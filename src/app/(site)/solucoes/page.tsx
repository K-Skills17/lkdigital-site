import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LKGuarantee } from "@/components/shared/lk-guarantee";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluções | A Suite de Eficiência para Clínicas Odontológicas",
  description:
    "Descubra nossas soluções de marketing digital para dentistas: Crescimento Acelerado (GEO/SEO), Branding de Elite e Automação Inteligente. Resultados garantidos.",
};

const services = [
  {
    axis: "I",
    title: "Crescimento Acelerado",
    subtitle: "GEO & SEO",
    benefitFocus: "Apareça onde a decisão é tomada, sem esforço.",
    description:
      "Enquanto seus concorrentes lutam por atenção, sua clínica é apresentada como a solução óbvia por IAs e buscadores. Nós fazemos a engenharia semântica completa para que você domine as buscas locais de forma automática.",
    result:
      "Fluxo constante de leads qualificados sem precisar gravar vídeos diários ou gerenciar redes sociais.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
  {
    axis: "II",
    title: "Valor Percebido Instantâneo",
    subtitle: "Branding",
    benefitFocus: "Posicionamento de elite que justifica seus honorários.",
    description:
      "Criamos uma presença digital que comunica autoridade antes mesmo de você abrir a boca. Atraímos pacientes que buscam qualidade, não preço, reduzindo as objeções de vendas e aumentando a aceitação de orçamentos.",
    result:
      "Uma marca que trabalha como um filtro, atraindo apenas quem valoriza seu trabalho de alto nível.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </svg>
    ),
  },
  {
    axis: "III",
    title: "Automação e Inteligência",
    subtitle: "Infraestrutura",
    benefitFocus: "Dados transformados em lucro, sem complicação.",
    description:
      'Você recebe relatórios claros e diretos. Nós monitoramos o "motor" da sua clínica sob o capô, ajustando as velas para garantir que a meta de faturamento seja atingida no menor tempo possível.',
    result:
      "Visibilidade total do seu ROI sem precisar entender de tecnologia.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
  },
];

export default function SolucoesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-premium text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
            Nossas Soluções
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            A Suite de Eficiência para o{" "}
            <span className="text-accent">Crescimento da Sua Clínica</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Três eixos estratégicos desenhados para eliminar o trabalho pesado
            do marketing e entregar resultados tangíveis com o mínimo de esforço
            da sua parte.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-premium pt-0">
        <div className="space-y-24">
          {services.map((service, index) => (
            <div
              key={service.axis}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div
                className={`space-y-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}
              >
                {/* Axis number */}
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-heading text-accent/30">
                    {service.axis}
                  </span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                      {service.title}
                    </h2>
                    <p className="text-sm text-accent uppercase tracking-wider mt-1">
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                {/* Benefit focus */}
                <div className="bg-trust-bg border-l-4 border-accent p-6">
                  <p className="text-lg font-medium text-foreground">
                    {service.benefitFocus}
                  </p>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* The Result */}
                <div className="flex items-start gap-4 pt-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
                      O Resultado
                    </p>
                    <p className="text-foreground font-medium">
                      {service.result}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="relative">
                  <div className="aspect-square bg-muted rounded-sm flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto text-accent">
                        {service.icon}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Ilustração: {service.title}
                      </p>
                    </div>
                  </div>
                  {/* Decorative corner */}
                  <div
                    className={`absolute w-16 h-16 border-accent/30 ${
                      index % 2 === 0
                        ? "-bottom-3 -right-3 border-r-2 border-b-2"
                        : "-bottom-3 -left-3 border-l-2 border-b-2"
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-premium bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Pronto para Eliminar o Peso do Marketing?
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Agende uma consultoria estratégica e descubra qual combinação de
            soluções é ideal para o momento da sua clínica.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="bg-accent text-white hover:bg-accent-dark px-8 py-6 text-base"
            >
              <Link href="/contato">Garantir Meu Crescimento</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LK Guarantee */}
      <LKGuarantee showCTA={false} />
    </>
  );
}
