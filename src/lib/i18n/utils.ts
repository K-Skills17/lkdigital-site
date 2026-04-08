import { defaultLocale, type Locale } from "./config";

/**
 * Build a localized href.
 * - PT (default) stays at root: /sobre, /contato
 * - EN/FR get prefixed: /en/about, /fr/a-propos
 */
export function localizedHref(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  // Strip leading slash for joining
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `/${locale}${clean ? `/${clean}` : ""}`;
}

/**
 * Slug mappings per locale for translated pages.
 * Maps from locale-specific slug -> page key.
 */
export const slugToPageKey: Record<string, Record<string, string>> = {
  en: {
    about: "about",
    solutions: "solutions",
    contact: "contact",
    tools: "tools",
  },
  fr: {
    "a-propos": "about",
    solutions: "solutions",
    contact: "contact",
    outils: "tools",
  },
};

/**
 * Reverse mapping: page key -> locale-specific slug.
 */
export const pageKeyToSlug: Record<string, Record<string, string>> = {
  en: {
    about: "about",
    solutions: "solutions",
    contact: "contact",
    tools: "tools",
  },
  fr: {
    about: "a-propos",
    solutions: "solutions",
    contact: "contact",
    tools: "outils",
  },
};

/**
 * Map PT paths to page keys for language switching.
 */
export const ptPathToPageKey: Record<string, string> = {
  "/sobre": "about",
  "/solucoes": "solutions",
  "/contato": "contact",
  "/ferramentas": "tools",
};

/**
 * Map page keys to PT paths.
 */
export const pageKeyToPtPath: Record<string, string> = {
  about: "/sobre",
  solutions: "/solucoes",
  contact: "/contato",
  tools: "/ferramentas",
};

/**
 * Get the equivalent path in a target locale.
 */
export function getEquivalentPath(
  currentPath: string,
  targetLocale: Locale
): string {
  // Home page
  if (currentPath === "/" || currentPath === "/en" || currentPath === "/fr") {
    return targetLocale === defaultLocale ? "/" : `/${targetLocale}`;
  }

  // Check if current path is a PT path
  const ptKey = ptPathToPageKey[currentPath];
  if (ptKey) {
    if (targetLocale === defaultLocale) return currentPath;
    const slug = pageKeyToSlug[targetLocale]?.[ptKey];
    return slug ? `/${targetLocale}/${slug}` : `/${targetLocale}`;
  }

  // Check if current path is an EN or FR path
  for (const locale of ["en", "fr"] as const) {
    const prefix = `/${locale}/`;
    if (currentPath.startsWith(prefix)) {
      const slug = currentPath.slice(prefix.length);
      const pageKey = slugToPageKey[locale]?.[slug];
      if (pageKey) {
        if (targetLocale === defaultLocale) {
          return pageKeyToPtPath[pageKey] || "/";
        }
        const targetSlug = pageKeyToSlug[targetLocale]?.[pageKey];
        return targetSlug
          ? `/${targetLocale}/${targetSlug}`
          : `/${targetLocale}`;
      }
    }
    // Check if it's just /en or /fr (homepage)
    if (currentPath === `/${locale}`) {
      return targetLocale === defaultLocale ? "/" : `/${targetLocale}`;
    }
  }

  // Fallback: just go to target locale home
  return targetLocale === defaultLocale ? "/" : `/${targetLocale}`;
}
