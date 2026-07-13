import Link from "next/link";
import FileIcon from "@/components/ui/FileIcon";
import { DASHBOARD_NAV } from "@/data/dashboard";
import { orderDashboardNav } from "@/lib/sectionOrder";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";

export default async function DashboardHomePage() {
  const order = await readSectionOrderFromSupabase();
  const items = orderDashboardNav(DASHBOARD_NAV, order);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8">
      <header className="mb-8 pb-1">
        <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
          Overview
        </p>
        <h1 className="mt-1 text-[26px] font-semibold tracking-tight text-on-surface">
          Content workspace
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-on-surface-variant">
          Pick a file from the explorer to manage that section. Editors land here one by one — auth
          and settings are already live.
        </p>
      </header>

      <div className="grid gap-1.5 sm:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="group flex items-center gap-2.5 rounded-lg bg-surface-container-lowest/80 px-3.5 py-3 transition hover:bg-surface-container-low"
          >
            <FileIcon ext={item.ext} size={16} />
            <span className="text-[13px] text-on-surface group-hover:text-primary">{item.label}</span>
            <span className="material-symbols-outlined ml-auto text-[16px] text-on-surface-variant/50 transition group-hover:text-primary">
              chevron_right
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
