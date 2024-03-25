import { generateRollupConfig } from '@siberiacancode/builder';

import pkg from './package.json';

export default generateRollupConfig({
  pkg,
  configs: {
    babel: {
      plugins: ['react-require', '@babel/plugin-transform-runtime'],
      babelHelpers: 'runtime'
    }
  }
});
