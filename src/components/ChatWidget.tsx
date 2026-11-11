"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "https://lk-chatbot-production.up.railway.app/api/webchat";
const TENANT_ID = "38610ffd-cb80-4938-8b3b-be6230991592";
const STORAGE_KEY = `lk_chat_session_${TENANT_ID}`;

interface Message {
  content: string;
  role: "user" | "assistant";
  imageDataUrl?: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<{
    base64: string;
    mimeType: string;
    dataUrl: string;
    name: string;
  } | null>(null);

  // Show bubble after delay
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Hide tooltip after 10s
  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(false), 12000);
    return () => clearTimeout(t);
  }, []);

  // Restore session
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSessionId(stored);
    }
  }, []);

  // Load history when session exists and chat opens
  useEffect(() => {
    if (!open || !sessionId || messages.length > 0) return;
    fetch(`${API_BASE}/${TENANT_ID}/messages/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch(() => {});
  }, [open, sessionId, messages.length]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const createSession = useCallback(async (): Promise<string> => {
    const res = await fetch(`${API_BASE}/${TENANT_ID}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const id = data.sessionId;
    localStorage.setItem(STORAGE_KEY, id);
    setSessionId(id);
    return id;
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    const image = pendingImage;
    if ((!text && !image) || loading) return;

    setInput("");
    setPendingImage(null);
    setMessages((prev) => [...prev, { content: text, role: "user", imageDataUrl: image?.dataUrl }]);
    setLoading(true);

    try {
      let sid = sessionId;
      if (!sid) {
        sid = await createSession();
      }

      const body: Record<string, string> = { sessionId: sid, text };
      if (image) {
        body.imageBase64 = image.base64;
        body.imageMimeType = image.mimeType;
      }

      const res = await fetch(`${API_BASE}/${TENANT_ID}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { content: data.reply, role: "assistant" },
        ]);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { content: "Desculpe, ocorreu um erro. Tente novamente.", role: "assistant" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { content: "Não foi possível conectar ao assistente. Tente novamente.", role: "assistant" },
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Imagem muito grande. Máximo 8MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      setPendingImage({ base64, mimeType: file.type, dataUrl, name: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Convert URLs to links
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
          className="underline text-accent hover:text-accent-dark"
        >
          {part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  if (!showBubble) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Chat Window */}
      {open && (
        <div className="w-[360px] max-w-[calc(100vw-1.5rem)] sm:max-w-[calc(100vw-2rem)] h-[480px] sm:h-[520px] max-h-[calc(100vh-7rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-[#0f0f0f]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
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
                  Assistente LK Digital
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-white/50">Online agora</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Fechar chat"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && !loading && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Olá! Como posso ajudar?
                </p>
                <p className="text-xs text-muted-foreground">
                  Tire dúvidas sobre nossos serviços para dentistas.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.imageDataUrl && (
                    <img src={msg.imageDataUrl} alt="imagem enviada" className="w-40 rounded-lg mb-2 block" />
                  )}
                  {msg.content && formatText(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border bg-card">
            {/* Image preview */}
            {pendingImage && (
              <div className="flex items-center gap-2 mb-2 bg-muted rounded-xl px-3 py-2 text-xs text-muted-foreground">
                <img src={pendingImage.dataUrl} alt="preview" className="w-8 h-8 object-cover rounded" />
                <span className="flex-1 truncate">{pendingImage.name}</span>
                <button
                  onClick={() => setPendingImage(null)}
                  className="text-muted-foreground hover:text-red-500 transition-colors font-bold text-base leading-none"
                  aria-label="Remover imagem"
                >
                  ×
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              {/* Image button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-accent flex items-center justify-center transition-colors flex-shrink-0"
                aria-label="Enviar imagem"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escreva sua mensagem..."
                rows={1}
                className="flex-1 resize-none bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-accent/30 max-h-24"
              />
              <button
                onClick={sendMessage}
                disabled={(!input.trim() && !pendingImage) || loading}
                className="w-10 h-10 rounded-xl bg-accent hover:bg-accent-dark text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Enviar mensagem"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Assistente IA da LK Digital
            </p>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {!open && showTooltip && (
        <div className="bg-card text-foreground text-sm px-4 py-2.5 rounded-lg shadow-xl border border-border max-w-[220px] animate-fade-up relative">
          <p className="font-medium text-xs leading-relaxed">
            Tire suas dúvidas com nosso
            <span className="text-accent"> assistente IA</span>
          </p>
          <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          setOpen(!open);
          setShowTooltip(false);
        }}
        aria-label={open ? "Fechar chat" : "Abrir chat com assistente IA"}
        className="group w-14 h-14 rounded-full bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-105 flex items-center justify-center"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
          </>
        )}
      </button>
    </div>
  );
}
