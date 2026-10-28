import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  calculateMatrix, isLeapYear, reduce22, sumDigits, traceReduction22, validateBirthDate,
} from './index';
import type { CalendarDate, PointId } from './index';

const today: CalendarDate = { year: 2026, month: 10, day: 28 };
const pointIds: readonly PointId[] = ['A', 'B', 'C', 'D', 'E', 'AB', 'BC', 'CD', 'DA'];

afterEach(() => vi.unstubAllGlobals());

describe('22-code reduction', () => {
  it('preserves every code from 1 through 22', () => {
    for (let code = 1; code <= 22; code++) {
      expect(reduce22(code)).toBe(code);
      expect(traceReduction22(code)).toEqual({ input: code, steps: [], result: code });
    }
  });

  it.each([[23, 5], [29, 11], [31, 4], [1999, 10]])('reduces %i to %i', (input, result) => {
    expect(reduce22(input)).toBe(result);
  });

  it('repeats digit sums and records every operand in 999 → 27 → 9', () => {
    expect(traceReduction22(999)).toEqual({
      input: 999,
      steps: [
        { input: 999, digits: [9, 9, 9], sum: 27 },
        { input: 27, digits: [2, 7], sum: 9 },
      ],
      result: 9,
    });
    expect(sumDigits(1991)).toBe(20);
    // 9007199254740991 → 76 → 13.
    expect(reduce22(Number.MAX_SAFE_INTEGER)).toBe(13);
  });

  it.each([0, -1, 1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1])(
    'rejects unsupported input %s rather than returning a misleading code', (input) => {
      expect(() => reduce22(input)).toThrow(RangeError);
      expect(() => sumDigits(input)).toThrow(RangeError);
    },
  );
});

describe('calendar validation', () => {
  it('uses Gregorian leap-year rules, including century exceptions', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2100)).toBe(false);
    expect(validateBirthDate({ year: 2000, month: 2, day: 29 }, today)).toEqual({ valid: true });
    expect(validateBirthDate({ year: 1900, month: 2, day: 29 }, today)).toMatchObject({
      valid: false, code: 'invalid-date',
    });
  });

  it.each([
    { year: 2025, month: 2, day: 29 }, { year: 2000, month: 4, day: 31 },
    { year: 2000, month: 1, day: 0 }, { year: 2000, month: 1, day: 32 },
    { year: 2000, month: 0, day: 1 }, { year: 2000, month: 13, day: 1 },
    { year: 2000, month: 1.5, day: 1 }, { year: 2000, month: 1, day: 1.5 },
    { year: 2000.5, month: 1, day: 1 }, { year: NaN, month: 1, day: 1 },
    { year: 2000, month: Infinity, day: 1 }, { year: 2000, month: 1, day: NaN },
  ])('rejects impossible calendar components: %o', (date) => {
    expect(validateBirthDate(date, today)).toMatchObject({ valid: false, code: 'invalid-date' });
    expect(() => calculateMatrix(date, today)).toThrow(RangeError);
  });

  it('accepts both inclusive boundaries and rejects earlier or future dates', () => {
    expect(validateBirthDate({ year: 1900, month: 1, day: 1 }, today)).toEqual({ valid: true });
    expect(validateBirthDate(today, today)).toEqual({ valid: true });
    expect(() => calculateMatrix(today, today)).not.toThrow();
    expect(validateBirthDate({ year: 1899, month: 12, day: 31 }, today)).toMatchObject({
      valid: false, code: 'before-minimum',
    });
    for (const future of [
      { year: 2026, month: 10, day: 29 }, { year: 2026, month: 11, day: 1 },
      { year: 2027, month: 1, day: 1 },
    ]) {
      expect(validateBirthDate(future, today)).toMatchObject({ valid: false, code: 'future-date' });
      expect(() => calculateMatrix(future, today)).toThrow(RangeError);
    }
  });

  it('requires a valid controlled today instead of silently falling back to the machine clock', () => {
    expect(() => validateBirthDate(today, { year: 2026, month: 2, day: 30 })).toThrow(RangeError);
    expect(() => validateBirthDate(today, { year: 1899, month: 12, day: 31 })).toThrow(RangeError);
  });
});

describe('version-1 calculation', () => {
  // Research distinguishes externally published A–E from independently derived diagonals.
  it.each([
    { date: { year: 1991, month: 7, day: 15 }, expected: [15, 7, 20, 6, 12, 22, 9, 8, 21] },
    { date: { year: 1995, month: 5, day: 6 }, expected: [6, 5, 6, 17, 7, 11, 11, 5, 5] },
    { date: { year: 2000, month: 2, day: 29 }, expected: [11, 2, 2, 15, 3, 13, 4, 17, 8] },
    { date: { year: 1999, month: 12, day: 31 }, expected: [4, 12, 10, 8, 7, 16, 22, 18, 12] },
    { date: { year: 2000, month: 1, day: 22 }, expected: [22, 1, 2, 7, 5, 5, 3, 9, 11] },
  ])('matches all nine research values for $date', ({ date, expected }) => {
    const result = calculateMatrix(date, today);
    expect(result.method).toBe('demo-22-codes');
    expect(result.version).toBe(1);
    expect(Object.keys(result.points)).toEqual(pointIds);
    expect(pointIds.map((id) => result.points[id].value)).toEqual(expected);
  });

  it('retains raw year operands, the initial digit sum, and every subsequent reduction', () => {
    const { C } = calculateMatrix({ year: 1995, month: 5, day: 6 }, today).points;
    expect(C).toEqual({
      id: 'C', formula: 'reduce22(sumDigits(year))', operands: [{ source: 'year', value: 1995 }],
      rawSum: 1995,
      digitSum: { input: 1995, digits: [1, 9, 9, 5], sum: 24 },
      reduction: { input: 24, steps: [{ input: 24, digits: [2, 4], sum: 6 }], result: 6 },
      value: 6,
    });
  });

  it('reduces only complete named sums and exposes the exact base/diagonal arithmetic', () => {
    const { A, B, C, D, E, AB, BC, CD, DA } = calculateMatrix({ year: 1991, month: 7, day: 15 }, today).points;
    expect(A.operands).toEqual([{ source: 'day', value: 15 }]);
    expect(B.operands).toEqual([{ source: 'month', value: 7 }]);
    expect(C.digitSum).toEqual({ input: 1991, digits: [1, 9, 9, 1], sum: 20 });
    expect(D.operands).toEqual([
      { source: 'A', value: 15 }, { source: 'B', value: 7 }, { source: 'C', value: 20 },
    ]);
    expect(D.rawSum).toBe(42);
    expect(D.reduction).toEqual({ input: 42, steps: [{ input: 42, digits: [4, 2], sum: 6 }], result: 6 });
    expect(E.operands).toEqual([...D.operands, { source: 'D', value: 6 }]);
    expect(E.rawSum).toBe(48);
    expect(E.reduction).toEqual({ input: 48, steps: [{ input: 48, digits: [4, 8], sum: 12 }], result: 12 });
    expect(AB.rawSum).toBe(22);
    expect(AB.reduction.steps).toEqual([]);
    expect([BC.rawSum, CD.rawSum, DA.rawSum]).toEqual([27, 26, 21]);
    expect(BC.operands).toEqual([{ source: 'B', value: 7 }, { source: 'C', value: 20 }]);
  });

  it('does not reduce A + B before adding C when calculating D', () => {
    const { D, E } = calculateMatrix({ year: 1995, month: 7, day: 22 }, today).points;
    // Full sum: 22 + 7 + 6 = 35 → 8. Prematurely reducing 29 would yield 17.
    expect(D.rawSum).toBe(35);
    expect(D.value).toBe(8);
    expect(E.rawSum).toBe(43);
    expect(E.value).toBe(7);
  });

  it('does not read Date or any timezone when calculating calendar components', () => {
    const date = Object.freeze({ year: 2000, month: 2, day: 29 });
    const controlledToday = Object.freeze({ ...today });
    const expected = calculateMatrix(date, controlledToday);
    vi.stubGlobal('Date', class {
      constructor() { throw new Error('The calendar domain must not read Date.'); }
      static now() { throw new Error('The calendar domain must not read the clock.'); }
    });
    expect(calculateMatrix(date, controlledToday)).toEqual(expected);
    expect(date).toEqual({ year: 2000, month: 2, day: 29 });
  });
});
