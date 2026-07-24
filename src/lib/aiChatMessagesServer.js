import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  groupAiChatMessagesIntoThreads,
  normalizeIpKey,
  normalizeStoredAiChatMessage,
  validateAiChatMessageInput,
} from "@/lib/aiChatMessages";

export async function insertAiChatMessage(input) {
  const validated = validateAiChatMessageInput(input);
  if (!validated.ok) {
    throw new Error(validated.error);
  }

  const ip = validated.value.ip;
  const ipKey = normalizeIpKey(ip);
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("ai_chat_messages")
    .insert({
      ip,
      ip_key: ipKey,
      message: validated.value.message,
    })
    .select("id, ip, message, is_read, created_at")
    .single();

  if (error) {
    throw new Error(error.message || "Could not save AI chat message.");
  }

  return normalizeStoredAiChatMessage(data);
}

export async function readAiChatMessageThreads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_chat_messages")
    .select("id, ip, message, is_read, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message || "Could not load AI chat messages.");
  }

  return groupAiChatMessagesIntoThreads(data ?? []);
}

export async function markAiChatThreadReadByIp(ip) {
  const ipKey = normalizeIpKey(ip);
  if (!ipKey) return { updated: 0 };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_chat_messages")
    .update({ is_read: true })
    .eq("ip_key", ipKey)
    .eq("is_read", false)
    .select("id");

  if (error) {
    throw new Error(error.message || "Could not mark messages as read.");
  }

  return { updated: data?.length ?? 0 };
}

export async function deleteAiChatThreadByIp(ip) {
  const ipKey = normalizeIpKey(ip);
  if (!ipKey) return { deleted: 0 };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_chat_messages")
    .delete()
    .eq("ip_key", ipKey)
    .select("id");

  if (error) {
    throw new Error(error.message || "Could not delete conversation.");
  }

  return { deleted: data?.length ?? 0 };
}
