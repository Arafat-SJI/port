import SectionHeader from "@/components/portfolio/SectionHeader";
import {
  formatExperienceMeta,
  formatExperiencePeriod,
  formatExperienceRole,
  getVisibleExperienceItems,
  normalizeExperienceContent,
} from "@/lib/experienceContent";

export default function ExperienceSection({ content }) {
  const { title } = normalizeExperienceContent(content);
  const items = getVisibleExperienceItems(content);

  if (!items.length) return null;

  return (
    <section className="space-y-5 scroll-mt-[30px]" id="experience">
      <SectionHeader>{title}</SectionHeader>
      <div className="relative space-y-8 pb-2">
        {items.map((exp) => {
          const period = formatExperiencePeriod(exp);
          const meta = formatExperienceMeta(exp);
          const roleTitle = formatExperienceRole(exp);
          const companyNode = exp.companyUrl ? (
            <a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-secondary hover:underline underline-offset-2"
            >
              {exp.company}
            </a>
          ) : (
            <p className="text-sm font-semibold text-secondary">{exp.company}</p>
          );

          return (
            <div key={exp.id} className="relative pl-8">
              <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-primary" />
              <div className="rounded-xl bg-surface-container-low p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h4 className="font-bold text-on-surface">{roleTitle}</h4>
                  {period ? (
                    <span className="shrink-0 rounded px-2 py-0.5 text-[10px] uppercase bg-primary/10 text-primary">
                      {period}
                    </span>
                  ) : null}
                </div>
                <div className="mb-1">{companyNode}</div>
                {meta ? (
                  <p className="mb-3 text-xs text-on-surface-variant">{meta}</p>
                ) : null}
                {exp.bullets.length ? (
                  <ul className="space-y-1.5 text-sm leading-relaxed text-on-surface-variant">
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <li key={`${exp.id}-${bulletIndex}`} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/80" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
