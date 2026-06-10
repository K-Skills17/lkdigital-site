import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-6 py-12 max-w-3xl mx-auto text-center border-t border-[#C4963A]/10">
      <p className="text-[#EDE8DF]/60 text-sm font-body mb-2">
        As vagas desta turma encerram em 31/07/2026 ou quando as 50 forem preenchidas — o que vier
        primeiro.
      </p>
      <p className="text-[#EDE8DF]/40 text-xs font-body mt-6">
        LK Digital · Marketing exclusivo para odontologia · CNPJ {"{placeholder}"}
      </p>
      <Link
        href="/raio-x/privacidade"
        className="text-[#C4963A]/60 hover:text-[#C4963A] text-xs font-body mt-2 inline-block transition-colors"
      >
        Política de Privacidade
      </Link>
    </footer>
  );
}
