import { SKILLS } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function SkillsSection() {
  return (
    <section className="space-y-5 scroll-mt-[15px]" id="skills">
      <SectionHeader>Tech Stack</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {SKILLS.map((group) => (
          <div
            key={group.title}
            className="p-4 bg-surface-container border border-border rounded-xl"
          >
            <p className="text-[10px] text-primary uppercase mb-3 tracking-tighter">{group.title}</p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="px-2 py-1 bg-surface-container-highest rounded text-[11px] text-on-surface"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
