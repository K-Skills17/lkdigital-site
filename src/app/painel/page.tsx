// /painel — internal operations dashboard (Basic-auth gated in middleware.ts).
// One view over every lead on the site (tool_leads: lead magnets, free tools, retired funnels),
// WhatsApp delivery health and AI usage across all backends.

import type { Metadata } from "next";
import UpdateDatabase from "@/components/painel/UpdateDatabase";
import { loadDashboard, SOURCE_LABELS, type DashboardData, type LeadRow } from "@/lib/backbone/dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Painel | LK Digital" },
  robots: { index: false, follow: false },
};

const fmtInt = new Intl.NumberFormat("pt-BR");
const fmtDateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});
const fmtDay = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" });

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold tabular-nums text-foreground">{value}</div>
      {sub && <div className="mt-1 text-sm text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Section({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SourceBars({ rows }: { rows: DashboardData["bySource"] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.source} className="grid grid-cols-[minmax(0,11rem)_1fr_3rem] items-center gap-3 text-sm" title={`${r.label}: ${r.count} leads`}>
          <span className="truncate text-foreground">{r.label}</span>
          <span className="h-3 rounded-r bg-muted">
            <span
              className="block h-3 rounded-r bg-accent"
              style={{ width: r.count ? `max(4px, ${(r.count / max) * 100}%)` : 0 }}
            />
          </span>
          <span className="text-right tabular-nums text-muted-foreground">{fmtInt.format(r.count)}</span>
        </li>
      ))}
    </ul>
  );
}

function DailyColumns({ days }: { days: DashboardData["daily"] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div>
      <div className="flex h-32 items-end gap-[2px] border-b border-border" role="img" aria-label="Leads por dia, últimos 30 dias">
        {days.map((d) => (
          <div key={d.day} className="group relative flex h-full flex-1 items-end" title={`${fmtDay.format(new Date(d.day))}: ${d.count} leads`}>
            <div
              className="w-full rounded-t-[4px] bg-accent group-hover:bg-accent-dark"
              style={{ height: d.count ? `max(2px, ${(d.count / max) * 100}%)` : 0 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{fmtDay.format(new Date(days[0].day))}</span>
        <span>máx. {max}/dia</span>
        <span>{fmtDay.format(new Date(days[days.length - 1].day))}</span>
      </div>
    </div>
  );
}

function Delivery({ lead }: { lead: LeadRow }) {
  if (lead.whatsapp_sent === null) return <span className="text-muted-foreground">—</span>;
  return lead.whatsapp_sent ? (
    <span className="text-emerald-700">✓ enviado</span>
  ) : lead.whatsapp ? (
    <span className="text-red-700">✕ falhou</span>
  ) : (
    <span className="text-muted-foreground">sem nº</span>
  );
}

function LeadsTable({ rows }: { rows: LeadRow[] }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">Nenhum lead nos últimos 30 dias.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-muted-foreground">
          <tr className="border-b border-border">
            <th className="py-2 pr-3 font-medium">Quando</th>
            <th className="py-2 pr-3 font-medium">Origem</th>
            <th className="py-2 pr-3 font-medium">Nome / Clínica</th>
            <th className="py-2 pr-3 font-medium">Contato</th>
            <th className="py-2 pr-3 font-medium">Resultado</th>
            <th className="py-2 font-medium">WhatsApp</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={`${l.source}-${l.id}`} className="border-b border-border/60 align-top">
              <td className="whitespace-nowrap py-2 pr-3 tabular-nums text-muted-foreground">{fmtDateTime.format(new Date(l.created_at))}</td>
              <td className="py-2 pr-3">{SOURCE_LABELS[l.source] ?? l.source}</td>
              <td className="py-2 pr-3">
                <div className="text-foreground">{l.name}</div>
                <div className="text-muted-foreground">{[l.clinic_name, l.city].filter(Boolean).join(" · ")}</div>
              </td>
              <td className="py-2 pr-3">
                {l.whatsapp ? (
                  <a className="text-accent-dark underline-offset-2 hover:underline" href={`https://wa.me/${l.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                    {l.whatsapp}
                  </a>
                ) : null}
                {l.email && <div className="text-muted-foreground">{l.email}</div>}
              </td>
              <td className="py-2 pr-3 text-muted-foreground">{l.headline}</td>
              <td className="whitespace-nowrap py-2">
                <Delivery lead={l} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function PainelPage() {
  let data: DashboardData;
  try {
    data = await loadDashboard();
  } catch (err) {
    console.error("[painel] load failed:", err);
    return (
      <main className="mx-auto max-w-3xl p-8 font-body">
        <h1 className="text-2xl font-semibold">Painel indisponível</h1>
        <p className="mt-2 text-muted-foreground">
          Não foi possível ler o banco de dados. Verifique DATABASE_URL no Vercel e clique abaixo para criar as
          tabelas que faltam (ou rode <code>npm run db:migrate</code>).
        </p>
        <div className="mt-6">
          <UpdateDatabase />
        </div>
      </main>
    );
  }

  const trend = data.leadsPrev7d ? Math.round(((data.leads7d - data.leadsPrev7d) / data.leadsPrev7d) * 100) : null;

  return (
    <main className="min-h-screen bg-background font-body">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Painel LK Digital</h1>
            <p className="text-sm text-muted-foreground">Todas as origens de lead, entrega no WhatsApp e uso de IA — últimos 30 dias.</p>
          </div>
          <UpdateDatabase />
        </header>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Tile
            label="Leads (7 dias)"
            value={fmtInt.format(data.leads7d)}
            sub={trend === null ? "sem base na semana anterior" : `${trend >= 0 ? "▲" : "▼"} ${Math.abs(trend)}% vs. 7 dias antes`}
          />
          <Tile label="Leads (30 dias)" value={fmtInt.format(data.leads30d)} />
          <Tile
            label="Relatório entregue no WhatsApp"
            value={data.whatsappRate === null ? "—" : `${Math.round(data.whatsappRate * 100)}%`}
            sub={`${data.whatsappAttempted} envios pelas ferramentas`}
          />
          <Tile
            label="Chamadas de IA (30 dias)"
            value={fmtInt.format(data.ai.calls)}
            sub={`≈ US$ ${data.ai.costUsd.toFixed(2)}${data.ai.costIncomplete ? "+ (modelos sem preço)" : ""}${data.ai.failed ? ` · ${data.ai.failed} falharam` : ""}`}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Leads por origem" note="Últimos 30 dias. Origens sem leads aparecem zeradas.">
            <SourceBars rows={data.bySource} />
          </Section>
          <Section title="Leads por dia" note="Todas as origens somadas. Passe o mouse para ver o dia.">
            <DailyColumns days={data.daily} />
          </Section>
        </div>

        {data.whatsappFailed.length > 0 && (
          <Section title="⚠ Relatórios que não chegaram no WhatsApp" note="Esses leads não receberam a mensagem — vale um contato manual.">
            <LeadsTable rows={data.whatsappFailed} />
          </Section>
        )}

        <Section title="Leads recentes">
          <LeadsTable rows={data.recent} />
        </Section>

        <Section title="Uso de IA por modelo" note="Custo estimado com base na tabela de preços em src/lib/backbone/models.ts.">
          {data.ai.byModel.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-2 pr-3 font-medium">Modelo</th>
                    <th className="py-2 pr-3 text-right font-medium">Chamadas</th>
                    <th className="py-2 pr-3 text-right font-medium">Tokens entrada</th>
                    <th className="py-2 pr-3 text-right font-medium">Tokens saída</th>
                    <th className="py-2 pr-3 text-right font-medium">Latência média</th>
                    <th className="py-2 text-right font-medium">Custo (US$)</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {data.ai.byModel.map((m) => (
                    <tr key={m.model} className="border-b border-border/60">
                      <td className="py-2 pr-3 font-mono text-xs">{m.model}</td>
                      <td className="py-2 pr-3 text-right">{fmtInt.format(m.calls)}</td>
                      <td className="py-2 pr-3 text-right">{fmtInt.format(m.inputTokens)}</td>
                      <td className="py-2 pr-3 text-right">{fmtInt.format(m.outputTokens)}</td>
                      <td className="py-2 pr-3 text-right">{(m.avgLatencyMs / 1000).toFixed(1)} s</td>
                      <td className="py-2 text-right" title={m.priced ? undefined : "Sem preço em MODEL_PRICING (src/lib/backbone/models.ts)"}>
                        {m.priced ? m.costUsd.toFixed(2) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma chamada registrada ainda.</p>
          )}
        </Section>
      </div>
    </main>
  );
}
