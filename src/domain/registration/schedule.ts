export const DAY = 24 * 60 * 60 * 1000;
export const TIME_ZONE = 'Europe/Moscow';

const calendar = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});

function wallTime(time: number): number {
  const values = Object.fromEntries(calendar.formatToParts(time).map(({ type, value }) => [type, value]));
  return Date.UTC(+values.year!, +values.month! - 1, +values.day!, +values.hour!, +values.minute!, +values.second!);
}

export interface Slot { readonly id: string; readonly startIso: string }
export function slotAt(time: number): Slot {
  const startIso = new Date(time).toISOString();
  return { id: `moscow:${startIso}`, startIso };
}

/** Calendar arithmetic is in Moscow wall time, never the host's local zone. */
export function upcomingSlots(now: number): Slot[] {
  const wall = new Date(wallTime(now));
  const day = Date.UTC(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate());
  const slots: Slot[] = [];
  for (let offset = 0; slots.length < 3; offset++) {
    const date = new Date(day + offset * DAY);
    const weekday = date.getUTCDay();
    const hour = weekday === 2 || weekday === 4 ? 19 : weekday === 6 ? 12 : null;
    if (hour === null) continue;
    const target = date.getTime() + hour * 60 * 60 * 1000;
    const instant = target - (wallTime(target) - target);
    if (instant >= now + DAY) slots.push(slotAt(instant));
  }
  return slots;
}

export function isScheduled(time: number): boolean {
  if (!Number.isFinite(time)) return false;
  const wall = new Date(wallTime(time));
  return wall.getUTCMinutes() === 0 && wall.getUTCSeconds() === 0 && time % 1000 === 0 &&
    (([2, 4].includes(wall.getUTCDay()) && wall.getUTCHours() === 19) ||
      (wall.getUTCDay() === 6 && wall.getUTCHours() === 12));
}

const dateLabel = new Intl.DateTimeFormat('ru-RU', {
  timeZone: TIME_ZONE, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
});
const clockLabel = new Intl.DateTimeFormat('ru-RU', {
  timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
export function formatSlot(slot: Slot): string {
  const time = Date.parse(slot.startIso);
  return `${dateLabel.format(time)} в ${clockLabel.format(time)}, время Москвы`;
}
