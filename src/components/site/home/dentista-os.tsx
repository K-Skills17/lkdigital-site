import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "../section";

export function DentistaOS() {
  return (
    <Section
      eyebrow="Solução em destaque para odontologia"
      title="Dentista OS™"
      description="O sistema operacional instalado pela LK Digital para clínicas odontológicas que precisam de previsibilidade — não experimentos."
    >
      <div>
        <Button
          asChild
          variant="outline"
          className="hover:text-[rgb(var(--brand-accent))] hover:border-[rgb(var(--brand-accent))]"
        >
          <Link href="/solucoes/dentista-os">Ver o sistema</Link>
        </Button>
      </div>
    </Section>
  );
}
