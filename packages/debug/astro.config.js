import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import vercelServerless from '@astrojs/vercel/serverless';
// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelServerless({
    webAnalytics: { enabled: true }
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react()
  ]
});
