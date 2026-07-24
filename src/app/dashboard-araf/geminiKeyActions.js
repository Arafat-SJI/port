"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  addGeminiApiKey,
  deleteGeminiApiKey,
  setGeminiApiKeyActive,
  setGeminiApiKeyCurrent,
} from "@/lib/geminiKeyServer";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function revalidateGeminiSettings() {
  revalidatePath("/dashboard-araf/settings/gemini-api");
}

export async function saveGeminiApiKeyAction(prevState, formData) {
  const user = await requireUser();
  if (!user) {
    return { error: "Unauthorized", success: false, status: null };
  }

  const apiKey = String(formData.get("apiKey") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  try {
    const status = await addGeminiApiKey(apiKey, name);
    revalidateGeminiSettings();
    const active = status?.activeCount ?? 0;
    const max = status?.maxActive ?? 5;
    return {
      error: null,
      success: true,
      message:
        active >= max && status?.keys?.some((k) => !k.isActive)
          ? `API key saved (${active}/${max} active). Turn one off to activate another.`
          : `API key added (${active}/${max} active).`,
      status,
    };
  } catch (err) {
    return {
      error: err?.message || "Could not save API key.",
      success: false,
      status: null,
    };
  }
}

export async function setGeminiApiKeyActiveAction(keyId, isActive) {
  const user = await requireUser();
  if (!user) {
    return { error: "Unauthorized", success: false, status: null };
  }

  try {
    const status = await setGeminiApiKeyActive(keyId, isActive);
    revalidateGeminiSettings();
    return {
      error: null,
      success: true,
      message: isActive
        ? `Key turned on (${status.activeCount}/${status.maxActive} active).`
        : `Key turned off (${status.activeCount}/${status.maxActive} active).`,
      status,
    };
  } catch (err) {
    return {
      error: err?.message || "Could not update API key.",
      success: false,
      status: null,
    };
  }
}

export async function setGeminiApiKeyCurrentAction(keyId) {
  const user = await requireUser();
  if (!user) {
    return { error: "Unauthorized", success: false, status: null };
  }

  try {
    const status = await setGeminiApiKeyCurrent(keyId);
    revalidateGeminiSettings();
    return {
      error: null,
      success: true,
      message: "In-use key updated.",
      status,
    };
  } catch (err) {
    return {
      error: err?.message || "Could not set in-use key.",
      success: false,
      status: null,
    };
  }
}

/** @deprecated Prefer setGeminiApiKeyActiveAction */
export async function activateGeminiApiKeyAction(keyId) {
  return setGeminiApiKeyActiveAction(keyId, true);
}

export async function deleteGeminiApiKeyAction(keyId) {
  const user = await requireUser();
  if (!user) {
    return { error: "Unauthorized", success: false, status: null };
  }

  try {
    const status = await deleteGeminiApiKey(keyId);
    revalidateGeminiSettings();
    return {
      error: null,
      success: true,
      message: "API key removed.",
      status,
    };
  } catch (err) {
    return {
      error: err?.message || "Could not delete API key.",
      success: false,
      status: null,
    };
  }
}
