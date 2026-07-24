"use client";

import { useEffect, useRef, useState } from "react";
import { CHAT_SUGGESTED_QUESTIONS } from "@/data/portfolio";
import {
  clearChatSession,
  readChatSession,
  writeChatSession,
} from "@/lib/chatSession";
import { PREFS_CHANGED_EVENT } from "@/lib/sidebarPrefs";
import { useExtensions } from "@/hooks/useExtensions";

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
          isUser
            ? "rounded-br-md bg-primary/90 text-on-primary"
            : "rounded-bl-md bg-surface-container-high/90 text-on-surface"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

function persistMessages(next) {
  writeChatSession({ messages: next });
}

export default function ChatPanel() {
  const { isActive, chatTheme } = useExtensions();
  const skin = isActive("chat-theme") ? chatTheme : "";
  const [messages, setMessages] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    setMessages(readChatSession().messages);
    setHydrated(true);
  }, []);

  useEffect(() => {
    const onPrefs = (event) => {
      const keys = event.detail?.keys;
      if (keys && !keys.includes("chat-session")) return;
      setMessages(readChatSession().messages);
      setPending(false);
    };
    window.addEventListener(PREFS_CHANGED_EVENT, onPrefs);
    window.addEventListener("storage", onPrefs);
    return () => {
      window.removeEventListener(PREFS_CHANGED_EVENT, onPrefs);
      window.removeEventListener("storage", onPrefs);
    };
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, pending]);

  const sendMessage = async (rawText) => {
    const text = String(rawText ?? "").trim();
    if (!text || pending) return;

    const nextMessages = [...messagesRef.current, { role: "user", content: text }];
    setMessages(nextMessages);
    messagesRef.current = nextMessages;
    persistMessages(nextMessages);
    setInput("");
    setPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        String(data?.reply ?? "").trim() ||
        "I blanked for a second — try asking that again.";
      const withAssistant = [
        ...messagesRef.current,
        { role: "assistant", content: reply },
      ];
      setMessages(withAssistant);
      messagesRef.current = withAssistant;
      persistMessages(withAssistant);
    } catch {
      const withAssistant = [
        ...messagesRef.current,
        {
          role: "assistant",
          content:
            "My brain hamster fell off its wheel for a second. Ask me again in a bit.",
        },
      ];
      setMessages(withAssistant);
      messagesRef.current = withAssistant;
      persistMessages(withAssistant);
    } finally {
      setPending(false);
      textareaRef.current?.focus();
    }
  };

  const clearThread = () => {
    if (pending) return;
    clearChatSession();
    setMessages([]);
    messagesRef.current = [];
    setInput("");
  };

  const onSubmit = (event) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  const hasThread = messages.length > 0;

  return (
    <aside
      data-chat-skin={skin || undefined}
      className="chat-panel relative flex h-full w-full min-h-0 flex-col bg-surface-container-lowest border-l border-border overflow-hidden"
    >
      <div className="chat-live-layer pointer-events-none absolute inset-0" aria-hidden />

      {hasThread ? (
        <div className="relative z-[1] flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border/60 px-3">
          <p className="truncate text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
            Chat · {messages.length} message{messages.length === 1 ? "" : "s"}
          </p>
          <button
            type="button"
            onClick={clearThread}
            disabled={pending}
            className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md px-1.5 text-[11px] text-on-surface-variant transition hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
            title="Clear chat (also removes from Source Control)"
          >
            <span className="material-symbols-outlined !text-[15px]">delete</span>
            Clear
          </button>
        </div>
      ) : null}

      <div
        ref={listRef}
        className="relative z-[1] flex-1 overflow-y-auto px-3 py-4 custom-scrollbar text-[13px]"
      >
        {!hydrated ? (
          <p className="px-2 py-6 text-center text-[12px] text-on-surface-variant">Loading…</p>
        ) : !hasThread ? (
          <>
            <div className="flex flex-col items-center text-center px-2 pt-4 space-y-3">
              <span className="material-symbols-outlined !text-[40px] text-primary/80 chat-accent">
                auto_awesome
              </span>
              <p className="text-on-surface text-[14px] leading-relaxed max-w-[340px]">
                Ask anything about Arafat — AI uses the live portfolio knowledgebase.
              </p>
              <p className="text-on-surface-variant text-[11px] leading-relaxed max-w-[240px] mt-[-10px]">
                Experience, projects, skills, education, and more.
              </p>
            </div>

            <div className="pt-8 space-y-1.5">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 px-1">
                Suggested
              </p>
              {CHAT_SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={pending}
                  onClick={() => void sendMessage(q)}
                  className="chat-suggest w-full text-left px-3 py-2 rounded-md border border-border bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary/30 transition-all text-[12px] text-on-surface-variant flex items-center gap-2 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary/70 chat-accent">
                    arrow_outward
                  </span>
                  <b>{q}</b>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-3 py-2">
            {messages.map((msg, index) => (
              <MessageBubble
                key={`${msg.role}-${index}-${msg.content.slice(0, 12)}`}
                role={msg.role}
                content={msg.content}
              />
            ))}
            {pending ? (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-surface-container-high/90 px-3 py-2 text-[12px] text-on-surface-variant">
                  Thinking…
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="relative z-[1] px-2 py-2 shrink-0">
        <div className="chat-composer rounded-lg border border-border bg-surface-container-low focus-within:border-primary/60 transition-colors">
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything about Arafat..."
            disabled={pending || !hydrated}
            className="w-full bg-transparent resize-none px-3 py-2 text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none custom-scrollbar disabled:opacity-70"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-secondary/50 bg-secondary/10 text-secondary text-[11px]">
                <span className="material-symbols-outlined text-[13px]">chat_bubble</span>
                Ask
              </span>
              <span className="hidden max-[819px]:flex min-[1020px]:flex items-center gap-0.5 px-0.5 py-0.5 text-[11px] text-on-surface-variant">
                <span className="min-[1150px]:hidden">gemini</span>
                <span className="hidden min-[1150px]:inline">gemini flash 2.5</span>
              </span>
            </div>
            <button
              type="submit"
              disabled={pending || !hydrated || !input.trim()}
              className="chat-send flex items-center justify-center w-6 h-6 rounded-md bg-primary text-on-primary hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </form>
    </aside>
  );
}
