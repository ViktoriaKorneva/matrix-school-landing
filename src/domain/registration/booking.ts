import { DAY, isScheduled, slotAt } from './schedule';

export const STORAGE_KEY = 'kontur22.demo.v1';
export interface Booking {
  readonly schemaVersion: 1;
  readonly status: 'confirmed';
  readonly slotId: string;
  readonly slotStartIso: string;
  readonly createdAtIso: string;
}
export type Validation = { valid: true; booking: Booking } | { valid: false; reason: 'invalid' | 'expired' };

function canonicalIso(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

/** Stored values are untrusted. Reject extra fields rather than rendering any of them. */
export function validateBooking(value: unknown, now: number): Validation {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, reason: 'invalid' };
  const b = value as Record<string, unknown>;
  const keys = ['schemaVersion', 'status', 'slotId', 'slotStartIso', 'createdAtIso'];
  if (Object.keys(b).length !== keys.length || !keys.every((key) => Object.hasOwn(b, key)) ||
    b.schemaVersion !== 1 || b.status !== 'confirmed' ||
    !canonicalIso(b.slotStartIso) || !canonicalIso(b.createdAtIso)) return { valid: false, reason: 'invalid' };
  const start = Date.parse(b.slotStartIso);
  const created = Date.parse(b.createdAtIso);
  if (b.slotId !== slotAt(start).id || !isScheduled(start) || created > now || start - created < DAY) {
    return { valid: false, reason: 'invalid' };
  }
  if (now - created >= DAY || start <= now) return { valid: false, reason: 'expired' };
  // Do not compare an existing confirmation to the newly offered nearest-three list.
  return { valid: true, booking: b as unknown as Booking };
}
