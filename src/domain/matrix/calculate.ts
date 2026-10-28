import { validateBirthDate } from './calendar';
import { traceDigitSum, traceReduction22 } from './reduction';
import type { CalendarDate, MatrixCalculation, PointCalculation, PointId } from './types';

function calculatePoint(
  id: PointId,
  formula: string,
  operands: PointCalculation['operands'],
  sumYearDigits = false,
): PointCalculation {
  const rawSum = operands.reduce((sum, operand) => sum + operand.value, 0);
  const digitSum = sumYearDigits ? traceDigitSum(rawSum) : undefined;
  const reduction = traceReduction22(digitSum?.sum ?? rawSum);
  return {
    id, formula, operands, rawSum,
    ...(digitSum ? { digitSum } : {}),
    reduction, value: reduction.result,
  };
}

/** Pure version-1 arithmetic; no interpretation, clock, storage, or network. */
export function calculateMatrix(date: CalendarDate, today: CalendarDate): MatrixCalculation {
  const validation = validateBirthDate(date, today);
  if (!validation.valid) throw new RangeError(validation.message);

  const A = calculatePoint('A', 'reduce22(day)', [{ source: 'day', value: date.day }]);
  const B = calculatePoint('B', 'month', [{ source: 'month', value: date.month }]);
  const C = calculatePoint('C', 'reduce22(sumDigits(year))', [{ source: 'year', value: date.year }], true);
  const baseOperands = [A, B, C].map(({ id, value }) => ({ source: id, value }));
  const D = calculatePoint('D', 'reduce22(A + B + C)', baseOperands);
  const E = calculatePoint('E', 'reduce22(A + B + C + D)', [...baseOperands, { source: 'D', value: D.value }]);

  const diagonal = (id: PointId, first: PointCalculation, second: PointCalculation) =>
    calculatePoint(id, `reduce22(${first.id} + ${second.id})`, [
      { source: first.id, value: first.value },
      { source: second.id, value: second.value },
    ]);

  return {
    method: 'demo-22-codes', version: 1,
    points: {
      A, B, C, D, E,
      AB: diagonal('AB', A, B), BC: diagonal('BC', B, C),
      CD: diagonal('CD', C, D), DA: diagonal('DA', D, A),
    },
  };
}
