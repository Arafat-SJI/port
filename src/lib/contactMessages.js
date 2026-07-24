/** Contact form inbox — visitor messages grouped by email (dashboard Messages).
 * Private dashboard-only. Never synced to AI Context Knowledgebase.
 */

export function normalizeEmailKey(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

export function normalizeContactMessageInput(input) {
  const raw = input && typeof input === "object" ? input : {};
  return {
    name: String(raw.name ?? "").trim().slice(0, 120),
    email: String(raw.email ?? "").trim().slice(0, 254),
    message: String(raw.message ?? "").trim().slice(0, 5000),
  };
}

export function validateContactMessageInput(input) {
  const { name, email, message } = normalizeContactMessageInput(input);

  if (!name) return { ok: false, error: "Name is required." };
  if (!email) return { ok: false, error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!message) return { ok: false, error: "Message is required." };

  return { ok: true, value: { name, email, message } };
}

export function normalizeStoredMessage(row) {
  const raw = row && typeof row === "object" ? row : {};
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? "").trim(),
    email: String(raw.email ?? "").trim(),
    emailKey: normalizeEmailKey(raw.email),
    message: String(raw.message ?? "").trim(),
    isRead: Boolean(raw.is_read),
    createdAt: raw.created_at ? String(raw.created_at) : null,
  };
}

/**
 * Group flat messages into chat threads by email (case-insensitive).
 * Threads sorted by newest message first; messages within a thread oldest → newest.
 */
export function groupMessagesIntoThreads(rows) {
  const messages = (Array.isArray(rows) ? rows : [])
    .map(normalizeStoredMessage)
    .filter((m) => m.id && m.emailKey);

  const byEmail = new Map();

  for (const msg of messages) {
    const existing = byEmail.get(msg.emailKey);
    if (existing) {
      existing.messages.push(msg);
    } else {
      byEmail.set(msg.emailKey, {
        emailKey: msg.emailKey,
        messages: [msg],
      });
    }
  }

  const threads = [...byEmail.values()].map((thread) => {
    const sorted = [...thread.messages].sort((a, b) => {
      const aTime = a.createdAt || "";
      const bTime = b.createdAt || "";
      return aTime.localeCompare(bTime);
    });
    const latest = sorted[sorted.length - 1];
    return {
      emailKey: thread.emailKey,
      email: latest?.email || sorted[0]?.email || "",
      name: latest?.name || sorted[0]?.name || "",
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

export function formatMessageTime(iso) {
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
