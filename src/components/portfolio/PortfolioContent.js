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

export default function PortfolioContent({ searchHighlight }) {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-[106px]">
      <SectionSearchTarget sectionHref="#about" searchHighlight={searchHighlight}>
        <div id="about" className="space-y-14 scroll-mt-[30px]">
          <HeroSection />
          <AboutSection />
        </div>
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#experience" searchHighlight={searchHighlight}>
        <ExperienceSection />
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#skills" searchHighlight={searchHighlight}>
        <SkillsSection />
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#projects" searchHighlight={searchHighlight}>
        <ProjectsSection />
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#education" searchHighlight={searchHighlight}>
        <EducationSection />
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#awards" searchHighlight={searchHighlight}>
        <AwardsSection />
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#publication" searchHighlight={searchHighlight}>
        <PublicationSection />
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#gallery" searchHighlight={searchHighlight}>
        <GallerySection />
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#clubing" searchHighlight={searchHighlight}>
        <ClubingSection />
      </SectionSearchTarget>

      <SectionSearchTarget sectionHref="#mentorship" searchHighlight={searchHighlight}>
        <MentorshipSection />
      </SectionSearchTarget>
    </div>
  );
}
