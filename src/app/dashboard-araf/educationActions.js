"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeEducationContent } from "@/lib/educationContent";
import { writeEducationContentToSupabase } from "@/lib/educationContentServer";

export async function saveEducationContentAction(prevState, formData) {
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
    return { error: "Invalid education payload.", success: false, content: null };
  }

  const normalized = normalizeEducationContent({
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
      error: "Add at least one education entry.",
      success: false,
      content: null,
    };
  }

  for (const item of normalized.items) {
    if (!item.degree.trim() || !item.institution.trim()) {
      return {
        error: "Each entry needs a degree and institution.",
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writeEducationContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/education");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Education saved.",
    };
  } catch {
    return {
      error: "Could not save Education content.",
      success: false,
      content: null,
    };
  }
}
