/** A Gregorian calendar date, without a time, offset, or machine clock. */
export interface CalendarDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export type DateValidationCode = 'invalid-date' | 'before-minimum' | 'future-date';

export type DateValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly code: DateValidationCode; readonly message: string };

export interface DigitSumStep {
  readonly input: number;
  readonly digits: readonly number[];
  readonly sum: number;
}

export interface ReductionTrace {
  readonly input: number;
  readonly steps: readonly DigitSumStep[];
  readonly result: number;
}

export type PointId = 'A' | 'B' | 'C' | 'D' | 'E' | 'AB' | 'BC' | 'CD' | 'DA';

export interface PointCalculation {
  readonly id: PointId;
  readonly formula: string;
  readonly operands: readonly {
    readonly source: 'day' | 'month' | 'year' | PointId;
    readonly value: number;
  }[];
  /** Sum of the original operands, before any digit sum or reduction. */
  readonly rawSum: number;
  /** C first sums the year digits, even when the year digit sum is <= 22. */
  readonly digitSum?: DigitSumStep;
  readonly reduction: ReductionTrace;
  readonly value: number;
}

export interface MatrixCalculation {
  readonly method: 'demo-22-codes';
  readonly version: 1;
  readonly points: Readonly<Record<PointId, PointCalculation>>;
}
