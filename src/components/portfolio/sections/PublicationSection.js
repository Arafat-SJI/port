import SectionHeader from "@/components/portfolio/SectionHeader";
import {
  getVisiblePublicationItems,
  normalizePublicationContent,
} from "@/lib/publicationContent";

export default function PublicationSection({ content }) {
  const { title } = normalizePublicationContent(content);
  const items = getVisiblePublicationItems(content);

  if (!items.length) return null;

  return (
    <section className="space-y-5 scroll-mt-[30px]" id="publication">
      <SectionHeader>{title}</SectionHeader>
      <div className="space-y-3">
        {items.map((pub) => (
          <article
            key={pub.id}
            className="bg-surface-container-low border border-border rounded-xl p-5 hover:border-primary/50 transition-colors group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {pub.type ? (
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded text-on-surface-variant bg-surface-container-highest">
                      {pub.type}
                    </span>
                  ) : null}
                  {pub.year ? (
                    <span className="text-[10px] text-on-surface-variant">{pub.year}</span>
                  ) : null}
                </div>
                <h3 className="text-sm font-semibold text-on-surface leading-snug mb-1.5 group-hover:text-primary transition-colors">
                  {pub.title}
                </h3>
                {pub.authors ? (
                  <p className="text-xs text-on-surface-variant mb-1">{pub.authors}</p>
                ) : null}
                {pub.venue ? (
                  <p className="text-xs text-secondary italic">{pub.venue}</p>
                ) : null}
              </div>
              {pub.link ? (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  Read
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
