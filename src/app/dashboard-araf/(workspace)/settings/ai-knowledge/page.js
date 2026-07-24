import { readAiKnowledgeFromSupabase } from "@/lib/aiKnowledgeServer";

/** Always show the latest Supabase ai_knowledge snapshot. */
export const dynamic = "force-dynamic";

export default async function SettingsAiKnowledgePage() {
  const knowledge = await readAiKnowledgeFromSupabase();
  const jsonText = JSON.stringify(knowledge, null, 2);
  const updatedAt = knowledge?.updatedAt
    ? new Date(knowledge.updatedAt).toLocaleString()
    : "Not synced yet";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[22px] text-primary">database</span>
          <div>
            <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
              Settings
            </p>
            <h1 className="text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
              AI Context Knowledgebase
            </h1>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-on-surface-variant">
          Read-only view of the live Supabase knowledge used for AI chat context. It updates
          automatically when you save public portfolio content in the dashboard. Not editable here.
          The Message inbox (visitor form submissions) is never included.
        </p>
        <p className="mt-1.5 font-label-mono text-[11px] text-on-surface-variant/80">
          Last synced: {updatedAt}
        </p>
      </header>

      <section className="overflow-hidden rounded-xl bg-surface-container-lowest/90">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 px-4 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
            <p className="truncate font-label-mono text-[11px] text-on-surface-variant">
              portfolio_settings.ai_knowledge
            </p>
          </div>
          <span className="shrink-0 rounded-md bg-surface-container-high px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-on-surface-variant">
            Read only
          </span>
        </div>
        <pre
          className="max-h-[min(70vh,720px)] overflow-auto custom-scrollbar p-4 font-label-mono text-[12px] leading-relaxed text-on-surface whitespace-pre"
          tabIndex={0}
          aria-label="AI knowledge JSON (read only)"
        >
          {jsonText}
        </pre>
      </section>
    </main>
  );
}
