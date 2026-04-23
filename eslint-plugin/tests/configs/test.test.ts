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

  it('does not share nested config objects with the strict preset', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const testConfig = (plugin.configs as Record<string, unknown>).test as Array<Record<string, unknown>>;
    const strictConfigWithRules = strict.find(config => config.rules !== undefined);
    const scopedConfigWithRules = testConfig.find(
      config => config.files !== undefined && config.rules !== undefined,
    );
    const strictConfigWithLanguageOptions = strict.find(config => config.languageOptions !== undefined);
    const scopedConfigWithLanguageOptions = testConfig.find(
      config => config.files !== undefined && config.languageOptions !== undefined,
    );

    expect(testConfig).toHaveLength(strict.length + 1);
    expect(strictConfigWithRules).toBeDefined();
    expect(scopedConfigWithRules).toBeDefined();
    expect(strictConfigWithLanguageOptions).toBeDefined();
    expect(scopedConfigWithLanguageOptions).toBeDefined();
    expect(scopedConfigWithRules?.rules).not.toBe(strictConfigWithRules?.rules);
    expect(scopedConfigWithLanguageOptions?.languageOptions).not.toBe(
      strictConfigWithLanguageOptions?.languageOptions,
    );
  });
});
