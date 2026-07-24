"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeExperienceContent } from "@/lib/experienceContent";
import { writeExperienceContentToSupabase } from "@/lib/experienceContentServer";

export async function saveExperienceContentAction(prevState, formData) {
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
    return { error: "Invalid experience payload.", success: false, content: null };
  }

  const normalized = normalizeExperienceContent({
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
      error: "Add at least one experience entry.",
      success: false,
      content: null,
    };
  }

  for (const item of normalized.items) {
    if (!item.company.trim() || !item.role.trim()) {
      return {
        error: "Each entry needs a company and role.",
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writeExperienceContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/experience");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Experience saved.",
    };
  } catch {
    return {
      error: "Could not save Experience content.",
      success: false,
      content: null,
    };
  }
}
