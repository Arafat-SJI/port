import { MENTORSHIP } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function MentorshipSection() {
  return (
    <section className="space-y-5 scroll-mt-[30px]" id="mentorship">
      <SectionHeader>Mentorship</SectionHeader>
      <div className="grid grid-cols-3 gap-3 mb-1">
        <div className="bg-surface-container-low border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">8+</p>
          <p className="text-[10px] text-on-surface-variant uppercase mt-1">Mentees</p>
        </div>
        <div className="bg-surface-container-low border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">3</p>
          <p className="text-[10px] text-on-surface-variant uppercase mt-1">Programs</p>
        </div>
        <div className="bg-surface-container-low border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">4yr</p>
          <p className="text-[10px] text-on-surface-variant uppercase mt-1">Active</p>
        </div>
      </div>
      <div className="space-y-3">
        {MENTORSHIP.map((item) => (
          <div
            key={item.program}
            className="bg-surface-container-low border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">{item.program}</h3>
                <p className="text-xs font-semibold text-secondary mt-0.5">
                  {item.role} · {item.mentees} mentees
                </p>
              </div>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded w-fit shrink-0 text-on-surface-variant bg-surface-container-highest">
                {item.period}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-3">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              {item.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-primary"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
