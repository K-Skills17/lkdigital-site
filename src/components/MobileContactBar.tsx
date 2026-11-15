"use client";

import { usePathname } from "next/navigation";
import { OPEN_CHAT_EVENT, WHATSAPP_HREF, hasMobileBar } from "./mobileBar";

/**
 * Single bottom bar on small screens (see mobileBar.ts). A spacer in the page
 * flow reserves the bar's height so the end of the page is never covered.
 */
export default function MobileContactBar() {
  const pathname = usePathname();
  if (!hasMobileBar(pathname)) return null;

  return (
    <>
      <div aria-hidden="true" className="h-[4.5rem] md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-[9990] grid grid-cols-2 gap-2 border-t border-border bg-background px-4 py-3 md:hidden">
        <a
          href={WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-accent text-sm font-medium text-[#1a1a1a]"
        >
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
          className="inline-flex min-h-12 items-center justify-center gap-2 border border-foreground/70 text-sm font-medium text-foreground"
        >
          Assistente IA
        </button>
      </div>
    </>
  );
}
