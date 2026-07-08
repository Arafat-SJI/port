import { CLUBS } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function ClubingSection() {
  return (
    <section className="space-y-5 scroll-mt-[15px]" id="clubing">
      <SectionHeader>Clubing</SectionHeader>
      <div className="space-y-3">
        {CLUBS.map((club) => (
          <div
            key={club.name}
            className="flex gap-4 bg-surface-container-low border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
          >
            <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">groups</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                <h3 className="text-sm font-semibold text-on-surface">{club.name}</h3>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded w-fit text-on-surface-variant bg-surface-container-highest">
                  {club.period}
                </span>
              </div>
              <p className="text-xs font-semibold text-secondary mb-2">{club.role}</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">{club.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
