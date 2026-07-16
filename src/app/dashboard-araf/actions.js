"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function loginAction(prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/dashboard-araf");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/dashboard-araf/login");
}

/** True if this email belongs to a dashboard auth user (owner). */
async function isDashboardOwnerEmail(email) {
  const normalized = String(email ?? "").trim().toLowerCase();
  if (!normalized) return false;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 50 });
    if (error || !data?.users?.length) return false;
    return data.users.some((u) => String(u.email ?? "").toLowerCase() === normalized);
  } catch {
    return false;
  }
}

export async function forgotPasswordAction(prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required.", success: false };
  }

  const isOwner = await isDashboardOwnerEmail(email);
  if (!isOwner) {
    return {
      error: "Get out of here, this is not your portfolio.",
      success: false,
    };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/dashboard-araf/settings/password?recovery=1`,
  });

  if (error) {
    return { error: "Could not send reset email. Try again.", success: false };
  }

  return {
    error: null,
    success: true,
    message: "Reset link sent. Check your email.",
  };
}

export async function verifyCurrentPasswordAction(prevState, formData) {
  const currentPassword = String(formData.get("currentPassword") ?? "");

  if (!currentPassword) {
    return { error: "Current password is required.", verified: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in.", verified: false };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (error) {
    return { error: "Current password is incorrect.", verified: false };
  }

  return { error: null, verified: true };
}

export async function changePasswordAction(prevState, formData) {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required.", success: false };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters.", success: false };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match.", success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in.", success: false };
  }

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (reauthError) {
    return { error: "Current password is incorrect.", success: false };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { error: error.message || "Could not update password.", success: false };
  }

  // Auth only — never write credentials to AI knowledge JSON.
  return { error: null, success: true, message: "Password updated successfully." };
}

export async function changeEmailAction(prevState, formData) {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newEmail = String(formData.get("newEmail") ?? "").trim().toLowerCase();

  if (!currentPassword || !newEmail) {
    return { error: "Current password and new email are required.", success: false, email: null };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return { error: "Enter a valid email address.", success: false, email: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in.", success: false, email: null };
  }

  if (newEmail === user.email.toLowerCase()) {
    return {
      error: "New email must be different from your current email.",
      success: false,
      email: null,
    };
  }

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (reauthError) {
    return { error: "Current password is incorrect.", success: false, email: null };
  }

  const { data, error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    return { error: error.message || "Could not update email.", success: false, email: null };
  }

  // Auth only — never write dashboard email to AI knowledge JSON.
  revalidatePath("/dashboard-araf", "layout");
  revalidatePath("/dashboard-araf/settings");

  const pendingConfirm =
    Boolean(data?.user?.new_email) ||
    data?.user?.email?.toLowerCase() !== newEmail;

  return {
    error: null,
    success: true,
    email: data?.user?.email ?? user.email,
    message: pendingConfirm
      ? "Check your new inbox to confirm the email change."
      : "Email updated successfully.",
  };
}
