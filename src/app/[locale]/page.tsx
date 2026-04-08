import { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref, pageKeyToSlug } from "@/lib/i18n/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MultilingualBadge from "@/components/ui/MultilingualBadge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const title =
    locale === "en"
      ? "LK Digital — Precision Digital Marketing for Dentists"
      : "LK Digital — Marketing Digital de Precision pour Dentistes";
  const description = dict.home.heroSubtitle;

  return {
    title,
    description,
    alternates: {
      canonical: `https://lkdigital.odo.br/${locale}`,
      languages: {
        "pt-BR": "https://lkdigital.odo.br/",
        en: "https://lkdigital.odo.br/en",
        fr: "https://lkdigital.odo.br/fr",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
      siteName: "LK Digital",
      title,
      description,
    },
  };
}

export default async function TranslatedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const t = dict.home;
  const slugs = pageKeyToSlug[locale] || {};

  const navLinks = [
    { href: localizedHref(slugs.about ? `/${slugs.about}` : "/about", locale as Locale), label: dict.nav.about },
    { href: localizedHref(slugs.solutions ? `/${slugs.solutions}` : "/solutions", locale as Locale), label: dict.nav.solutions },
    { href: localizedHref(slugs.tools ? `/${slugs.tools}` : "/tools", locale as Locale), label: dict.nav.tools },
    { href: "/faq", label: dict.nav.faq },
    { href: "/blog", label: dict.nav.blog },
  ];

  return (
    <>
      <Navbar
        links={navLinks}
        ctaHref={localizedHref(slugs.contact ? `/${slugs.contact}` : "/contact", locale as Locale)}
        ctaLabel={dict.common.freeDiagnosis}
      />
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-bg">
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <div className="w-full h-full bg-gradient-to-br from-[#0f0f0f] via-[#1a1510] to-[#0f0f0f]" />
          </div>
          <div className="absolute inset-0 grain-overlay z-[1]" />
          <div className="relative z-10 max-w-narrow mx-auto px-4 sm:px-6 pt-24 pb-16 md:pt-36 md:pb-28 text-center">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-[11px] sm:text-xs font-medium tracking-[0.25em] uppercase mb-5 md:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {t.heroEyebrow}
            </p>
            <h1 className="font-display text-[clamp(1.75rem,5vw,4.5rem)] leading-[1.1] text-white text-balance max-w-4xl mx-auto mb-4 md:mb-6">
              {t.heroTitle}{" "}
              <span className="text-accent">{t.heroTitleAccent}</span>
            </h1>
            <p className="text-base md:text-xl text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 md:mb-16">
              <Link
                href={localizedHref(slugs.contact ? `/${slugs.contact}` : "/contact", locale as Locale)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25 text-center"
              >
                {t.heroCTA}
              </Link>
              <Link
                href={localizedHref(slugs.solutions ? `/${slugs.solutions}` : "/solutions", locale as Locale)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border border-accent/40 text-accent hover:bg-accent hover:text-white font-medium rounded-md transition-all duration-200 text-center"
              >
                {t.heroSecondaryCTA}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-sm sm:max-w-lg mx-auto">
              <div className="text-center">
                <p className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-white">{t.stat1Value}</p>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1">{t.stat1Label}</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-white">{t.stat2Value}</p>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1">{t.stat2Label}</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-white">{t.stat3Value}</p>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1">{t.stat3Label}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-20 md:py-28">
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.valueProps.map((prop: { title: string; desc: string }, i: number) => (
                <div key={i} className="p-6 md:p-8 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300">
                  <h3 className="font-display text-lg font-medium text-foreground mb-3">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prop.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Multilingual Badge */}
        <section className="py-12 md:py-16 bg-muted">
          <div className="max-w-content mx-auto px-4 sm:px-6 text-center">
            <h2 className="font-display text-display-sm text-foreground mb-4">
              {t.multilingualTitle}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {t.multilingualDesc}
            </p>
            <MultilingualBadge text={dict.common.multilingualBadge} />
          </div>
        </section>

        {/* FAQ Highlights */}
        <section className="py-20 md:py-28">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-sm text-foreground mb-10 text-center">
              {t.faqTitle}
            </h2>
            <div className="space-y-6">
              {t.faqs.map((faq: { question: string; answer: string }, i: number) => (
                <div key={i} className="p-6 bg-card rounded-xl border border-border/60">
                  <h3 className="font-display text-lg font-medium text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-md text-foreground mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              {t.ctaSubtitle}
            </p>
            <Link
              href={localizedHref(slugs.contact ? `/${slugs.contact}` : "/contact", locale as Locale)}
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              {t.ctaButton}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
