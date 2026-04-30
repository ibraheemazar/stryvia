// Shared ESLint flat config (ESLint 9+) for any TypeScript code in the monorepo.
// Consumers extend this with framework-specific configs (./react.js, ./nextjs.js).

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    // Anything tool-generated or vendored should not be linted. Each consumer can
    // add to this list, but these defaults cover the common cases for the monorepo.
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.min.js',
    ],
  },

  // ESLint's recommended JS rules.
  js.configs.recommended,

  // typescript-eslint's recommended rules — non-type-checked variant. The full
  // type-checked config is significantly slower and requires a parserOptions.project
  // pointing to a real tsconfig, which each consumer wires up themselves if they want it.
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // typescript-eslint rules — scoped to TS files only. `consistent-type-imports`
  // is type-aware in tseslint v8, so it would crash on plain .js/.mjs config
  // files (postcss.config.mjs, next.config.mjs, etc.) that aren't in the project's
  // tsconfig include. Scoping here keeps the rule available where it's meaningful
  // and silent where it isn't.
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      // Allow intentionally-unused args/vars when prefixed with `_` — common ergonomic
      // pattern for callbacks where you must keep the signature but ignore some args.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // We rely on TypeScript itself to flag truly unused vars; turn off the JS rule
      // to avoid duplicate reports.
      'no-unused-vars': 'off',

      // Prefer `import type` for type-only imports — pairs with verbatimModuleSyntax in tsconfig.
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  // Disable any stylistic rules that would conflict with Prettier. MUST come last.
  prettierConfig,
);
