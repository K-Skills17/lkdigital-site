import type { Locale } from "./config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<Locale, () => Promise<any>> = {
  pt: () => import("@/dictionaries/pt.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]();
};
