import { eslint } from '@siberiacancode/eslint';

export default eslint(
  { typescript: true, react: true, jsx: true },
  {
    name: '@webcam/react/ignores',
    ignores: ['*.md']
  },
  {
    name: '@webcam/react/rewrites',
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/no-floating-promises': 'off'
    }
  }
);
