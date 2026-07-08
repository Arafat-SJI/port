import { PROJECTS } from "@/data/portfolio";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function ProjectsSection() {
  return (
    <section className="space-y-5 scroll-mt-[15px]" id="projects">
      <div className="flex justify-between items-end">
        <div>
          <SectionHeader>Selected Projects</SectionHeader>
          <p className="text-sm text-on-surface-variant mt-2">Tools and platforms engineered for scale.</p>
        </div>
        <a className="text-primary text-xs hover:underline" href="#projects">
          view_all_src
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.map((project) => (
          <div
            key={project.title}
            className="bg-surface-container-lowest border border-border rounded-xl overflow-hidden group hover:border-primary transition-all"
          >
            <div className="h-40 relative overflow-hidden bg-surface-container-highest">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                alt={project.alt}
                src={project.image}
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest to-transparent" />
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-base text-on-surface font-semibold">{project.title}</h3>
                <div className="flex gap-2">
                  {project.links.map((link) => (
                    <span
                      key={link}
                      className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      {link}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-on-surface-variant text-sm line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-surface-container-highest text-[10px] text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
