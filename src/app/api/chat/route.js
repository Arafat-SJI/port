import { NextResponse } from "next/server";
import { getClientIpFromHeaders } from "@/lib/clientIp";
import { insertAiChatMessage } from "@/lib/aiChatMessagesServer";
import { answerPortfolioChat } from "@/lib/geminiChat";

export const dynamic = "force-dynamic";

function latestUserMessage(messages) {
  const list = Array.isArray(messages) ? messages : [];
  for (let i = list.length - 1; i >= 0; i -= 1) {
    const m = list[i];
    if (m?.role === "user" && String(m.content ?? "").trim()) {
      return String(m.content).trim().slice(0, 5000);
    }
  }
  return "";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { reply: "Ask me something about Arafat." },
      { status: 400 }
    );
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const question = latestUserMessage(messages);

  if (question) {
    try {
      await insertAiChatMessage({
        ip: getClientIpFromHeaders(request.headers),
        message: question,
      });
    } catch {
      // Never block chat on inbox logging failures.
    }
  }

  const result = await answerPortfolioChat(messages);

  return NextResponse.json(
    { reply: result.reply },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
