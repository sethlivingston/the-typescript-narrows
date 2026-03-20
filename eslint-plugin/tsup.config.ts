import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  target: 'node18',
  platform: 'node',
  splitting: false,
  sourcemap: false,
  define: {
    PACKAGE_VERSION: JSON.stringify(pkg.version),
  },
  external: [
    'eslint',
    /^@typescript-eslint/,
    /^typescript-eslint/,
    /^eslint-plugin-import/,
    'typescript',
  ],
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
});
