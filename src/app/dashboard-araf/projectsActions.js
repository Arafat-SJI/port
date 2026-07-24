"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeProjectsContent } from "@/lib/projectsContent";
import { writeProjectsContentToSupabase } from "@/lib/projectsContentServer";

export async function saveProjectsContentAction(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", success: false, content: null };
  }

  const payloadRaw = formData.get("payload");
  let parsed;
  try {
    parsed = typeof payloadRaw === "string" ? JSON.parse(payloadRaw) : payloadRaw;
  } catch {
    return { error: "Invalid projects payload.", success: false, content: null };
  }

  const normalized = normalizeProjectsContent(parsed);

  if (!normalized.title.trim()) {
    return {
      error: "Section header title is required.",
      success: false,
      content: null,
    };
  }

  if (!normalized.items.length) {
    return {
      error: "Add at least one project.",
      success: false,
      content: null,
    };
  }

  for (const item of normalized.items) {
    if (!item.title.trim()) {
      return {
        error: "Each project needs a title.",
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writeProjectsContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/projects");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Projects saved.",
    };
  } catch {
    return {
      error: "Could not save Projects content.",
      success: false,
      content: null,
    };
  }
}
