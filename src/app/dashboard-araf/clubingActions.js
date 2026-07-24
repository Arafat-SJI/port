"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeClubingContent } from "@/lib/clubingContent";
import { writeClubingContentToSupabase } from "@/lib/clubingContentServer";

export async function saveClubingContentAction(prevState, formData) {
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
    return { error: "Invalid clubing payload.", success: false, content: null };
  }

  const normalized = normalizeClubingContent({
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
      error: "Add at least one club entry.",
      success: false,
      content: null,
    };
  }

  for (const item of normalized.items) {
    if (!item.name.trim()) {
      return {
        error: "Each club needs a name.",
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writeClubingContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/clubing");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Clubing saved.",
    };
  } catch {
    return {
      error: "Could not save Clubing content.",
      success: false,
      content: null,
    };
  }
}
