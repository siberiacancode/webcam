import { defineMain } from '@storybook/react-vite/node';

export default defineMain({
  staticDirs: ['../src'],
  stories: ['./stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links'],
  framework: '@storybook/react-vite',
  typescript: {
    check: true
  }
});
