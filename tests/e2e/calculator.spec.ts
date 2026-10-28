import { expect, test } from '@playwright/test';

const expectedExample: Readonly<Record<string, string>> = {
  A: '15', B: '7', C: '20', D: '6', E: '12', AB: '22', BC: '9', CD: '8', DA: '21',
};

test('example calculates all nine points and exposes each point by keyboard', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Показать пример 15.07.1991' }).click();

  await expect(page.locator('[data-result-heading]')).toBeFocused();
  for (const [id, value] of Object.entries(expectedExample)) {
    const point = page.locator(`[data-point-id="${id}"]`);
    await expect(point).toBeEnabled();
    await expect(point.locator('[data-point-value]')).toHaveText(value);
  }

  const d = page.locator('[data-point-id="D"]');
  await d.focus();
  await d.press('Space');
  await expect(d).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-detail-title]')).toContainText('Точка D');
  await expect(page.locator('[data-detail-substitution]')).toHaveText('15 + 7 + 20 = 42');
  await expect(page.locator('[data-detail-steps]')).toContainText('4 + 2 = 6');
  await expect(page.locator('[data-detail-result]')).toHaveText('D = 6');

  for (const id of Object.keys(expectedExample)) {
    const point = page.locator(`[data-point-id="${id}"]`);
    await point.focus();
    await point.press('Enter');
    await expect(point).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-detail-result]')).toHaveText(new RegExp(`^${id} =`));
  }
});

test('validation distinguishes empty, impossible, future and leap dates', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Рассчитать матрицу' }).click();
  await expect(page.locator('[data-date-error]')).toHaveText('Заполни день, месяц и год.');
  await expect(page.locator('#birth-day')).toHaveAttribute('aria-invalid', 'true');

  const fillDate = async (day: string, month: string, year: string): Promise<void> => {
    await page.locator('#birth-day').fill(day);
    await page.locator('#birth-month').fill(month);
    await page.locator('#birth-year').fill(year);
    await page.locator('#birth-year').press('Enter');
  };

  await fillDate('29', '02', '1900');
  await expect(page.locator('[data-date-error]')).toHaveText('Укажи существующую календарную дату.');

  await fillDate('31', '04', '2000');
  await expect(page.locator('[data-date-error]')).toHaveText('Укажи существующую календарную дату.');

  await fillDate('29', '02', '2000');
  await expect(page.locator('[data-point-id="E"] [data-point-value]')).toHaveText('3');

  await fillDate('01', '01', String(new Date().getFullYear() + 1));
  await expect(page.locator('[data-date-error]')).toHaveText('Дата рождения не может быть позже сегодняшнего дня.');
});

test('editing, recalculation and restart cannot leave stale point details', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Показать пример 15.07.1991' }).click();
  await page.locator('[data-point-id="D"]').click();
  await expect(page.locator('[data-point-detail]')).toBeVisible();

  await page.locator('#birth-day').fill('06');
  await expect(page.locator('[data-point-detail]')).toBeHidden();
  await expect(page.locator('[data-point-id="D"]')).toBeDisabled();

  await page.locator('#birth-month').fill('05');
  await page.locator('#birth-year').fill('1995');
  await page.locator('#birth-year').press('Enter');
  await expect(page.locator('[data-point-id="D"] [data-point-value]')).toHaveText('17');

  await page.getByRole('button', { name: 'Начать заново' }).click();
  await expect(page.locator('#birth-day')).toBeFocused();
  await expect(page.locator('#birth-day')).toHaveValue('');
  await expect(page.locator('[data-point-id="A"]')).toBeDisabled();
});

test('calculation does not persist or transmit the entered date', async ({ page, context }) => {
  await page.addInitScript(() => {
    const target = window as unknown as Window & { __storageWrites: string[] };
    target.__storageWrites = [];
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key: string, value: string): void {
      target.__storageWrites.push(`${key}=${value}`);
      originalSetItem.call(this, key, value);
    };
  });
  const consoleMessages: string[] = [];
  page.on('console', (message) => consoleMessages.push(message.text()));
  await page.goto('/', { waitUntil: 'networkidle' });

  const requestsAfterLoad: string[] = [];
  page.on('request', (request) => requestsAfterLoad.push(request.url()));
  const initialUrl = page.url();

  await page.locator('#birth-day').fill('23');
  await page.locator('#birth-month').fill('11');
  await page.locator('#birth-year').fill('1988');
  await page.locator('#birth-year').press('Enter');
  await page.locator('[data-point-id="C"]').click();

  expect(page.url()).toBe(initialUrl);
  expect(requestsAfterLoad).toEqual([]);
  expect(consoleMessages.join('\n')).not.toContain('1988');
  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    writes: (window as unknown as Window & { __storageWrites: string[] }).__storageWrites,
  }))).toEqual({ local: [], session: [], writes: [] });
  await expect(page.locator('#birth-day')).not.toHaveAttribute('name');
  await expect(page.locator('#birth-month')).not.toHaveAttribute('name');
  await expect(page.locator('#birth-year')).not.toHaveAttribute('name');
});

test('form fallback cannot serialize the date when JavaScript is unavailable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));

  await page.locator('#birth-day').fill('23');
  await page.locator('#birth-month').fill('11');
  await page.locator('#birth-year').fill('1988');
  await page.getByRole('button', { name: 'Рассчитать матрицу' }).click();
  await page.waitForLoadState('domcontentloaded');

  const url = new URL(page.url());
  expect(url.search).toBe('');
  expect(url.hash).toBe('');
  expect(requests.every((request) => !request.includes('1988') && !request.includes('23%2F11'))).toBe(true);
  await context.close();
});

for (const viewport of [
  { name: 'mobile-360', width: 360, height: 800 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-breakpoint-1220', width: 1220, height: 900 },
  { name: 'desktop-1440', width: 1440, height: 1000 },
  { name: 'zoom-layout-floor', width: 180, height: 400 },
]) {
  test(`${viewport.name} keeps the lesson inside the viewport`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/');
    await page.getByRole('button', { name: 'Показать пример 15.07.1991' }).click();
    await page.locator('[data-point-id="C"]').click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

for (const width of [1712, 1920]) {
  test(`${width}px keeps the display title clear of the matrix heading`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const geometry = await page.evaluate(() => {
      const title = document.querySelector('.calculator h1 span:first-child');
      const matrixHeading = document.querySelector('[data-result-heading]');
      if (!title || !matrixHeading) throw new Error('Expected first-viewport headings');

      const titleRange = document.createRange();
      titleRange.selectNodeContents(title);
      const titleRect = titleRange.getBoundingClientRect();
      const matrixRect = matrixHeading.getBoundingClientRect();

      return {
        gap: matrixRect.left - titleRect.right,
        sharesVerticalBand: titleRect.bottom > matrixRect.top && titleRect.top < matrixRect.bottom,
      };
    });

    expect(geometry.sharesVerticalBand).toBe(true);
    expect(geometry.gap).toBeGreaterThanOrEqual(24);
  });
}

test('reduced motion removes meaningful transition time', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const duration = await page.locator('.matrix-node button').first().evaluate((element) =>
    getComputedStyle(element).transitionDuration,
  );
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.001);
});
