/**
 * lint-staged — run formatters/linters only on the files you actually staged.
 *
 * The pre-commit hook invokes this; the typecheck step runs separately
 * because it needs whole-workspace context, not just the changed files.
 *
 * ESLint runs from each workspace's directory because the shared
 * `@stryvia/eslint-config/nextjs` uses `parserOptions.projectService: true`,
 * which auto-discovers tsconfig.json from cwd. Files outside any known
 * workspace are formatted by Prettier but skipped for ESLint — `npm run lint`
 * is still the source of truth for full validation.
 *
 * Ruff discovers the engine's pyproject.toml automatically from each file's
 * location, so we can hand it absolute paths from the repo root.
 */
const path = require('node:path');

const WORKSPACES = ['apps/admin', 'apps/producer'];

function workspaceFor(file) {
  const rel = path.relative(__dirname, file);
  return WORKSPACES.find((ws) => rel === ws || rel.startsWith(ws + path.sep));
}

function groupByWorkspace(files) {
  const groups = new Map();
  for (const file of files) {
    const ws = workspaceFor(file);
    if (!ws) continue;
    if (!groups.has(ws)) groups.set(ws, []);
    groups.get(ws).push(path.relative(path.join(__dirname, ws), file));
  }
  return groups;
}

function quote(p) {
  return `"${p.replace(/"/g, '\\"')}"`;
}

module.exports = {
  '*.{ts,tsx,js,jsx,mjs,cjs}': (files) => {
    const cmds = [`prettier --write ${files.map(quote).join(' ')}`];
    for (const [ws, wsFiles] of groupByWorkspace(files)) {
      cmds.push(
        `bash -c 'cd ${ws} && npx --no-install eslint --fix ${wsFiles.map(quote).join(' ')}'`,
      );
    }
    return cmds;
  },

  '*.{json,jsonc,md,mdx,yml,yaml,css,scss,html}': ['prettier --write'],

  'services/engine/**/*.py': [
    'services/engine/.venv/bin/ruff check --fix',
    'services/engine/.venv/bin/ruff format',
  ],
};
