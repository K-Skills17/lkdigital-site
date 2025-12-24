import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/site/page-header";

export default function ParaQuemPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-14 pb-8 md:pb-12">
      <PageHeader
        title="Para quem"
        description="Conteúdo em desenvolvimento."
      />

      <Card className="rounded-2xl border-muted/60 bg-background py-0">
        <CardContent className="p-6 md:p-8">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Esta página está em construção. Em breve você encontrará informações
            sobre o perfil ideal de clínicas odontológicas que se beneficiam dos
            sistemas da LK Digital.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
