import { describe, expect, it } from 'vitest';

import { calculateMatrix } from '../../domain/matrix';
import type { CalendarDate, PointId } from '../../domain/matrix';
import { describePoint, getSymbolicCode, POINT_META, POINTS } from './presentation';

const today: CalendarDate = { year: 2026, month: 10, day: 28 };
const example = calculateMatrix({ year: 1991, month: 7, day: 15 }, today);

describe('calculator presentation', () => {
  it('maps every domain point to one unique matrix position', () => {
    const ids = POINTS.map(({ id }) => id);
    const positions = POINTS.map(({ position }) => position);
    expect(ids).toEqual(['AB', 'B', 'BC', 'A', 'E', 'C', 'DA', 'D', 'CD']);
    expect(new Set(ids).size).toBe(9);
    expect(new Set(positions).size).toBe(9);
    expect(Object.keys(POINT_META)).toHaveLength(9);
  });

  it('formats the independently verified D trace without recomputing partial sums', () => {
    expect(describePoint(example.points.D)).toEqual({
      source: 'A: 15 · B: 7 · C: 20',
      formula: 'D = сократить A + B + C до диапазона 1–22',
      substitution: '15 + 7 + 20 = 42',
      steps: ['Сокращение: 4 + 2 = 6'],
      result: 'D = 6',
    });
  });

  it('shows the year digit sum and later reduction as separate C steps', () => {
    const { C } = calculateMatrix({ year: 1995, month: 5, day: 6 }, today).points;
    expect(describePoint(C)).toMatchObject({
      source: 'год: 1995',
      substitution: 'C = сократить(1 + 9 + 9 + 5)',
      steps: ['Сумма цифр года: 1 + 9 + 9 + 5 = 24', 'Сокращение: 2 + 4 = 6'],
      result: 'C = 6',
    });
  });

  it('does not present an unreduced day as equal to point A', () => {
    const { A } = calculateMatrix({ year: 1991, month: 7, day: 29 }, today).points;
    expect(describePoint(A)).toMatchObject({
      substitution: 'A = сократить(29)',
      steps: ['Сокращение: 2 + 9 = 11'],
      result: 'A = 11',
    });
  });

  it('keeps 22 and explains that no further reduction is needed', () => {
    expect(describePoint(example.points.AB)).toMatchObject({
      substitution: '15 + 7 = 22',
      steps: ['22 уже находится в диапазоне 1–22.'],
      result: 'AB = 22',
    });
  });

  it('can present every returned point and every supported symbolic code', () => {
    const ids = Object.keys(example.points) as PointId[];
    for (const id of ids) {
      expect(describePoint(example.points[id]).result).toBe(`${id} = ${example.points[id].value}`);
    }
    for (let value = 1; value <= 22; value++) {
      expect(getSymbolicCode(value).title).not.toHaveLength(0);
      expect(getSymbolicCode(value).reflection).toMatch(/\?$/);
    }
    expect(() => getSymbolicCode(0)).toThrow(RangeError);
    expect(() => getSymbolicCode(23)).toThrow(RangeError);
  });
});
