import { CHAT_SUGGESTED_QUESTIONS } from "@/data/portfolio";

export default function ChatPanel() {
  return (
    <aside className="hidden xl:flex w-[360px] shrink-0 flex-col bg-surface-container-lowest border-l border-border">
      <div className="flex-1 overflow-y-auto px-3 py-6 custom-scrollbar text-[13px]">
        <div className="flex flex-col items-center text-center px-2 pt-4 space-y-3">
          <span className="material-symbols-outlined !text-[40px] text-primary/80">auto_awesome</span>
          <p className="text-on-surface text-[14px] leading-relaxed max-w-[340px]">
            Ask anything about me, AI has the context.
          </p>
          <p className="text-on-surface-variant text-[11px] leading-relaxed max-w-[220px] mt-[-10px]">
            Projects, experience, skills, and more.
          </p>
        </div>

        <div className="pt-8 space-y-1.5">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">
            Suggested
          </p>
          {CHAT_SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className="w-full text-left px-3 py-2 rounded-md border border-border bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary/30 transition-all text-[12px] text-on-surface-variant flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[14px] text-primary/70">
                arrow_outward
              </span>
              <b>{q}</b>
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-2 shrink-0">
        <div className="rounded-lg border border-border bg-surface-container-low focus-within:border-primary/60 transition-colors">
          <textarea
            rows={2}
            placeholder="Ask anything about me..."
            className="w-full bg-transparent resize-none px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none custom-scrollbar"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-secondary/50 bg-secondary/10 text-secondary text-[11px] hover:bg-secondary/15 transition-colors"
              >
                <span className="material-symbols-outlined text-[13px]">chat_bubble</span>
                Ask
                <span className="material-symbols-outlined text-[13px]">expand_more</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-0.5 px-0.5 py-0.5 text-[11px] text-on-surface-variant hover:text-on-surface transition-colors"
              >
                gemini flash 2.5
                <span className="material-symbols-outlined text-[13px]">expand_more</span>
              </button>
            </div>
            <button className="flex items-center justify-center w-6 h-6 rounded-md bg-primary text-on-primary hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
