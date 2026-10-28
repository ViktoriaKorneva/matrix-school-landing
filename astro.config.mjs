import node from '@astrojs/node';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: true,
  },
  env: {
    schema: {
      AI_CHAT_ENABLED: envField.boolean({
        context: 'server',
        access: 'secret',
        default: false,
      }),
      AI_PROVIDER_BASE_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      AI_PROVIDER_MODEL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      AI_PROVIDER_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
});
