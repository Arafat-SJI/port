import { PUBLICATIONS } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function PublicationSection() {
  return (
    <section className="space-y-5 scroll-mt-[15px]" id="publication">
      <SectionHeader>Publication</SectionHeader>
      <div className="space-y-3">
        {PUBLICATIONS.map((pub) => (
          <article
            key={pub.title}
            className="bg-surface-container-low border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded text-on-surface-variant bg-surface-container-highest">
                    {pub.type}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">{pub.year}</span>
                </div>
                <h3 className="text-sm font-semibold text-on-surface leading-snug mb-1.5 group-hover:text-primary transition-colors">
                  {pub.title}
                </h3>
                <p className="text-xs text-on-surface-variant mb-1">{pub.authors}</p>
                <p className="text-xs text-secondary italic">{pub.venue}</p>
              </div>
              <a
                href={pub.link}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
              >
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                Read
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
