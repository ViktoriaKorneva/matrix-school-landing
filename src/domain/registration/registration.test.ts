import { describe, expect, it } from 'vitest';
import { DAY, formatSlot, isScheduled, slotAt, upcomingSlots } from './schedule';
import { STORAGE_KEY, validateBooking, type Booking } from './booking';
import { messages, Registration, type StoragePort } from './controller';

const instant = (s: string): number => Date.parse(s);
const now = instant('2026-10-28T12:00:00+03:00');
function record(start = upcomingSlots(now)[0]!.startIso, created = now): Booking {
  return { schemaVersion: 1, status: 'confirmed', slotId: slotAt(instant(start)).id,
    slotStartIso: start, createdAtIso: new Date(created).toISOString() };
}
function fixture() {
  let time = now;
  let raw: string | null = null;
  const fail = { read: false, write: false, remove: false };
  const storage: StoragePort = {
    getItem: () => { if (fail.read) throw new Error(); return raw; },
    setItem: (_, value) => { if (fail.write) throw new Error(); raw = value; },
    removeItem: () => { if (fail.remove) throw new Error(); raw = null; },
  };
  return { storage, fail, setTime: (value: number) => { time = value; },
    get raw() { return raw; }, seed: (value: string) => { raw = value; },
    load: () => new Registration(storage, () => time) };
}
function prepare(r: Registration) { r.select(r.slots()[0]!.id); r.fillExample(); }

describe('Moscow calendar', () => {
  it('offers the independently calculated next three slots', () => {
    expect(upcomingSlots(now).map((s) => s.startIso)).toEqual([
      '2026-10-29T16:00:00.000Z', '2026-10-31T09:00:00.000Z', '2026-11-03T16:00:00.000Z',
    ]);
    expect(formatSlot(upcomingSlots(now)[0]!)).toBe('четверг, 29 октября 2026 г. в 19:00, время Москвы');
  });
  it('includes exactly 24 hours and excludes it one millisecond later', () => {
    const boundary = instant('2026-10-28T19:00:00+03:00');
    expect(upcomingSlots(boundary)[0]!.startIso).toBe('2026-10-29T16:00:00.000Z');
    expect(upcomingSlots(boundary + 1)[0]!.startIso).toBe('2026-10-31T09:00:00.000Z');
  });
  it('crosses Moscow midnight and the year boundary independent of the host zone', () => {
    for (const zone of ['UTC', 'Pacific/Honolulu', 'Asia/Tokyo']) {
      const previous = process.env.TZ;
      try {
        process.env.TZ = zone;
        expect(upcomingSlots(instant('2026-12-30T21:30:00Z')).map((s) => s.startIso)).toEqual([
          '2027-01-02T09:00:00.000Z', '2027-01-05T16:00:00.000Z', '2027-01-07T16:00:00.000Z',
        ]);
      } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous; }
    }
  });
  it('rejects seconds, unscheduled days, and wrong Moscow hours', () => {
    expect(isScheduled(instant('2026-10-29T19:00:00+03:00'))).toBe(true);
    for (const s of ['2026-10-29T19:00:01+03:00', '2026-10-29T12:00:00+03:00', '2026-10-30T19:00:00+03:00']) {
      expect(isScheduled(instant(s))).toBe(false);
    }
  });
});

describe('untrusted confirmation validation', () => {
  it('preserves a future slot less than 24 hours away', () => {
    const created = instant('2026-10-28T18:00:00+03:00');
    const current = instant('2026-10-29T10:00:00+03:00');
    expect(validateBooking(record(undefined, created), current).valid).toBe(true);
  });
  it('preserves a future scheduled slot outside the nearest three', () => {
    expect(validateBooking(record('2026-11-14T09:00:00.000Z'), now).valid).toBe(true);
  });
  it('expires at 24 hours exactly and at slot start exactly', () => {
    const b = record();
    expect(validateBooking(b, now + DAY - 1).valid).toBe(true);
    expect(validateBooking(b, now + DAY)).toEqual({ valid: false, reason: 'expired' });
    const atStart = instant(b.slotStartIso);
    // A backward clock/record manipulation can put the slot inside the age window.
    expect(validateBooking({ ...b, createdAtIso: new Date(atStart - DAY).toISOString() }, atStart))
      .toEqual({ valid: false, reason: 'expired' });
  });
  it.each([
    null, [], {}, { ...record(), schemaVersion: 2 }, { ...record(), status: 'cancelled' },
    { ...record(), slotId: 'invalid' }, { ...record(), slotStartIso: '2026-02-30T16:00:00.000Z' },
    { ...record(), createdAtIso: new Date(now + 1).toISOString() }, { ...record(), email: 'student@example.com' },
    record('2026-10-30T16:00:00.000Z'),
  ])('rejects malformed, incompatible or impossible record %#', (value) => {
    expect(validateBooking(value, now).valid).toBe(false);
  });
});

describe('state machine and individual storage failures', () => {
  it('guards incomplete drafts, supports either preparation order and never persists drafts', () => {
    const f = fixture(); const r = f.load();
    expect(r.confirm()).toBe(false); expect(r.error).toBe('slots');
    r.select(r.slots()[0]!.id);
    expect(r.confirm()).toBe(false); expect(r.error).toBe('example'); expect(f.raw).toBeNull();
    expect(f.load().stage).toBe('initial');
    r.resetDraft(); r.fillExample(); expect(r.ready).toBe(false);
    r.select(r.slots()[0]!.id); expect(r.ready).toBe(true);
    expect(r.confirm()).toBe(true);
    expect(Object.keys(JSON.parse(f.raw!))).toEqual(['schemaVersion', 'status', 'slotId', 'slotStartIso', 'createdAtIso']);
    expect(f.raw).not.toMatch(/Марина|email|student|1991/);
    expect(f.load().stage).toBe('confirmed');
    expect(STORAGE_KEY).toBe('kontur22.demo.v1');
  });
  it('does not extend creation on replacement and restores the old slot while editing', () => {
    const f = fixture(); const r = f.load(); prepare(r); r.confirm();
    const original = r.booking;
    f.setTime(now + 1000); r.edit(); r.select(r.slots()[1]!.id);
    expect(f.load().booking).toEqual(original);
    expect(r.confirm()).toBe(true); expect(r.booking?.createdAtIso).toBe(original?.createdAtIso);
    r.open(); expect(r.stage).toBe('confirmed');
    r.edit(); r.select(r.slots()[0]!.id); r.close(); expect(r.booking).not.toEqual(original);
    expect(r.stage).toBe('confirmed');
  });
  it('rejects stale selection, keeps the prepared example and regenerates slots', () => {
    const f = fixture(); const r = f.load(); prepare(r);
    f.setTime(instant('2026-10-28T19:00:00.001+03:00'));
    expect(r.confirm()).toBe(false); expect(r.selected).toBeNull();
    expect(r.example).toBe(true); expect(r.notice).toBe(messages.stale);
    expect(r.slots()[0]!.startIso).toBe('2026-10-31T09:00:00.000Z');
  });
  it('preserves old saved confirmation on failed replacement; retry replaces one record', () => {
    const f = fixture(); const r = f.load(); prepare(r); r.confirm();
    const old = f.raw; const oldBooking = r.booking;
    r.edit(); r.select(r.slots()[1]!.id); f.fail.write = true;
    expect(r.confirm()).toBe(false); expect(r.stage).toBe('editing');
    expect(f.raw).toBe(old); expect(r.booking).toEqual(oldBooking); expect(r.notice).toBe(messages.replace);
    f.fail.write = false; expect(r.confirm()).toBe(true); expect(f.raw).not.toBe(old);
  });
  it('never announces cancellation until removal succeeds', () => {
    const f = fixture(); const r = f.load(); prepare(r); r.confirm();
    const old = f.raw; f.fail.remove = true;
    expect(r.cancel()).toBe(false); expect(r.stage).toBe('confirmed'); expect(f.raw).toBe(old);
    expect(r.notice).toBe(messages.cancel);
    f.fail.remove = false; expect(r.cancel()).toBe(true); expect(r.stage).toBe('cancelled');
    expect(f.raw).toBeNull(); expect(f.load().stage).toBe('initial');
    r.open(); expect(r.example).toBe(false); expect(r.selected).toBeNull();
  });
  it.each(['read', 'write'] as const)('supports honest memory-only confirmation after %s failure', (failure) => {
    const f = fixture(); f.fail[failure] = true; const r = f.load();
    prepare(r); expect(r.confirm()).toBe(true); expect(r.memoryOnly).toBe(true);
    expect(r.notice).toBe(messages.memory); expect(f.raw).toBeNull();
    r.edit(); r.select(r.slots()[1]!.id); expect(r.confirm()).toBe(true);
    expect(r.cancel()).toBe(true); expect(f.load().booking).toBeNull();
  });
  it.each(['{broken', JSON.stringify({ ...record(), schemaVersion: 99 }), JSON.stringify(record(undefined, now - DAY))])(
    'cleans invalid/expired records without using their raw content', (raw) => {
      const f = fixture(); f.seed(raw); const r = f.load();
      expect(r.booking).toBeNull(); expect(f.raw).toBeNull(); expect(r.notice).not.toContain(raw);
    },
  );
  it('rejects invalid records even if cleanup fails and never promises removal or recovery', () => {
    const f = fixture(); f.seed('{broken'); f.fail.remove = true; const r = f.load();
    expect(r.booking).toBeNull(); expect(r.notice).toBe(messages.cleanup); expect(f.raw).toBe('{broken');
    prepare(r); r.confirm(); expect(r.notice).toBe(messages.memory); expect(f.raw).toBe('{broken');
    expect(f.load().booking).toBeNull();
  });
  it('expires the old confirmation during editing before accepting a replacement', () => {
    const f = fixture(); const r = f.load(); prepare(r); r.confirm(); r.edit();
    r.select(r.slots()[1]!.id); f.setTime(now + DAY);
    expect(r.confirm()).toBe(false); expect(r.stage).toBe('initial'); expect(f.raw).toBeNull();
  });
});
