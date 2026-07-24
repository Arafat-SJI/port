import SectionHeader from "@/components/portfolio/SectionHeader";
import {
  getVisibleSkillsGroups,
  normalizeSkillsContent,
} from "@/lib/skillsContent";

export default function SkillsSection({ content }) {
  const { title } = normalizeSkillsContent(content);
  const groups = getVisibleSkillsGroups(content);

  if (!groups.length) return null;

  return (
    <section className="space-y-5 scroll-mt-[30px]" id="skills">
      <SectionHeader>{title}</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="p-4 bg-surface-container border border-border rounded-xl"
          >
            <p className="text-[10px] text-primary uppercase mb-3 tracking-tighter">
              {group.title}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={`${group.id}-${item}`}
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
