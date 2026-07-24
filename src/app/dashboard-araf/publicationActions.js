"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizePublicationContent } from "@/lib/publicationContent";
import { writePublicationContentToSupabase } from "@/lib/publicationContentServer";

export async function savePublicationContentAction(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", success: false, content: null };
  }

  const itemsRaw = formData.get("items");
  const titleRaw = formData.get("title");
  let parsed;
  try {
    parsed = typeof itemsRaw === "string" ? JSON.parse(itemsRaw) : itemsRaw;
  } catch {
    return { error: "Invalid publication payload.", success: false, content: null };
  }

  const normalized = normalizePublicationContent({
    title: typeof titleRaw === "string" ? titleRaw : "",
    items: parsed,
  });

  if (!normalized.title.trim()) {
    return {
      error: "Section header title is required.",
      success: false,
      content: null,
    };
  }

  if (!normalized.items.length) {
    return {
      error: "Add at least one publication.",
      success: false,
      content: null,
    };
  }

  for (const item of normalized.items) {
    if (!item.title.trim()) {
      return {
        error: "Each publication needs a title.",
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writePublicationContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/publication");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Publication saved.",
    };
  } catch {
    return {
      error: "Could not save Publication content.",
      success: false,
      content: null,
    };
  }
}
