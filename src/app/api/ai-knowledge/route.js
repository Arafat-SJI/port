import { NextResponse } from "next/server";
import { readAiKnowledgeFromSupabase } from "@/lib/aiKnowledgeServer";

/** Public read of AI chat knowledge (portfolio content only — no auth secrets). */
export async function GET() {
  const knowledge = await readAiKnowledgeFromSupabase();
  return NextResponse.json(knowledge, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
