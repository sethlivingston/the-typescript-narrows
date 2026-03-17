import { defineConfig } from 'tsup';

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
