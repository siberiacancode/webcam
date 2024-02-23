import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: {
      prefixDefaultLocale: true
    }
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  })
});
