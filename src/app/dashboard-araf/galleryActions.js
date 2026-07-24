"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeGalleryContent } from "@/lib/galleryContent";
import { writeGalleryContentToSupabase } from "@/lib/galleryContentServer";

export async function saveGalleryContentAction(prevState, formData) {
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
    return { error: "Invalid gallery payload.", success: false, content: null };
  }

  const normalized = normalizeGalleryContent(parsed);

  if (!normalized.title.trim()) {
    return {
      error: "Section header title is required.",
      success: false,
      content: null,
    };
  }

  if (!normalized.items.length) {
    return {
      error: "Add at least one gallery item.",
      success: false,
      content: null,
    };
  }

  for (const item of normalized.items) {
    if (!item.caption.trim()) {
      return {
        error: "Each gallery item needs a caption.",
        success: false,
        content: null,
      };
    }
  }

  try {
    const saved = await writeGalleryContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/gallery");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Gallery saved.",
    };
  } catch {
    return {
      error: "Could not save Gallery content.",
      success: false,
      content: null,
    };
  }
}
