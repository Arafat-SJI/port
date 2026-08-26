import HomeClient from "@/components/HomeClient";
import { readAboutContentFromSupabase } from "@/lib/aboutContentServer";
import { readAwardsContentFromSupabase } from "@/lib/awardsContentServer";
import { readClubingContentFromSupabase } from "@/lib/clubingContentServer";
import { readContactContentFromSupabase } from "@/lib/contactContentServer";
import { readEducationContentFromSupabase } from "@/lib/educationContentServer";
import { readExperienceContentFromSupabase } from "@/lib/experienceContentServer";
import { readGalleryContentFromSupabase } from "@/lib/galleryContentServer";
import { readMentorshipContentFromSupabase } from "@/lib/mentorshipContentServer";
import { readProjectsContentFromSupabase } from "@/lib/projectsContentServer";
import { readPublicationContentFromSupabase } from "@/lib/publicationContentServer";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";
import { readSkillsContentFromSupabase } from "@/lib/skillsContentServer";
import { readUiExtensionsFromSupabase } from "@/lib/uiExtensionsServer";

/** Always read shared portfolio data from Supabase so first paint matches dashboard. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    sectionOrder,
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
    contactContent,
    uiExtensions,
  ] = await Promise.all([
    readSectionOrderFromSupabase(),
    readAboutContentFromSupabase(),
    readExperienceContentFromSupabase(),
    readSkillsContentFromSupabase(),
    readProjectsContentFromSupabase(),
    readEducationContentFromSupabase(),
    readAwardsContentFromSupabase(),
    readPublicationContentFromSupabase(),
    readGalleryContentFromSupabase(),
    readClubingContentFromSupabase(),
    readMentorshipContentFromSupabase(),
    readContactContentFromSupabase(),
    readUiExtensionsFromSupabase(),
  ]);
  return (
    <HomeClient
      sectionOrder={sectionOrder}
      aboutContent={aboutContent}
      experienceContent={experienceContent}
      skillsContent={skillsContent}
      projectsContent={projectsContent}
      educationContent={educationContent}
      awardsContent={awardsContent}
      publicationContent={publicationContent}
      galleryContent={galleryContent}
      clubingContent={clubingContent}
      mentorshipContent={mentorshipContent}
      contactContent={contactContent}
      uiExtensions={uiExtensions}
    />
  );
}
