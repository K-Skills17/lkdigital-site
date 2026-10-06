// Types for render.mjs (plain ESM, shared with the offline PDF generator in lead-magnets/).
export function itemCount(c: { secoes: Array<{ itens: unknown[] }> }): number;
export function interactive(c: unknown, cfg: Record<string, unknown>): string;
export function print(c: unknown, cfg: Record<string, unknown>): string;
