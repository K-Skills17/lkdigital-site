import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

const validLocales: Locale[] = ["en", "fr"];

export function generateStaticParams() {
  return validLocales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!validLocales.includes(locale as Locale)) {
    notFound();
  }

  return <>{children}</>;
}
