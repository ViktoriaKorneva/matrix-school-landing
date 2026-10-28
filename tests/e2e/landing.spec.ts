import { expect, test } from '@playwright/test';

test('supporting landing keeps one clear heading hierarchy and honest disclosures', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  const headings = await page.locator('main h1, main h2, main h3').evaluateAll((elements) =>
    elements.map((element) => ({ level: Number(element.tagName.slice(1)), text: element.textContent?.trim() ?? '' })),
  );
  expect(headings.every((heading, index) => index === 0 || heading.level <= headings[index - 1]!.level + 1)).toBe(true);

  await expect(page.getByRole('heading', { name: 'Путь обучения не прячет механику за обещанием' })).toBeVisible();
  await expect(page.getByText('Это вымышленная программа для портфолио-концепта.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'У метода есть чёткая граница' })).toBeVisible();
  await expect(page.getByText('Здесь нет реальных учеников, преподавателей, квалификаций, отзывов, гарантий или научных заявлений.')).toBeVisible();

  const header = page.getByRole('banner');
  await expect(header.getByRole('link', { name: 'Как это работает' })).toHaveAttribute('href', '#how-it-works');
  await expect(header.getByRole('link', { name: 'Программа' })).toHaveAttribute('href', '#program');
  await expect(header.getByRole('link', { name: 'Метод' })).toHaveAttribute('href', '#method');
  await expect(header.getByRole('link', { name: 'Вопросы' })).toHaveAttribute('href', '#faq');
});

test('FAQ is keyboard-operable and public links have a clear destination', async ({ page }) => {
  await page.goto('/');

  const question = page.getByText('Куда попадает введённая дата?', { exact: true });
  await question.focus();
  await question.press('Enter');
  await expect(page.getByText('Никуда за пределы текущей вкладки.')).toBeVisible();

  const repositoryLinks = page.getByRole('link', { name: /GitHub|репозиторий/ });
  await expect(repositoryLinks).toHaveCount(2);
  for (const link of await repositoryLinks.all()) {
    await expect(link).toHaveAttribute('href', 'https://github.com/ViktoriaKorneva/matrix-school-landing');
  }
  await expect(page.getByRole('link', { name: 'К калькулятору', exact: true })).toHaveAttribute('href', '#page-title');
});

test('forced colors preserves visible boundaries and focus affordances', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');

  const question = page.getByText('Это настоящая онлайн-школа?', { exact: true });
  await question.focus();
  await expect(question).toBeFocused();
  await expect(page.locator('.method__disclosure')).toBeVisible();
});
