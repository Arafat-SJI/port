import { emitPrefsChanged } from "@/lib/sidebarPrefs";

const CHAT_STORAGE_KEY = "portfolio-chat-session-v1";
const MAX_STORED_MESSAGES = 40;

export const DEFAULT_CHAT_SESSION = {
  messages: [],
  updatedAt: null,
};

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim()
    )
    .map((m) => ({
      role: m.role,
      content: String(m.content).slice(0, 8000),
    }))
    .slice(-MAX_STORED_MESSAGES);
}

export function readChatSession() {
  if (typeof window === "undefined") return { ...DEFAULT_CHAT_SESSION, messages: [] };

  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_CHAT_SESSION, messages: [] };

    const parsed = safeParse(raw);
    if (!parsed || typeof parsed !== "object") {
      return { ...DEFAULT_CHAT_SESSION, messages: [] };
    }

    return {
      messages: normalizeMessages(parsed.messages),
      updatedAt: parsed.updatedAt ? String(parsed.updatedAt) : null,
    };
  } catch {
    return { ...DEFAULT_CHAT_SESSION, messages: [] };
  }
}

export function writeChatSession(state, { emit = true } = {}) {
  if (typeof window === "undefined") return;

  const messages = normalizeMessages(state?.messages);
  const payload = {
    messages,
    updatedAt: messages.length ? new Date().toISOString() : null,
  };

  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(payload));

  if (emit) {
    emitPrefsChanged({ keys: ["chat-session"] });
  }

  return payload;
}

export function clearChatSession({ emit = true } = {}) {
  if (typeof window === "undefined") return;
  writeChatSession(DEFAULT_CHAT_SESSION, { emit });
}

export function isChatSessionDirty(session = readChatSession()) {
  return Array.isArray(session?.messages) && session.messages.length > 0;
}

export function getChatSessionSummary(session = readChatSession()) {
  const messages = Array.isArray(session?.messages) ? session.messages : [];
  if (!messages.length) return "Empty";

  const firstUser = messages.find((m) => m.role === "user");
  const snippet = String(firstUser?.content ?? messages[0]?.content ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 48);

  const count = messages.length;
  const label = `${count} message${count === 1 ? "" : "s"}`;
  return snippet ? `${label} · “${snippet}${snippet.length >= 48 ? "…" : ""}”` : label;
}
