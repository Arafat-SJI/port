export default function DashboardAiChatsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
          <span className="material-symbols-outlined text-[20px] text-primary">smart_toy</span>
        </div>
        <div className="min-w-0">
          <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
            System
          </p>
          <h1 className="mt-0.5 text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
            AI Chat
          </h1>
          <p className="mt-1 text-[13px] text-on-surface-variant">
            Pick a visitor IP from the sidebar to see what they asked about you.
          </p>
        </div>
      </header>

      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl bg-surface-container-lowest/90 px-6 py-12 text-center">
        <span className="material-symbols-outlined mb-2 text-[32px] text-primary/55">
          forum
        </span>
        <p className="text-[14px] font-medium text-on-surface">Select a visitor</p>
        <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-on-surface-variant">
          Each IP address is its own conversation. Same IP keeps questions in one
          chatbox.
        </p>
      </div>
    </main>
  );
}
