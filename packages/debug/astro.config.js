import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercelServerless from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';
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
