"use client";

import { useEffect } from "react";

export default function RaioXViewEvent() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "raiox_view" });
    }
  }, []);

  return null;
}
