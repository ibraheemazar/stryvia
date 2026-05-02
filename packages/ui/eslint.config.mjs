import reactConfig from '@stryvia/eslint-config/react';

export default [
  ...reactConfig,
  {
    settings: {
      react: {
        version: '18.3',
      },
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    // shadcn/ui components are intentionally copied unmodified — opt them out
    // of the strict lint rules we apply to first-party code.
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
