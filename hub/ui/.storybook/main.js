const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');

module.exports = {
  stories: ['../src/**/*.stories.jsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async config => {
    config.resolve.alias['@src'] = srcDir;
    return config;
  },
};
