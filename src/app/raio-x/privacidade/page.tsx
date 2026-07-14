import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — Raio-X Digital | LK Digital",
  description: "Política de privacidade do Raio-X Digital 2026, em conformidade com a LGPD.",
  robots: { index: false, follow: false },
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#EDE8DF] px-6 py-16 md:py-24">
      <article className="max-w-2xl mx-auto prose-invert">
        <h1 className="font-display text-display-md text-[#EDE8DF] mb-8">
          Política de Privacidade
        </h1>
        <div className="space-y-6 text-[#EDE8DF]/80 text-sm font-body leading-relaxed">
          <p>
            <strong>LK Digital</strong> (&ldquo;nós&rdquo;, &ldquo;nosso&rdquo;) respeita a
            privacidade dos usuários deste site e está comprometida com a proteção dos dados
            pessoais que coleta, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei
            nº 13.709/2018 — LGPD).
          </p>

          <h2 className="font-display text-lg text-[#EDE8DF] mt-8 mb-2">Dados coletados</h2>
          <p>
            Ao solicitar o Raio-X Digital, coletamos: nome, nome da clínica, cidade/estado, número
            de WhatsApp, Instagram da clínica (opcional), site (opcional), papel na clínica, número
            de cadeiras, procedimentos de interesse e responsável pelo marketing. Também capturamos
            parâmetros UTM da URL para fins de atribuição de campanha.
          </p>

          <h2 className="font-display text-lg text-[#EDE8DF] mt-8 mb-2">
            Finalidade do tratamento
          </h2>
          <p>
            Os dados são utilizados exclusivamente para realizar a avaliação digital da clínica
            (Raio-X Digital), entregar o relatório via WhatsApp e, caso solicitado, entrar em contato
            para apresentar nossos serviços.
          </p>

          <h2 className="font-display text-lg text-[#EDE8DF] mt-8 mb-2">Base legal</h2>
          <p>
            O tratamento dos dados se dá com base no consentimento do titular (Art. 7º, I, LGPD),
            manifestado no momento do envio do formulário.
          </p>

          <h2 className="font-display text-lg text-[#EDE8DF] mt-8 mb-2">
            Compartilhamento de dados
          </h2>
          <p>
            Não compartilhamos, vendemos ou alugamos seus dados pessoais a terceiros. Os dados são
            armazenados em servidores seguros (Supabase) e acessados apenas pela equipe da LK
            Digital.
          </p>

          <h2 className="font-display text-lg text-[#EDE8DF] mt-8 mb-2">
            Retenção e exclusão
          </h2>
          <p>
            Os dados são mantidos pelo período necessário para a prestação do serviço. Você pode
            solicitar a exclusão dos seus dados a qualquer momento, entrando em contato pelo e-mail
            abaixo.
          </p>

          <h2 className="font-display text-lg text-[#EDE8DF] mt-8 mb-2">Seus direitos</h2>
          <p>
            Nos termos da LGPD, você tem direito a: confirmar a existência de tratamento, acessar
            seus dados, solicitar correção, anonimização, bloqueio ou eliminação, portabilidade,
            informação sobre compartilhamento e revogação do consentimento.
          </p>

          <h2 className="font-display text-lg text-[#EDE8DF] mt-8 mb-2">Contato</h2>
          <p>
            Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
            <br />
            <strong>E-mail:</strong> privacidade@lkdigital.odo.br
          </p>

          <p className="text-[#EDE8DF]/40 text-xs mt-12">
            Última atualização: junho de 2026.
          </p>
        </div>

        <Link
          href="/raio-x"
          className="inline-block mt-8 text-[#C4963A] text-sm font-body hover:underline"
        >
          ← Voltar ao Raio-X Digital
        </Link>
      </article>
    </main>
  );
}
