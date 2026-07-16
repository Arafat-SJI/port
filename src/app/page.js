import HomeClient from "@/components/HomeClient";
import { readAboutContentFromSupabase } from "@/lib/aboutContentServer";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";

/** Always read shared portfolio data from Supabase so first paint matches dashboard. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [sectionOrder, aboutContent] = await Promise.all([
    readSectionOrderFromSupabase(),
    readAboutContentFromSupabase(),
  ]);
  return <HomeClient sectionOrder={sectionOrder} aboutContent={aboutContent} />;
}
