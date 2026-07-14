import { Metadata } from "next";
import ScoreQuiz from "@/components/unicornio/ScoreQuiz";

export const metadata: Metadata = {
  title: "Quiz — Diagnóstico Digital para Dentistas | LK Digital",
  robots: { index: false, follow: false },
};

export default function UnicornioPage() {
  return (
    <main id="main-content" lang="pt-BR">
      <ScoreQuiz />
    </main>
  );
}
