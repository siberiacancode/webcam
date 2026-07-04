import react from '@vitejs/plugin-react';
import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import pkg from './package.json';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    react(),
    dts({
      afterBuild: () => {
        copyFileSync('dist/index.d.ts', 'dist/index.d.mts');
      },
      entryRoot: 'src',
      outDir: 'dist',
      tsconfigPath: './tsconfig.json'
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: pkg.name,
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.ts')
      },
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'react/jsx-runtime'
      ],
      output: [
        {
          dir: 'dist/esm',
          entryFileNames: '[name].mjs',
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: 'src'
        },
        {
          dir: 'dist/cjs',
          entryFileNames: '[name].cjs',
          exports: 'named',
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: 'src'
        }
      ]
    },
    emptyOutDir: true,
    outDir: 'dist',
    sourcemap: true
  }
});
