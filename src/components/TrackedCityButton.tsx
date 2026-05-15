"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/events";

export function TrackedCTAButton({
  href,
  label,
  cityName,
  className,
}: {
  href: string;
  label: string;
  cityName: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent("cta_click", { cta: label, city: cityName, page: `/cidades/${cityName}` })
      }
    >
      {label}
    </Link>
  );
}

export function TrackedNearbyCityLink({
  href,
  fromCity,
  toCity,
  className,
  children,
}: {
  href: string;
  label?: string;
  fromCity: string;
  toCity: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackEvent("nearby_city_click", { from: fromCity, to: toCity })
      }
    >
      {children}
    </Link>
  );
}
