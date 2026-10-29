import { Registration, messages } from '../../domain/registration/controller';
import { DAY, formatSlot } from '../../domain/registration/schedule';

function element<T extends HTMLElement>(selector: string): T {
  const result = document.querySelector<T>(selector);
  if (!result) throw new Error('Demo interface is unavailable');
  return result;
}

export function initRegistration(): void {
  const r = new Registration({
    getItem: (key) => window.sessionStorage.getItem(key),
    setItem: (key, value) => window.sessionStorage.setItem(key, value),
    removeItem: (key) => window.sessionStorage.removeItem(key),
  }, () => Date.now());
  const root = element('[data-demo-root]');
  const heading = element('#demo-heading');
  const slots = element('[data-demo-slots]');
  const group = element<HTMLFieldSetElement>('#demo-slots');
  const live = element('[data-demo-live]');
  const error = element('#demo-error');
  const triggers = [...document.querySelectorAll<HTMLButtonElement>('[data-demo-open]')];
  let trigger: HTMLButtonElement | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let slotIds = '';
  const show = (selector: string, visible: boolean): void => { element(selector).hidden = !visible; };
  const focusHeading = (): void => { heading.focus(); };
  const button = (action: string): HTMLButtonElement => element(`[data-demo-action="${action}"]`);

  function render(): void {
    const editing = r.stage === 'editing';
    const confirmed = r.stage === 'confirmed';
    const cancelled = r.stage === 'cancelled';
    root.dataset.state = r.stage;
    root.classList.toggle('confirmation-surface', confirmed || cancelled);
    heading.textContent = confirmed ? 'Демозапись подтверждена' : editing ? 'Изменить время демозаписи'
      : cancelled ? 'Демозапись отменена' : r.stage === 'draft' ? 'Подготовьте демозапись' : 'Выберите демовремя открытого урока';
    show('[data-demo-preparation]', !confirmed && !cancelled);
    show('[data-demo-confirmed]', confirmed);
    show('[data-demo-cancelled]', cancelled);
    show('[data-booking-status]', !!r.booking);
    show('[data-memory-warning]', r.memoryOnly && !confirmed && !cancelled);
    element('[data-memory-warning]').textContent = r.notice === messages.cleanup ? messages.cleanup : messages.read;
    error.hidden = !r.error;
    error.textContent = r.error ? r.notice : '';
    group.setAttribute('aria-invalid', String(r.error === 'slots'));
    button('example').setAttribute('aria-invalid', String(r.error === 'example'));
    if (live.textContent !== r.notice) live.textContent = r.notice;
    show('[data-example-block]', !editing);
    show('[data-example-instruction]', !r.example);
    show('[data-prepared-values]', r.example);
    button('example').textContent = r.example ? 'Пример заполнен' : 'Заполнить пример';
    button('example').setAttribute('aria-pressed', String(r.example));
    button('confirm').textContent = editing ? 'Сохранить новое время' : 'Подтвердить демозапись';
    button('confirm').disabled = !r.ready;
    button('reset').hidden = r.stage !== 'draft';
    button('back').hidden = !editing;
    show('[data-draft-help]', !editing);
    element('#demo-completion').textContent = editing
      ? r.ready ? 'Новое время выбрано. Можно сохранить изменение.' : 'Выберите другое время или вернитесь без изменений.'
      : r.ready ? 'Время и пример выбраны. Можно подтвердить демозапись.'
        : r.example ? 'Осталось выбрать время открытого урока.'
          : r.selected ? 'Осталось нажать «Заполнить пример».' : 'Для подтверждения выберите время и заполните пример.';
    show('[data-editing-description]', editing);
    show('[data-current-slot]', editing);
    group.querySelector('legend')!.textContent = editing ? 'Новое время открытого урока' : 'Время открытого урока';
    const offered = r.slots();
    const ids = offered.map((s) => s.id).join('|');
    if (ids !== slotIds) {
      slots.replaceChildren(...offered.map((slot) => {
        const label = document.createElement('label'); label.className = 'demo-slot';
        const radio = document.createElement('input');
        radio.type = 'radio'; radio.name = 'demo-time'; radio.value = slot.id;
        radio.setAttribute('aria-describedby', 'demo-schedule demo-error');
        const text = document.createElement('span'); text.textContent = formatSlot(slot);
        const selected = document.createElement('small'); selected.textContent = 'Выбрано'; selected.hidden = true;
        text.append(selected); label.append(radio, text);
        return label;
      }));
      slotIds = ids;
    }
    slots.querySelectorAll<HTMLInputElement>('input').forEach((radio) => {
      radio.checked = radio.value === r.selected?.id;
      radio.closest('label')!.classList.toggle('slot-chosen', radio.checked);
      radio.closest('label')!.querySelector('small')!.hidden = !radio.checked;
    });
    show('[data-selected-time]', !!r.selected);
    element('[data-selected-time]').textContent = r.selected ? `Выбрано время: ${formatSlot(r.selected)}.` : '';
    if (r.booking) {
      const time = formatSlot({ id: r.booking.slotId, startIso: r.booking.slotStartIso });
      element('[data-confirmed-slot]').textContent = time;
      element('[data-current-slot]').textContent = `Сейчас выбрано: ${time}.`;
    }
    element('[data-storage-note]').textContent = r.memoryOnly ? messages.memory
      : 'Подтверждение восстановится после обновления этой вкладки, пока оно действительно. Оно удаляется при отмене, истечении 24 часов или наступлении выбранного времени. После закрытия вкладки не рассчитывайте на сохранение; браузер управляет завершением сессии. Имя и email в хранилище не записываются.';
    const cancelFailed = r.notice === messages.cancel;
    button('cancel').textContent = cancelFailed ? 'Повторить отмену' : 'Отменить демозапись';
    button('dismiss-error').hidden = !cancelFailed;
    clearTimeout(timer);
    if (r.booking) {
      const expires = Math.min(Date.parse(r.booking.createdAtIso) + DAY, Date.parse(r.booking.slotStartIso));
      timer = setTimeout(() => { r.refresh(); render(); }, Math.max(0, expires - Date.now()));
    }
  }

  triggers.forEach((t) => {
    t.disabled = false;
    t.addEventListener('click', () => {
      trigger = t; r.open(); root.hidden = false;
      triggers.forEach((other) => other.setAttribute('aria-expanded', 'true'));
      render(); focusHeading();
    });
  });
  slots.addEventListener('change', (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    r.select(event.target.value); render();
  });
  root.addEventListener('click', (event) => {
    const source = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-demo-action]') : null;
    if (!source) return;
    const action = source.dataset.demoAction;
    if (action === 'close') {
      r.close(); render(); root.hidden = true;
      triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
      (trigger?.isConnected ? trigger : triggers[0])?.focus(); return;
    }
    if (r.refresh()) { render(); focusHeading(); return; }
    if (action === 'example') r.fillExample();
    if (action === 'confirm') {
      const success = r.confirm(); render();
      if (success) focusHeading();
      else if (r.error === 'slots') group.focus();
      else if (r.error === 'example') button('example').focus();
      else if (r.stage === 'initial') focusHeading();
      return;
    }
    if (action === 'edit') { r.edit(); render(); group.focus(); return; }
    if (action === 'back' || action === 'dismiss-error') { r.returnToConfirmation(); render(); button('edit').focus(); return; }
    if (action === 'cancel') { const success = r.cancel(); render(); if (success) focusHeading(); return; }
    if (action === 'reset' || action === 'repeat') {
      r.resetDraft();
      r.notice = action === 'reset' ? 'Черновик сброшен. Можно выбрать время заново.' : 'Можно начать новую демозапись. Выберите время и заполните пример.';
      render(); focusHeading(); return;
    }
    render();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && r.refresh()) render();
  });
  render();
  element('[data-demo-fallback]').hidden = true;
  root.dataset.ready = 'true';
}
