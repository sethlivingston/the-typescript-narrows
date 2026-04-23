import { describe, it, expect } from 'vitest';
import plugin from '../../src/index.js';

describe('tooling config preset', () => {
  it('exports a tooling config as an array', () => {
    expect(plugin.configs).toBeDefined();
    const tooling = (plugin.configs as Record<string, unknown>).tooling;
    expect(Array.isArray(tooling)).toBe(true);
  });

  it('targets conventional config entrypoints', () => {
    const tooling = (plugin.configs as Record<string, unknown>).tooling as Array<Record<string, unknown>>;
    const files = tooling.flatMap(config => {
      const configFiles = config.files as string[] | undefined;
      return configFiles ?? [];
    });

    expect(files).toContain('**/eslint.config.ts');
    expect(files).toContain('**/eslint.config.mjs');
    expect(files).toContain('**/vite.config.ts');
    expect(files).toContain('**/vitest.config.ts');
    expect(files).toContain('**/tsup.config.ts');
    expect(files).toContain('**/playwright.config.ts');
    expect(files).toContain('**/prettier.config.cjs');
    expect(files).toContain('**/tailwind.config.tsx');
    expect(files).not.toContain('**/*.test.ts');
    expect(files).not.toContain('src/**/*.ts');
  });

  it('relaxes import/no-default-export for tooling files only', () => {
    const tooling = (plugin.configs as Record<string, unknown>).tooling as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};

    for (const config of tooling) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    expect(allRules['import/no-default-export']).toBe('off');
    expect(allRules['@typescript-eslint/no-floating-promises']).toBe('error');
  });
});
