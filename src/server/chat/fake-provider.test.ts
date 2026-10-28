import { describe, expect, it } from 'vitest';

import { FakeChatProvider } from './fake-provider';

describe('FakeChatProvider', () => {
  it('returns a deterministic reply without an external request', async () => {
    const provider = new FakeChatProvider('Тестовый ответ');

    await expect(provider.complete({ message: 'Что такое матрица?' })).resolves.toEqual({
      text: 'Тестовый ответ',
    });
  });
});
