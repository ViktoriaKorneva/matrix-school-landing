import { expect, test } from '@playwright/test';

test('supporting landing keeps one clear heading hierarchy and honest disclosures', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const headings = await page.locator('main h1, main h2, main h3').evaluateAll((elements) =>
    elements.map((element) => ({ level: Number(element.tagName.slice(1)), text: element.textContent?.trim() ?? '' })),
  );
  expect(headings.every((heading, index) => index === 0 || heading.level <= headings[index - 1]!.level + 1)).toBe(true);

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Первый разбор:');
  await expect(page.locator('.portfolio-status')).toHaveText('Портфолио-концепт · школа не существует.');
  await expect(page.locator('#E02')).toContainText('Елена хочет снова рисовать.');
  await expect(page.locator('#B03')).toContainText('не обещает клиентов, дохода');
  await expect(page.locator('#E01 .teacher-photo')).toHaveAttribute('alt', /сгенерированный.*вымышленной/);
  await expect(page.locator('#B07 .testimonial-avatar')).toHaveCount(3);

  const header = page.getByRole('banner');
  await expect(header.getByRole('link', { name: 'О курсе' })).toHaveAttribute('href', '#course');
  await expect(header.getByRole('link', { name: 'Программа' })).toHaveAttribute('href', '#B05');
  await expect(header.getByRole('link', { name: 'Учебный пример' })).toHaveAttribute('href', '#B04');
  await expect(header.getByRole('link', { name: 'Вопросы' })).toHaveAttribute('href', '#B10');
});

test('FAQ is keyboard-operable and public links have a clear destination', async ({ page }) => {
  await page.goto('/');

  const question = page.locator('#B10 summary').filter({ hasText: 'Что сохраняется после демозаписи?' });
  await question.focus();
  await question.press('Enter');
  await expect(question.locator('..')).toHaveAttribute('open', '');
  await expect(question.locator('..')).toContainText('Имя и email не сохраняются.');

  const repositoryLinks = page.locator('a[href="https://github.com/ViktoriaKorneva/matrix-school-landing"]');
  await expect(repositoryLinks).toHaveCount(2);
  for (const link of await repositoryLinks.all()) {
    await expect(link).toHaveAttribute('href', 'https://github.com/ViktoriaKorneva/matrix-school-landing');
  }
  await expect(page.locator('#B08').getByRole('link', { name: 'Перейти к открытому уроку', exact: true })).toHaveCount(2);
});

test('forced colors preserves visible boundaries and focus affordances', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');

  const question = page.locator('#B10 summary').first();
  await question.focus();
  await expect(question).toBeFocused();
  await expect(page.locator('.boundary-copy')).toBeVisible();
});
