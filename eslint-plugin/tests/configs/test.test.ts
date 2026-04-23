import type { Linter } from 'eslint';
import { describe, it, expect } from 'vitest';
import plugin from '../../src/index.js';
import { scopeConfigsToFiles } from '../../src/configs/shared.js';

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
    const originalConfig: Linter.Config[] = [
      {
        languageOptions: {
          parserOptions: {
            projectService: {
              allowDefaultProject: ['*.ts'],
            },
          },
        },
        rules: {
          'no-console': 'error',
        },
      },
    ];
    const [scopedConfig] = scopeConfigsToFiles(originalConfig, ['**/*.test.ts']);
    const originalParserOptions = (
      originalConfig[0].languageOptions as { parserOptions?: { projectService?: { allowDefaultProject?: string[] } } }
    ).parserOptions;
    const scopedParserOptions = (
      scopedConfig.languageOptions as { parserOptions?: { projectService?: { allowDefaultProject?: string[] } } }
    ).parserOptions;

    expect(scopedConfig.rules).not.toBe(originalConfig[0].rules);
    expect(scopedParserOptions).not.toBe(originalParserOptions);
    expect(scopedParserOptions?.projectService).not.toBe(originalParserOptions?.projectService);
    expect(scopedParserOptions?.projectService?.allowDefaultProject).not.toBe(
      originalParserOptions?.projectService?.allowDefaultProject,
    );
  });
});
