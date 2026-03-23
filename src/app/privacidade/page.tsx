import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Política de Privacidade (LGPD)",
  description:
    "Política de privacidade da LK Digital. Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD.",
};

export default function Privacidade() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          variant="minimal"
          eyebrow="Legal"
          title="Política de Privacidade"
          titleAccent="(LGPD)"
          subtitle="Última atualização: Março 2026"
          pageNumber="Privacidade"
        />

        <section className="py-16 md:py-24">
          <div className="max-w-prose mx-auto px-4 sm:px-6">
            <div className="space-y-10 text-sm text-muted-foreground leading-relaxed">

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  1. Quem Somos
                </h2>
                <p>
                  A LK Digital (&ldquo;Legacy Keystone Digital&rdquo;) é uma agência de marketing
                  digital especializada em odontologia. Esta política descreve como
                  coletamos, utilizamos, armazenamos e protegemos os dados pessoais
                  dos visitantes do nosso site e dos profissionais que utilizam nossos
                  serviços, em conformidade com a Lei Geral de Proteção de Dados
                  (Lei nº 13.709/2018 — LGPD).
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  2. Dados que Coletamos
                </h2>
                <p className="mb-3">Coletamos os seguintes dados pessoais:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-foreground">Dados de identificação:</strong> nome,
                    e-mail profissional, nome do consultório/clínica — fornecidos
                    voluntariamente ao preencher formulários no site.
                  </li>
                  <li>
                    <strong className="text-foreground">Dados de navegação:</strong> endereço IP,
                    tipo de navegador, páginas visitadas, tempo de permanência — coletados
                    automaticamente via cookies e ferramentas de analytics.
                  </li>
                  <li>
                    <strong className="text-foreground">Dados de comunicação:</strong> mensagens
                    enviadas através do formulário de contato ou do assistente de chat.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  3. Finalidade do Tratamento
                </h2>
                <p className="mb-3">Utilizamos seus dados para:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Responder às suas solicitações e agendar diagnósticos</li>
                  <li>Enviar comunicações relevantes sobre nossos serviços (com seu consentimento)</li>
                  <li>Melhorar a experiência de navegação no site</li>
                  <li>Gerar análises agregadas e anônimas sobre o uso do site</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  4. Base Legal
                </h2>
                <p>
                  O tratamento dos seus dados pessoais é realizado com base no seu
                  consentimento (Art. 7º, I da LGPD), na execução de contrato ou
                  procedimentos preliminares (Art. 7º, V), e no legítimo interesse
                  da LK Digital (Art. 7º, IX), sempre respeitando seus direitos
                  fundamentais.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  5. Compartilhamento de Dados
                </h2>
                <p className="mb-3">
                  Não vendemos, alugamos ou compartilhamos seus dados pessoais com
                  terceiros para fins de marketing. Seus dados podem ser compartilhados
                  apenas com:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Prestadores de serviços essenciais (hospedagem, analytics, e-mail) que atuam como operadores sob nossas instruções</li>
                  <li>Autoridades competentes, quando exigido por lei</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  6. Armazenamento e Segurança
                </h2>
                <p>
                  Seus dados são armazenados em servidores seguros com criptografia
                  em trânsito (HTTPS/TLS) e em repouso. Adotamos medidas técnicas e
                  organizacionais adequadas para proteger seus dados contra acesso
                  não autorizado, perda, alteração ou destruição. Os dados são
                  retidos apenas pelo tempo necessário para cumprir as finalidades
                  para as quais foram coletados.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  7. Seus Direitos (LGPD)
                </h2>
                <p className="mb-3">
                  Você tem o direito de, a qualquer momento:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Confirmar a existência de tratamento dos seus dados</li>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários</li>
                  <li>Solicitar a portabilidade dos dados</li>
                  <li>Revogar o consentimento a qualquer momento</li>
                  <li>Solicitar a eliminação dos dados tratados com base no consentimento</li>
                </ul>
                <p className="mt-3">
                  Para exercer qualquer desses direitos, entre em contato pelo e-mail:{" "}
                  <a href="mailto:contato@lkdigital.org" className="text-accent hover:text-accent-dark underline">
                    contato@lkdigital.org
                  </a>
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  8. Cookies
                </h2>
                <p>
                  Utilizamos cookies essenciais para o funcionamento do site e
                  cookies analíticos para entender como os visitantes interagem com
                  nossas páginas. Você pode gerenciar suas preferências de cookies
                  nas configurações do seu navegador. A desativação de cookies
                  essenciais pode afetar a funcionalidade do site.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  9. Assistente de Chat (IA)
                </h2>
                <p>
                  Nosso site utiliza um assistente de chat baseado em inteligência
                  artificial. As mensagens enviadas ao assistente são processadas
                  para fornecer respostas relevantes sobre nossos serviços. Não
                  utilizamos o conteúdo das conversas para treinar modelos de IA.
                  Os dados das conversas são armazenados de forma segura e podem
                  ser excluídos mediante solicitação.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  10. Alterações nesta Política
                </h2>
                <p>
                  Esta política pode ser atualizada periodicamente. Recomendamos
                  que você a consulte regularmente. Alterações significativas serão
                  comunicadas de forma destacada no site.
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  LK Digital — Legacy Keystone Digital
                  <br />
                  Política de Privacidade v1.0 — Março 2026
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
