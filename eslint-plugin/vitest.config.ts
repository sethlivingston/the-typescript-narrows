import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  define: {
    PACKAGE_VERSION: JSON.stringify(pkg.version),
  },
  test: {
    setupFiles: ['./tests/setup.ts'],
    globals: false,
    passWithNoTests: true,
  },
});
