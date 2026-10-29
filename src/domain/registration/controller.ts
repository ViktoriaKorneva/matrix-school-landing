import { STORAGE_KEY, validateBooking, type Booking } from './booking';
import { upcomingSlots, type Slot } from './schedule';

export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export type Stage = 'initial' | 'draft' | 'confirmed' | 'editing' | 'cancelled';
export type ErrorTarget = 'slots' | 'example' | 'storage' | null;
export const messages = {
  read: 'Браузер не разрешает сохранить демозапись в этой вкладке. Можно пройти демонстрацию, но после обновления выбор не восстановится.',
  memory: 'Демозапись подтверждена только на открытой странице. Браузер не разрешил сохранить её для обновления. Если обновить страницу, демонстрацию нужно начать заново. Ничего не отправлено, письмо не придёт.',
  restored: 'Демозапись восстановлена в этой вкладке. Ничего не отправлено, письмо не придёт.',
  expired: 'Срок демозаписи закончился. Локальное подтверждение удалено. Вы можете выбрать новое время; настоящей заявки не было.',
  invalid: 'Демоданные сброшены: сохранённое состояние устарело или повреждено. Настоящей заявки не было. Выберите время и заполните пример заново.',
  cleanup: 'Сохранённое подтверждение недействительно, но браузер не позволил удалить его. Оно не используется. Можно продолжить демонстрацию на этой странице без обещания восстановления после обновления.',
  replace: 'Новое время не удалось сохранить в этой вкладке. Пока действует прежняя демозапись. Попробуйте ещё раз или вернитесь без изменений.',
  cancel: 'Не удалось удалить локальное подтверждение. Демозапись пока не отменена. Попробуйте ещё раз или закройте эту вкладку.',
  stale: 'Выбранное демовремя устарело. Выберите другое из обновлённого списка.',
};

/** Browser-independent state machine; the clock and each storage operation are injectable. */
export class Registration {
  stage: Stage = 'initial';
  booking: Booking | null = null;
  selected: Slot | null = null;
  example = false;
  persisted = false;
  memoryOnly = false;
  notice = '';
  error: ErrorTarget = null;

  constructor(private readonly storage: StoragePort, private readonly now: () => number) {
    let raw: string | null;
    try { raw = storage.getItem(STORAGE_KEY); }
    catch { this.memoryOnly = true; this.notice = messages.read; return; }
    if (raw === null) return;
    let value: unknown;
    try { value = JSON.parse(raw); } catch { value = null; }
    const result = validateBooking(value, now());
    if (result.valid) {
      this.booking = result.booking;
      this.persisted = true;
      this.stage = 'confirmed';
      this.notice = messages.restored;
    } else this.cleanup(result.reason);
  }

  slots(): Slot[] { return upcomingSlots(this.now()); }

  private cleanup(reason: 'expired' | 'invalid'): void {
    this.booking = null;
    this.persisted = false;
    this.resetDraft();
    try { this.storage.removeItem(STORAGE_KEY); this.notice = messages[reason]; }
    catch { this.memoryOnly = true; this.notice = messages.cleanup; }
  }

  /** Called at every action, on visibility return, and at the exact expiry boundary. */
  refresh(): boolean {
    if (!this.booking) return false;
    const result = validateBooking(this.booking, this.now());
    if (result.valid) return false;
    const wasEditing = this.stage === 'editing';
    if (this.persisted) this.cleanup(result.reason);
    else {
      this.booking = null;
      this.resetDraft();
      this.notice = 'Срок демозаписи закончился. Можно начать новую демонстрацию; настоящей заявки не было.';
    }
    if (wasEditing && this.notice !== messages.cleanup) {
      this.notice = 'Прежняя демозапись больше не действует. Начните новую демонстрацию.';
    }
    return true;
  }

  open(): void {
    this.refresh();
    if (this.booking) this.stage = 'confirmed';
    else this.resetDraft();
  }

  close(): void {
    this.refresh();
    if (this.booking) this.stage = 'confirmed';
    else if (this.stage !== 'cancelled') this.resetDraft();
    this.selected = null;
  }

  resetDraft(): void {
    this.stage = 'initial'; this.selected = null; this.example = false; this.error = null;
  }

  fillExample(): void {
    if (!['initial', 'draft'].includes(this.stage)) return;
    this.example = true; this.stage = 'draft'; this.error = null;
    this.notice = 'Пример заполнен. Используются вымышленные имя и email.';
  }

  select(id: string): void {
    if (this.refresh() || !['initial', 'draft', 'editing'].includes(this.stage)) return;
    this.selected = this.slots().find((s) => s.id === id) ?? null;
    if (this.stage !== 'editing') this.stage = 'draft';
    this.error = null; this.notice = '';
  }

  get ready(): boolean {
    return !!this.selected && (this.stage === 'editing'
      ? this.selected.id !== this.booking?.slotId : this.example);
  }

  confirm(): boolean {
    if (this.refresh() || !['initial', 'draft', 'editing'].includes(this.stage)) return false;
    if (!this.selected) {
      this.error = 'slots';
      this.notice = this.stage === 'editing' ? 'Выберите другое время или вернитесь без изменений.'
        : this.example ? 'Выберите время открытого урока.' : 'Выберите время и нажмите «Заполнить пример».';
      return false;
    }
    if (!this.slots().some((s) => s.id === this.selected?.id)) {
      this.selected = null; this.error = 'slots'; this.notice = messages.stale; return false;
    }
    if (this.stage !== 'editing' && !this.example) {
      this.error = 'example'; this.notice = 'Нажмите «Заполнить пример», чтобы продолжить на вымышленных данных.'; return false;
    }
    if (!this.ready) return false;
    const editing = this.stage === 'editing';
    const next: Booking = {
      schemaVersion: 1, status: 'confirmed', slotId: this.selected.id,
      slotStartIso: this.selected.startIso,
      createdAtIso: this.booking?.createdAtIso ?? new Date(this.now()).toISOString(),
    };
    if (!this.memoryOnly) {
      try { this.storage.setItem(STORAGE_KEY, JSON.stringify(next)); this.persisted = true; }
      catch {
        if (this.persisted) { this.error = 'storage'; this.notice = messages.replace; return false; }
        this.memoryOnly = true;
      }
    }
    this.booking = next; this.stage = 'confirmed'; this.selected = null; this.error = null;
    this.notice = this.memoryOnly ? messages.memory : editing
      ? 'Демовремя изменено. Активна одна демозапись.' : 'Демозапись подтверждена. Ничего не отправлено, письмо не придёт.';
    return true;
  }

  edit(): void {
    if (this.refresh() || !this.booking) return;
    this.stage = 'editing'; this.selected = null; this.error = null; this.notice = '';
  }

  returnToConfirmation(): void {
    if (this.refresh() || !this.booking) return;
    this.stage = 'confirmed'; this.selected = null; this.error = null; this.notice = '';
  }

  cancel(): boolean {
    if (this.refresh() || !this.booking) return false;
    if (this.persisted) {
      try { this.storage.removeItem(STORAGE_KEY); }
      catch { this.stage = 'confirmed'; this.error = 'storage'; this.notice = messages.cancel; return false; }
    }
    this.booking = null; this.persisted = false; this.selected = null; this.example = false;
    this.stage = 'cancelled'; this.error = null;
    this.notice = 'Демозапись отменена. Локальное подтверждение удалено. Активной демозаписи нет.';
    return true;
  }
}
