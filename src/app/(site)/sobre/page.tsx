import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LKGuarantee } from "@/components/shared/lk-guarantee";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nós | A História da LK Digital",
  description:
    "Conheça a LK Digital: 6+ anos de experiência em marketing digital de alta performance aplicados ao setor de saúde. Atendemos médicos, dentistas, dermatologistas, psicólogos e outros especialistas.",
  keywords: [
    "sobre LK Digital",
    "agência marketing saúde",
    "história LK Digital",
    "marketing para profissionais de saúde Brasil",
    "especialistas marketing digital clínicas",
    "marketing para médicos",
    "marketing para dentistas",
  ],
};

export default function SobrePage() {
  return (
    <>
      {/* Hero: The Opening - The "Why" */}
      <section className="section-premium">
        <div className="max-w-4xl mx-auto">
          {/* Decorative line */}
          <div className="w-12 h-px bg-accent mb-8" aria-hidden="true" />

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">
            Nascemos para Devolver o seu Tempo.
          </h1>

          <div className="w-16 h-px bg-accent my-10" aria-hidden="true" />

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Entendemos que um profissional de saúde de elite deve estar focado
            no paciente, não em algoritmos. A LK Digital foi fundada para
            preencher a lacuna entre a{" "}
            <span className="text-foreground font-medium">
              excelência clínica
            </span>{" "}
            e o{" "}
            <span className="text-foreground font-medium">
              sucesso comercial previsível
            </span>{" "}
            — para médicos, dentistas, dermatologistas, psicólogos, fisioterapeutas
            e todas as especialidades que constroem carreiras baseadas em confiança.
          </p>
        </div>
      </section>

      {/* Visual placeholder section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto">
          <div className="aspect-[21/9] bg-muted rounded-sm flex items-center justify-center">
            <div className="text-center space-y-4 p-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Imagem editorial: Ambiente de trabalho premium, equipe focada em
                análise de dados e estratégias digitais
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Narrative: 6 Years of Precision */}
      <section className="section-premium bg-muted">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          {/* Left: Title (40%) */}
          <div className="lg:col-span-2">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
              Nossa Trajetória
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
              Da Alta Performance para a Saúde.
            </h2>
          </div>

          {/* Right: Copy (60%) */}
          <div className="lg:col-span-3 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Com{" "}
              <span className="text-foreground font-medium">mais de seis anos</span>{" "}
              em mercados digitais competitivos, aplicamos nossa metodologia
              primeiro às clínicas odontológicas — onde as exigências de
              posicionamento, ética regulatória e ticket alto criam o ambiente
              mais desafiador do setor de saúde.
            </p>

            <p>
              O método funcionou. E foi replicado. Hoje atendemos{" "}
              <span className="text-foreground font-medium">
                dentistas, médicos, dermatologistas, psicólogos, fisioterapeutas
                e nutricionistas
              </span>{" "}
              — qualquer especialidade que constrói sua reputação sobre confiança
              e excelência técnica.
            </p>

            <p>
              Porque percebemos que o problema é o mesmo em todas as
              especialidades: os melhores profissionais de saúde estão
              sobrecarregados enquanto clínicas medianas dominam o mercado
              por saberem usar as ferramentas certas.
            </p>

            <p className="text-foreground font-medium text-xl">
              Nós mudamos esse jogo — em todas as especialidades.
            </p>
          </div>
        </div>
      </section>

      {/* Specialties: Health Industry Breadth */}
      <section className="section-premium">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-4">
              Especialidades Atendidas
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Um Método. Todas as Especialidades.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              { name: "Odontologia", note: "Principal foco" },
              { name: "Medicina Geral" },
              { name: "Dermatologia" },
              { name: "Psicologia" },
              { name: "Fisioterapia" },
              { name: "Nutrição" },
              { name: "Cardiologia" },
              { name: "Ortopedia" },
            ].map((specialty) => (
              <div
                key={specialty.name}
                className="relative flex flex-col items-center justify-center text-center p-4 border border-border/60 bg-muted hover:border-accent/40 transition-colors duration-300 rounded-sm"
              >
                {specialty.note && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-white text-[9px] uppercase tracking-widest px-2 py-0.5 whitespace-nowrap">
                    {specialty.note}
                  </span>
                )}
                <span className="text-sm font-medium text-foreground mt-1">
                  {specialty.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline: The Transformation Process */}
      <section className="section-premium">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
              A Transformação
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Do Sobrecarregado ao Escalável
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-accent/30"
              aria-hidden="true"
            />

            {/* Timeline items */}
            <div className="space-y-16">
              {/* Step 1 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right md:pr-12">
                  <span className="text-sm text-accent uppercase tracking-wider">
                    Antes
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mt-2">
                    Profissional Sobrecarregado
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Dividido entre atender pacientes e gerenciar marketing.
                    Resultados imprevisíveis. Tempo escasso.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background" />
                <div className="md:pl-12">
                  <div className="w-full aspect-video bg-muted rounded-sm flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-muted-foreground/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2 md:text-left md:pl-12">
                  <span className="text-sm text-accent uppercase tracking-wider">
                    Parceria LK
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mt-2">
                    Sistemas Instalados
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Infraestrutura completa de aquisição. Processos automatizados.
                    Dados claros e acionáveis.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background" />
                <div className="md:order-1 md:pr-12">
                  <div className="w-full aspect-video bg-muted rounded-sm flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-muted-foreground/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="md:text-right md:pr-12">
                  <span className="text-sm text-accent uppercase tracking-wider">
                    Depois
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mt-2">
                    Clínica Escalável LK
                  </h3>
                  <p className="text-muted-foreground mt-2">
                    Crescimento previsível. Foco total na clínica. Liberdade para
                    expandir com tranquilidade.
                  </p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background" />
                <div className="md:pl-12">
                  <div className="w-full aspect-video bg-muted rounded-sm flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-muted-foreground/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              className="bg-accent text-white hover:bg-accent-dark px-8 py-6 text-base"
            >
              <Link href="/contato">Agendar Diagnóstico Gratuito</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* The Methodology: Heavy Lifting Guarantee */}
      <section className="section-premium bg-foreground text-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
              Nossa Metodologia
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Nós assumimos o risco.{" "}
              <span className="text-accent">Você colhe os resultados.</span>
            </h2>
          </div>

          <div className="w-16 h-px bg-accent mx-auto mb-12" aria-hidden="true" />

          <div className="space-y-6 text-lg text-background/80 leading-relaxed text-center">
            <p>
              Nosso modelo é simples: nós cuidamos de toda a infraestrutura — do
              GEO (Otimização para IAs) aos funis de conversão de alto ticket.
              Isso reduz o seu esforço de gestão em até{" "}
              <span className="text-accent font-semibold">80%</span>, permitindo
              que sua clínica cresça com velocidade enquanto sua qualidade de
              vida aumenta.
            </p>

            <p>
              Não somos fornecedores; somos os{" "}
              <span className="text-background font-medium">
                guardiões do seu crescimento
              </span>
              . Por isso, oferecemos garantias de valor que nos mantêm 100%
              responsáveis pelos seus resultados.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-heading text-accent">
                80%
              </div>
              <p className="text-sm text-background/60 mt-2">
                Menos esforço operacional
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-heading text-accent">
                100%
              </div>
              <p className="text-sm text-background/60 mt-2">
                Responsabilidade nossa
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-heading text-accent">
                ∞
              </div>
              <p className="text-sm text-background/60 mt-2">
                Potencial de escala
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Result: A Scalable Future */}
      <section className="section-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual */}
          <div className="relative">
            <div className="aspect-square bg-muted rounded-sm flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <svg
                    className="w-10 h-10 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ilustração: Rede de clínicas escaláveis conectadas
                </p>
              </div>
            </div>
            <div
              className="absolute -top-4 -left-4 w-20 h-20 border-l-2 border-t-2 border-accent/30"
              aria-hidden="true"
            />
          </div>

          {/* Right: Copy */}
          <div className="space-y-8">
            <p className="text-sm font-medium text-accent uppercase tracking-widest">
              O Resultado Final
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight">
              Sistemas que Funcionam Sem Você.
            </h2>

            <div className="w-16 h-px bg-accent" aria-hidden="true" />

            <p className="text-lg text-muted-foreground leading-relaxed">
              O objetivo final não é apenas atrair pacientes, mas construir um{" "}
              <span className="text-foreground font-medium">ativo digital</span>
              . Estamos aqui para criar a base que permitirá que você gerencie
              uma ou dez clínicas com a mesma tranquilidade.
            </p>

            <Button
              asChild
              size="lg"
              className="bg-accent text-white hover:bg-accent-dark px-8 py-6 text-base"
            >
              <Link href="/contato">Agendar Diagnóstico Gratuito</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* GEO Section: A Ciência por trás da LK Digital */}
      <section className="section-premium bg-trust-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-6">
              Inteligência Aplicada
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              A Ciência por trás da LK Digital
            </h2>
          </div>

          <div className="w-16 h-px bg-accent mx-auto mb-12" aria-hidden="true" />

          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Na era da Inteligência Artificial, os mecanismos de busca e os
                LLMs (Large Language Models) como ChatGPT, Gemini e Claude estão
                redefinindo como pacientes encontram e escolhem seus médicos,
                dentistas, dermatologistas e outros especialistas de saúde.
              </p>

              <p>
                A LK Digital é pioneira em{" "}
                <span className="text-foreground font-medium">
                  GEO — Generative Engine Optimization
                </span>
                , a ciência de posicionar sua clínica como autoridade reconhecida
                tanto por buscadores tradicionais quanto por inteligências
                artificiais.
              </p>

              <div className="bg-background p-8 rounded-sm border border-accent/20 my-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Como as IAs categorizam autoridade em saúde:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent mt-1 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      <strong className="text-foreground">
                        Estrutura semântica
                      </strong>{" "}
                      — Conteúdo organizado em blocos de resposta de 75-300
                      palavras
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent mt-1 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      <strong className="text-foreground">Schema markup</strong>{" "}
                      — Dados estruturados que comunicam expertise à máquina
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent mt-1 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      <strong className="text-foreground">
                        Pilares de autoridade
                      </strong>{" "}
                      — Conteúdo que demonstra profundidade e especialização
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-accent mt-1 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>
                      <strong className="text-foreground">llms.txt</strong> —
                      Arquivo dedicado para crawlers de IA identificarem sua
                      expertise
                    </span>
                  </li>
                </ul>
              </div>

              <p>
                Quando você trabalha com a LK Digital, sua clínica é otimizada
                para ser citada como referência por IAs quando pacientes
                perguntam:{" "}
                <em>
                  &ldquo;Qual o melhor especialista de saúde na minha
                  região?&rdquo;
                </em>{" "}
                — seja um cardiologista, dermatologista, ortopedista ou qualquer
                outra especialidade.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-accent text-accent hover:bg-accent hover:text-white px-8 py-6 text-base"
            >
              <Link href="/faq">Perguntas Frequentes sobre GEO & SEO</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LK Guarantee */}
      <LKGuarantee />
    </>
  );
}
