// Types for render.mjs (plain ESM, shared with the offline generator in lead-magnets/).
export function allScripts(c: unknown): Array<{ texto: string; titulo?: string; secao: string; audio?: boolean; grupo?: string }>;
export function booklet(c: unknown, cfg: Record<string, unknown>): string;
export function cola(c: unknown): string;
export function markdown(c: unknown): string;
export function landing(c: unknown): string;
