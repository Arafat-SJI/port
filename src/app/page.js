import HomeClient from "@/components/HomeClient";
import { readAboutContentFromSupabase } from "@/lib/aboutContentServer";
import { readExperienceContentFromSupabase } from "@/lib/experienceContentServer";
import { readProjectsContentFromSupabase } from "@/lib/projectsContentServer";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";
import { readSkillsContentFromSupabase } from "@/lib/skillsContentServer";

/** Always read shared portfolio data from Supabase so first paint matches dashboard. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [sectionOrder, aboutContent, experienceContent, skillsContent, projectsContent] =
    await Promise.all([
      readSectionOrderFromSupabase(),
      readAboutContentFromSupabase(),
      readExperienceContentFromSupabase(),
      readSkillsContentFromSupabase(),
      readProjectsContentFromSupabase(),
    ]);
  return (
    <HomeClient
      sectionOrder={sectionOrder}
      aboutContent={aboutContent}
      experienceContent={experienceContent}
      skillsContent={skillsContent}
      projectsContent={projectsContent}
    />
  );
}
