export default function StatusBar({ terminalMsg }) {
  return (
    <footer className="flex justify-between items-center w-full h-6 fixed bottom-0 z-50 bg-surface-container border-t border-border">
      <div className="flex items-center gap-0 h-full">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-[2px] px-1 py-0.5 rounded hover:bg-surface-container-high transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[12px]  text-blue-400">
              account_tree
            </span>
            <span className="text-[10px] text-on-surface-variant">main*</span>
          </div>
        </div>
        <div className="flex items-center gap-[1px] px-1 hover:bg-surface-container-highest cursor-pointer h-full transition-colors">
          <span className="material-symbols-outlined text-[14px] text-red-400">error</span>
          <span className="font-code-sm text-code-sm text-on-surface-variant">0</span>
        </div>
        <div className="flex items-center gap-[1px] px-1 hover:bg-surface-container-highest cursor-pointer h-full transition-colors">
          <span className="material-symbols-outlined text-[14px] text-yellow-400">warning</span>
          <span className="font-code-sm text-code-sm text-on-surface-variant">2</span>
        </div>
        <div className="flex items-center gap-2 px-2 h-full">
          <span className="font-code-sm text-[11px] text-secondary">{terminalMsg}</span>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex items-center gap-4 h-full">
          <span className="font-code-sm text-[11px] text-on-surface-variant px-2 hover:bg-surface-container-highest cursor-pointer h-full flex items-center">
            UTF-8
          </span>
          <span className="font-code-sm text-[11px] text-on-surface-variant px-2 hover:bg-surface-container-highest cursor-pointer h-full flex items-center">
            TypeScript JSX
          </span>
          <span className="font-code-sm text-[11px] text-on-surface-variant px-2 hover:bg-surface-container-highest cursor-pointer h-full flex items-center">
            Spaces: 2
          </span>
          <span className="font-code-sm text-[11px] text-on-surface-variant px-2 hover:bg-surface-container-highest cursor-pointer h-full flex items-center">
            CRLF
          </span>
          <div className="flex items-center gap-1 text-on-surface-variant px-2 h-full border-l border-border cursor-pointer hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined text-[14px]">notifications</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
