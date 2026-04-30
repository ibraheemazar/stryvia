# Shared tooling configuration

This directory holds the shared tooling presets consumed by every workspace in the monorepo.
Centralising these here keeps lint/format/type-check rules consistent across apps and
packages, and makes upgrades a one-PR change instead of an N-PR change.

| Sub-package                   | Purpose                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| [`typescript/`](./typescript) | `@stryvia/typescript-config` — `base`, `nextjs`, `library` tsconfig presets |
| [`eslint/`](./eslint)         | `@stryvia/eslint-config` — `base`, `react`, `nextjs` flat-config presets    |
| [`prettier/`](./prettier)     | `@stryvia/prettier-config` — shared Prettier options                        |

## Using a TypeScript preset

```jsonc
// apps/producer/tsconfig.json
{
  "extends": "@stryvia/typescript-config/nextjs.json",
  "include": ["**/*.ts", "**/*.tsx", "next-env.d.ts"],
}
```

## Using an ESLint preset

```js
// apps/producer/eslint.config.js
import nextConfig from '@stryvia/eslint-config/nextjs';

export default nextConfig;
```

## Using the Prettier preset

```jsonc
// package.json
{
  "prettier": "@stryvia/prettier-config",
}
```

The root `package.json` already wires this up, so any workspace inherits it automatically
when Prettier is invoked from the repo root (`npm run format`).
