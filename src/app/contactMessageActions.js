"use server";

import { revalidatePath } from "next/cache";
import { insertContactMessage } from "@/lib/contactMessagesServer";
import { validateContactMessageInput } from "@/lib/contactMessages";

/** Public contact form submit — no auth required. */
export async function submitContactMessageAction(prevState, formData) {
  const validated = validateContactMessageInput({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validated.ok) {
    return { error: validated.error, success: false };
  }

  try {
    await insertContactMessage(validated.value);
    revalidatePath("/dashboard-araf/messages");
    revalidatePath("/dashboard-araf", "layout");
    return { error: null, success: true, message: "Message sent successfully." };
  } catch (err) {
    return {
      error: err?.message || "Could not send message. Try again.",
      success: false,
    };
  }
}
