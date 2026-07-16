"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ABOUT_IMAGE_BUCKET,
  ABOUT_IMAGE_MAX_BYTES,
  ABOUT_IMAGE_MIME_TYPES,
  ABOUT_IMAGE_PATH,
  CV_MAX_BYTES,
  CV_STORAGE_BUCKET,
  CV_STORAGE_PATH,
  normalizeAboutContent,
  stripIntroMarkup,
} from "@/lib/aboutContent";
import {
  readAboutContentFromSupabase,
  writeAboutContentToSupabase,
} from "@/lib/aboutContentServer";

export async function saveAboutContentAction(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", success: false, content: null };
  }

  const interestsRaw = String(formData.get("interests") ?? "");
  const payload = {
    headlinePrefix: formData.get("headlinePrefix"),
    headlineHighlight: formData.get("headlineHighlight"),
    headlineSuffix: formData.get("headlineSuffix"),
    intro: formData.get("intro"),
    primaryCta: formData.get("primaryCta"),
    secondaryCta: formData.get("secondaryCta"),
    cvUrl: formData.get("cvUrl"),
    imageUrl: formData.get("imageUrl"),
    summary: formData.get("summary"),
    interests: interestsRaw,
    visibility: formData.get("visibility"),
  };

  const normalized = normalizeAboutContent(payload);

  if (!normalized.summary.trim()) {
    return { error: "Summary is required.", success: false, content: null };
  }

  if (!stripIntroMarkup(normalized.intro).trim()) {
    return { error: "Intro is required.", success: false, content: null };
  }

  try {
    const saved = await writeAboutContentToSupabase(normalized, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf/about");
    return { error: null, success: true, content: saved, message: "About saved." };
  } catch {
    return { error: "Could not save About content.", success: false, content: null };
  }
}

async function requireDashboardUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", user: null, supabase };
  return { error: null, user, supabase };
}

export async function uploadCvAction(prevState, formData) {
  const { error: authError, supabase } = await requireDashboardUser();
  if (authError) {
    return { error: authError, success: false, content: null };
  }

  const file = formData.get("cv");
  if (!file || typeof file === "string" || !file.size) {
    return { error: "Choose a PDF file to upload.", success: false, content: null };
  }

  if (file.type && file.type !== "application/pdf") {
    return { error: "Only PDF files are allowed.", success: false, content: null };
  }

  if (file.size > CV_MAX_BYTES) {
    return { error: "PDF must be 5MB or smaller.", success: false, content: null };
  }

  try {
    const admin = createAdminClient();
    const bytes = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from(CV_STORAGE_BUCKET)
      .upload(CV_STORAGE_PATH, bytes, {
        upsert: true,
        contentType: "application/pdf",
        cacheControl: "3600",
      });

    if (uploadError) {
      return {
        error: uploadError.message || "Upload failed. Ensure the portfolio-cv bucket exists.",
        success: false,
        content: null,
      };
    }

    const { data: publicData } = admin.storage
      .from(CV_STORAGE_BUCKET)
      .getPublicUrl(CV_STORAGE_PATH);

    const cvUrl = `${publicData.publicUrl}?v=${Date.now()}`;
    const current = await readAboutContentFromSupabase();
    const saved = await writeAboutContentToSupabase(
      { ...current, cvUrl },
      supabase
    );

    revalidatePath("/");
    revalidatePath("/dashboard-araf/about");
    return {
      error: null,
      success: true,
      content: saved,
      message: "CV uploaded.",
    };
  } catch (err) {
    return {
      error: err?.message || "Could not upload CV.",
      success: false,
      content: null,
    };
  }
}

export async function removeCvAction() {
  const { error: authError, supabase } = await requireDashboardUser();
  if (authError) {
    return { error: authError, success: false, content: null };
  }

  try {
    const admin = createAdminClient();
    await admin.storage.from(CV_STORAGE_BUCKET).remove([CV_STORAGE_PATH]);

    const current = await readAboutContentFromSupabase();
    const saved = await writeAboutContentToSupabase(
      { ...current, cvUrl: "" },
      supabase
    );

    revalidatePath("/");
    revalidatePath("/dashboard-araf/about");
    return { error: null, success: true, content: saved, message: "CV removed." };
  } catch {
    return { error: "Could not remove CV.", success: false, content: null };
  }
}

export async function uploadAboutImageAction(prevState, formData) {
  const { error: authError, supabase } = await requireDashboardUser();
  if (authError) {
    return { error: authError, success: false, content: null };
  }

  const file = formData.get("image");
  if (!file || typeof file === "string" || !file.size) {
    return { error: "Choose an image to upload.", success: false, content: null };
  }

  if (file.type && !ABOUT_IMAGE_MIME_TYPES.includes(file.type)) {
    return {
      error: "Only JPG, PNG, WebP, or GIF images are allowed.",
      success: false,
      content: null,
    };
  }

  if (file.size > ABOUT_IMAGE_MAX_BYTES) {
    return { error: "Image must be 3MB or smaller.", success: false, content: null };
  }

  try {
    const admin = createAdminClient();
    const bytes = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || "image/jpeg";

    const { error: uploadError } = await admin.storage
      .from(ABOUT_IMAGE_BUCKET)
      .upload(ABOUT_IMAGE_PATH, bytes, {
        upsert: true,
        contentType,
        cacheControl: "3600",
      });

    if (uploadError) {
      return {
        error:
          uploadError.message ||
          "Upload failed. Ensure the portfolio-about bucket exists.",
        success: false,
        content: null,
      };
    }

    const { data: publicData } = admin.storage
      .from(ABOUT_IMAGE_BUCKET)
      .getPublicUrl(ABOUT_IMAGE_PATH);

    const imageUrl = `${publicData.publicUrl}?v=${Date.now()}`;
    const current = await readAboutContentFromSupabase();
    const saved = await writeAboutContentToSupabase(
      { ...current, imageUrl },
      supabase
    );

    revalidatePath("/");
    revalidatePath("/dashboard-araf/about");
    return {
      error: null,
      success: true,
      content: saved,
      message: "Image uploaded.",
    };
  } catch (err) {
    return {
      error: err?.message || "Could not upload image.",
      success: false,
      content: null,
    };
  }
}

export async function removeAboutImageAction() {
  const { error: authError, supabase } = await requireDashboardUser();
  if (authError) {
    return { error: authError, success: false, content: null };
  }

  try {
    const admin = createAdminClient();
    await admin.storage.from(ABOUT_IMAGE_BUCKET).remove([ABOUT_IMAGE_PATH]);

    const current = await readAboutContentFromSupabase();
    const saved = await writeAboutContentToSupabase(
      { ...current, imageUrl: "" },
      supabase
    );

    revalidatePath("/");
    revalidatePath("/dashboard-araf/about");
    return { error: null, success: true, content: saved, message: "Image removed." };
  } catch {
    return { error: "Could not remove image.", success: false, content: null };
  }
}
