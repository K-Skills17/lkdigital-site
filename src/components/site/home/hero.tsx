import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="section-premium">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Copy - Always first on mobile */}
        <div className="space-y-6 md:space-y-8">
          {/* Decorative accent line */}
          <div className="w-10 md:w-12 h-px bg-accent" aria-hidden="true" />

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-foreground leading-[1.15]">
            A Maestria em Negócios Odontológicos:{" "}
            <span className="text-accent">Da Estratégia ao Faturamento.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            Não somos uma agência de SEO. Somos o seu braço direito em
            inteligência de mercado. Implementamos sistemas completos de
            aquisição de leads, conversão de alto ticket e retenção de pacientes
            para transformar sua clínica em uma operação de elite.
          </p>

          {/* CTA Button */}
          <div className="pt-2 md:pt-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-accent text-white hover:bg-accent-dark px-6 sm:px-8 py-5 sm:py-6 text-base"
            >
              <Link href="/contato">Iniciar Consultoria de Negócios</Link>
            </Button>
          </div>
        </div>

        {/* Visual Placeholder - Hidden on small mobile, shown on sm+ */}
        <div className="relative hidden sm:block">
          <div className="aspect-[4/3] bg-muted rounded-sm overflow-hidden">
            {/* Placeholder for hero image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-6 md:p-8">
                <div className="w-12 md:w-16 h-12 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <svg
                    className="w-6 md:w-8 h-6 md:h-8 text-accent"
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
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
                  Clínica odontológica de alto padrão operando como uma empresa
                  de excelência.
                </p>
              </div>
            </div>
          </div>
          {/* Decorative accent corner - hidden on mobile */}
          <div
            className="absolute -bottom-4 -right-4 w-16 md:w-24 h-16 md:h-24 border-r-2 border-b-2 border-accent/30 hidden md:block"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
