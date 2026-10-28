import { calculateMatrix, validateBirthDate } from '../../domain/matrix';
import type { CalendarDate, MatrixCalculation, PointId } from '../../domain/matrix';
import { describePoint, getSymbolicCode, POINT_META } from './presentation';

const EXAMPLE_DATE: CalendarDate = { year: 1991, month: 7, day: 15 };

interface Fields {
  readonly day: HTMLInputElement;
  readonly month: HTMLInputElement;
  readonly year: HTMLInputElement;
}

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Calculator element not found: ${selector}`);
  return element;
}

function localToday(): CalendarDate {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

function parseFields(fields: Fields): CalendarDate | string {
  const raw = {
    day: fields.day.value.trim(),
    month: fields.month.value.trim(),
    year: fields.year.value.trim(),
  };
  if (!raw.day || !raw.month || !raw.year) return 'Заполни день, месяц и год.';
  if (!/^\d{1,2}$/.test(raw.day) || !/^\d{1,2}$/.test(raw.month) || !/^\d{4}$/.test(raw.year)) {
    return 'Используй цифры: две для дня и месяца, четыре для года.';
  }
  return { day: Number(raw.day), month: Number(raw.month), year: Number(raw.year) };
}

export function initCalculator(root: HTMLElement): void {
  const form = requireElement<HTMLFormElement>(root, '[data-calculator-form]');
  const fields: Fields = {
    day: requireElement(root, '[data-date-field="day"]'),
    month: requireElement(root, '[data-date-field="month"]'),
    year: requireElement(root, '[data-date-field="year"]'),
  };
  const fieldset = requireElement<HTMLFieldSetElement>(root, '[data-date-fieldset]');
  const error = requireElement<HTMLElement>(root, '[data-date-error]');
  const status = requireElement<HTMLElement>(root, '[data-calculator-status]');
  const resultTools = requireElement<HTMLElement>(root, '[data-result-tools]');
  const resultHeading = requireElement<HTMLElement>(root, '[data-result-heading]');
  const pointPrompt = requireElement<HTMLElement>(root, '[data-point-prompt]');
  const promptTitle = requireElement<HTMLElement>(pointPrompt, '[data-prompt-title]');
  const promptCopy = requireElement<HTMLElement>(pointPrompt, '[data-prompt-copy]');
  const detail = requireElement<HTMLElement>(root, '[data-point-detail]');
  const nodeButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-point-id]'));
  const exampleButton = requireElement<HTMLButtonElement>(root, '[data-use-example]');
  const changeButton = requireElement<HTMLButtonElement>(root, '[data-change-date]');
  const resetButton = requireElement<HTMLButtonElement>(root, '[data-reset]');
  const workspace = requireElement<HTMLElement>(root, '[data-workspace]');
  const matrixStage = requireElement<HTMLElement>(root, '[data-matrix-stage]');
  const traceCard = requireElement<HTMLElement>(root, '[data-trace-card]');
  const traceRoute = requireElement<SVGSVGElement>(root, '[data-trace-route]');
  const tracePath = requireElement<SVGPathElement>(traceRoute, '[data-trace-path]');
  const tracePathUnderlay = requireElement<SVGPathElement>(traceRoute, '[data-trace-path-underlay]');

  let calculation: MatrixCalculation | null = null;
  let selectedButton: HTMLButtonElement | null = null;

  const updateTraceRoute = (): void => {
    if (!selectedButton || !calculation) {
      traceRoute.dataset.visible = 'false';
      return;
    }
    const workspaceRect = workspace.getBoundingClientRect();
    const stageRect = matrixStage.getBoundingClientRect();
    const buttonRect = selectedButton.getBoundingClientRect();
    const cardRect = traceCard.getBoundingClientRect();
    const x = (value: number): number => value - workspaceRect.left;
    const y = (value: number): number => value - workspaceRect.top;
    const startX = x(buttonRect.left + buttonRect.width / 2);
    const startY = y(buttonRect.top + buttonRect.height / 2);
    const centerX = x(stageRect.left + stageRect.width / 2);
    const centerY = y(stageRect.top + stageRect.height / 2);
    const isStacked = cardRect.top >= stageRect.bottom - 8;
    let path: string;

    if (isStacked) {
      const edgeX = x(stageRect.right) - 10;
      const endX = x(cardRect.left + cardRect.width / 2);
      const endY = y(cardRect.top) + 3;
      path = `M ${startX} ${startY} L ${centerX} ${centerY} ` +
        `C ${edgeX} ${centerY}, ${edgeX} ${endY - 36}, ${endX} ${endY}`;
    } else {
      const edgeX = x(stageRect.right) - 20;
      const endX = x(cardRect.left) + 2;
      const endY = y(cardRect.top + Math.min(190, cardRect.height * 0.38));
      path = `M ${startX} ${startY} L ${centerX} ${centerY} ` +
        `C ${edgeX} ${centerY - 120}, ${endX - 42} ${endY}, ${endX} ${endY}`;
    }

    traceRoute.setAttribute('viewBox', `0 0 ${workspaceRect.width} ${workspaceRect.height}`);
    tracePath.setAttribute('d', path);
    tracePathUnderlay.setAttribute('d', path);
    traceRoute.dataset.visible = 'true';
  };

  const setError = (message: string): void => {
    error.textContent = message;
    error.hidden = false;
    fieldset.classList.add('has-error');
    Object.values(fields).forEach((field) => field.setAttribute('aria-invalid', 'true'));
    status.textContent = message;
  };

  const clearError = (): void => {
    error.textContent = '';
    error.hidden = true;
    fieldset.classList.remove('has-error');
    Object.values(fields).forEach((field) => field.removeAttribute('aria-invalid'));
  };

  const clearDetail = (): void => {
    selectedButton = null;
    traceRoute.dataset.visible = 'false';
    detail.hidden = true;
    pointPrompt.hidden = false;
    nodeButtons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
    root.querySelectorAll('[data-line-id]').forEach((line) => line.classList.remove('is-selected'));
  };

  const clearResult = (): void => {
    calculation = null;
    clearDetail();
    resultTools.hidden = true;
    promptTitle.textContent = 'Сначала рассчитай';
    promptCopy.textContent = 'После расчёта здесь откроются исходные значения, формула и каждый шаг сокращения.';
    root.dataset.state = 'initial';
    nodeButtons.forEach((button) => {
      button.disabled = true;
      const id = button.dataset.pointId as PointId;
      requireElement<HTMLElement>(button, '[data-point-value]').textContent = '—';
      button.setAttribute('aria-label', `${POINT_META[id].label}, ${POINT_META[id].role}. Сначала рассчитай матрицу.`);
    });
  };

  const renderCalculation = (next: MatrixCalculation): void => {
    calculation = next;
    clearDetail();
    resultTools.hidden = false;
    promptTitle.textContent = 'Выбери точку';
    promptCopy.textContent = 'Откроем исходные значения, формулу, подстановку и каждый шаг сокращения.';
    root.dataset.state = 'calculated';
    for (const button of nodeButtons) {
      const id = button.dataset.pointId as PointId;
      const point = next.points[id];
      button.disabled = false;
      requireElement<HTMLElement>(button, '[data-point-value]').textContent = String(point.value);
      button.setAttribute('aria-label', `${POINT_META[id].label}, ${POINT_META[id].role}, значение ${point.value}`);
    }
    status.textContent = 'Расчёт готов. Получены девять точек. Выбери любую точку, чтобы увидеть формулу.';
    resultHeading.focus();
  };

  const calculate = (): void => {
    clearError();
    const parsed = parseFields(fields);
    if (typeof parsed === 'string') {
      setError(parsed);
      fields.day.focus();
      return;
    }
    const validation = validateBirthDate(parsed, localToday());
    if (!validation.valid) {
      setError(validation.message);
      fields.day.focus();
      return;
    }
    renderCalculation(calculateMatrix(parsed, localToday()));
  };

  const selectPoint = (id: PointId, button: HTMLButtonElement): void => {
    if (!calculation) return;
    const point = calculation.points[id];
    const meta = POINT_META[id];
    const trace = describePoint(point);
    const symbolic = getSymbolicCode(point.value);
    selectedButton = button;

    nodeButtons.forEach((node) => node.setAttribute('aria-pressed', String(node === button)));
    root.querySelectorAll('[data-line-id]').forEach((line) => {
      line.classList.toggle('is-selected', line.getAttribute('data-line-id') === id);
    });
    requireElement<HTMLElement>(detail, '[data-detail-title]').textContent =
      `${meta.label}: как получено число ${point.value}`;
    requireElement<HTMLElement>(detail, '[data-detail-source]').textContent = trace.source;
    requireElement<HTMLElement>(detail, '[data-detail-formula]').textContent = trace.formula;
    requireElement<HTMLElement>(detail, '[data-detail-substitution]').textContent = trace.substitution;
    const steps = requireElement<HTMLOListElement>(detail, '[data-detail-steps]');
    steps.replaceChildren(...trace.steps.map((step) => {
      const item = document.createElement('li');
      item.textContent = step;
      return item;
    }));
    requireElement<HTMLElement>(detail, '[data-detail-result]').textContent = trace.result;
    requireElement<HTMLElement>(detail, '[data-symbolic-title]').textContent =
      `Символический вопрос · Код ${point.value}: ${symbolic.title}`;
    requireElement<HTMLElement>(detail, '[data-symbolic-copy]').textContent = symbolic.reflection;
    requireElement<HTMLElement>(detail, '[data-lesson-prompt]').textContent = meta.lessonPrompt;

    pointPrompt.hidden = true;
    detail.hidden = false;
    root.dataset.state = 'selected';
    status.textContent = `${meta.label} выбрана. ${trace.result}. Подробный расчёт открыт после матрицы.`;
    requestAnimationFrame(updateTraceRoute);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate();
  });

  Object.values(fields).forEach((field) => {
    field.addEventListener('input', () => {
      clearError();
      if (calculation) {
        clearResult();
        status.textContent = 'Дата изменена. Выполни расчёт заново.';
      }
    });
  });

  exampleButton.addEventListener('click', () => {
    fields.day.value = String(EXAMPLE_DATE.day).padStart(2, '0');
    fields.month.value = String(EXAMPLE_DATE.month).padStart(2, '0');
    fields.year.value = String(EXAMPLE_DATE.year);
    calculate();
  });

  changeButton.addEventListener('click', () => {
    clearResult();
    status.textContent = 'Измени дату и запусти новый расчёт.';
    fields.day.focus();
    fields.day.select();
  });

  resetButton.addEventListener('click', () => {
    form.reset();
    clearError();
    clearResult();
    status.textContent = 'Калькулятор очищен.';
    fields.day.focus();
  });

  nodeButtons.forEach((button) => {
    button.addEventListener('click', () => selectPoint(button.dataset.pointId as PointId, button));
  });

  window.addEventListener('resize', () => requestAnimationFrame(updateTraceRoute));

  clearResult();
  root.dataset.ready = 'true';
}

document.querySelectorAll<HTMLElement>('[data-calculator]').forEach(initCalculator);
