import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "A IA Está Recomendando Clínicas — A Sua Está na Lista? | LK Digital",
  description:
    "Clínicas sem estrutura digital otimizada estão invisíveis para a IA. Descubra como construir a fundação que permite ao ChatGPT, Google AI e outros modelos reconhecerem e recomendarem a sua clínica.",
  robots: { index: false, follow: false },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* ── Top bar — logo only, no distractions ── */}
      <div className="bg-[#1A1A1A] px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <span className="text-lg font-semibold tracking-tight text-white">
            LK <span className="text-[#C5A368]">Digital</span>
          </span>
        </div>
      </div>

      {/* ── HEADER — The Problem in one sharp line ── */}
      <section className="bg-[#1A1A1A] px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl">

          {/* Eyebrow */}
          <div className="mb-8 flex items-center gap-3">
            <span
              className="block h-px w-10 bg-[#C5A368]"
              aria-hidden="true"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A368]">
              Para médicos, dentistas e especialistas de saúde
            </p>
          </div>

          {/* H1 */}
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hoje, a Inteligência Artificial Indicou Pacientes para{" "}
            <span className="text-[#C5A368]">Concorrentes Seus.</span>{" "}
            Não para Você.
          </h1>

          {/* Reader — draws them into the body */}
          <p className="mt-8 text-lg leading-relaxed text-white/70 sm:text-xl">
            Se você chegou até aqui, já percebeu que algo precisa mudar. Antes
            de falarmos sobre a nossa solução, precisa entender o que está
            acontecendo no mercado — e por que a maioria das clínicas ainda não
            viu.
          </p>

        </div>
      </section>

      {/* ── MESSAGE — PAS body ── */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-14">

          {/* ─ P: Problema ─ */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A368]">
              O Problema
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] mb-6 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
              Sua Clínica Não Existe para a IA — e Isso Está Custando Pacientes Todos os Dias
            </h2>
            <div className="space-y-5 text-[17px] leading-8 text-[#4A4A4A]">
              <p>
                Quando um paciente pergunta ao ChatGPT{" "}
                <em>"qual o melhor cardiologista em São Paulo?"</em> ou acessa o
                Google e recebe uma resposta gerada por IA — essa IA não faz
                pesquisa em tempo real. Ela responde com base em sinais de
                autoridade que a sua clínica ou tem, ou não tem.
              </p>
              <p>
                Site mal estruturado. Google Business Profile incompleto. Falta
                de conteúdo técnico sobre os seus procedimentos. Para a
                inteligência artificial, esses sinais comunicam uma coisa:{" "}
                <strong className="font-semibold text-[#1A1A1A]">
                  essa clínica não merece ser citada.
                </strong>
              </p>
              <p>
                Isso não é uma ameaça para daqui a dois anos. Está acontecendo
                agora, na sua especialidade, na sua cidade — e cada dia sem a
                estrutura certa é um dia em que pacientes qualificados são
                direcionados para concorrentes que já construíram essa fundação.
              </p>
            </div>
          </div>

          <div className="h-px bg-[#E5E5E5]" aria-hidden="true" />

          {/* ─ A: Agitação ─ */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A368]">
              A Armadilha
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] mb-6 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
              Investir em Anúncios Sem a Fundação Certa é Jogar Dinheiro Fora
            </h2>
            <div className="space-y-5 text-[17px] leading-8 text-[#4A4A4A]">
              <p>
                A resposta instintiva de muitas clínicas é investir mais em
                Google Ads ou Meta Ads. E funcionam — enquanto você paga. No
                momento em que o orçamento pausa, os pacientes somem.
              </p>
              <p>
                Mais grave: anúncios sem fundação custam mais e convertem menos.
                Um paciente que vê o seu anúncio vai pesquisar a clínica antes
                de ligar. Se encontra um site lento, um perfil do Google
                desatualizado e poucas avaliações recentes, ele liga para outro.
                Você pagou pelo clique. Seu concorrente ficou com o paciente.
              </p>
              <p>
                Você está alugando visibilidade. Financiando um sistema que não
                pertence à sua clínica. E quanto mais depende de anúncios e de
                indicações que chegam por acaso — menos controle tem sobre o
                crescimento real do seu consultório.
              </p>
              <div className="border-l-4 border-[#C5A368] bg-[#F9F6F0] py-4 pl-6 pr-4">
                <p className="font-semibold text-[#1A1A1A]">
                  O problema não é fazer anúncios. O problema é fazer anúncios
                  sem o sistema que sustenta os resultados depois que a campanha
                  encerra.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#E5E5E5]" aria-hidden="true" />

          {/* ─ S: Solução ─ */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A368]">
              A Solução
            </p>
            <h2 className="font-[family-name:var(--font-cormorant)] mb-6 text-3xl font-bold text-[#1A1A1A] sm:text-4xl">
              Não Prometemos Visibilidade Imediata. Construímos a Estrutura que a Torna Possível.
            </h2>
            <div className="space-y-5 text-[17px] leading-8 text-[#4A4A4A]">
              <p>
                Ser recomendado pela IA não acontece da noite para o dia. Isso
                leva tempo — e qualquer agência que prometa o contrário não está
                sendo honesta com você.
              </p>
              <p>
                O que fazemos é diferente: construímos a fundação técnica e de
                conteúdo que torna essa visibilidade possível. Sem ela, não
                importa quanto você invista em anúncios ou quanto confie nas
                indicações — você continuará dependendo de ambos,
                indefinidamente.
              </p>

              {/* What we build */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    title: "Site estruturado para IA e buscadores",
                    desc: "Schema markup correto para saúde, velocidade otimizada e arquitetura de conteúdo que modelos de linguagem conseguem ler, interpretar e citar.",
                  },
                  {
                    title: "Google Business Profile completamente otimizado",
                    desc: "O ativo local mais crítico para qualquer clínica. Um perfil bem estruturado é a base da sua presença nos mapas, na busca local e nas respostas de IA com contexto geográfico.",
                  },
                  {
                    title: "Conteúdo que responde às perguntas dos seus pacientes",
                    desc: "Blocos de autoridade sobre os seus procedimentos e especialidade — estruturados para aparecer como fonte nas respostas de ChatGPT, Gemini e Google AI Overview.",
                  },
                  {
                    title: "Presença consistente nos diretórios que alimentam a IA",
                    desc: "Cada menção correta da sua clínica nos lugares certos é um sinal que os modelos de IA leem e acumulam ao longo do tempo.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-sm bg-white p-5 border border-[#E5E5E5]">
                    <div
                      className="mt-1 h-5 w-5 shrink-0 rounded-full bg-[#C5A368]/10 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg className="h-3 w-3 text-[#C5A368]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[#6B6B6B]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="pt-2">
                Quando esta fundação está no lugar, ela trabalha por você 24
                horas por dia. Mês após mês, a dependência de anúncios e
                indicações diminui — porque a sua clínica passa a ser
                encontrada e recomendada de forma orgânica, pelos buscadores e
                cada vez mais pelas IAs que hoje seus pacientes consultam antes
                de decidir com qual médico marcar consulta.
              </p>
              <p className="font-medium text-[#1A1A1A]">
                Não vendemos campanhas. Implementamos sistemas.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA — single, strong action ── */}
      <section className="bg-[#1A1A1A] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A368]">
            Próximo Passo
          </p>

          <h2 className="font-[family-name:var(--font-cormorant)] text-3xl font-bold text-white sm:text-4xl">
            Agende uma Conversa — Sem Compromisso
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
            30 minutos. Analisamos a situação digital atual da sua clínica e
            apresentamos, de forma direta, o que seria necessário para construir
            a fundação certa — sem promessas irreais e sem pressão de venda.
          </p>

          <div className="mt-10">
            <Link
              href="/contato"
              className="inline-flex items-center gap-3 rounded-full bg-[#C5A368] px-10 py-4 text-base font-semibold text-[#1A1A1A] transition-colors hover:bg-[#D4B87A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A368]"
            >
              Agendar Minha Conversa Gratuita
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <p className="mt-5 text-xs text-white/35">
            Atendemos no máximo 5 clínicas por cidade. Verifique a disponibilidade para a sua região.
          </p>

        </div>
      </section>

      {/* ── Minimal footer ── */}
      <div className="bg-[#111111] px-6 py-5">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-4 text-xs text-white/25">
          <span>© {new Date().getFullYear()} LK Digital</span>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-white/50 transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-white/50 transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
