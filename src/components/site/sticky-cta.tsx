"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StickyCTA() {
  return (
    <>
      {/* Desktop: Floating bottom-right button */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Button
            asChild
            className="bg-accent text-white hover:opacity-90 shadow-lg"
          >
            <Link href="/diagnostico">Diagnosticar sua clínica</Link>
          </Button>
        </div>
      </div>

      {/* Mobile: Fixed bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pointer-events-auto bg-accent px-4 py-3 border-t border-accent/20">
          <Button
            asChild
            className="w-full bg-white hover:bg-white/90 text-accent font-medium"
          >
            <Link href="/diagnostico">Diagnosticar sua clínica</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

