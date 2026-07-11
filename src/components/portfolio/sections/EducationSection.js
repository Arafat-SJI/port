import { EDUCATION } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function EducationSection() {
  return (
    <section className="space-y-5 scroll-mt-[30px]" id="education">
      <SectionHeader>Education</SectionHeader>
      <div className="space-y-4">
        {EDUCATION.map((edu) => (
          <div
            key={edu.institution}
            className="bg-surface-container-low border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base font-semibold text-on-surface">{edu.degree}</h3>
                <p className="text-sm font-semibold text-secondary mt-0.5">{edu.institution}</p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <span className="text-[10px] uppercase px-2 py-0.5 rounded text-on-surface-variant bg-surface-container-highest">
                  {edu.period}
                </span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded text-primary bg-primary/10">
                  GPA {edu.gpa}
                </span>
              </div>
            </div>
            <ul className="flex flex-wrap gap-2">
              {edu.highlights.map((item) => (
                <li
                  key={item}
                  className="text-[11px] text-on-surface-variant px-2 py-1 bg-surface-container-highest rounded"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
