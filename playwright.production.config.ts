import { defineConfig } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import base from './playwright.config';

mkdirSync('.impeccable/phase9', { recursive: true });

// A separate port and no server reuse prevent a dev server from satisfying this gate.
export default defineConfig(base, {
  outputDir: 'test-results/production',
  globalSetup: './tests/support/production-evidence.ts',
  use: { baseURL: 'http://127.0.0.1:4323' },
  webServer: {
    command: 'node ./dist/server/entry.mjs > .impeccable/phase9/server.stdout.log 2> .impeccable/phase9/server.stderr.log',
    env: { HOST: '127.0.0.1', PORT: '4323' },
    url: 'http://127.0.0.1:4323',
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
