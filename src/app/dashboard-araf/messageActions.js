"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  deleteThreadByEmail,
  markThreadReadByEmail,
  readContactMessageThreads,
} from "@/lib/contactMessagesServer";

async function requireDashboardUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

export async function markMessageThreadReadAction(emailKey) {
  const user = await requireDashboardUser();
  if (!user) return { error: "Unauthorized", success: false };

  try {
    await markThreadReadByEmail(emailKey);
    revalidatePath("/dashboard-araf/messages");
    revalidatePath("/dashboard-araf", "layout");
    return { error: null, success: true };
  } catch (err) {
    return { error: err?.message || "Could not update.", success: false };
  }
}

export async function deleteMessageThreadAction(emailKey) {
  const user = await requireDashboardUser();
  if (!user) return { error: "Unauthorized", success: false };

  try {
    await deleteThreadByEmail(emailKey);
    revalidatePath("/dashboard-araf/messages");
    revalidatePath("/dashboard-araf", "layout");
    return { error: null, success: true };
  } catch (err) {
    return { error: err?.message || "Could not delete.", success: false };
  }
}

export async function refreshMessageThreadsAction() {
  const user = await requireDashboardUser();
  if (!user) return { error: "Unauthorized", threads: [] };

  try {
    const threads = await readContactMessageThreads();
    return { error: null, threads };
  } catch (err) {
    return { error: err?.message || "Could not load messages.", threads: [] };
  }
}
