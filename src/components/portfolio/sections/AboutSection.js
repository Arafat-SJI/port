export default function AboutSection({ content }) {
  const { summary, interests } = content;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="md:col-span-2 p-5 bg-surface-container-low border border-border rounded-xl group hover:border-primary/50 transition-colors">
        <h3 className="text-base text-on-surface mb-2 font-semibold">Summary</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">{summary}</p>
      </div>
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
    </section>
  );
}
