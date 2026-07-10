import FileIcon from "@/components/ui/FileIcon";
import { getExtensionById } from "@/data/extensions";

export default function Breadcrumb({ activeNav, extensionId }) {
  const extension = extensionId ? getExtensionById(extensionId) : null;

  if (extension) {
    return (
      <div className="flex items-center gap-1 px-2 h-6 text-[11px] text-on-surface-variant bg-surface-container-lowest border-b border-border shrink-0">
        <span className="material-symbols-outlined text-[13px] opacity-60">extension</span>
        <span className="opacity-70">extensions</span>
        <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
        <span className="flex items-center gap-1 text-on-surface">
          <span
            className="material-symbols-outlined text-[13px]"
            style={{ color: extension.iconColor }}
          >
            {extension.icon}
          </span>
          {extension.name}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 px-2 h-6 text-[11px] text-on-surface-variant bg-surface-container-lowest border-b border-border shrink-0">
      <span className="material-symbols-outlined text-[13px] opacity-60">folder</span>
      <span className="opacity-70">portfolio</span>
      <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
      <span className="opacity-70">src</span>
      <span className="material-symbols-outlined text-[13px] opacity-40">chevron_right</span>
      <span className="flex items-center gap-1 text-on-surface">
        <FileIcon ext={activeNav.ext} size={13} />
        {activeNav.label}
      </span>
    </div>
  );
}
