import GeminiApiKeyForm from "@/components/dashboard/GeminiApiKeyForm";
import { readGeminiKeyStatus } from "@/lib/geminiKeyServer";

export const dynamic = "force-dynamic";

export default async function SettingsGeminiApiPage() {
  const status = await readGeminiKeyStatus();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined rotate-90 text-[22px] text-primary">key</span>
          <div>
            <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
              Settings
            </p>
            <h1 className="text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
              Gemini API key
            </h1>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-on-surface-variant">
          Free Gemini keys expire. Save multiple keys here in Supabase (dashboard-only) — not in{" "}
          <code className="font-label-mono">.env</code>, never in AI knowledge. Keep up to 5
          Active; chat fails over automatically when a key dies and turns that toggle off.
          Visitors still get a funny fallback reply.
        </p>
      </header>

      <GeminiApiKeyForm initialStatus={status} />
    </main>
  );
}
