import type { DigitSumStep, ReductionTrace } from './types';

function requirePositiveInteger(value: number): void {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new RangeError('Expected a positive safe integer.');
  }
}

export function traceDigitSum(input: number): DigitSumStep {
  requirePositiveInteger(input);
  const digits = String(input).split('').map(Number);
  return { input, digits, sum: digits.reduce((sum, digit) => sum + digit, 0) };
}

export function sumDigits(input: number): number {
  return traceDigitSum(input).sum;
}

export function traceReduction22(input: number): ReductionTrace {
  requirePositiveInteger(input);
  const steps: DigitSumStep[] = [];
  let result = input;
  while (result > 22) {
    const step = traceDigitSum(result);
    steps.push(step);
    result = step.sum;
  }
  return { input, steps, result };
}

export function reduce22(input: number): number {
  return traceReduction22(input).result;
}
