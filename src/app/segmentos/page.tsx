import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Segmentos — Especialidades Odontológicas Que Atendemos",
  description:
    "Marketing digital especializado para implantodontia, ortodontia, odontopediatria, endodontia, periodontia e estética dental. Uma vaga por especialidade por região.",
};

const specialties = [
  {
    id: "implantodontia",
    name: "Implantodontia",
    tagline: "Pacientes de alto ticket buscando implantes encontram você primeiro",
    description:
      "Implantes são o procedimento de maior ticket na odontologia — e os pacientes pesquisam extensivamente antes de decidir. Posicionamos seu consultório como a referência na região para implantes, com conteúdo que educa, constrói confiança e converte.",
    keywords: [
      "implante dentário preço",
      "implantodontista perto de mim",
      "implante de porcelana",
      "carga imediata",
    ],
  },
  {
    id: "ortodontia",
    name: "Ortodontia",
    tagline: "Atraia pacientes para alinhadores, aparelhos e tratamentos ortodônticos",
    description:
      "O mercado de ortodontia está cada vez mais competitivo com os alinhadores invisíveis. Diferenciamos seu consultório com posicionamento digital que destaca sua expertise clínica — não preço mais baixo.",
    keywords: [
      "ortodontista",
      "aparelho invisível preço",
      "invisalign",
      "alinhador transparente",
    ],
  },
  {
    id: "odontopediatria",
    name: "Odontopediatria",
    tagline: "Mães e pais encontram seu consultório quando buscam dentista para os filhos",
    description:
      "Pais são extremamente criteriosos ao escolher um dentista para seus filhos. Nossa estratégia constrói autoridade e confiança com conteúdo que responde às preocupações reais dos responsáveis.",
    keywords: [
      "dentista infantil",
      "odontopediatra perto de mim",
      "primeira consulta dentista bebê",
      "medo de dentista criança",
    ],
  },
  {
    id: "endodontia",
    name: "Endodontia",
    tagline: "Pacientes com dor de dente urgente encontram você imediatamente",
    description:
      "Endodontia tem um componente de urgência que exige presença digital imediata. Quando alguém busca 'tratamento de canal perto de mim' às 22h, seu consultório precisa aparecer — e nós garantimos isso.",
    keywords: [
      "tratamento de canal",
      "dor de dente urgente",
      "endodontista",
      "canal dentário preço",
    ],
  },
  {
    id: "periodontia",
    name: "Periodontia",
    tagline: "Eduque pacientes sobre saúde gengival e atraia tratamentos recorrentes",
    description:
      "Muitos pacientes nem sabem que precisam de um periodontista. Nossa estratégia de conteúdo educativo transforma buscas informacionais em consultas agendadas — com autoridade que os convence.",
    keywords: [
      "periodontista",
      "gengiva sangrando",
      "tratamento periodontal",
      "retração gengival",
    ],
  },
  {
    id: "estetica",
    name: "Estética Dental",
    tagline: "Pacientes que investem em estética descobrem seus serviços premium",
    description:
      "Estética dental é sobre aspiração e confiança. Posicionamos seu consultório como referência premium em lentes de contato dental, clareamento e harmonização — atraindo pacientes que valorizam qualidade acima de preço.",
    keywords: [
      "lente de contato dental",
      "clareamento dental",
      "facetas de porcelana preço",
      "harmonização orofacial",
    ],
  },
];

export default function Segmentos() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          variant="editorial"
          eyebrow="Especialidades"
          title="Cada Especialidade Merece Uma Estratégia"
          titleAccent="Própria."
          subtitle="Cada especialidade tem um tipo de paciente, um funil diferente e regulações específicas. Nossas estratégias são construídas para a sua realidade."
          pageNumber="06"
        />

        {/* Specialties */}
        <section className="py-20 md:py-28">
          <div className="max-w-content mx-auto px-4 sm:px-6 space-y-16">
            {specialties.map((spec, i) => (
              <div
                key={spec.id}
                id={spec.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${
                  i % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="text-xs font-medium text-accent uppercase tracking-[0.25em] mb-2">
                    {spec.name}
                  </p>
                  <h2 className="font-display text-display-sm text-foreground mb-3">
                    {spec.tagline}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {spec.description}
                  </p>
                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.25em] mb-2">
                      Buscas que capturamos:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {spec.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-3 py-1 text-xs bg-accent/10 text-accent rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/contato"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
                  >
                    Verificar disponibilidade na sua região
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
                <div
                  className={`aspect-[4/3] rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-border/60 flex items-center justify-center ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <span className="font-display text-6xl text-accent/15 font-light">
                    {spec.name.charAt(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exclusivity CTA */}
        <section className="py-20 md:py-28 bg-muted text-center">
          <div className="max-w-narrow mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Vagas limitadas por região
            </div>
            <h2 className="font-display text-display-md text-foreground mb-4 text-balance">
              Apenas 1 Consultório Por Especialidade Por Região
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Verifique se a sua especialidade e região ainda estão disponíveis.
              Quanto antes garantir a vaga, antes os pacientes começam a chegar.
            </p>
            <Link
              href="/contato"
              className="inline-flex px-8 py-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-md transition-all duration-200 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-accent/25"
            >
              Verificar Disponibilidade
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
