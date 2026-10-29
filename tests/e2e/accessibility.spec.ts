import { expect, test, type Page } from '@playwright/test';

async function checkTextContrast(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  await expect.poll(() => page.evaluate(() => {
    const rgb = (s: string) => (s.match(/[\d.]+/g) ?? []).map(Number);
    const lum = (c: number[]) => c.slice(0, 3).map((v) => {
      const n = v / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
    }).reduce((s, n, i) => s + n * [.2126, .7152, .0722][i]!, 0);
    const issues: { text: string; ratio: number }[] = [];
    for (const e of document.querySelectorAll('main *, footer *')) {
      const rect = e.getBoundingClientRect();
      if (!rect.width || !rect.height || ![...e.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())) continue;
      const style = getComputedStyle(e);
      let parent: Element | null = e; let background: number[] | null = null;
      while (parent) {
        const color = rgb(getComputedStyle(parent).backgroundColor);
        if (color.length >= 3 && (color.length === 3 || color[3] === 1)) { background = color; break; }
        parent = parent.parentElement;
      }
      if (!background) continue;
      const a = lum(rgb(style.color)); const b = lum(background);
      const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.6667 && parseInt(style.fontWeight) >= 700);
      if (ratio < (large ? 3 : 4.5)) issues.push({ text: e.textContent!.slice(0, 55), ratio });
    }
    return issues;
  })).toEqual([]);
}

for (const width of [360, 390, 1440]) {
  test(`visible text, target sizes and demo states remain accessible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/'); await page.locator('[data-use-example]').click();
    await page.locator('[data-point-id="D"]').click(); await checkTextContrast(page);
    await page.locator('[data-demo-open]').first().click();
    const confirm = page.locator('[data-demo-action="confirm"]');
    await checkTextContrast(page);
    await confirm.evaluate((b) => { (b as HTMLButtonElement).disabled = false; }); await confirm.click();
    await checkTextContrast(page);
    await page.getByRole('radio').first().check(); await page.locator('[data-demo-action="example"]').click();
    await checkTextContrast(page); await confirm.click(); await checkTextContrast(page);
    await page.locator('[data-demo-action="edit"]').click(); await checkTextContrast(page);
    await page.locator('[data-demo-action="back"]').click(); await page.locator('[data-demo-action="cancel"]').click();
    await checkTextContrast(page);
    const undersized = await page.locator('main button, main summary, header nav a, footer a, .demo-slot').evaluateAll((controls) =>
      controls.filter((c) => { const r = c.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44); })
        .map((c) => ({ text: c.textContent?.trim().slice(0, 55), width: c.getBoundingClientRect().width, height: c.getBoundingClientRect().height })),
    );
    expect(undersized).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
