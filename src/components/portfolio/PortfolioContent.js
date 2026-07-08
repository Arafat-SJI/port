import AboutSection from "./sections/AboutSection";
import AwardsSection from "./sections/AwardsSection";
import ClubingSection from "./sections/ClubingSection";
import ContactSection from "./sections/ContactSection";
import EducationSection from "./sections/EducationSection";
import ExperienceSection from "./sections/ExperienceSection";
import GallerySection from "./sections/GallerySection";
import HeroSection from "./sections/HeroSection";
import MentorshipSection from "./sections/MentorshipSection";
import ProjectsSection from "./sections/ProjectsSection";
import PublicationSection from "./sections/PublicationSection";
import SkillsSection from "./sections/SkillsSection";

export default function PortfolioContent() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-8 space-y-[76px]">
      <div id="about" className="space-y-14 scroll-mt-[15px]">
        <HeroSection />
        <AboutSection />
      </div>
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <AwardsSection />
      <PublicationSection />
      <GallerySection />
      <ClubingSection />
      <MentorshipSection />
      <ContactSection />
    </div>
  );
}
