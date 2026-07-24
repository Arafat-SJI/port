"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeMentorshipContent } from "@/lib/mentorshipContent";
import { writeMentorshipContentToSupabase } from "@/lib/mentorshipContentServer";

export async function saveMentorshipContentAction(prevState, formData) {
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
    return { error: "Invalid mentorship payload.", success: false, content: null };
  }

  const normalized = normalizeMentorshipContent(parsed);

  if (!normalized.title.trim()) {
    return {
      error: "Section header title is required.",
      success: false,
      content: null,
    };
  }

  if (!normalized.items.length) {
    return {
      error: "Add at least one mentorship entry.",
      success: false,
      content: null,
    };
  }

  for (const item of normalized.items) {
    if (!item.program.trim()) {
      return {
        error: "Each entry needs a program name.",
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writeMentorshipContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/mentorship");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Mentorship saved.",
    };
  } catch {
    return {
      error: "Could not save Mentorship content.",
      success: false,
      content: null,
    };
  }
}
