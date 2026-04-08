import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { slugToPageKey, localizedHref, pageKeyToSlug } from "@/lib/i18n/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MultilingualBadge from "@/components/ui/MultilingualBadge";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["en", "fr"]) {
    const slugs = slugToPageKey[locale];
    for (const slug of Object.keys(slugs)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const pageKey = slugToPageKey[locale]?.[slug];
  if (!pageKey) return {};

  const dict = await getDictionary(locale as Locale);
  const section = dict[pageKey as keyof typeof dict] as Record<string, string> | undefined;
  if (!section) return {};

  const title = `${section.title || ""} ${section.titleAccent || ""} | LK Digital`.trim();
  const description = (section.subtitle as string) || "";

  // Build hreflang alternates
  const enSlug = pageKeyToSlug.en[pageKey];
  const frSlug = pageKeyToSlug.fr[pageKey];
  const ptPaths: Record<string, string> = {
    about: "/sobre",
    solutions: "/solucoes",
    contact: "/contato",
    tools: "/ferramentas",
  };

  return {
    title,
    description,
    alternates: {
      canonical: `https://lkdigital.odo.br/${locale}/${slug}`,
      languages: {
        "pt-BR": `https://lkdigital.odo.br${ptPaths[pageKey] || "/"}`,
        en: `https://lkdigital.odo.br/en/${enSlug}`,
        fr: `https://lkdigital.odo.br/fr/${frSlug}`,
      },
    },
  };
}

function getNavLinks(locale: string, dict: Record<string, Record<string, string>>) {
  const slugs = pageKeyToSlug[locale] || {};
  return [
    { href: localizedHref(`/${slugs.about || "about"}`, locale as Locale), label: dict.nav.about },
    { href: localizedHref(`/${slugs.solutions || "solutions"}`, locale as Locale), label: dict.nav.solutions },
    { href: localizedHref(`/${slugs.tools || "tools"}`, locale as Locale), label: dict.nav.tools },
    { href: "/faq", label: dict.nav.faq },
    { href: "/blog", label: dict.nav.blog },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AboutPage({ dict, locale }: { dict: any; locale: string }) {
  const t = dict.about;
  const slugs = pageKeyToSlug[locale] || {};
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-narrow mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">{t.eyebrow}</p>
          <h1 className="font-display text-display-lg text-foreground mb-4">
            {t.title} <span className="text-accent">{t.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      {/* Beliefs */}
      <section className="py-20 md:py-28">
        <div className="max-w-prose mx-auto px-4 sm:px-6">
          <h2 className="font-display text-display-sm text-foreground mb-8">{t.beliefTitle}</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>{t.beliefText1}</p>
            <p>{t.beliefText2}</p>
            <p>{t.beliefText3}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {t.values.map((item: { value: string; desc: string }, i: number) => (
              <div key={i} className="border-t-2 border-accent/30 pt-4">
                <h3 className="font-display text-lg font-medium text-foreground mb-2">{item.value}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Dentistry */}
      <section className="py-20 md:py-28 bg-muted">
        <div className="max-w-narrow mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-display-md text-foreground text-balance">{t.whyDentistryTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {t.whyDentistry.map((item: { title: string; desc: string }, i: number) => (
              <div key={i} className="p-6 bg-card rounded-xl border border-border/60">
                <h3 className="font-display text-lg font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MultilingualBadge text={dict.common.multilingualBadge} />

      {/* CTA */}
      <section className="py-20 md:py-28 text-center">
        <div className="max-w-narrow mx-auto px-4 sm:px-6">
          <h2 className="font-display text-display-md text-foreground mb-4">{t.ctaTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t.ctaSubtitle}</p>
          <Link
            href={localizedHref(`/${slugs.contact || "contact"}`, locale as Locale)}
            className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SolutionsPage({ dict, locale }: { dict: any; locale: string }) {
  const t = dict.solutions;
  const slugs = pageKeyToSlug[locale] || {};
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-narrow mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">{t.eyebrow}</p>
          <h1 className="font-display text-display-lg text-foreground mb-4">
            {t.title} <span className="text-accent">{t.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      {t.categories.map((category: { category: string; items: { title: string; desc: string; result: string }[] }, ci: number) => (
        <section key={ci} className={`py-20 md:py-24 ${ci % 2 === 1 ? "bg-muted" : ""}`}>
          <div className="max-w-content mx-auto px-4 sm:px-6">
            <h2 className="font-display text-display-sm text-foreground mb-10">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.items.map((service, si) => (
                <div key={si} className="group p-6 md:p-8 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 flex flex-col">
                  <h3 className="font-display text-lg font-medium text-foreground mb-3 group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{service.desc}</p>
                  <div className="pt-4 border-t border-border/60">
                    <p className="text-sm font-medium text-accent flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {service.result}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-20 md:py-28 text-center">
        <div className="max-w-narrow mx-auto px-4 sm:px-6">
          <h2 className="font-display text-display-md text-foreground mb-4">{t.ctaTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t.ctaSubtitle}</p>
          <Link
            href={localizedHref(`/${slugs.contact || "contact"}`, locale as Locale)}
            className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ContactPage({ dict, locale }: { dict: any; locale: string }) {
  const t = dict.contact;
  void locale; // Contact page doesn't need locale-specific links beyond what's shown
  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-narrow mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">{t.eyebrow}</p>
          <h1 className="font-display text-display-lg text-foreground mb-4">
            {t.title} <span className="text-accent">{t.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-narrow mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-display-sm text-foreground mb-4">{t.formTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{t.formDesc}</p>
              <ul className="space-y-3 mb-6">
                {t.benefits.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <svg className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {t.limitedSpots}
              </div>

              <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                <p className="text-sm font-medium text-foreground mb-2">{t.preferDirect}</p>
                <a
                  href="https://wa.me/5511952823271"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t.whatsapp}
                </a>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <a
                  href="tel:+5511946851028"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border/60 text-foreground text-sm font-medium rounded-md hover:border-accent/30 transition-all"
                >
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  {t.call}: (11) 94685-1028
                </a>
                <a
                  href="mailto:contato@lkdigital.org"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border border-border/60 text-foreground text-sm font-medium rounded-md hover:border-accent/30 transition-all"
                >
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  contato@lkdigital.org
                </a>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border/60 p-6 md:p-8 shadow-lg shadow-black/5">
              <p className="text-center text-muted-foreground py-8">
                {t.formDesc}
              </p>
              <a
                href="https://wa.me/5511952823271"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200"
              >
                {t.submitButton}
              </a>
              <p className="text-[11px] text-muted-foreground text-center mt-4">
                {t.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </section>

      <MultilingualBadge text={dict.common.multilingualBadge} />
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ToolsPage({ dict, locale }: { dict: any; locale: string }) {
  const t = dict.tools;
  const slugs = pageKeyToSlug[locale] || {};

  const toolLinks = [
    { name: locale === "fr" ? "Audit de Site" : "Website Audit", url: "https://fb-lead-audit-tool.vercel.app" },
    { name: locale === "fr" ? "Diagnostic Google" : "Google Business Diagnosis", url: "https://diagnostico-google.vercel.app" },
    { name: locale === "fr" ? "Simulateur de Mutuelles" : "Insurance Simulator", url: "https://simulador-convenio.vercel.app" },
    { name: locale === "fr" ? "Calculateur de Prix" : "Pricing Calculator", url: "https://calculadora-precificacao-phi.vercel.app" },
    { name: locale === "fr" ? "Diagnostic de Cabinet" : "Practice Diagnosis", url: "https://lk-diagnostico-clinica.vercel.app" },
    { name: locale === "fr" ? "Calculateur d'Agenda" : "Schedule Calculator", url: "https://calculadora-agenda-ten.vercel.app" },
  ];

  return (
    <>
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-narrow mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-3">{t.eyebrow}</p>
          <h1 className="font-display text-display-lg text-foreground mb-4">
            {t.title} <span className="text-accent">{t.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          <h2 className="font-display text-display-sm text-foreground mb-4 max-w-2xl">{t.chooseTitle}</h2>
          <p className="text-muted-foreground mb-12 max-w-xl">{t.chooseDesc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {toolLinks.map((tool, i) => (
              <div key={i} className="group p-6 md:p-8 bg-card rounded-xl border border-border/60 hover:border-accent/30 transition-all duration-300 flex flex-col">
                <h3 className="font-display text-lg font-medium text-foreground mb-4 group-hover:text-accent transition-colors">
                  {tool.name}
                </h3>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-md transition-all duration-200"
                >
                  {t.useTool}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-content mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 items-start">
            <div>
              <h2 className="font-display text-display-sm text-foreground mb-4">{t.whyFreeTitle}</h2>
              <span className="w-12 h-px bg-accent block" />
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{t.whyFreeText1}</p>
              <p className="text-muted-foreground leading-relaxed">{t.whyFreeText2}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 text-center">
        <div className="max-w-narrow mx-auto px-4 sm:px-6">
          <h2 className="font-display text-display-md text-foreground mb-4">{t.diagnosisTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t.diagnosisDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={localizedHref(`/${slugs.contact || "contact"}`, locale as Locale)}
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              {t.diagnosisCTA}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function TranslatedPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const pageKey = slugToPageKey[locale]?.[slug];

  if (!pageKey) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);
  const navLinks = getNavLinks(locale, dict as unknown as Record<string, Record<string, string>>);
  const slugs = pageKeyToSlug[locale] || {};

  return (
    <>
      <Navbar
        links={navLinks}
        ctaHref={localizedHref(`/${slugs.contact || "contact"}`, locale as Locale)}
        ctaLabel={dict.common.freeDiagnosis}
      />
      <main>
        {pageKey === "about" && <AboutPage dict={dict} locale={locale} />}
        {pageKey === "solutions" && <SolutionsPage dict={dict} locale={locale} />}
        {pageKey === "contact" && <ContactPage dict={dict} locale={locale} />}
        {pageKey === "tools" && <ToolsPage dict={dict} locale={locale} />}
      </main>
      <Footer />
    </>
  );
}
