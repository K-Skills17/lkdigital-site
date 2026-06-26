"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://lk-chatbot-production.up.railway.app/api/webchat";

interface Message {
  content: string;
  role: "user" | "assistant";
}

interface WidgetConfig {
  primaryColor: string;
  headerTitle: string;
  welcomeMessage: string | null;
  avatarUrl: string | null;
}

export default function DemoChatWidget({ tenantId }: { tenantId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const storageKey = `lk_demo_session_${tenantId}`;

  // Fetch config for header branding only
  useEffect(() => {
    fetch(`${API_BASE}/${tenantId}/config`)
      .then((r) => r.json())
      .then((cfg: WidgetConfig) => setConfig(cfg))
      .catch(() => {});
  }, [tenantId]);

  // Init: restore existing session history, or create a new session and
  // fire a hidden trigger so the bot sends its real opening greeting.
  // This keeps the backend conversation state in sync with what the user sees,
  // preventing the bot from re-introducing itself on the first real reply.
  useEffect(() => {
    const TRIGGER = "__start__";

    const init = async () => {
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        setSessionId(stored);
        try {
          const r = await fetch(`${API_BASE}/${tenantId}/messages/${stored}`);
          const data = await r.json();
          if (data.messages?.length > 0) {
            // Filter the hidden auto-trigger from display
            const visible = (data.messages as Message[]).filter(
              (m, i) => !(i === 0 && m.role === "user" && m.content === TRIGGER)
            );
            setMessages(visible);
            return;
          }
        } catch {}
      }

      // New session — create it, then fire the hidden trigger to get the
      // bot's real opening message (not a fake client-side string).
      setLoading(true);
      try {
        const sessRes = await fetch(`${API_BASE}/${tenantId}/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const sessData = await sessRes.json();
        const sid = sessData.sessionId;
        localStorage.setItem(storageKey, sid);
        setSessionId(sid);

        const msgRes = await fetch(`${API_BASE}/${tenantId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid, text: TRIGGER }),
        });
        const msgData = await msgRes.json();
        if (msgData.reply) {
          setMessages([{ content: msgData.reply, role: "assistant" }]);
        }
      } catch {
        // Silent fail — user can still type and the session will be created then
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [tenantId, storageKey]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []);

  const createSession = useCallback(async (): Promise<string> => {
    const res = await fetch(`${API_BASE}/${tenantId}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    localStorage.setItem(storageKey, data.sessionId);
    setSessionId(data.sessionId);
    return data.sessionId;
  }, [tenantId, storageKey]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { content: text, role: "user" }]);
    setLoading(true);

    try {
      let sid = sessionId;
      if (!sid) sid = await createSession();

      const res = await fetch(`${API_BASE}/${tenantId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, text }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          content: data.reply ?? "Desculpe, ocorreu um erro. Tente novamente.",
          role: "assistant",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          content: "Não foi possível conectar. Tente novamente em instantes.",
          role: "assistant",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-accent hover:text-accent-dark break-all"
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#141414] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#0f0f0f] flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {config?.headerTitle ?? "Assistente IA"}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] text-white/50">Online agora</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white rounded-br-sm"
                  : "bg-white/[0.08] text-white/90 rounded-bl-sm border border-white/[0.06]"
              }`}
            >
              {formatText(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.08] border border-white/[0.06] px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5">
                <span
                  className="w-2 h-2 rounded-full bg-white/30 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-white/30 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-white/30 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/10 bg-[#0f0f0f] flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva sua mensagem..."
            rows={1}
            className="flex-1 resize-none bg-white/[0.06] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-accent/40 max-h-24"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-accent hover:bg-accent-dark text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Enviar mensagem"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-white/20 text-center mt-2">
          Assistente IA · LK Digital
        </p>
      </div>
    </div>
  );
}
