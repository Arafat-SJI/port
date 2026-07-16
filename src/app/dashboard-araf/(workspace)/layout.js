import DashboardShell from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";

export default async function DashboardWorkspaceLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const sectionOrder = await readSectionOrderFromSupabase();

  return (
    <DashboardShell email={user?.email ?? ""} sectionOrder={sectionOrder}>
      {children}
    </DashboardShell>
  );
}
