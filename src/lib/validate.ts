// Tiny dependency-free validation helpers shared by the API routes.

export function isNonEmptyString(v: unknown, max = 2000): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(v: unknown): v is string {
  return typeof v === "string" && EMAIL_RE.test(v.trim()) && v.length <= 320;
}

export function cleanString(v: unknown, max = 2000): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}
