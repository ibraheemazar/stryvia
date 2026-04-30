import nextConfig from '@stryvia/eslint-config/nextjs';

export default [
  ...nextConfig,
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  {
    // shadcn/ui components are intentionally copied unmodified — opt them out
    // of the strict lint rules we apply to first-party code.
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
