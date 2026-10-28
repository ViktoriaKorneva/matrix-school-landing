import type { PointCalculation, PointId } from '../../domain/matrix';

export interface PointMeta {
  readonly id: PointId;
  readonly label: string;
  readonly role: string;
  readonly position: 'ab' | 'b' | 'bc' | 'a' | 'e' | 'c' | 'da' | 'd' | 'cd';
  readonly lessonPrompt: string;
}

export interface PointTrace {
  readonly source: string;
  readonly formula: string;
  readonly substitution: string;
  readonly steps: readonly string[];
  readonly result: string;
}

interface SymbolicCode {
  readonly title: string;
  readonly reflection: string;
}

export const POINTS: readonly PointMeta[] = [
  {
    id: 'AB', label: 'Связь A + B', role: 'день и месяц', position: 'ab',
    lessonPrompt: 'Что становится заметнее, если сопоставить исходный импульс дня с ритмом месяца?',
  },
  {
    id: 'B', label: 'Точка B', role: 'число месяца', position: 'b',
    lessonPrompt: 'Как ритм и повторяемость помогают увидеть устойчивую часть ситуации?',
  },
  {
    id: 'BC', label: 'Связь B + C', role: 'месяц и год', position: 'bc',
    lessonPrompt: 'Что меняется, если соединить близкий ритм месяца с более широким контекстом года?',
  },
  {
    id: 'A', label: 'Точка A', role: 'число дня', position: 'a',
    lessonPrompt: 'Какой первый шаг здесь можно назвать самым конкретным и наблюдаемым?',
  },
  {
    id: 'E', label: 'Точка E', role: 'сводный центр', position: 'e',
    lessonPrompt: 'Какая общая тема связывает четыре базовые точки, если смотреть на них вместе?',
  },
  {
    id: 'C', label: 'Точка C', role: 'число года', position: 'c',
    lessonPrompt: 'Какой более широкий контекст стоит учесть, прежде чем делать вывод?',
  },
  {
    id: 'DA', label: 'Связь D + A', role: 'основание и день', position: 'da',
    lessonPrompt: 'Как общий результат соотносится с первоначальным числом дня?',
  },
  {
    id: 'D', label: 'Точка D', role: 'сумма A + B + C', position: 'd',
    lessonPrompt: 'Какой итог получается, когда три исходные точки рассматриваются как одна система?',
  },
  {
    id: 'CD', label: 'Связь C + D', role: 'год и основание', position: 'cd',
    lessonPrompt: 'Что можно переосмыслить, сопоставив широкий контекст с общим результатом?',
  },
] as const;

export const POINT_META = Object.fromEntries(POINTS.map((point) => [point.id, point])) as Readonly<
  Record<PointId, PointMeta>
>;

const SYMBOLIC_CODES: readonly SymbolicCode[] = [
  { title: 'Начало', reflection: 'Какой небольшой первый шаг можно сделать без ожидания полной уверенности?' },
  { title: 'Наблюдение', reflection: 'Что прояснится, если сначала собрать факты и не торопиться с ответом?' },
  { title: 'Рост', reflection: 'Что уже получает достаточно внимания, чтобы развиваться дальше?' },
  { title: 'Структура', reflection: 'Какая простая граница или договорённость добавит устойчивости?' },
  { title: 'Обучение', reflection: 'Какое правило полезно понять, прежде чем переходить к следующему шагу?' },
  { title: 'Выбор', reflection: 'Какие две ценности здесь важно не перепутать при принятии решения?' },
  { title: 'Направление', reflection: 'Что поможет удержать курс и не распылять усилия?' },
  { title: 'Баланс', reflection: 'Где нужна честная мера между действием и ограничением?' },
  { title: 'Сосредоточение', reflection: 'Какой вопрос требует тишины и самостоятельного размышления?' },
  { title: 'Перемена', reflection: 'Что в этой ситуации уже движется и не обязано оставаться прежним?' },
  { title: 'Внутренняя сила', reflection: 'Где мягкая настойчивость будет полезнее давления?' },
  { title: 'Новый ракурс', reflection: 'Как выглядит задача, если временно отказаться от привычного объяснения?' },
  { title: 'Завершение', reflection: 'Что пора закончить, чтобы освободить место для следующего этапа?' },
  { title: 'Соразмерность', reflection: 'Какие части можно соединить постепенно, без резкого движения?' },
  { title: 'Привязанность', reflection: 'Что удерживает внимание сильнее, чем действительно помогает?' },
  { title: 'Перестройка', reflection: 'Какую непрочную конструкцию полезно пересобрать на более ясной основе?' },
  { title: 'Ориентир', reflection: 'Какой образ результата помогает не потерять смысл текущей работы?' },
  { title: 'Неопределённость', reflection: 'Каких данных пока не хватает и где предположение стоит назвать предположением?' },
  { title: 'Ясность', reflection: 'Что можно сделать видимым, простым и понятным для других?' },
  { title: 'Пересмотр', reflection: 'Какой прошлый вывод стоит проверить заново с учётом новых данных?' },
  { title: 'Целостность', reflection: 'Какие разрозненные части уже складываются в завершённую картину?' },
  { title: 'Открытость', reflection: 'Что можно исследовать как новый опыт, сохраняя внимание к рискам?' },
] as const;

const SOURCE_LABELS: Readonly<Record<PointCalculation['operands'][number]['source'], string>> = {
  day: 'день', month: 'месяц', year: 'год',
  A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', AB: 'AB', BC: 'BC', CD: 'CD', DA: 'DA',
};

const FORMULAS: Readonly<Record<PointId, string>> = {
  A: 'A = сократить число дня до диапазона 1–22',
  B: 'B = номер месяца',
  C: 'C = сократить сумму цифр года до диапазона 1–22',
  D: 'D = сократить A + B + C до диапазона 1–22',
  E: 'E = сократить A + B + C + D до диапазона 1–22',
  AB: 'AB = сократить A + B до диапазона 1–22',
  BC: 'BC = сократить B + C до диапазона 1–22',
  CD: 'CD = сократить C + D до диапазона 1–22',
  DA: 'DA = сократить D + A до диапазона 1–22',
};

function digitsEquation(digits: readonly number[], sum: number): string {
  return `${digits.join(' + ')} = ${sum}`;
}

export function describePoint(point: PointCalculation): PointTrace {
  const source = point.operands
    .map((operand) => `${SOURCE_LABELS[operand.source]}: ${operand.value}`)
    .join(' · ');
  let substitution: string;
  if (point.id === 'A') {
    substitution = `A = сократить(${point.operands[0]!.value})`;
  } else if (point.id === 'C' && point.digitSum) {
    substitution = `C = сократить(${point.digitSum.digits.join(' + ')})`;
  } else if (point.operands.length === 1) {
    substitution = `${point.id} = ${point.operands[0]!.value}`;
  } else {
    substitution = `${point.operands.map((operand) => operand.value).join(' + ')} = ${point.rawSum}`;
  }
  const steps: string[] = [];

  if (point.digitSum) {
    steps.push(`Сумма цифр года: ${digitsEquation(point.digitSum.digits, point.digitSum.sum)}`);
  }
  for (const step of point.reduction.steps) {
    steps.push(`Сокращение: ${digitsEquation(step.digits, step.sum)}`);
  }
  if (point.id === 'B') {
    steps.push('Номер месяца используется без дополнительного сокращения.');
  } else if (point.reduction.steps.length === 0) {
    steps.push(`${point.reduction.result} уже находится в диапазоне 1–22.`);
  }

  return {
    source,
    formula: FORMULAS[point.id],
    substitution,
    steps,
    result: `${point.id} = ${point.value}`,
  };
}

export function getSymbolicCode(value: number): SymbolicCode {
  const code = SYMBOLIC_CODES[value - 1];
  if (!code) throw new RangeError(`Unsupported symbolic code: ${value}`);
  return code;
}
