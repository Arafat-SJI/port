import SectionHeader from "@/components/portfolio/SectionHeader";
import {
  getVisibleEducationItems,
  normalizeEducationContent,
} from "@/lib/educationContent";

export default function EducationSection({ content }) {
  const { title } = normalizeEducationContent(content);
  const items = getVisibleEducationItems(content);

  if (!items.length) return null;

  return (
    <section className="space-y-5 scroll-mt-[30px]" id="education">
      <SectionHeader>{title}</SectionHeader>
      <div className="space-y-4">
        {items.map((edu) => (
          <div
            key={edu.id}
            className="bg-surface-container-low border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-semibold text-on-surface">{edu.degree}</h3>
                <p className="text-sm font-semibold text-secondary mt-0.5">{edu.institution}</p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {edu.period ? (
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded text-on-surface-variant bg-surface-container-highest">
                    {edu.period}
                  </span>
                ) : null}
                {edu.gpa ? (
                  <span className="text-[10px] uppercase px-2 py-0.5 rounded text-primary bg-primary/10">
                    GPA {edu.gpa}
                  </span>
                ) : null}
              </div>
            </div>
            {edu.highlights.length ? (
              <ul className="flex flex-wrap gap-2">
                {edu.highlights.map((item) => (
                  <li
                    key={`${edu.id}-${item}`}
                    className="text-[11px] text-on-surface-variant px-2 py-1 bg-surface-container-highest rounded"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
