import { notFound } from "next/navigation";
import AiChatThreadView from "@/components/dashboard/AiChatThreadView";
import { createClient } from "@/lib/supabase/server";
import {
  groupAiChatMessagesIntoThreads,
  normalizeIpKey,
} from "@/lib/aiChatMessages";

export default async function DashboardAiChatThreadPage({ params }) {
  const { ipKey: rawKey } = await params;
  const ipKey = normalizeIpKey(decodeURIComponent(String(rawKey ?? "")));
  if (!ipKey) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_chat_messages")
    .select("id, ip, message, is_read, created_at")
    .eq("ip_key", ipKey)
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <p className="text-[13px] text-error">
          Could not load this conversation. Run migration{" "}
          <code className="font-label-mono">020_ai_chat_messages.sql</code>.
        </p>
      </main>
    );
  }

  const threads = groupAiChatMessagesIntoThreads(data ?? []);
  const thread = threads.find((t) => t.ipKey === ipKey) ?? null;

  if (!thread) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-[20px] text-primary">smart_toy</span>
        </div>
        <div className="min-w-0">
          <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
            System / AI Chat
          </p>
          <h1 className="mt-0.5 truncate font-label-mono text-[18px] font-semibold tracking-tight text-on-surface sm:text-[20px]">
            {thread.name || thread.ip}
          </h1>
          <p className="mt-1 text-[13px] text-on-surface-variant">
            Questions this visitor asked the portfolio AI
          </p>
        </div>
      </header>

      <AiChatThreadView thread={thread} />
    </main>
  );
}
