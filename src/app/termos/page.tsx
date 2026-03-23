import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do site da LK Digital. Condições para utilização dos nossos serviços de marketing digital para dentistas.",
};

export default function Termos() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          variant="minimal"
          eyebrow="Legal"
          title="Termos de Uso"
          subtitle="Última atualização: Março 2026"
          pageNumber="Termos"
        />

        <section className="py-16 md:py-24">
          <div className="max-w-prose mx-auto px-4 sm:px-6">
            <div className="space-y-10 text-sm text-muted-foreground leading-relaxed">

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  1. Aceitação dos Termos
                </h2>
                <p>
                  Ao acessar e utilizar o site da LK Digital (&ldquo;Legacy Keystone
                  Digital&rdquo;), disponível em lkdigital.odo.br, você concorda com
                  estes Termos de Uso. Se você não concordar com qualquer parte
                  destes termos, solicitamos que não utilize o site. O uso
                  continuado do site constitui aceitação integral destes termos.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  2. Descrição dos Serviços
                </h2>
                <p>
                  A LK Digital é uma agência de marketing digital especializada
                  exclusivamente em odontologia. Através deste site, apresentamos
                  nossos serviços, publicamos conteúdo educativo, oferecemos
                  diagnósticos gratuitos e disponibilizamos um assistente de chat
                  para esclarecer dúvidas. Os serviços contratados são regidos por
                  contratos específicos firmados entre a LK Digital e o cliente.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  3. Uso do Site
                </h2>
                <p className="mb-3">Ao utilizar este site, você concorda em:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Fornecer informações verdadeiras e atualizadas nos formulários</li>
                  <li>Não utilizar o site para fins ilícitos ou não autorizados</li>
                  <li>Não tentar acessar áreas restritas do site ou seus sistemas</li>
                  <li>Não reproduzir, duplicar ou explorar comercialmente qualquer parte do site sem autorização</li>
                  <li>Não transmitir vírus, malware ou qualquer código de natureza destrutiva</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  4. Propriedade Intelectual
                </h2>
                <p>
                  Todo o conteúdo deste site — incluindo textos, imagens, logotipos,
                  design, código-fonte, gráficos e layout — é de propriedade da LK
                  Digital ou licenciado para uso por ela, e está protegido pelas leis
                  brasileiras de propriedade intelectual e direitos autorais (Lei nº
                  9.610/1998). A reprodução, distribuição ou uso não autorizado de
                  qualquer material deste site é expressamente proibida.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  5. Diagnóstico Gratuito
                </h2>
                <p>
                  O diagnóstico gratuito oferecido através do site é uma análise
                  preliminar da presença digital do solicitante. Não constitui
                  proposta comercial vinculante, contrato de prestação de serviços
                  ou garantia de resultados. Os dados fornecidos no formulário de
                  diagnóstico são tratados conforme nossa Política de Privacidade.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  6. Assistente de Chat (IA)
                </h2>
                <p>
                  O assistente de chat disponível neste site utiliza inteligência
                  artificial para fornecer informações gerais sobre nossos serviços.
                  As respostas do assistente são de caráter informativo e não
                  constituem consultoria profissional, proposta comercial ou
                  compromisso contratual. A LK Digital não se responsabiliza por
                  decisões tomadas exclusivamente com base nas respostas do
                  assistente.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  7. Conteúdo do Blog (Insights)
                </h2>
                <p>
                  Os artigos publicados na seção Insights têm caráter educativo e
                  informativo. Embora nos esforcemos para manter o conteúdo
                  atualizado e preciso, não garantimos que as informações estejam
                  completas ou livres de erros. O conteúdo não substitui consultoria
                  profissional especializada. Dados de mercado, estatísticas e
                  regulamentações citados podem sofrer alterações.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  8. Exclusividade Territorial
                </h2>
                <p>
                  As referências à exclusividade territorial em nosso site descrevem
                  nossa política comercial geral. Os termos específicos de
                  exclusividade são definidos nos contratos individuais de prestação
                  de serviços. A menção no site não constitui garantia automática
                  de exclusividade sem a formalização contratual.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  9. Limitação de Responsabilidade
                </h2>
                <p>
                  A LK Digital não se responsabiliza por danos diretos, indiretos,
                  incidentais ou consequentes decorrentes do uso ou impossibilidade
                  de uso deste site. O site é fornecido &ldquo;como está&rdquo;, sem
                  garantias de qualquer tipo. Não garantimos que o site estará
                  disponível de forma ininterrupta ou livre de erros.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  10. Links Externos
                </h2>
                <p>
                  Este site pode conter links para sites de terceiros. A LK Digital
                  não controla e não se responsabiliza pelo conteúdo, políticas de
                  privacidade ou práticas de sites de terceiros. O acesso a links
                  externos é de inteira responsabilidade do usuário.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  11. Conformidade com CFO
                </h2>
                <p>
                  Todo o conteúdo publicitário produzido pela LK Digital para
                  dentistas e clínicas odontológicas segue as resoluções do
                  Conselho Federal de Odontologia (CFO) aplicáveis à publicidade
                  odontológica. Casos de sucesso e depoimentos apresentados no
                  site são baseados em resultados reais, mas resultados individuais
                  podem variar conforme a região, especialidade e outros fatores.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  12. Legislação Aplicável
                </h2>
                <p>
                  Estes Termos de Uso são regidos pelas leis da República Federativa
                  do Brasil. Qualquer disputa decorrente destes termos será submetida
                  ao foro da comarca de domicílio da LK Digital, com exclusão de
                  qualquer outro.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  13. Alterações nos Termos
                </h2>
                <p>
                  A LK Digital reserva-se o direito de modificar estes Termos de
                  Uso a qualquer momento. Alterações entram em vigor imediatamente
                  após a publicação no site. O uso continuado do site após
                  alterações constitui aceitação dos novos termos.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl text-foreground mb-3">
                  14. Contato
                </h2>
                <p>
                  Para dúvidas sobre estes Termos de Uso, entre em contato:{" "}
                  <a href="mailto:contato@lkdigital.org" className="text-accent hover:text-accent-dark underline">
                    contato@lkdigital.org
                  </a>
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  LK Digital — Legacy Keystone Digital
                  <br />
                  Termos de Uso v1.0 — Março 2026
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
