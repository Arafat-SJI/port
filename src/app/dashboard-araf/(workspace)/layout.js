import { createClient } from "@/lib/supabase/server";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardWorkspaceLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-full min-h-0">
      <DashboardSidebar email={user?.email ?? ""} />
      <div className="relative min-h-0 min-w-0 flex-1 overflow-y-auto custom-scrollbar bg-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 100% -10%, rgb(173 198 255 / 0.12), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, rgb(78 222 163 / 0.06), transparent 50%)",
          }}
        />
        <div className="relative z-[1] min-h-full">{children}</div>
      </div>
    </div>
  );
}
