// lib/backbone/phone.ts
// Brazilian phone normalization shared by every lead source.

/** Normalize to digits with the 55 country code, e.g. "(11) 94685-1028" → "5511946851028". */
export function normalizeBrPhone(raw: string): string {
  let digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  if (digits.length === 10 || digits.length === 11) return "55" + digits;
  return digits;
}

/** A normalized BR number is 55 + 2-digit DDD + 8/9-digit subscriber = 12 or 13 digits. */
export function isValidBrPhone(normalized: string): boolean {
  return /^55\d{10,11}$/.test(normalized);
}
