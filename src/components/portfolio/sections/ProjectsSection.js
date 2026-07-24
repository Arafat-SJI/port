import SectionHeader from "@/components/portfolio/SectionHeader";
import {
  getVisibleProjectsItems,
  normalizeProjectsContent,
} from "@/lib/projectsContent";

export default function ProjectsSection({ content }) {
  const { title, subtitle } = normalizeProjectsContent(content);
  const items = getVisibleProjectsItems(content);

  if (!items.length) return null;

  return (
    <section className="space-y-5 scroll-mt-[30px]" id="projects">
      <div className="flex justify-between items-end">
        <div>
          <SectionHeader>{title}</SectionHeader>
          {subtitle ? (
            <p className="text-sm text-on-surface-variant mt-2">{subtitle}</p>
          ) : null}
        </div>
        <a className="text-primary text-xs hover:underline" href="#projects">
          view_all_src
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((project) => (
          <div
            key={project.id}
            className="bg-surface-container-lowest border border-border rounded-xl overflow-hidden group hover:border-primary transition-all"
          >
            <div className="h-40 relative overflow-hidden bg-surface-container-highest">
              {project.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  alt={project.imageAlt || project.title}
                  src={project.imageUrl}
                />
              ) : null}
              <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest to-transparent" />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-base text-on-surface font-semibold">{project.title}</h3>
                <div className="flex gap-2 shrink-0">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="material-symbols-outlined text-on-surface-variant hover:text-primary"
                      aria-label={`${project.title} live site`}
                    >
                      link
                    </a>
                  ) : null}
                  {project.codeUrl ? (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="material-symbols-outlined text-on-surface-variant hover:text-primary"
                      aria-label={`${project.title} source code`}
                    >
                      code
                    </a>
                  ) : null}
                </div>
              </div>
              {project.description ? (
                <p className="text-on-surface-variant text-sm line-clamp-2">
                  {project.description}
                </p>
              ) : null}
              {project.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={`${project.id}-${tag}`}
                      className="px-2 py-0.5 rounded-full bg-surface-container-highest text-[10px] text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
