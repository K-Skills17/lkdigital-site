import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function DiagnosticoPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-14 pb-8 md:pb-12">
      {/* Header block */}
      <div className="space-y-4 mb-10 md:mb-12">
        <div>
          <span className="inline-block text-xs px-2 py-1 rounded-full border border-accent/30 text-foreground font-medium mb-4">
            PROTOCOLO
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          Diagnóstico
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
          Este diagnóstico existe para identificar gargalos operacionais reais.
          <br />
          Não é uma proposta comercial.
        </p>
      </div>

      {/* Main Card */}
      <Card className="rounded-2xl border-muted/60 bg-background hover:shadow-md transition mb-6 md:mb-8 py-0">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
            O que você vai receber
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <span className="text-base md:text-lg text-muted-foreground leading-relaxed">
                5–8 minutos
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <span className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Avaliação estratégica
              </span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <span className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Nem toda clínica será elegível
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Card */}
      <Card className="rounded-2xl border-muted/60 bg-background hover:shadow-md transition mb-8 md:mb-10 py-0">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
            Como usar este diagnóstico
          </h2>
          <div className="space-y-3 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>Respostas objetivas</p>
            <p>Sem promessas</p>
            <p>Direcionamento no final</p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom action row */}
      <div className="space-y-3">
        <Button
          asChild
          size="lg"
          className="bg-accent text-white hover:opacity-90"
        >
          <Link href="/diagnostico/iniciar">Iniciar diagnóstico</Link>
        </Button>
        <p className="text-sm text-muted-foreground">
          Você receberá um direcionamento claro ao final.
        </p>
      </div>
    </div>
  );
}
