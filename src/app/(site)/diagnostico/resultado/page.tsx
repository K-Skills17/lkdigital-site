import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/site/page-header";

export default function ResultadoPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-14 pb-8 md:pb-12">
      <PageHeader title="Direcionamento" />

      {/* Main Card */}
      <Card className="rounded-2xl border-muted/60 bg-background hover:shadow-md transition mb-8 md:mb-10 py-0">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Status line block */}
          <div className="space-y-2 pb-4 border-b border-muted/60">
            <p className="text-sm text-muted-foreground font-medium">
              Status
            </p>
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              Próximo passo recomendado: estruturar o protocolo de qualificação
              e atendimento.
            </p>
          </div>

          {/* Body paragraph */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Com base neste diagnóstico, o maior risco tende a estar em falta de
            sistemas claros de controle e conversão.
          </p>
        </CardContent>
      </Card>

      {/* Bottom action row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button
          asChild
          variant="outline"
          className="order-2 sm:order-1"
        >
          <Link href="/diagnostico">Refazer diagnóstico</Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="bg-[rgb(var(--brand-accent))] text-white hover:opacity-90 order-1 sm:order-2"
        >
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </div>
  );
}
