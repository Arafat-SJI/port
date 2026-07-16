import SectionSearchTarget from "./SectionSearchTarget";
import AboutSection from "./sections/AboutSection";
import AwardsSection from "./sections/AwardsSection";
import ClubingSection from "./sections/ClubingSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import GallerySection from "./sections/GallerySection";
import HeroSection from "./sections/HeroSection";
import MentorshipSection from "./sections/MentorshipSection";
import ProjectsSection from "./sections/ProjectsSection";
import PublicationSection from "./sections/PublicationSection";
import SkillsSection from "./sections/SkillsSection";
import { NAV_ITEMS } from "@/data/portfolio";
import { DEFAULT_ABOUT_CONTENT } from "@/lib/aboutContent";
import { orderNavItems } from "@/lib/sectionOrder";

function createSectionRenderers(aboutContent, onNavigateSection) {
  return {
    about: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#about" searchHighlight={searchHighlight}>
        <div id="about" className="space-y-14 scroll-mt-[30px]">
          <HeroSection content={aboutContent} onNavigateSection={onNavigateSection} />
          <AboutSection content={aboutContent} />
        </div>
      </SectionSearchTarget>
    ),
    experience: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#experience" searchHighlight={searchHighlight}>
        <ExperienceSection />
      </SectionSearchTarget>
    ),
    skills: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#skills" searchHighlight={searchHighlight}>
        <SkillsSection />
      </SectionSearchTarget>
    ),
    projects: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#projects" searchHighlight={searchHighlight}>
        <ProjectsSection />
      </SectionSearchTarget>
    ),
    education: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#education" searchHighlight={searchHighlight}>
        <EducationSection />
      </SectionSearchTarget>
    ),
    awards: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#awards" searchHighlight={searchHighlight}>
        <AwardsSection />
      </SectionSearchTarget>
    ),
    publication: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#publication" searchHighlight={searchHighlight}>
        <PublicationSection />
      </SectionSearchTarget>
    ),
    gallery: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#gallery" searchHighlight={searchHighlight}>
        <GallerySection />
      </SectionSearchTarget>
    ),
    clubing: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#clubing" searchHighlight={searchHighlight}>
        <ClubingSection />
      </SectionSearchTarget>
    ),
    mentorship: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#mentorship" searchHighlight={searchHighlight}>
        <MentorshipSection />
      </SectionSearchTarget>
    ),
  };
}

export default function PortfolioContent({
  searchHighlight,
  sectionOrder,
  aboutContent = DEFAULT_ABOUT_CONTENT,
  onNavigateSection,
}) {
  const ordered = orderNavItems(NAV_ITEMS, sectionOrder).filter(
    (item) => item.href !== "#contact"
  );
  const renderers = createSectionRenderers(aboutContent, onNavigateSection);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-[106px]">
      {ordered.map((item) => {
        const slug = item.href.replace(/^#/, "");
        const render = renderers[slug];
        return render ? <div key={slug}>{render(searchHighlight)}</div> : null;
      })}
    </div>
  );
}
