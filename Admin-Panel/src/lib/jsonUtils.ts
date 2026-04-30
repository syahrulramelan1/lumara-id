/** Normalize a JSON field that may arrive as string OR parsed array (production Prisma Json type) */
export function parseJsonArr(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (!raw || typeof raw !== "string") return [];
  try { const a = JSON.parse(raw); return Array.isArray(a) ? a.map(String) : []; }
  catch { return []; }
}

export function parseJsonArrToString(raw: unknown): string {
  return parseJsonArr(raw).join(", ");
}

export function firstImage(raw: unknown): string {
  return parseJsonArr(raw)[0] ?? "";
}
