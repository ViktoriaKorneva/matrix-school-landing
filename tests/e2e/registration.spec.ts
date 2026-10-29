import { expect, test, type Page } from '@playwright/test';
import { STORAGE_KEY } from '../../src/domain/registration/booking';
import { DAY, slotAt } from '../../src/domain/registration/schedule';

const NOW = new Date('2026-10-28T12:00:00+03:00');
const action = (page: Page, name: string) => page.locator(`[data-demo-action="${name}"]`);
async function open(page: Page) {
  await page.locator('[data-demo-open]').first().click();
  await expect(page.locator('#demo-heading')).toBeFocused();
}
async function confirm(page: Page) {
  await open(page);
  await page.getByRole('radio').first().check();
  await action(page, 'example').click();
  await action(page, 'confirm').click();
  await expect(page.locator('[data-demo-root]')).toHaveAttribute('data-state', 'confirmed');
}
test.beforeEach(async ({ page }) => { await page.clock.install({ time: NOW }); });

test('keyboard preparation, confirm, refresh, edit, cancel and repeat use one record', async ({ page }) => {
  await page.goto('/'); await open(page);
  for (const trigger of await page.locator('[data-demo-open]').all()) {
    await expect(trigger).toHaveAccessibleDescription(/Урок не состоится, заявка и письмо не создаются/);
  }
  await expect(action(page, 'confirm')).toBeDisabled();
  await expect(page.locator('[data-prepared-values]')).toBeHidden();
  const radio = page.getByRole('radio').first();
  await radio.focus(); await radio.press('Space');
  await expect(radio).toBeFocused();
  await expect(page.locator('#demo-completion')).toContainText('Осталось нажать');
  await action(page, 'example').focus(); await action(page, 'example').press('Enter');
  await expect(action(page, 'example')).toBeFocused();
  await expect(page.locator('[data-prepared-values]')).toContainText('Марина Соколова');
  await expect(action(page, 'confirm')).toBeEnabled();
  await action(page, 'confirm').focus(); await action(page, 'confirm').press('Enter');
  await expect(page.locator('#demo-heading')).toBeFocused();
  const original = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), STORAGE_KEY);
  expect(Object.keys(original)).toEqual(['schemaVersion', 'status', 'slotId', 'slotStartIso', 'createdAtIso']);
  await action(page, 'close').click();
  await expect(page.locator('[data-demo-open]').first()).toBeFocused();
  await page.locator('[data-demo-open]').last().click();
  await expect(page.locator('[data-demo-root]')).toHaveAttribute('data-state', 'confirmed');
  await action(page, 'edit').click(); await expect(page.locator('#demo-slots')).toBeFocused();
  await page.getByRole('radio').nth(1).check();
  await page.reload();
  await expect(page.locator('[data-demo-root]')).toBeHidden();
  await expect(page.locator('[data-booking-status]')).toBeVisible();
  await expect(page.locator('#demo-heading')).not.toBeFocused();
  await open(page);
  expect(await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), STORAGE_KEY)).toEqual(original);
  await action(page, 'edit').click(); await page.getByRole('radio').nth(1).check();
  await action(page, 'confirm').click();
  const changed = await page.evaluate((key) => JSON.parse(sessionStorage.getItem(key)!), STORAGE_KEY);
  expect(changed.createdAtIso).toBe(original.createdAtIso); expect(changed.slotId).not.toBe(original.slotId);
  await action(page, 'cancel').click();
  await expect(page.locator('#demo-heading')).toHaveText('Демозапись отменена');
  await expect(page.locator('#demo-heading')).toBeFocused();
  expect(await page.evaluate((key) => sessionStorage.getItem(key), STORAGE_KEY)).toBeNull();
  await action(page, 'repeat').click();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(page.locator('[data-prepared-values]')).toBeHidden();
});

test('draft reset, close and refresh discard only the in-memory preparation', async ({ page }) => {
  await page.goto('/'); await open(page); await action(page, 'example').click();
  await action(page, 'reset').click(); await expect(action(page, 'confirm')).toBeDisabled();
  await page.getByRole('radio').first().check(); await action(page, 'close').click();
  await open(page); await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await action(page, 'example').click(); await page.reload(); await open(page);
  await expect(page.locator('[data-prepared-values]')).toBeHidden();
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
});

test('stale selected time is rejected and the example remains applied', async ({ page }) => {
  await page.goto('/'); await open(page); await page.getByRole('radio').first().check();
  await action(page, 'example').click();
  await page.clock.setSystemTime(new Date('2026-10-28T19:00:00.001+03:00'));
  await action(page, 'confirm').click();
  await expect(page.locator('#demo-error')).toContainText('устарело');
  await expect(page.locator('#demo-slots')).toBeFocused();
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(page.locator('[data-prepared-values]')).toBeVisible();
  await expect(page.getByRole('radio').first()).toHaveAccessibleName(/31 октября 2026/);
});

for (const kind of ['near', 'outside-three'] as const) {
  test(`restoration preserves valid ${kind} confirmation`, async ({ page }) => {
    const current = kind === 'near' ? new Date('2026-10-29T10:00:00+03:00') : NOW;
    await page.clock.setSystemTime(current);
    const start = kind === 'near' ? '2026-10-29T16:00:00.000Z' : '2026-11-14T09:00:00.000Z';
    const created = kind === 'near' ? new Date('2026-10-28T18:00:00+03:00') : NOW;
    await page.addInitScript(({ key, start, created }) => {
      sessionStorage.setItem(key, JSON.stringify({ schemaVersion: 1, status: 'confirmed',
        slotId: `moscow:${start}`, slotStartIso: start, createdAtIso: created }));
    }, { key: STORAGE_KEY, start, created: created.toISOString() });
    await page.goto('/'); await expect(page.locator('[data-demo-root]')).toBeHidden();
    await open(page); await expect(page.locator('[data-demo-root]')).toHaveAttribute('data-state', 'confirmed');
    await expect(page.locator('[data-confirmed-slot]')).toContainText(kind === 'near' ? '29 октября 2026' : '14 ноября 2026');
  });
}

test('failed replacement and removal preserve the last successful confirmation', async ({ page }) => {
  await page.goto('/'); await confirm(page);
  const original = await page.evaluate((key) => sessionStorage.getItem(key), STORAGE_KEY);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Blocked'); };
    Storage.prototype.removeItem = () => { throw new DOMException('Blocked'); };
  });
  await action(page, 'edit').click(); await page.getByRole('radio').nth(1).check(); await action(page, 'confirm').click();
  await expect(page.locator('#demo-error')).toContainText('Пока действует прежняя');
  expect(await page.evaluate((key) => sessionStorage.getItem(key), STORAGE_KEY)).toBe(original);
  await action(page, 'back').click(); await action(page, 'cancel').click();
  await expect(page.locator('#demo-heading')).toHaveText('Демозапись подтверждена');
  await expect(page.locator('#demo-error')).toContainText('пока не отменена');
  await expect(action(page, 'cancel')).toHaveText('Повторить отмену');
  expect(await page.evaluate((key) => sessionStorage.getItem(key), STORAGE_KEY)).toBe(original);
});

for (const operation of ['getItem', 'setItem'] as const) {
  test(`${operation} denial uses memory and never promises refresh recovery`, async ({ page }) => {
    await page.addInitScript((operation) => { Storage.prototype[operation] = () => { throw new DOMException('Blocked'); }; }, operation);
    await page.goto('/'); await confirm(page);
    await expect(page.locator('[data-storage-note]')).toContainText('Если обновить страницу');
    await expect(page.locator('[data-storage-note]')).not.toContainText('Подтверждение восстановится');
    await action(page, 'edit').click(); await page.getByRole('radio').nth(1).check(); await action(page, 'confirm').click();
    await action(page, 'cancel').click(); await expect(page.locator('#demo-heading')).toHaveText('Демозапись отменена');
    await page.reload(); await open(page); await expect(page.locator('[data-demo-root]')).toHaveAttribute('data-state', 'initial');
  });
}

for (const cleanupFails of [false, true]) {
  test(`corrupt state is rejected with cleanup failure=${cleanupFails}`, async ({ page }) => {
    await page.addInitScript(({ key, cleanupFails }) => {
      sessionStorage.setItem(key, '<script>untrusted</script>');
      if (cleanupFails) Storage.prototype.removeItem = () => { throw new DOMException('Blocked'); };
    }, { key: STORAGE_KEY, cleanupFails });
    await page.goto('/');
    await expect(page.locator('[data-demo-live]')).toContainText(cleanupFails ? 'не позволил удалить' : 'устарело или повреждено');
    await open(page); await expect(page.locator('[data-demo-root]')).toHaveAttribute('data-state', 'initial');
    expect(await page.evaluate(() => document.body.innerHTML.includes('<script>untrusted</script>'))).toBe(false);
    if (cleanupFails) {
      await page.getByRole('radio').first().check(); await action(page, 'example').click(); await action(page, 'confirm').click();
      await expect(page.locator('[data-storage-note]')).toContainText('только на открытой странице');
    }
  });
}

test('age expiry is cleaned during editing and does not renew the booking', async ({ page }) => {
  await page.goto('/'); await confirm(page); await action(page, 'edit').click();
  await page.clock.setSystemTime(new Date(NOW.getTime() + DAY));
  await page.getByRole('radio').nth(1).check();
  await expect(page.locator('[data-demo-root]')).toHaveAttribute('data-state', 'initial');
  expect(await page.evaluate((key) => sessionStorage.getItem(key), STORAGE_KEY)).toBeNull();
});

test('demo sends no requests and persists exactly the five allowed fields', async ({ page, context }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const requests: string[] = [];
  page.on('request', (request) => requests.push(`${request.method()} ${request.url()}`));
  const url = page.url();
  await confirm(page);
  const stored = await page.evaluate((key) => ({
    keys: Object.keys(sessionStorage), record: JSON.parse(sessionStorage.getItem(key)!), local: Object.keys(localStorage),
  }), STORAGE_KEY);
  expect(stored.keys).toEqual([STORAGE_KEY]); expect(stored.local).toEqual([]);
  expect(stored.record.slotId).toBe(slotAt(Date.parse(stored.record.slotStartIso)).id);
  expect(JSON.stringify(stored)).not.toMatch(/student|Марина|1991/);
  await expect(page.locator('[data-demo-root] input:not([type="radio"])')).toHaveCount(0);
  await expect(page.locator('[data-demo-root] form, [data-demo-root] textarea')).toHaveCount(0);
  await action(page, 'edit').click(); await page.getByRole('radio').nth(1).check(); await action(page, 'confirm').click();
  await action(page, 'cancel').click(); await action(page, 'repeat').click();
  expect(requests).toEqual([]); expect(page.url()).toBe(url); expect(await context.cookies()).toEqual([]);
});

test('without JavaScript the static offer is available and no contact form exists', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto(baseURL!);
  await expect(page.locator('[data-demo-fallback]')).toContainText('Для деморегистрации нужен JavaScript');
  await expect(page.locator('[data-demo-open]').first()).toBeDisabled();
  await expect(page.locator('[data-demo-root]')).toBeHidden();
  await expect(page.locator('input[type="email"], input[type="tel"]')).toHaveCount(0);
  const faq = page.locator('#B10 summary').first(); await faq.click();
  await expect(faq.locator('..')).toHaveAttribute('open', ''); await context.close();
});

test('bypassing disabled confirmation still associates errors and focuses the missing step', async ({ page }) => {
  await page.goto('/'); await open(page);
  const bypass = async () => {
    await action(page, 'confirm').evaluate((button) => { (button as HTMLButtonElement).disabled = false; });
    await action(page, 'confirm').click();
  };
  await bypass();
  await expect(page.locator('#demo-slots')).toBeFocused();
  await expect(page.locator('#demo-slots')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#demo-error')).toContainText('нажмите «Заполнить пример»');
  await page.getByRole('radio').first().check(); await bypass();
  await expect(action(page, 'example')).toBeFocused();
  await expect(action(page, 'example')).toHaveAttribute('aria-describedby', 'demo-error');
});

test('a detectable module failure leaves a truthful fallback', async ({ page }) => {
  let blocked = false;
  // Match the source module in dev and the hashed dynamic-import chunk in production.
  await page.route(/\/(?:src\/components\/registration\/registration\.ts|_astro\/registration\.[^/]+\.js)(?:\?.*)?$/, (route) => {
    blocked = true;
    return route.abort();
  });
  await page.goto('/');
  await expect(page.locator('[data-demo-fallback]')).toContainText('Не удалось открыть демонстрацию');
  await expect(page.locator('[data-demo-root]')).toBeHidden();
  await expect(page.locator('[data-demo-open]').first()).toBeDisabled();
  expect(blocked).toBe(true);
});
