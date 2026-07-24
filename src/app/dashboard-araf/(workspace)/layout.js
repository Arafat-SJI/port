import DashboardShell from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { groupAiChatMessagesIntoThreads } from "@/lib/aiChatMessages";
import { groupMessagesIntoThreads } from "@/lib/contactMessages";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";

export default async function DashboardWorkspaceLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const sectionOrder = await readSectionOrderFromSupabase();

  const { data: messageRows, error: messagesError } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, is_read, created_at")
    .order("created_at", { ascending: true });

  const messageThreads = messagesError
    ? []
    : groupMessagesIntoThreads(messageRows ?? []);

  const { data: aiChatRows, error: aiChatsError } = await supabase
    .from("ai_chat_messages")
    .select("id, ip, message, is_read, created_at")
    .order("created_at", { ascending: true });

  const aiChatThreads = aiChatsError
    ? []
    : groupAiChatMessagesIntoThreads(aiChatRows ?? []);

  return (
    <DashboardShell
      email={user?.email ?? ""}
      sectionOrder={sectionOrder}
      messageThreads={messageThreads}
      messagesLoadError={Boolean(messagesError)}
      aiChatThreads={aiChatThreads}
      aiChatsLoadError={Boolean(aiChatsError)}
    >
      {children}
    </DashboardShell>
  );
}
