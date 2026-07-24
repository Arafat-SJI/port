import { notFound } from "next/navigation";
import FileIcon from "@/components/ui/FileIcon";
import { getDashboardNavItem } from "@/data/dashboard";

const RESERVED = new Set([
  "settings",
  "login",
  "forgot-password",
  "messages",
  "ai-chats",
]);

export default async function DashboardSectionPage({ params }) {
  const { section } = await params;

  if (RESERVED.has(section)) notFound();

  // Dedicated editors live under their own routes
  if (
    section === "about" ||
    section === "experience" ||
    section === "skills" ||
    section === "projects" ||
    section === "education" ||
    section === "awards" ||
    section === "publication" ||
    section === "gallery" ||
    section === "clubing" ||
    section === "mentorship" ||
    section === "contact"
  ) {
    notFound();
  }

  const item = getDashboardNavItem(section);

  if (!item) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
          <FileIcon ext={item.ext} size={18} />
        </div>
        <div className="min-w-0">
          <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
            Section
          </p>
          <h1 className="mt-0.5 text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
            {item.label}
          </h1>
          <p className="mt-1 text-[13px] text-on-surface-variant">
            Editor for this section isn’t wired yet. You’ll add real fields here when the content is
            ready.
          </p>
        </div>
      </header>

      <section className="rounded-xl bg-surface-container-lowest/80 px-4 py-8 text-center sm:px-5 sm:py-10">
        <span className="material-symbols-outlined mb-3 text-[32px] text-primary/70">edit_note</span>
        <p className="text-[14px] font-medium text-on-surface">Placeholder editor</p>
        <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-on-surface-variant">
          When you confirm this section’s public layout, dashboard inputs will appear here and sync
          to Supabase + the AI knowledge JSON (never credentials).
        </p>
      </section>
    </main>
  );
}
