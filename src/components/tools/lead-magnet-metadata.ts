import type { Metadata } from "next";
import { FILES_PATH, SITE_URL } from "@/tools/shared/lead-magnets";

/** Same metadata shape for every lead-magnet page: canonical, OG (pt_BR, 1200×630 image), Twitter card. */
export function leadMagnetMetadata(o: {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  /** OG image file in public/ferramentas/arquivos/ (built by lead-magnets/). */
  ogImage: string;
}): Metadata {
  const url = SITE_URL + o.path;
  return {
    title: { absolute: o.title },
    description: o.description,
    alternates: { canonical: url },
    openGraph: {
      title: o.ogTitle,
      description: o.ogDescription,
      url,
      type: "website",
      locale: "pt_BR",
      images: [{ url: SITE_URL + FILES_PATH + o.ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: o.ogTitle, description: o.ogDescription },
  };
}
