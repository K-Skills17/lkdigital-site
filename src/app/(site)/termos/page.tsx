import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso | LK Digital",
  description:
    "Termos e condições de uso dos serviços de marketing digital da LK Digital para clínicas e profissionais de saúde.",
  robots: { index: true, follow: true },
};

const sections = [
  {
    id: "aceitacao",
    title: "1. Aceitação dos Termos",
    content: `Ao acessar o site lkdigital.com.br ou contratar os serviços da LK Digital, você ("Cliente") concorda com estes Termos de Uso. Caso não concorde com alguma condição, não utilize o site ou os serviços.

A LK Digital reserva-se o direito de atualizar estes termos periodicamente. Mudanças relevantes serão comunicadas por e-mail ou notificação no site. O uso continuado após a publicação implica aceitação das alterações.`,
  },
  {
    id: "servicos",
    title: "2. Descrição dos Serviços",
    content: `A LK Digital oferece serviços de marketing digital especializados para clínicas e profissionais de saúde, incluindo:

— GEO & SEO: otimização de presença digital para motores de busca e inteligências artificiais;
— Branding Premium: desenvolvimento de identidade visual e posicionamento de marca;
— Infraestrutura Digital: implementação de funis de conversão, automações e dashboards;
— Consultoria Estratégica: diagnose e planejamento de crescimento digital.

Os serviços específicos contratados são definidos em Proposta Comercial e/ou Contrato de Prestação de Serviços assinado entre as partes.`,
  },
  {
    id: "responsabilidades",
    title: "3. Responsabilidades do Cliente",
    content: `O Cliente compromete-se a:

— Fornecer informações verdadeiras, completas e atualizadas sobre sua clínica e serviços;
— Respeitar as normas dos conselhos profissionais de saúde aplicáveis (CFM, CFO, CFP, CRN, COFFITO, etc.) em toda comunicação de marketing;
— Aprovar conteúdos e materiais produzidos pela LK Digital antes da publicação;
— Não utilizar os serviços para fins ilegais, fraudulentos ou que violem direitos de terceiros;
— Manter sigilo sobre estratégias, processos e documentos confidenciais da LK Digital.`,
  },
  {
    id: "propriedade-intelectual",
    title: "4. Propriedade Intelectual",
    content: `Todo o conteúdo produzido pela LK Digital no âmbito dos serviços contratados torna-se propriedade do Cliente após a quitação integral dos valores devidos, salvo disposição contrária em contrato específico.

O método, processos e sistemas proprietários da LK Digital permanecem de propriedade exclusiva da LK Digital. O Cliente não poderá reproduzir, licenciar ou comercializar o método sem autorização expressa por escrito.

O site lkdigital.com.br e seus conteúdos (textos, imagens, design, marca) são propriedade da LK Digital e protegidos pela legislação de direitos autorais e marcas (Lei nº 9.279/1996 e Lei nº 9.610/1998).`,
  },
  {
    id: "pagamentos",
    title: "5. Condições Comerciais e Pagamento",
    content: `Os valores, prazos e condições de pagamento são definidos na Proposta Comercial e/ou Contrato de Prestação de Serviços.

O não pagamento nas datas acordadas sujeita o Cliente a:
— Multa de 2% sobre o valor em atraso;
— Juros de 1% ao mês (pro rata die);
— Suspensão dos serviços após 15 dias de inadimplência;
— Rescisão contratual após 30 dias de inadimplência.

Reembolsos são avaliados caso a caso, conforme as garantias previstas em contrato.`,
  },
  {
    id: "limitacao",
    title: "6. Limitação de Responsabilidade",
    content: `A LK Digital envida todos os esforços para entregar resultados de marketing de alta qualidade. Contudo, resultados específicos de negócio (faturamento, número de pacientes, posicionamento orgânico) dependem de fatores externos e não podem ser garantidos de forma absoluta, salvo quando expressamente previstos em contrato com cláusula de performance.

A LK Digital não se responsabiliza por danos indiretos, perda de lucros ou danos decorrentes de fatores fora do seu controle, como mudanças de algoritmo, crises de mercado ou decisões unilaterais do Cliente que impactem as estratégias acordadas.`,
  },
  {
    id: "rescisao",
    title: "7. Rescisão",
    content: `Qualquer das partes pode rescindir o contrato mediante notificação por escrito com antecedência mínima de 30 dias corridos.

Em caso de rescisão antecipada pelo Cliente sem justa causa, serão devidos os valores dos serviços realizados até a data de rescisão, acrescidos de multa compensatória prevista em contrato.

Em caso de violação grave destes Termos, a LK Digital pode rescindir imediatamente o contrato, sem prejuízo de outras medidas legais cabíveis.`,
  },
  {
    id: "lei-aplicavel",
    title: "8. Lei Aplicável e Foro",
    content: `Estes Termos são regidos pelas leis da República Federativa do Brasil. Para resolução de conflitos, fica eleito o foro da Comarca de São Paulo/SP, com renúncia expressa a qualquer outro, por mais privilegiado que seja.

As partes comprometem-se a buscar solução amigável antes de recorrer a medidas judiciais.

Última atualização: fevereiro de 2026.`,
  },
];

export default function TermosPage() {
  return (
    <article className="max-w-3xl mx-auto section-premium">
      {/* Header */}
      <div className="mb-12">
        <div className="w-12 h-px bg-accent mb-6" aria-hidden="true" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
          Termos de Uso
        </h1>
        <p className="text-muted-foreground">
          Condições gerais para uso do site e contratação dos serviços da LK Digital.
        </p>
        <p className="text-sm text-muted-foreground/60 mt-2">
          Última atualização: fevereiro de 2026
        </p>
      </div>

      {/* Table of contents */}
      <nav className="bg-muted p-6 mb-10 rounded-sm" aria-label="Índice">
        <p className="text-[11px] uppercase tracking-widest text-accent font-medium mb-4">
          Nesta página
        </p>
        <ol className="space-y-1.5 text-sm text-muted-foreground">
          {sections.map((s) => (
            <li key={s.id}>
              <Link
                href={`#${s.id}`}
                className="hover:text-accent transition-colors"
              >
                {s.title}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div className="space-y-12">
        {sections.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {s.title}
            </h2>
            <div className="text-muted-foreground leading-relaxed space-y-3">
              {s.content.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6 h-px bg-border/60" aria-hidden="true" />
          </section>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 p-6 bg-trust-bg border border-accent/20">
        <p className="text-sm text-foreground font-medium mb-1">
          Dúvidas sobre os termos?
        </p>
        <p className="text-sm text-muted-foreground">
          Entre em contato:{" "}
          <Link
            href="mailto:contato@lkdigital.com.br"
            className="text-accent hover:underline"
          >
            contato@lkdigital.com.br
          </Link>{" "}
          ou acesse nossa{" "}
          <Link href="/privacidade" className="text-accent hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
