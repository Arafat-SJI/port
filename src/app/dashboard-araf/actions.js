"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

const DASHBOARD_OWNER_EMAIL = "arafhussain11@gmail.com";

export async function forgotPasswordAction(prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required.", success: false };
  }

  if (email.toLowerCase() !== DASHBOARD_OWNER_EMAIL) {
    return {
      error: "Get out of here, this is not your portfolio.",
      success: false,
    };
  }

  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/dashboard-araf/settings?recovery=1`,
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
