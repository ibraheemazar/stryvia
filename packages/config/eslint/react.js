// Shared ESLint flat config for any React code in the monorepo (Next.js apps,
// the @stryvia/ui component library, etc.). Layers on top of ./base.js.

import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import baseConfig from './base.js';

export default [
  ...baseConfig,

  // React's flat-config recommended preset (covers JSX, prop validation, etc.).
  reactPlugin.configs.flat.recommended,
  // Modern JSX runtime — no need to `import React` in every file (Next.js / React 17+).
  reactPlugin.configs.flat['jsx-runtime'],

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Hooks rules — non-negotiable. These catch the two most common React bugs:
      // calling hooks conditionally, and missing/extra deps in useEffect/useMemo.
      ...reactHooks.configs.recommended.rules,

      // TypeScript handles prop typing; the legacy prop-types rule is noise.
      'react/prop-types': 'off',
    },
  },
];
