const { prettier } = require('@siberiacancode/prettier');

/** @type {import('prettier').Config} */
module.exports = {
  ...prettier,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
