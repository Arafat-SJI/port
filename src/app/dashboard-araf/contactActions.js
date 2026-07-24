"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeContactContent } from "@/lib/contactContent";
import { writeContactContentToSupabase } from "@/lib/contactContentServer";

export async function saveContactContentAction(prevState, formData) {
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
    return { error: "Invalid contact payload.", success: false, content: null };
  }

  const normalized = normalizeContactContent(parsed);

  if (!normalized.intro.trim()) {
    return {
      error: "Intro text is required.",
      success: false,
      content: null,
    };
  }

  if (!normalized.email.trim()) {
    return {
      error: "Public email is required.",
      success: false,
      content: null,
    };
  }

  try {
    const saved = await writeContactContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/contact");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Contact saved.",
    };
  } catch {
    return {
      error: "Could not save Contact content.",
      success: false,
      content: null,
    };
  }
}
