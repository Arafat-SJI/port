import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  MAX_ACTIVE_GEMINI_KEYS,
  maskApiKey,
  normalizeGeminiKeyName,
  toPublicGeminiKeyEntry,
  toPublicGeminiKeyStatus,
} from "@/lib/geminiKey";

const KEY_SELECT =
  "id, name, value, is_active, is_current, last_error, last_error_at, created_at, updated_at";

/** Stable order by created time — activating a key must not move it. */
function sortKeys(rows) {
  return [...(rows ?? [])].sort((a, b) =>
    String(a.created_at || "").localeCompare(String(b.created_at || ""))
  );
}

function missingColumnHint(error) {
  const msg = error?.message || "";
  if (msg.includes("is_current") || error?.code === "42703") {
    return "Run migration 022_gemini_in_use_key.sql in Supabase.";
  }
  if (msg.includes("gemini_api_keys") || error?.code === "42P01") {
    return "Keys table missing. Run migration 018_gemini_api_keys.sql in Supabase.";
  }
  return msg || "Could not load API keys.";
}

async function countActiveKeys(supabase) {
  const { count, error } = await supabase
    .from("gemini_api_keys")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  if (error) {
    throw new Error(error.message || "Could not count active keys.");
  }

  return count ?? 0;
}

async function clearCurrentFlags(supabase) {
  await supabase
    .from("gemini_api_keys")
    .update({ is_current: false, updated_at: new Date().toISOString() })
    .eq("is_current", true);
}

/** Prefer an explicit nextId; otherwise oldest remaining active key. */
async function promoteCurrentKey(supabase, preferredId = null) {
  await clearCurrentFlags(supabase);

  let nextId = String(preferredId ?? "").trim();

  if (nextId) {
    const { data: preferred } = await supabase
      .from("gemini_api_keys")
      .select("id, is_active")
      .eq("id", nextId)
      .maybeSingle();
    if (!preferred?.is_active) nextId = "";
  }

  if (!nextId) {
    const { data: next } = await supabase
      .from("gemini_api_keys")
      .select("id")
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    nextId = next?.id ? String(next.id) : "";
  }

  if (!nextId) return null;

  await supabase
    .from("gemini_api_keys")
    .update({
      is_current: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", nextId);

  return nextId;
}

/** Public-safe status for dashboard UI (never returns raw keys). */
export async function readGeminiKeyStatus() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gemini_api_keys")
      .select(KEY_SELECT)
      .order("created_at", { ascending: true });

    if (error) {
      const hint = missingColumnHint(error);
      return toPublicGeminiKeyStatus({
        keys: [],
        loadError: true,
        loadErrorMessage: hint,
        lastError: hint,
        lastErrorAt: new Date().toISOString(),
      });
    }

    return toPublicGeminiKeyStatus({
      keys: sortKeys(data),
      loadError: false,
    });
  } catch (err) {
    return toPublicGeminiKeyStatus({
      keys: [],
      loadError: true,
      loadErrorMessage: err?.message || "Could not load API keys.",
      lastError: err?.message || "Could not load API keys.",
      lastErrorAt: new Date().toISOString(),
    });
  }
}

/**
 * Server-only: active raw keys — in-use first, then oldest standby.
 * Never send to the browser.
 */
export async function readActiveGeminiApiKeys() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("gemini_api_keys")
    .select("id, value, is_current, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message || "Could not read Gemini API keys.");
  }

  const rows = (data ?? [])
    .map((row) => ({
      id: String(row.id ?? ""),
      value: String(row.value ?? "").trim(),
      isCurrent: Boolean(row.is_current),
      createdAt: String(row.created_at || ""),
    }))
    .filter((row) => row.id && row.value);

  rows.sort((a, b) => {
    if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
    return a.createdAt.localeCompare(b.createdAt);
  });

  return rows.slice(0, MAX_ACTIVE_GEMINI_KEYS).map(({ id, value }) => ({ id, value }));
}

/** @deprecated Prefer readActiveGeminiApiKeys — kept for any leftover callers. */
export async function readGeminiApiKeyRaw() {
  const keys = await readActiveGeminiApiKeys();
  return keys[0]?.value ?? "";
}

export async function addGeminiApiKey(rawKey, rawName) {
  const value = String(rawKey ?? "").trim();
  const name = normalizeGeminiKeyName(rawName);
  if (!value) {
    throw new Error("API key is required.");
  }
  if (value.length < 16) {
    throw new Error("That doesn’t look like a valid API key.");
  }
  if (!name) {
    throw new Error("A name for this key is required.");
  }

  const supabase = await createClient();

  const { data: existingRows, error: existingError } = await supabase
    .from("gemini_api_keys")
    .select("id, value, is_active, is_current");

  if (existingError) {
    throw new Error(missingColumnHint(existingError));
  }

  const duplicate = (existingRows ?? []).find(
    (row) => String(row.value ?? "").trim() === value
  );

  if (duplicate) {
    await supabase
      .from("gemini_api_keys")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", duplicate.id);
    if (!duplicate.is_active) {
      await setGeminiApiKeyActive(duplicate.id, true);
    }
    return readGeminiKeyStatus();
  }

  const activeCount = (existingRows ?? []).filter((row) => row.is_active).length;
  const hasCurrent = (existingRows ?? []).some((row) => row.is_current && row.is_active);
  const makeActive = activeCount < MAX_ACTIVE_GEMINI_KEYS;
  const makeCurrent = makeActive && !hasCurrent;

  const { error: insertError } = await supabase.from("gemini_api_keys").insert({
    name,
    value,
    is_active: makeActive,
    is_current: makeCurrent,
    last_error: null,
    last_error_at: null,
    updated_at: new Date().toISOString(),
  });

  if (insertError) {
    throw new Error(insertError.message || "Could not save API key.");
  }

  return readGeminiKeyStatus();
}

/** Turn a key on or off. At most MAX_ACTIVE_GEMINI_KEYS may be active. */
export async function setGeminiApiKeyActive(keyId, nextActive) {
  const id = String(keyId ?? "").trim();
  if (!id) {
    throw new Error("Key id is required.");
  }

  const supabase = await createClient();

  const { data: target, error: targetError } = await supabase
    .from("gemini_api_keys")
    .select("id, is_active, is_current")
    .eq("id", id)
    .maybeSingle();

  if (targetError || !target) {
    throw new Error(
      targetError ? missingColumnHint(targetError) : "API key not found."
    );
  }

  const wantActive = Boolean(nextActive);

  if (Boolean(target.is_active) === wantActive) {
    return readGeminiKeyStatus();
  }

  if (wantActive) {
    const activeCount = await countActiveKeys(supabase);
    if (activeCount >= MAX_ACTIVE_GEMINI_KEYS) {
      throw new Error(
        `At most ${MAX_ACTIVE_GEMINI_KEYS} keys can be active. Turn one off first.`
      );
    }

    const { data: currentRow } = await supabase
      .from("gemini_api_keys")
      .select("id")
      .eq("is_current", true)
      .eq("is_active", true)
      .maybeSingle();

    const becomeCurrent = !currentRow?.id;

    const { error: updateError } = await supabase
      .from("gemini_api_keys")
      .update({
        is_active: true,
        is_current: becomeCurrent,
        last_error: null,
        last_error_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message || "Could not update API key.");
    }
  } else {
    const wasCurrent = Boolean(target.is_current);
    const { error: updateError } = await supabase
      .from("gemini_api_keys")
      .update({
        is_active: false,
        is_current: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message || "Could not update API key.");
    }

    if (wasCurrent) {
      await promoteCurrentKey(supabase);
    }
  }

  return readGeminiKeyStatus();
}

/** Mark one active key as In use (only one at a time). */
export async function setGeminiApiKeyCurrent(keyId) {
  const id = String(keyId ?? "").trim();
  if (!id) {
    throw new Error("Key id is required.");
  }

  const supabase = await createClient();

  const { data: target, error: targetError } = await supabase
    .from("gemini_api_keys")
    .select("id, is_active, is_current")
    .eq("id", id)
    .maybeSingle();

  if (targetError || !target) {
    throw new Error(
      targetError ? missingColumnHint(targetError) : "API key not found."
    );
  }

  if (!target.is_active) {
    throw new Error("Turn the key Active before marking it In use.");
  }

  if (target.is_current) {
    return readGeminiKeyStatus();
  }

  await promoteCurrentKey(supabase, id);
  return readGeminiKeyStatus();
}

/** @deprecated Use setGeminiApiKeyActive(id, true) */
export async function activateGeminiApiKey(keyId) {
  return setGeminiApiKeyActive(keyId, true);
}

export async function deleteGeminiApiKey(keyId) {
  const id = String(keyId ?? "").trim();
  if (!id) {
    throw new Error("Key id is required.");
  }

  const supabase = await createClient();

  const { data: target, error: targetError } = await supabase
    .from("gemini_api_keys")
    .select("id, is_current")
    .eq("id", id)
    .maybeSingle();

  if (targetError || !target) {
    throw new Error("API key not found.");
  }

  const wasCurrent = Boolean(target.is_current);

  const { error: deleteError } = await supabase
    .from("gemini_api_keys")
    .delete()
    .eq("id", id);

  if (deleteError) {
    throw new Error(deleteError.message || "Could not delete API key.");
  }

  if (wasCurrent) {
    await promoteCurrentKey(supabase);
  }

  return readGeminiKeyStatus();
}

/**
 * Quota / invalid key: record error, turn off, promote next In use.
 */
export async function deactivateGeminiKeyWithError(keyId, message) {
  try {
    const id = String(keyId ?? "").trim();
    if (!id) return;

    const supabase = createAdminClient();
    const { data: target } = await supabase
      .from("gemini_api_keys")
      .select("id, is_current")
      .eq("id", id)
      .maybeSingle();

    await supabase
      .from("gemini_api_keys")
      .update({
        is_active: false,
        is_current: false,
        last_error: String(message ?? "Gemini API error").slice(0, 500),
        last_error_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (target?.is_current) {
      await promoteCurrentKey(supabase);
    } else {
      const { data: current } = await supabase
        .from("gemini_api_keys")
        .select("id")
        .eq("is_current", true)
        .eq("is_active", true)
        .maybeSingle();
      if (!current?.id) {
        await promoteCurrentKey(supabase);
      }
    }
  } catch {
    // Chat must still return a friendly reply even if status write fails.
  }
}

export async function recordGeminiKeyError(message, keyId = null) {
  try {
    const supabase = createAdminClient();
    let id = String(keyId ?? "").trim();

    if (!id) {
      const { data: current } = await supabase
        .from("gemini_api_keys")
        .select("id")
        .eq("is_current", true)
        .eq("is_active", true)
        .maybeSingle();
      id = current?.id ? String(current.id) : "";
    }

    if (!id) {
      const { data: active } = await supabase
        .from("gemini_api_keys")
        .select("id")
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      id = active?.id ? String(active.id) : "";
    }

    if (!id) return;

    await supabase
      .from("gemini_api_keys")
      .update({
        last_error: String(message ?? "Gemini API error").slice(0, 500),
        last_error_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } catch {
    // ignore
  }
}

export async function clearGeminiKeyError(keyId = null) {
  try {
    const supabase = createAdminClient();
    const id = String(keyId ?? "").trim();
    const patch = {
      last_error: null,
      last_error_at: null,
      updated_at: new Date().toISOString(),
    };

    if (id) {
      await supabase.from("gemini_api_keys").update(patch).eq("id", id);
      return;
    }

    await supabase.from("gemini_api_keys").update(patch).eq("is_active", true);
  } catch {
    // ignore
  }
}

export { maskApiKey, toPublicGeminiKeyEntry, toPublicGeminiKeyStatus };
