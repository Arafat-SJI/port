import { normalizeAboutVisibility } from "@/lib/aboutContent";

export default function AboutSection({ content }) {
  const { summary, interests, visibility: visibilityRaw } = content;
  const visibility = normalizeAboutVisibility(visibilityRaw);
  const showSummary = visibility.summary;
  const showInterests = visibility.interests;

  if (!showSummary && !showInterests) {
    return null;
  }

  return (
    <section
      className={`grid grid-cols-1 gap-3 ${
        showSummary && showInterests ? "md:grid-cols-3" : ""
      }`}
    >
      {showSummary ? (
        <div
          className={`${
            showInterests ? "md:col-span-2" : ""
          } p-5 bg-surface-container-low border border-border rounded-xl group hover:border-primary/50 transition-colors`}
        >
          <h3 className="text-base text-on-surface mb-2 font-semibold">Summary</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">{summary}</p>
        </div>
      ) : null}
      {showInterests ? (
        <div className="p-5 bg-surface-container-low border border-border rounded-xl group hover:border-primary/50 transition-colors">
          <h3 className="text-base text-on-surface mb-2 font-semibold">Interests</h3>
          <ul className="space-y-1.5 text-on-surface-variant text-xs">
            {interests.map((interest) => (
              <li key={interest} className="flex items-center gap-2">
                <span className="text-primary">▹</span> {interest}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
