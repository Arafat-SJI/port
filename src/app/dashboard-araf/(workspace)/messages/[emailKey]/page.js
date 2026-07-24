import { notFound } from "next/navigation";
import MessageThreadView from "@/components/dashboard/MessageThreadView";
import { createClient } from "@/lib/supabase/server";
import { groupMessagesIntoThreads, normalizeEmailKey } from "@/lib/contactMessages";

export default async function DashboardMessageThreadPage({ params }) {
  const { emailKey: rawKey } = await params;
  const emailKey = normalizeEmailKey(decodeURIComponent(String(rawKey ?? "")));
  if (!emailKey) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, is_read, created_at")
    .eq("email_key", emailKey)
    .order("created_at", { ascending: true });

  if (error) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <p className="text-[13px] text-error">
          Could not load this conversation. Run migration{" "}
          <code className="font-label-mono">016_contact_messages.sql</code>.
        </p>
      </main>
    );
  }

  const threads = groupMessagesIntoThreads(data ?? []);
  const thread = threads.find((t) => t.emailKey === emailKey) ?? null;

  if (!thread) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-[20px] text-primary">mail</span>
        </div>
        <div className="min-w-0">
          <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
            System / Message
          </p>
          <h1 className="mt-0.5 truncate text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
            {thread.name || thread.email}
          </h1>
          <p className="mt-1 truncate text-[13px] text-on-surface-variant">{thread.email}</p>
        </div>
      </header>

      <MessageThreadView thread={thread} />
    </main>
  );
}
