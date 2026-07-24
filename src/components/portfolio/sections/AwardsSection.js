import SectionHeader from "@/components/portfolio/SectionHeader";
import {
  getVisibleAwardsItems,
  normalizeAwardsContent,
} from "@/lib/awardsContent";

export default function AwardsSection({ content }) {
  const { title } = normalizeAwardsContent(content);
  const items = getVisibleAwardsItems(content);

  if (!items.length) return null;

  return (
    <section className="space-y-5 scroll-mt-[30px]" id="awards">
      <SectionHeader>{title}</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((award) => (
          <div
            key={award.id}
            className="bg-surface-container-low border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
                emoji_events
              </span>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-on-surface leading-snug">
                    {award.title}
                  </h3>
                  {award.year ? (
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded shrink-0 text-primary bg-primary/10">
                      {award.year}
                    </span>
                  ) : null}
                </div>
                {award.issuer ? (
                  <p className="text-xs font-semibold text-secondary mb-2">{award.issuer}</p>
                ) : null}
                {award.description ? (
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {award.description}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
