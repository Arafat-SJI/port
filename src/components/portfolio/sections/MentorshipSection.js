import SectionHeader from "@/components/portfolio/SectionHeader";
import {
  getVisibleMentorshipItems,
  normalizeMentorshipContent,
} from "@/lib/mentorshipContent";

export default function MentorshipSection({ content }) {
  const { title, stats } = normalizeMentorshipContent(content);
  const items = getVisibleMentorshipItems(content);

  if (!items.length) return null;

  return (
    <section className="space-y-5 scroll-mt-[30px]" id="mentorship">
      <SectionHeader>{title}</SectionHeader>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container-low border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.mentees}</p>
            <p className="text-[10px] text-on-surface-variant uppercase mt-1">Mentees</p>
          </div>
          <div className="bg-surface-container-low border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.programs}</p>
            <p className="text-[10px] text-on-surface-variant uppercase mt-1">Programs</p>
          </div>
          <div className="bg-surface-container-low border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.active}</p>
            <p className="text-[10px] text-on-surface-variant uppercase mt-1">Active</p>
          </div>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-low border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">{item.program}</h3>
                <p className="text-xs font-semibold text-secondary mt-0.5">
                  {[item.role, item.mentees ? `${item.mentees} mentees` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              {item.period ? (
                <span className="text-[10px] uppercase px-2 py-0.5 rounded w-fit shrink-0 text-on-surface-variant bg-surface-container-highest">
                  {item.period}
                </span>
              ) : null}
            </div>
            {item.description ? (
              <p className="text-sm text-on-surface-variant leading-relaxed mb-3">
                {item.description}
              </p>
            ) : null}
            {item.topics.length ? (
              <div className="flex flex-wrap gap-2">
                {item.topics.map((topic) => (
                  <span
                    key={`${item.id}-${topic}`}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container-highest text-primary"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
