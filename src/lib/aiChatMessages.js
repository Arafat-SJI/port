/** AI chat inbox — visitor questions grouped by IP (dashboard AI Chat).
 * Private dashboard-only. Never synced to AI Context Knowledgebase.
 */

export function normalizeIpKey(ip) {
  const value = String(ip ?? "")
    .trim()
    .toLowerCase()
    .slice(0, 64);
  return value || "unknown";
}

export function normalizeAiChatMessageInput(input) {
  const raw = input && typeof input === "object" ? input : {};
  const ip = String(raw.ip ?? "").trim().slice(0, 64) || "unknown";
  return {
    ip,
    message: String(raw.message ?? "").trim().slice(0, 5000),
  };
}

export function validateAiChatMessageInput(input) {
  const { ip, message } = normalizeAiChatMessageInput(input);
  if (!message) return { ok: false, error: "Message is required." };
  return { ok: true, value: { ip, message } };
}

export function normalizeStoredAiChatMessage(row) {
  const raw = row && typeof row === "object" ? row : {};
  const ip = String(raw.ip ?? "").trim() || "unknown";
  return {
    id: String(raw.id ?? ""),
    ip,
    ipKey: normalizeIpKey(raw.ip_key ?? raw.ip),
    message: String(raw.message ?? "").trim(),
    isRead: Boolean(raw.is_read),
    createdAt: raw.created_at ? String(raw.created_at) : null,
  };
}

/**
 * Group flat AI chat messages into threads by IP.
 * Threads sorted by newest message first; messages within a thread oldest → newest.
 */
export function groupAiChatMessagesIntoThreads(rows) {
  const messages = (Array.isArray(rows) ? rows : [])
    .map(normalizeStoredAiChatMessage)
    .filter((m) => m.id && m.ipKey);

  const byIp = new Map();

  for (const msg of messages) {
    const existing = byIp.get(msg.ipKey);
    if (existing) {
      existing.messages.push(msg);
    } else {
      byIp.set(msg.ipKey, {
        ipKey: msg.ipKey,
        messages: [msg],
      });
    }
  }

  const threads = [...byIp.values()].map((thread) => {
    const sorted = [...thread.messages].sort((a, b) => {
      const aTime = a.createdAt || "";
      const bTime = b.createdAt || "";
      return aTime.localeCompare(bTime);
    });
    const latest = sorted[sorted.length - 1];
    const ip = latest?.ip || sorted[0]?.ip || thread.ipKey;
    return {
      ipKey: thread.ipKey,
      ip,
      name: ip,
      messages: sorted,
      unreadCount: sorted.filter((m) => !m.isRead).length,
      latestAt: latest?.createdAt || null,
      latestPreview: latest?.message || "",
      messageCount: sorted.length,
    };
  });

  threads.sort((a, b) => {
    const aTime = a.latestAt || "";
    const bTime = b.latestAt || "";
    return bTime.localeCompare(aTime);
  });

  return threads;
}

export function formatAiChatMessageTime(iso) {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return "";
  }
}
