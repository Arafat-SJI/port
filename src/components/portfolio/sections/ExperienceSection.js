import { EXPERIENCE } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function ExperienceSection() {
  return (
    <section className="space-y-5 scroll-mt-[15px]" id="experience">
      <SectionHeader>Experience</SectionHeader>
      <div className="relative border-l border-border ml-4 space-y-8 pb-2">
        {EXPERIENCE.map((exp) => (
          <div key={exp.company} className="relative pl-8">
            <div
              className={`absolute left-[-9px] top-1.5 w-4 h-4 rounded-full border border-background ${
                exp.current ? "bg-primary" : "bg-outline-variant"
              }`}
            />
            <div
              className={`bg-surface-container-low border border-border p-5 rounded-xl ${
                exp.current ? "" : "opacity-80 hover:opacity-100 transition-opacity"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-on-surface">{exp.role}</h4>
                <span
                  className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                    exp.current
                      ? "text-primary bg-primary/10"
                      : "text-on-surface-variant bg-surface-container-highest"
                  }`}
                >
                  {exp.period}
                </span>
              </div>
              <p className="text-sm font-semibold text-secondary mb-2">{exp.company}</p>
              <p className="text-on-surface-variant text-sm leading-relaxed">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
