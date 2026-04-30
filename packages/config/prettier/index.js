// Shared Prettier config for the STRYVIA monorepo.
// Consumed via the `"prettier": "@stryvia/prettier-config"` field in package.json.

/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
};
