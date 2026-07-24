import Link from "next/link";
import FileIcon from "@/components/ui/FileIcon";
import { DASHBOARD_NAV } from "@/data/dashboard";
import { orderDashboardNav } from "@/lib/sectionOrder";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";

export default async function DashboardHomePage() {
  const order = await readSectionOrderFromSupabase();
  const items = orderDashboardNav(DASHBOARD_NAV, order);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 pb-1 sm:mb-8">
        <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
          Overview
        </p>
        <h1 className="mt-1 text-[22px] font-semibold tracking-tight text-on-surface sm:text-[26px]">
          Content workspace
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-on-surface-variant">
          Pick a file from the explorer to manage that section. Editors land here one by one — auth
          and settings are already live.
        </p>
      </header>

      <div>
        <p className="mb-1.5 px-0.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">
          Files
        </p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="group flex cursor-pointer items-center gap-2.5 rounded-lg bg-surface-container-lowest/80 px-3.5 py-3 transition hover:bg-surface-container-low"
            >
              <FileIcon ext={item.ext} size={16} />
              <span className="text-[13px] text-on-surface group-hover:text-primary">{item.label}</span>
              <span className="material-symbols-outlined ml-auto text-[16px] text-on-surface-variant/50 transition group-hover:text-primary">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-1.5 px-0.5 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/80">
          System
        </p>
        <div className="grid gap-1.5 sm:grid-cols-2">
          <Link
            href="/dashboard-araf/messages"
            className="group flex cursor-pointer items-center gap-2.5 rounded-lg bg-surface-container-lowest/80 px-3.5 py-3 transition hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px] text-primary/80">mail</span>
            <span className="text-[13px] text-on-surface group-hover:text-primary">Message</span>
            <span className="material-symbols-outlined ml-auto text-[16px] text-on-surface-variant/50 transition group-hover:text-primary">
              chevron_right
            </span>
          </Link>
          <Link
            href="/dashboard-araf/ai-chats"
            className="group flex cursor-pointer items-center gap-2.5 rounded-lg bg-surface-container-lowest/80 px-3.5 py-3 transition hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px] text-primary/80">
              smart_toy
            </span>
            <span className="text-[13px] text-on-surface group-hover:text-primary">AI Chat</span>
            <span className="material-symbols-outlined ml-auto text-[16px] text-on-surface-variant/50 transition group-hover:text-primary">
              chevron_right
            </span>
          </Link>
          <Link
            href="/dashboard-araf/settings/email"
            className="group flex cursor-pointer items-center gap-2.5 rounded-lg bg-surface-container-lowest/80 px-3.5 py-3 transition hover:bg-surface-container-low"
          >
            <span className="material-symbols-outlined text-[18px] text-primary/80">settings</span>
            <span className="text-[13px] text-on-surface group-hover:text-primary">Settings</span>
            <span className="material-symbols-outlined ml-auto text-[16px] text-on-surface-variant/50 transition group-hover:text-primary">
              chevron_right
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
