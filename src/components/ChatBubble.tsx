"use client";

import { useState, useEffect } from "react";

export default function ChatBubble() {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  // Show bubble after a short delay so it doesn't compete with page load
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Stop pulsing after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  // Try to open the chatbot widget if it exists
  const handleClick = () => {
    // Look for the chatbot's own toggle button and click it
    const chatToggle = document.querySelector(
      '[id*="chat"] button, [class*="chat-toggle"], [class*="chat-bubble"], [class*="webchat"] button'
    ) as HTMLElement | null;

    if (chatToggle) {
      chatToggle.click();
    } else {
      // Fallback: look for any fixed-position button at the bottom-right
      const allButtons = Array.from(document.querySelectorAll("button, div[role='button']"));
      for (const btn of allButtons) {
        const rect = btn.getBoundingClientRect();
        const style = window.getComputedStyle(btn);
        if (
          style.position === "fixed" &&
          rect.bottom > window.innerHeight - 120 &&
          rect.right > window.innerWidth - 120
        ) {
          (btn as HTMLElement).click();
          return;
        }
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">
      {/* Tooltip */}
      <div
        className="bg-card text-foreground text-sm px-4 py-2.5 rounded-lg shadow-xl border border-border max-w-[220px] animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        <p className="font-medium text-xs leading-relaxed">
          Tire suas dúvidas com nosso
          <span className="text-accent"> assistente IA</span>
        </p>
        <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
      </div>

      {/* Chat Button */}
      <button
        onClick={handleClick}
        aria-label="Abrir chat com assistente IA"
        className={`group relative w-14 h-14 rounded-full bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-105 flex items-center justify-center ${
          pulse ? "animate-pulse" : ""
        }`}
      >
        {/* Chat icon */}
        <svg
          className="w-6 h-6 transition-transform duration-200 group-hover:scale-110"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>

        {/* Notification dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
      </button>
    </div>
  );
}
