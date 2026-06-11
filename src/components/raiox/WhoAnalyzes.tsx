"use client";

import Image from "next/image";
import { useState } from "react";

export default function WhoAnalyzes() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="px-6 py-10 md:py-16 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-[#1A1A1A] border border-[#C4963A]/30 flex items-center justify-center">
          {imgError ? (
            <span className="text-[#C4963A] font-display text-3xl">DK</span>
          ) : (
            <Image
              src="/domingos.jpg"
              alt="Domingos — fundador da LK Digital"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div>
          <h2 className="font-display text-display-sm text-[#EDE8DF] mb-4">Quem analisa</h2>
          <p className="text-[#EDE8DF]/80 text-base leading-relaxed font-body">
            Sou Domingos, fundador da LK Digital — agência que atua exclusivamente com clínicas
            odontológicas. Não atendemos restaurantes, academias ou lojas. Só odontologia, só
            captação de pacientes de alto valor, sempre dentro das normas do CFO/CRO. É por isso que
            cada avaliação é feita manualmente — e por isso as vagas são limitadas.
          </p>
        </div>
      </div>
    </section>
  );
}
