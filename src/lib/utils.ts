/**
 * Generate a unique ID with an optional prefix.
 * Uses crypto.randomUUID() for stable, non-time-based IDs.
 * Safe to call anywhere — during render or in event handlers.
 */
export function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

/**
 * Get today's date as ISO string (YYYY-MM-DD).
 */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Add days to an ISO date string, returns new ISO date string.
 */
export function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
