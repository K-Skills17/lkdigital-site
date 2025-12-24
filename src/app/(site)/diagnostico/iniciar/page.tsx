import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/site/page-header";

export default function IniciarPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-14 pb-8 md:pb-12">
      <PageHeader
        title="Antes de começar"
        description="Responda com precisão. O objetivo é mapear risco operacional — não 'fazer marketing'."
        metaPill="Tempo estimado: 5–8 min"
      />

      {/* Main Card */}
      <Card className="rounded-2xl border-muted/60 bg-background hover:shadow-md transition mb-8 md:mb-10 py-0">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-0">
            <div className="py-4">
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                Responda como dono(a) ou gestor(a)
              </p>
            </div>
            <Separator />
            <div className="py-4">
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                Evite respostas "otimistas"
              </p>
            </div>
            <Separator />
            <div className="py-4">
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                Use dados reais quando possível
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom action row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Link
          href="/diagnostico"
          className="text-sm text-muted-foreground hover:text-[rgb(var(--brand-accent))] transition-colors"
        >
          Voltar ao protocolo
        </Link>
        <Button
          asChild
          size="lg"
          className="bg-[rgb(var(--brand-accent))] text-white hover:opacity-90"
        >
          <Link href="/diagnostico/quiz">Começar</Link>
        </Button>
      </div>
    </div>
  );
}
