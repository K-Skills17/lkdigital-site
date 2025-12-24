"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/site/diagnostico/progress";
import { QuestionCard } from "@/components/site/diagnostico/question-card";
import { PageHeader } from "@/components/site/page-header";

export default function QuizPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-14 pb-8 md:pb-12">
      {/* Progress bar */}
      <div className="mb-8 md:mb-10">
        <Progress current={1} total={6} />
      </div>

      <PageHeader title="Diagnóstico — Etapa 1" />

      {/* Question Cards */}
      <div className="space-y-6 md:space-y-8 mb-8 md:mb-10">
        <QuestionCard
          question="Qual é o seu papel na clínica?"
          options={[
            "Dono(a)/Sócio(a)",
            "Gestor(a)",
            "Recepção/Atendimento",
          ]}
        />
        <QuestionCard
          question="Qual é o principal objetivo nos próximos 90 dias?"
          options={[
            "Aumentar agendamentos de alto valor",
            "Reduzir faltas e cancelamentos",
            "Melhorar conversão do atendimento",
          ]}
        />
      </div>

      {/* Muted note */}
      <p className="text-sm text-muted-foreground mb-8 md:mb-10">
        (Protótipo UI. Perguntas completas e lógica entram no STEP 5.)
      </p>

      {/* Bottom sticky action row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pt-6 border-t">
        <Link
          href="/diagnostico/iniciar"
          className="text-sm text-muted-foreground hover:text-[rgb(var(--brand-accent))] transition-colors"
        >
          Voltar
        </Link>
        <Button
          asChild
          size="lg"
          className="bg-[rgb(var(--brand-accent))] text-white hover:opacity-90"
        >
          <Link href="/diagnostico/resultado">Finalizar (placeholder)</Link>
        </Button>
      </div>
    </div>
  );
}
