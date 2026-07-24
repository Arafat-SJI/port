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
import { DEFAULT_AWARDS_CONTENT } from "@/lib/awardsContent";
import { DEFAULT_CLUBING_CONTENT } from "@/lib/clubingContent";
import { DEFAULT_EDUCATION_CONTENT } from "@/lib/educationContent";
import { DEFAULT_EXPERIENCE_CONTENT } from "@/lib/experienceContent";
import { DEFAULT_GALLERY_CONTENT } from "@/lib/galleryContent";
import { DEFAULT_MENTORSHIP_CONTENT } from "@/lib/mentorshipContent";
import { DEFAULT_PROJECTS_CONTENT } from "@/lib/projectsContent";
import { DEFAULT_PUBLICATION_CONTENT } from "@/lib/publicationContent";
import { DEFAULT_SKILLS_CONTENT } from "@/lib/skillsContent";
import { orderNavItems } from "@/lib/sectionOrder";

function createSectionRenderers(content, onNavigateSection) {
  const {
    aboutContent,
    experienceContent,
    skillsContent,
    projectsContent,
    educationContent,
    awardsContent,
    publicationContent,
    galleryContent,
    clubingContent,
    mentorshipContent,
  } = content;

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
        <ExperienceSection content={experienceContent} />
      </SectionSearchTarget>
    ),
    skills: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#skills" searchHighlight={searchHighlight}>
        <SkillsSection content={skillsContent} />
      </SectionSearchTarget>
    ),
    projects: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#projects" searchHighlight={searchHighlight}>
        <ProjectsSection content={projectsContent} />
      </SectionSearchTarget>
    ),
    education: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#education" searchHighlight={searchHighlight}>
        <EducationSection content={educationContent} />
      </SectionSearchTarget>
    ),
    awards: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#awards" searchHighlight={searchHighlight}>
        <AwardsSection content={awardsContent} />
      </SectionSearchTarget>
    ),
    publication: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#publication" searchHighlight={searchHighlight}>
        <PublicationSection content={publicationContent} />
      </SectionSearchTarget>
    ),
    gallery: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#gallery" searchHighlight={searchHighlight}>
        <GallerySection content={galleryContent} />
      </SectionSearchTarget>
    ),
    clubing: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#clubing" searchHighlight={searchHighlight}>
        <ClubingSection content={clubingContent} />
      </SectionSearchTarget>
    ),
    mentorship: (searchHighlight) => (
      <SectionSearchTarget sectionHref="#mentorship" searchHighlight={searchHighlight}>
        <MentorshipSection content={mentorshipContent} />
      </SectionSearchTarget>
    ),
  };
}

export default function PortfolioContent({
  searchHighlight,
  sectionOrder,
  aboutContent = DEFAULT_ABOUT_CONTENT,
  experienceContent = DEFAULT_EXPERIENCE_CONTENT,
  skillsContent = DEFAULT_SKILLS_CONTENT,
  projectsContent = DEFAULT_PROJECTS_CONTENT,
  educationContent = DEFAULT_EDUCATION_CONTENT,
  awardsContent = DEFAULT_AWARDS_CONTENT,
  publicationContent = DEFAULT_PUBLICATION_CONTENT,
  galleryContent = DEFAULT_GALLERY_CONTENT,
  clubingContent = DEFAULT_CLUBING_CONTENT,
  mentorshipContent = DEFAULT_MENTORSHIP_CONTENT,
  onNavigateSection,
}) {
  const ordered = orderNavItems(NAV_ITEMS, sectionOrder).filter(
    (item) => item.href !== "#contact"
  );
  const renderers = createSectionRenderers(
    {
      aboutContent,
      experienceContent,
      skillsContent,
      projectsContent,
      educationContent,
      awardsContent,
      publicationContent,
      galleryContent,
      clubingContent,
      mentorshipContent,
    },
    onNavigateSection
  );

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
