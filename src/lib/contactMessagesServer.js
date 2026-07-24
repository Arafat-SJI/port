import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  groupMessagesIntoThreads,
  normalizeStoredMessage,
  validateContactMessageInput,
} from "@/lib/contactMessages";

export async function insertContactMessage(input) {
  const validated = validateContactMessageInput(input);
  if (!validated.ok) {
    throw new Error(validated.error);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name: validated.value.name,
      email: validated.value.email,
      email_key: validated.value.email.toLowerCase(),
      message: validated.value.message,
    })
    .select("id, name, email, message, is_read, created_at")
    .single();

  if (error) {
    throw new Error(error.message || "Could not send message.");
  }

  return normalizeStoredMessage(data);
}

export async function readContactMessageThreads() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message || "Could not load messages.");
  }

  return groupMessagesIntoThreads(data ?? []);
}

export async function markThreadReadByEmail(email) {
  const emailKey = String(email ?? "")
    .trim()
    .toLowerCase();
  if (!emailKey) return { updated: 0 };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ is_read: true })
    .eq("email_key", emailKey)
    .eq("is_read", false)
    .select("id");

  if (error) {
    throw new Error(error.message || "Could not mark messages as read.");
  }

  return { updated: data?.length ?? 0 };
}

export async function deleteThreadByEmail(email) {
  const emailKey = String(email ?? "")
    .trim()
    .toLowerCase();
  if (!emailKey) return { deleted: 0 };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("email_key", emailKey)
    .select("id");

  if (error) {
    throw new Error(error.message || "Could not delete conversation.");
  }

  return { deleted: data?.length ?? 0 };
}
