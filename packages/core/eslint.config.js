import { eslint } from '@siberiacancode/eslint';

export default eslint(
  { typescript: true },
  {
    name: '@webcam/core/ignores',
    ignores: ['*.md']
  },
  {
    name: '@webcam/core/rewrites',
    rules: {
      '@typescript-eslint/no-floating-promises': 'off'
    }
  }
);
