"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  deleteAiChatThreadByIp,
  markAiChatThreadReadByIp,
  readAiChatMessageThreads,
} from "@/lib/aiChatMessagesServer";

async function requireDashboardUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

export async function markAiChatThreadReadAction(ipKey) {
  const user = await requireDashboardUser();
  if (!user) return { error: "Unauthorized", success: false };

  try {
    await markAiChatThreadReadByIp(ipKey);
    revalidatePath("/dashboard-araf/ai-chats");
    revalidatePath("/dashboard-araf", "layout");
    return { error: null, success: true };
  } catch (err) {
    return { error: err?.message || "Could not update.", success: false };
  }
}

export async function deleteAiChatThreadAction(ipKey) {
  const user = await requireDashboardUser();
  if (!user) return { error: "Unauthorized", success: false };

  try {
    await deleteAiChatThreadByIp(ipKey);
    revalidatePath("/dashboard-araf/ai-chats");
    revalidatePath("/dashboard-araf", "layout");
    return { error: null, success: true };
  } catch (err) {
    return { error: err?.message || "Could not delete.", success: false };
  }
}

export async function refreshAiChatThreadsAction() {
  const user = await requireDashboardUser();
  if (!user) return { error: "Unauthorized", threads: [] };

  try {
    const threads = await readAiChatMessageThreads();
    return { error: null, threads };
  } catch (err) {
    return { error: err?.message || "Could not load AI chats.", threads: [] };
  }
}
