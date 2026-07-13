"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeSectionOrderToSupabase } from "@/lib/sectionOrderServer";

export async function saveSectionOrderAction(order) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", order: null };
  }

  try {
    const saved = await writeSectionOrderToSupabase(order, supabase);
    revalidatePath("/");
    revalidatePath("/dashboard-araf", "layout");
    return { error: null, order: saved };
  } catch {
    return { error: "Could not save order.", order: null };
  }
}
