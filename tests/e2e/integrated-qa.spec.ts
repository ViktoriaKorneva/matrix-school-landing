import { expect, test, type Page } from '@playwright/test';

async function tabTo(page: Page, selector: string): Promise<void> {
  const target = page.locator(selector);
  for (let count = 0; count < 40; count++) {
    if (await target.evaluate((element) => element === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Keyboard could not reach ${selector}`);
}

test('the primary journey works by keyboard from skip link through cancellation and return', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await tabTo(page, '#course [data-demo-open]');
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-heading')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('radio').first()).toBeFocused();
  await page.keyboard.press('Space');
  await tabTo(page, '[data-demo-action="example"]');
  await page.keyboard.press('Enter');
  await tabTo(page, '[data-demo-action="confirm"]');
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-heading')).toHaveText('Демозапись подтверждена');
  await tabTo(page, '[data-demo-action="edit"]');
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-slots')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio').nth(1)).toBeChecked();
  await tabTo(page, '[data-demo-action="confirm"]');
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-heading')).toBeFocused();
  await tabTo(page, '[data-demo-action="cancel"]');
  await page.keyboard.press('Enter');
  await expect(page.locator('#demo-heading')).toHaveText('Демозапись отменена');
  await tabTo(page, '[data-demo-action="repeat"]');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
  await tabTo(page, '[data-demo-action="close"]');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-demo-open]').first()).toBeFocused();
});

test('public page assets, anchors and programmatic references resolve in the built page', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const integrity = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    return {
      duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
      missingAnchors: [...document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
        .filter((link) => !document.getElementById(link.hash.slice(1))).map((link) => link.hash),
      missingReferences: [...document.querySelectorAll('[aria-controls], [aria-labelledby], [aria-describedby]')]
        .flatMap((element) => ['aria-controls', 'aria-labelledby', 'aria-describedby'].flatMap((attribute) =>
          (element.getAttribute(attribute) ?? '').split(/\s+/).filter((id) => id && !document.getElementById(id)))),
      brokenImages: [...document.images].filter((image) => !image.complete || !image.naturalWidth).map((image) => image.alt),
      imageCount: document.images.length,
    };
  });
  expect(integrity).toEqual({ duplicateIds: [], missingAnchors: [], missingReferences: [], brokenImages: [], imageCount: 4 });
  for (const trigger of await page.locator('[data-demo-open]').all()) {
    await trigger.click();
    await expect(page.locator('#demo-heading')).toBeFocused();
    await page.locator('[data-demo-action="close"]').click();
    await expect(trigger).toBeFocused();
  }
});
