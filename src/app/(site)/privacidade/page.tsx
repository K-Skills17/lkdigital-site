import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade (LGPD) | LK Digital",
  description:
    "Política de privacidade da LK Digital em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Saiba como tratamos e protegemos os seus dados pessoais.",
  robots: { index: true, follow: true },
};

const sections = [
  {
    id: "identificacao",
    title: "1. Identificação do Controlador",
    content: `A LK Digital ("LK Digital", "nós", "nosso") é a controladora dos dados pessoais coletados por meio deste site e dos serviços prestados. Atuamos em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018) e demais normas aplicáveis.

Para exercer seus direitos ou contatar nosso Encarregado de Dados (DPO), utilize: contato@lkdigital.com.br`,
  },
  {
    id: "dados-coletados",
    title: "2. Dados Pessoais Coletados",
    content: `Coletamos dados pessoais nas seguintes situações:

— Formulários de contato e diagnose: nome completo, especialidade profissional, nome da clínica, e-mail profissional, WhatsApp e descrição do desafio de crescimento.

— Navegação no site: endereço IP, tipo de navegador, páginas visitadas, tempo de sessão e dados analíticos anonimizados (via Google Analytics, com IP anonimizado).

— Comunicações: dados fornecidos voluntariamente em trocas de e-mail ou mensagens.

Não coletamos dados sensíveis (dados de saúde de pacientes) e não vendemos dados pessoais a terceiros.`,
  },
  {
    id: "finalidade",
    title: "3. Finalidade do Tratamento",
    content: `Tratamos seus dados pessoais para as seguintes finalidades:

— Responder solicitações de contato e diagnose estratégica;
— Prestar os serviços de marketing digital contratados;
— Enviar comunicações de marketing relevantes (somente com consentimento);
— Melhorar a experiência de uso do site por meio de análises de navegação;
— Cumprir obrigações legais e regulatórias;
— Exercer direitos em processos judiciais, administrativos ou arbitrais.

A base legal para o tratamento é o legítimo interesse, a execução de contrato e/ou o consentimento, conforme a finalidade aplicável (Art. 7º, LGPD).`,
  },
  {
    id: "compartilhamento",
    title: "4. Compartilhamento de Dados",
    content: `Compartilhamos seus dados apenas quando necessário e com as devidas garantias:

— Prestadores de serviços tecnológicos (hospedagem, e-mail marketing, analytics) — vinculados por acordos de confidencialidade e conformidade com a LGPD;
— Autoridades públicas — quando exigido por lei ou ordem judicial;
— Parceiros de negócio — nunca, sem seu consentimento expresso.

Todos os subprocessadores são avaliados quanto à sua conformidade com legislações de proteção de dados.`,
  },
  {
    id: "direitos",
    title: "5. Seus Direitos (Art. 18, LGPD)",
    content: `Como titular dos dados, você tem os seguintes direitos:

— Confirmação de que seus dados são tratados por nós;
— Acesso aos seus dados pessoais;
— Correção de dados incompletos, inexatos ou desatualizados;
— Anonimização, bloqueio ou eliminação de dados desnecessários;
— Portabilidade dos dados a outro fornecedor de serviço;
— Eliminação de dados tratados com base no consentimento;
— Informação sobre o compartilhamento de dados;
— Revogação do consentimento a qualquer momento.

Para exercer seus direitos, envie e-mail para: contato@lkdigital.com.br. Responderemos em até 15 dias úteis.`,
  },
  {
    id: "retencao",
    title: "6. Retenção e Segurança dos Dados",
    content: `Retemos seus dados pelo tempo necessário para cumprir as finalidades descritas, respeitando os prazos legais aplicáveis. Dados de clientes ativos são mantidos durante a vigência contratual e por até 5 anos após o encerramento, para fins legais e fiscais.

Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda, destruição ou divulgação, incluindo: criptografia em trânsito (TLS), controle de acesso por perfil, e revisões periódicas de segurança.`,
  },
  {
    id: "cookies",
    title: "7. Cookies e Tecnologias de Rastreamento",
    content: `Utilizamos cookies essenciais (para funcionamento do site) e cookies analíticos (para entender padrões de uso). Cookies de marketing são utilizados somente mediante seu consentimento explícito.

Você pode gerenciar suas preferências de cookies a qualquer momento nas configurações do seu navegador. A desativação de cookies essenciais pode impactar a funcionalidade do site.`,
  },
  {
    id: "atualizacoes",
    title: "8. Atualizações desta Política",
    content: `Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação. A versão mais recente estará sempre disponível nesta página, com a data de última atualização.

Última atualização: fevereiro de 2026.

Em caso de dúvidas, entre em contato: contato@lkdigital.com.br`,
  },
];

export default function PrivacidadePage() {
  return (
    <article className="max-w-3xl mx-auto section-premium">
      {/* Header */}
      <div className="mb-12">
        <div className="w-12 h-px bg-accent mb-6" aria-hidden="true" />
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
          Política de Privacidade
        </h1>
        <p className="text-muted-foreground">
          Em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº
          13.709/2018)
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
          Dúvidas sobre privacidade?
        </p>
        <p className="text-sm text-muted-foreground">
          Entre em contato com nosso Encarregado de Dados:{" "}
          <Link
            href="mailto:contato@lkdigital.com.br"
            className="text-accent hover:underline"
          >
            contato@lkdigital.com.br
          </Link>
        </p>
      </div>
    </article>
  );
}
