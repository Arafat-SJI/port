/**
 * Gemini API keys — dashboard-only secrets (multi-key, up to 5 active).
 * Never include in ai_knowledge, never expose full keys to the public site.
 */

export const GEMINI_API_KEY_SECRET = "gemini_api_key";

/** Max keys that may be Active at once (failover pool). */
export const MAX_ACTIVE_GEMINI_KEYS = 5;

export function maskApiKey(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  if (value.length <= 8) return "••••••••";
  return `••••${value.slice(-4)}`;
}

export function isLikelyApiKeyError(status, bodyText = "") {
  const text = String(bodyText).toLowerCase();
  if (status === 401 || status === 403) return true;
  if (status === 429) return true;
  return (
    text.includes("api key") ||
    text.includes("api_key") ||
    text.includes("invalid") ||
    text.includes("expired") ||
    text.includes("permission") ||
    text.includes("quota") ||
    text.includes("resource_exhausted") ||
    text.includes("billing")
  );
}

/** Public-facing replies when Gemini is unavailable — never mention keys/quota. */
export const FUNNY_CHAT_FALLBACKS = [
  "My brain hamster fell off its wheel for a second. Ask me again in a bit — or ping Arafat the old-fashioned way.",
  "I short-circuited on that one (politely). Try another question while I reboot my imaginary coffee.",
  "404: witty answer not found. I promise I’m usually more helpful — give me another shot soon.",
  "I was about to say something brilliant, then my cloud floated away. Catch me after a quick recharge.",
  "Even AI needs a snack break. Come back with that question in a moment — I’ll be less dramatic then.",
];

export function pickFunnyChatFallback(seed = Date.now()) {
  const list = FUNNY_CHAT_FALLBACKS;
  return list[Math.abs(Number(seed)) % list.length];
}

export function normalizeGeminiKeyName(raw) {
  return String(raw ?? "")
    .trim()
    .slice(0, 60);
}

export function toPublicGeminiKeyEntry(row) {
  const raw = row && typeof row === "object" ? row : {};
  const value = String(raw.value ?? "").trim();
  const name = normalizeGeminiKeyName(raw.name);
  const isActive = Boolean(raw.is_active ?? raw.isActive);
  const isCurrent = Boolean(raw.is_current ?? raw.isCurrent) && isActive;
  return {
    id: String(raw.id ?? ""),
    name: name || null,
    masked: maskApiKey(value),
    isActive,
    isCurrent,
    lastError: raw.last_error ?? raw.lastError ?? null,
    lastErrorAt: raw.last_error_at ?? raw.lastErrorAt ?? null,
    createdAt: raw.created_at ?? raw.createdAt ?? null,
    updatedAt: raw.updated_at ?? raw.updatedAt ?? null,
  };
}

export function toPublicGeminiKeyStatus(payload) {
  const raw = payload && typeof payload === "object" ? payload : {};
  let keys = Array.isArray(raw.keys)
    ? raw.keys.map(toPublicGeminiKeyEntry).filter((k) => k.id)
    : [];
  const activeKeys = keys.filter((k) => k.isActive);
  let currentId =
    keys.find((k) => k.isCurrent)?.id ??
    raw.currentId ??
    raw.activeId ??
    null;

  // If DB has no current among actives, treat oldest active as current for UI.
  if (!currentId && activeKeys.length) {
    currentId = activeKeys[0].id;
    keys = keys.map((k) => ({
      ...k,
      isCurrent: k.id === currentId,
    }));
  }

  const erroredActive =
    activeKeys.find((k) => k.lastError) ??
    keys.find((k) => k.lastError) ??
    null;

  return {
    configured: keys.length > 0,
    activeId: currentId,
    currentId,
    activeIds: activeKeys.map((k) => k.id),
    activeCount: activeKeys.length,
    maxActive: MAX_ACTIVE_GEMINI_KEYS,
    keys,
    lastError: erroredActive?.lastError ?? raw.lastError ?? null,
    lastErrorAt: erroredActive?.lastErrorAt ?? raw.lastErrorAt ?? null,
    loadError: Boolean(raw.loadError),
    loadErrorMessage: raw.loadErrorMessage ?? null,
  };
}
