import ChangeEmailForm from "@/components/dashboard/ChangeEmailForm";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsEmailPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[22px] text-primary">mail</span>
          <div>
            <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
              Settings
            </p>
            <h1 className="text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
              Change email
            </h1>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-on-surface-variant">
          Updates Supabase Auth only — never the AI knowledge JSON.
        </p>
      </header>

      <ChangeEmailForm currentEmail={user?.email ?? ""} />
    </main>
  );
}
