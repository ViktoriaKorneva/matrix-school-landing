import type { CalendarDate, DateValidationResult } from './types';

export function isLeapYear(year: number): boolean {
  return Number.isSafeInteger(year) && year >= 1 &&
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function isCalendarDate(date: CalendarDate): boolean {
  const { year, month, day } = date;
  if (!Number.isSafeInteger(year) || year < 1 ||
    !Number.isInteger(month) || month < 1 || month > 12 ||
    !Number.isInteger(day) || day < 1) return false;

  const days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1]!;
}

function compareDates(left: CalendarDate, right: CalendarDate): number {
  return left.year - right.year || left.month - right.month || left.day - right.day;
}

/** The caller supplies the visitor's current local calendar date explicitly. */
export function validateBirthDate(date: CalendarDate, today: CalendarDate): DateValidationResult {
  if (!isCalendarDate(today) || today.year < 1900) {
    throw new RangeError('Today must be a valid calendar date on or after 1900-01-01.');
  }
  if (!isCalendarDate(date)) {
    return { valid: false, code: 'invalid-date', message: 'Укажи существующую календарную дату.' };
  }
  if (date.year < 1900) {
    return { valid: false, code: 'before-minimum', message: 'Укажи дату не раньше 1 января 1900 года.' };
  }
  if (compareDates(date, today) > 0) {
    return { valid: false, code: 'future-date', message: 'Дата рождения не может быть позже сегодняшнего дня.' };
  }
  return { valid: true };
}
