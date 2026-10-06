// Registry of every tool plugged into the backbone. Adding a tool = one adapter + one line here.
import type { ToolAdapter } from "../types";
import { auditoriaSite } from "./auditoria-site";
import { calculadoraAgenda } from "./calculadora-agenda";
import { calculadoraPrecificacao } from "./calculadora-precificacao";
import { diagnosticoClinica } from "./diagnostico-clinica";
import { raioX } from "./raio-x";
import { diagnosticoGoogle } from "./diagnostico-google";
import { simuladorConvenios } from "./simulador-convenios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TOOL_ADAPTERS: Record<string, ToolAdapter<any>> = Object.fromEntries(
  [raioX, auditoriaSite, diagnosticoGoogle, simuladorConvenios, calculadoraPrecificacao, diagnosticoClinica, calculadoraAgenda].map(
    (a) => [a.id, a]
  )
);
