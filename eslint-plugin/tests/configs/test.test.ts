import { describe, it, expect } from 'vitest';
import plugin from '../../src/index.js';

describe('test config preset', () => {
  it('exports a test config as an array', () => {
    expect(plugin.configs).toBeDefined();
    const testConfig = (plugin.configs as Record<string, unknown>).test;
    expect(Array.isArray(testConfig)).toBe(true);
  });

  it('targets conventional test file patterns including tsx cases', () => {
    const testConfig = (plugin.configs as Record<string, unknown>).test as Array<Record<string, unknown>>;
    const files = testConfig.flatMap(config => {
      const configFiles = config.files as string[] | undefined;
      return configFiles ?? [];
    });

    expect(files).toContain('**/*.test.ts');
    expect(files).toContain('**/*.spec.ts');
    expect(files).toContain('**/*.test.tsx');
    expect(files).toContain('**/*.spec.tsx');
    expect(files).toContain('**/*.test.mts');
    expect(files).toContain('**/*.spec.cts');
    expect(files).toContain('tests/**/*.ts');
    expect(files).toContain('tests/**/*.tsx');
    expect(files).toContain('tests/**/*.mts');
    expect(files).toContain('tests/**/*.cts');
  });

  it('relaxes the selected ceremony-heavy rules for tests', () => {
    const testConfig = (plugin.configs as Record<string, unknown>).test as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};

    for (const config of testConfig) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    expect(allRules['@typescript-eslint/explicit-function-return-type']).toBe('off');
    expect(allRules['@typescript-eslint/prefer-readonly-parameter-types']).toBe('off');
    expect(allRules['@typescript-eslint/require-await']).toBe('off');
    expect(allRules['@typescript-eslint/no-floating-promises']).toBe('error');
  });
});
