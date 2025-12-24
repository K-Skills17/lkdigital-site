import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/site/page-header";

export default function DentistaOSPage() {
  return (
    <div className="max-w-3xl mx-auto pt-8 md:pt-14 pb-8 md:pb-12">
      <PageHeader
        title="Dentista OS™"
        description="O sistema operacional instalado pela LK Digital para clínicas odontológicas que precisam de previsibilidade — não experimentos."
      />

      <Card className="rounded-2xl border-muted/60 bg-background py-0">
        <CardContent className="p-6 md:p-8 space-y-6">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Conteúdo em desenvolvimento. Em breve você encontrará informações
            detalhadas sobre o Dentista OS™ e como ele transforma a operação de
            clínicas odontológicas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
