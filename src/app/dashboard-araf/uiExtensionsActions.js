"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUiExtensions } from "@/lib/uiExtensions";
import { writeUiExtensionsToSupabase } from "@/lib/uiExtensionsServer";

export async function saveUiExtensionsAction(payload) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", success: false, content: null };
  }

  let parsed = payload;
  if (typeof payload === "string") {
    try {
      parsed = JSON.parse(payload);
    } catch {
      return { error: "Invalid UI extensions payload.", success: false, content: null };
    }
  }

  try {
    const normalized = normalizeUiExtensions(parsed);
    const saved = await writeUiExtensionsToSupabase(normalized, supabase);
    revalidatePath("/", "layout");
    revalidatePath("/");
    // Do not revalidate this settings page — client autosave owns local state
    // (revalidating caused toggles to snap back and need a second click).
    return { error: null, success: true, content: saved };
  } catch (err) {
    return {
      error: err?.message || "Could not save UI defaults.",
      success: false,
      content: null,
    };
  }
}
