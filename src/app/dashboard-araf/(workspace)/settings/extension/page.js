import UiExtensionsEditor from "@/components/dashboard/UiExtensionsEditor";
import { readUiExtensionsFromSupabase } from "@/lib/uiExtensionsServer";

export const dynamic = "force-dynamic";

export default async function SettingsExtensionPage() {
  const content = await readUiExtensionsFromSupabase();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[22px] text-primary">extension</span>
          <div>
            <p className="font-label-mono text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
              Settings · UI
            </p>
            <h1 className="text-[20px] font-semibold tracking-tight text-on-surface sm:text-[22px]">
              Extension
            </h1>
          </div>
        </div>
        <p className="mt-2 max-w-2xl text-[13px] text-on-surface-variant">
          All portfolio marketplace extensions are listed below with color previews. Whatever you
          set here is the first look for new visitors; they can still change it in Extensions.
          Discard in Source Control restores your defaults. Not in AI knowledge.
        </p>
      </header>

      <UiExtensionsEditor initialContent={content} />
    </main>
  );
}
