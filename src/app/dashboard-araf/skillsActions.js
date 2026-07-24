"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeSkillsContent } from "@/lib/skillsContent";
import { writeSkillsContentToSupabase } from "@/lib/skillsContentServer";

export async function saveSkillsContentAction(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", success: false, content: null };
  }

  const groupsRaw = formData.get("groups");
  const titleRaw = formData.get("title");
  let parsed;
  try {
    parsed = typeof groupsRaw === "string" ? JSON.parse(groupsRaw) : groupsRaw;
  } catch {
    return { error: "Invalid skills payload.", success: false, content: null };
  }

  const normalized = normalizeSkillsContent({
    title: typeof titleRaw === "string" ? titleRaw : "",
    groups: parsed,
  });

  if (!normalized.title.trim()) {
    return {
      error: "Section header title is required.",
      success: false,
      content: null,
    };
  }

  if (!normalized.groups.length) {
    return {
      error: "Add at least one skill group.",
      success: false,
      content: null,
    };
  }

  for (const group of normalized.groups) {
    if (!group.title.trim()) {
      return {
        error: "Each group needs a title.",
        success: false,
        content: null,
      };
    }
    if (!group.items.length) {
      return {
        error: `Add at least one skill under “${group.title}”.`,
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writeSkillsContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/skills");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Skills saved.",
    };
  } catch {
    return {
      error: "Could not save Skills content.",
      success: false,
      content: null,
    };
  }
}
