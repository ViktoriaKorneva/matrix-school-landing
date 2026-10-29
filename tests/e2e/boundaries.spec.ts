import { expect, test as base, type Page } from '@playwright/test';

const KEY = 'kontur22.demo.v1';
const NOW = new Date('2026-10-28T09:00:00.000Z');
const DAY = 86_400_000;
const FIRST = '2026-10-29T16:00:00.000Z';
const action = (page: Page, name: string) => page.locator(`[data-demo-action="${name}"]`);
const state = (page: Page) => page.locator('[data-demo-root]');
const booking = (start = FIRST, created = NOW.toISOString()) => ({
  schemaVersion: 1, status: 'confirmed', slotId: `moscow:${start}`, slotStartIso: start, createdAtIso: created,
});

// Observe forbidden API attempts even when they fail or leave no final stored value.
// Ordinary navigation/assets are distinct from calls made by the demo.
const test = base.extend<{ boundaryGuard: void }>({
  boundaryGuard: [async ({ page, context, baseURL }, use) => {
    const effects: string[] = [];
    const logs: string[] = [];
    const errors: string[] = [];
    const responses: Promise<void>[] = [];
    const origin = new URL(baseURL!).origin;
    await page.exposeFunction('__boundaryEffect', (kind: string) => { effects.push(kind); });
    await page.addInitScript(() => {
      const report = (kind: string) => {
        void (window as unknown as { __boundaryEffect: (s: string) => Promise<void> }).__boundaryEffect(kind);
      };
      const fetch = window.fetch;
      window.fetch = (...args) => { report('fetch'); return fetch(...args); };
      const open = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = new Proxy(open, {
        apply(target, receiver, args) { report('XHR'); return Reflect.apply(target, receiver, args); },
      });
      const beacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = (...args) => { report('beacon'); return beacon(...args); };
      const submit = HTMLFormElement.prototype.submit;
      HTMLFormElement.prototype.submit = function () { report('form.submit'); submit.call(this); };
      document.addEventListener('submit', (event) => {
        // Bubble after the calculator's target listener has prevented its local submit.
        if (!event.defaultPrevented) report('unhandled form submission');
      });
      const cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')!;
      Object.defineProperty(document, 'cookie', {
        get() { return cookie.get!.call(document); },
        set(value: string) { report('cookie write'); cookie.set!.call(document, value); },
      });
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (this === localStorage) report('localStorage write');
        else if (key !== 'kontur22.demo.v1') report('unexpected sessionStorage key');
        return set.call(this, key, value);
      };
    });
    page.on('request', (request) => {
      const url = new URL(request.url());
      // Dev assets are allowed here because this same suite also runs in dev.
      const asset = /^\/(?:_astro\/|_image\?|@|src\/|node_modules\/)/.test(url.pathname + url.search);
      if (url.origin !== origin || request.method() !== 'GET' || (!asset && url.href !== `${origin}/`)) {
        effects.push(`request: ${request.method()} ${url.pathname}`);
      }
    });
    page.on('response', (response) => {
      responses.push(response.headerValue('set-cookie').then((value) => {
        if (value !== null) effects.push('server Set-Cookie');
      }));
    });
    page.on('console', (message) => { logs.push(message.text()); });
    page.on('pageerror', (error) => { errors.push(error.message); });
    await use();
    await Promise.all(responses);
    expect(effects).toEqual([]);
    expect(errors).toEqual([]);
    expect(logs.join('\n')).not.toMatch(/Марина|student@example|1988|schemaVersion|slotStartIso|createdAtIso|moscow:|UNTRUSTED_DEMO/);
    expect(await context.cookies()).toEqual([]);
    expect(new URL(page.url()).search).toBe('');
    expect(new URL(page.url()).hash).toBe('');
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  }, { auto: true }],
});

async function open(page: Page) {
  await page.locator('[data-demo-open]').first().click();
}
async function prepare(page: Page) {
  await page.getByRole('radio').first().check();
  await action(page, 'example').click();
}
async function confirm(page: Page) {
  await open(page); await prepare(page); await action(page, 'confirm').click();
  await expect(state(page)).toHaveAttribute('data-state', 'confirmed');
}
async function stored(page: Page) {
  return page.evaluate((key) => sessionStorage.getItem(key), KEY);
}
async function load(page: Page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(state(page)).toHaveAttribute('data-ready', 'true');
}
async function seed(page: Page, raw: string) {
  // Seed once before a reload, so subsequent recovery cannot silently reseed data.
  await load(page);
  await page.evaluate(({ key, raw }) => sessionStorage.setItem(key, raw), { key: KEY, raw });
  await page.reload({ waitUntil: 'networkidle' });
  await expect(state(page)).toHaveAttribute('data-ready', 'true');
}
test.use({ reducedMotion: 'reduce' });

test('all lifecycle stages keep data local and independent of the calculator', async ({ page }) => {
  await page.clock.setFixedTime(NOW); await load(page);
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  const snapshot = async (confirmed: boolean) => {
    const data = await page.evaluate((key) => ({
      keys: Object.keys(sessionStorage), raw: sessionStorage.getItem(key),
      local: Object.keys(localStorage),
    }), KEY);
    expect(data.keys).toEqual(confirmed ? [KEY] : []);
    expect(data.local).toEqual([]);
    expect(await page.evaluate(async () => ({
      databases: await indexedDB.databases(), caches: await caches.keys(),
    }))).toEqual({ databases: [], caches: [] });
    if (confirmed) {
      expect(Object.keys(JSON.parse(data.raw!)).sort()).toEqual([
        'createdAtIso', 'schemaVersion', 'slotId', 'slotStartIso', 'status',
      ]);
      expect(JSON.parse(data.raw!).status).toBe('confirmed');
      expect(data.raw).not.toMatch(/Марина|student|email|1988|draft|cancelled/);
    }
    expect(requests).toEqual([]);
  };
  await snapshot(false);
  await page.locator('#birth-day').fill('23'); await page.locator('#birth-month').fill('11');
  await page.locator('#birth-year').fill('1988'); await page.locator('#birth-year').press('Enter');
  await snapshot(false); await open(page);
  await expect(page.locator('[data-prepared-values]')).toBeHidden();
  await expect(page.locator('[data-demo-root] input:not([type="radio"]), [data-demo-root] textarea, [data-demo-root] [contenteditable], [data-demo-root] form')).toHaveCount(0);
  await action(page, 'example').click(); await snapshot(false);
  await page.getByRole('radio').first().check(); await snapshot(false);
  await action(page, 'confirm').click(); await snapshot(true);
  const original = JSON.parse((await stored(page))!);
  await action(page, 'edit').click(); await page.getByRole('radio').nth(1).check();
  await snapshot(true); expect(JSON.parse((await stored(page))!)).toEqual(original);
  await action(page, 'back').click(); await snapshot(true);
  await action(page, 'edit').click(); await page.getByRole('radio').nth(1).check();
  await page.clock.setFixedTime(new Date(NOW.getTime() + 60_000));
  await action(page, 'confirm').click(); await snapshot(true);
  expect(JSON.parse((await stored(page))!).createdAtIso).toBe(original.createdAtIso);
  await action(page, 'cancel').click(); await snapshot(false);
  // Navigation loads are observed separately from actions after the quiet point.
  await page.reload({ waitUntil: 'networkidle' }); requests.length = 0;
  await expect(state(page)).toBeHidden(); await open(page);
  await expect(state(page)).toHaveAttribute('data-state', 'initial'); await snapshot(false);
  await prepare(page); await action(page, 'confirm').click(); await snapshot(true);
  await action(page, 'cancel').click(); await action(page, 'repeat').click(); await snapshot(false);
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await expect(page.locator('[data-prepared-values]')).toBeHidden();
});

for (const zone of ['Pacific/Honolulu', 'Asia/Tokyo']) {
  test.describe(`Moscow schedule from ${zone}`, () => {
    test.use({ timezoneId: zone });
    test('keeps all three dates and the exact lead-time boundary in Moscow', async ({ page }) => {
      await page.clock.setFixedTime(new Date('2026-10-28T16:00:00.000Z'));
      await load(page); await open(page);
      expect(await page.getByRole('radio').evaluateAll((radios) => radios.map((r) => (r as HTMLInputElement).value))).toEqual([
        `moscow:${FIRST}`, 'moscow:2026-10-31T09:00:00.000Z', 'moscow:2026-11-03T16:00:00.000Z',
      ]);
      await expect(page.getByRole('radio').first()).toHaveAccessibleName(/четверг, 29 октября 2026 г. в 19:00, время Москвы/);
      await action(page, 'close').click();
      await page.clock.setFixedTime(new Date('2026-10-28T16:00:00.001Z')); await open(page);
      await expect(page.getByRole('radio').first()).toHaveAttribute('value', 'moscow:2026-10-31T09:00:00.000Z');
    });
  });
}

test('an idle open confirmation expires at exactly 24 hours without any action', async ({ page }) => {
  await page.clock.install({ time: NOW }); await page.clock.pauseAt(NOW);
  await load(page); await confirm(page);
  await page.clock.fastForward(DAY - 1);
  await expect(state(page)).toHaveAttribute('data-state', 'confirmed');
  await page.clock.runFor(1);
  await expect(state(page)).toHaveAttribute('data-state', 'initial');
  expect(await stored(page)).toBeNull();
  await expect(page.locator('[data-demo-live]')).toContainText('Срок демозаписи закончился');
});

test('slot start rejects a formerly valid confirmation at its exact boundary', async ({ page }) => {
  // With a >=24h initial lead time, slot start cannot precede the record-age limit.
  const before = new Date('2026-10-29T15:59:59.999Z');
  await page.clock.install({ time: before }); await page.clock.pauseAt(before);
  await seed(page, JSON.stringify(booking(FIRST, '2026-10-28T16:00:00.000Z')));
  await open(page); await expect(state(page)).toHaveAttribute('data-state', 'confirmed');
  await page.clock.runFor(1);
  await expect(state(page)).toHaveAttribute('data-state', 'initial'); expect(await stored(page)).toBeNull();
});

test('visibility return cleans an expired hidden confirmation without opening or focus capture', async ({ page }) => {
  await page.clock.install({ time: NOW }); await page.clock.pauseAt(NOW);
  await load(page); await confirm(page); await action(page, 'close').click();
  await page.locator('[data-demo-open]').first().focus();
  // Model a throttled background tab: advance wall time without delivering timers.
  await page.evaluate(() => Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }));
  await page.clock.setSystemTime(new Date(NOW.getTime() + DAY));
  expect(await stored(page)).not.toBeNull();
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(state(page)).toBeHidden(); expect(await stored(page)).toBeNull();
  await expect(page.locator('[data-demo-open]').first()).toBeFocused();
  await expect(page.locator('[data-demo-live]')).toContainText('Срок демозаписи закончился');
});

const invalidRecords = [
  ['JSON', '{UNTRUSTED_DEMO'],
  ['version', JSON.stringify({ ...booking(), schemaVersion: 99 })],
  ['status', JSON.stringify({ ...booking(), status: 'cancelled' })],
  ['extra field', JSON.stringify({ ...booking(), name: '<img src=x onerror="UNTRUSTED_DEMO">' })],
  ['impossible date', JSON.stringify({ ...booking(), slotStartIso: '2026-02-30T16:00:00.000Z' })],
  ['wrong schedule', JSON.stringify(booking('2026-10-30T16:00:00.000Z'))],
  ['mismatched ID', JSON.stringify({ ...booking(), slotId: 'UNTRUSTED_DEMO' })],
  ['future creation', JSON.stringify(booking(FIRST, '2026-10-28T09:00:00.001Z'))],
  ['insufficient original lead', JSON.stringify(booking('2026-10-27T16:00:00.000Z', '2026-10-27T09:00:00.000Z'))],
] as const;
for (const [kind, raw] of invalidRecords) {
  test(`untrusted ${kind} record is rejected and stays cleared after refresh`, async ({ page }) => {
    await page.clock.setFixedTime(NOW); await seed(page, raw);
    await expect(page.locator('[data-demo-live]')).toContainText('устарело или повреждено');
    expect(await stored(page)).toBeNull();
    await expect(page.locator('body')).not.toContainText('UNTRUSTED_DEMO');
    await expect(page.locator('[data-booking-status]')).toBeHidden();
    await open(page); await expect(state(page)).toHaveAttribute('data-state', 'initial');
    await page.reload({ waitUntil: 'networkidle' }); await open(page);
    await expect(state(page)).toHaveAttribute('data-state', 'initial'); expect(await stored(page)).toBeNull();
  });
}

test('failed replacement survives refresh; failed cancellation can be retried independently', async ({ page }) => {
  await page.clock.setFixedTime(NOW); await load(page); await confirm(page);
  const original = await stored(page);
  await action(page, 'edit').click(); await page.getByRole('radio').nth(1).check();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked'); }; });
  await action(page, 'confirm').click();
  await expect(page.locator('#demo-error')).toContainText('Пока действует прежняя');
  await page.reload({ waitUntil: 'networkidle' }); await open(page);
  expect(await stored(page)).toBe(original);
  await page.evaluate(() => {
    const remove = Storage.prototype.removeItem;
    let denied = true;
    Storage.prototype.removeItem = function (key) {
      if (denied) { denied = false; throw new DOMException('Blocked'); }
      remove.call(this, key);
    };
  });
  await action(page, 'cancel').click();
  await expect(state(page)).toHaveAttribute('data-state', 'confirmed');
  expect(await stored(page)).toBe(original);
  await action(page, 'cancel').click();
  await expect(state(page)).toHaveAttribute('data-state', 'cancelled'); expect(await stored(page)).toBeNull();
});

test('failed expiry cleanup never revives invalid data, including after refresh', async ({ page }) => {
  await page.clock.install({ time: NOW }); await page.clock.pauseAt(NOW);
  await page.addInitScript(() => { Storage.prototype.removeItem = () => { throw new DOMException('Blocked'); }; });
  await load(page); await confirm(page); const original = await stored(page);
  await page.clock.fastForward(DAY);
  await expect(state(page)).toHaveAttribute('data-state', 'initial');
  await expect(page.locator('[data-demo-live]')).toContainText('не позволил удалить');
  expect(await stored(page)).toBe(original);
  await page.reload({ waitUntil: 'networkidle' }); await open(page);
  await expect(state(page)).toHaveAttribute('data-state', 'initial');
  await expect(page.locator('[data-memory-warning]')).toContainText('Оно не используется');
  await prepare(page); await action(page, 'confirm').click();
  await expect(page.locator('[data-storage-note]')).toContainText('только на открытой странице');
  expect(await stored(page)).toBe(original);
});

for (const operation of ['getItem', 'setItem'] as const) {
  test(`${operation} denial keeps the complete memory journey free of external effects`, async ({ page }) => {
    await page.clock.setFixedTime(NOW);
    await page.addInitScript((operation) => {
      // Deny only this feature's operation; unrelated dev tooling uses Storage too.
      if (operation === 'getItem') {
        const get = Storage.prototype.getItem;
        Storage.prototype.getItem = function (key) {
          if (this === sessionStorage && key === 'kontur22.demo.v1') throw new DOMException('Blocked');
          return get.call(this, key);
        };
      } else {
        const set = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          if (this === sessionStorage && key === 'kontur22.demo.v1') throw new DOMException('Blocked');
          return set.call(this, key, value);
        };
      }
    }, operation);
    await load(page); await confirm(page);
    expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
    await action(page, 'edit').click(); await page.getByRole('radio').nth(1).check();
    await action(page, 'confirm').click();
    await expect(page.locator('[data-storage-note]')).toContainText('Если обновить страницу');
    await action(page, 'cancel').click(); await action(page, 'repeat').click();
    await expect(state(page)).toHaveAttribute('data-state', 'initial');
    await page.reload({ waitUntil: 'networkidle' }); await open(page);
    await expect(state(page)).toHaveAttribute('data-state', 'initial');
  });
}

test('stale draft rejection causes no persistence or external effect', async ({ page }) => {
  await page.clock.setFixedTime(NOW); await load(page); await open(page); await prepare(page);
  await page.clock.setFixedTime(new Date('2026-10-28T16:00:00.001Z'));
  await action(page, 'confirm').click();
  await expect(page.locator('#demo-error')).toContainText('устарело');
  expect(await stored(page)).toBeNull();
  await expect(page.locator('[data-prepared-values]')).toBeVisible();
});
