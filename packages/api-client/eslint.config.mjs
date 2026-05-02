import baseConfig from '@stryvia/eslint-config/base';

export default [
  ...baseConfig,
  {
    ignores: ['src/generated/**'],
  },
];
