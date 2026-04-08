export const defaultLocale = "pt" as const;
export const locales = ["pt", "en", "fr"] as const;
export type Locale = (typeof locales)[number];
