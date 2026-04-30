// Shared ESLint flat config for Next.js apps. Layers Next's rules on top of ./react.js.
//
// `eslint-config-next` is still distributed as a legacy (.eslintrc) config, so we use
// FlatCompat to bridge it into flat config. This is the pattern the Next.js team
// recommends until they ship a native flat-config build.

import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';
import reactConfig from './react.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  ...reactConfig,
  ...compat.extends('next/core-web-vitals'),

  // `compat.extends('next/core-web-vitals')` installs `eslint-config-next/parser`,
  // which doesn't surface type info to type-aware tseslint rules (e.g.
  // `@typescript-eslint/consistent-type-imports` in tseslint v8). Re-pin the
  // tseslint parser for TS files and turn on the Project Service — it
  // auto-discovers each consumer app's tsconfig.json from the cwd, so this works
  // for every app without per-app wiring.
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
  },

  {
    rules: {
      // The base react config keeps `react-in-jsx-scope` off via the jsx-runtime preset;
      // re-assert here so a Next consumer can't accidentally turn it back on.
      'react/react-in-jsx-scope': 'off',
    },
  },
];
