import { describe, it, expect } from 'vitest';
import plugin from '../../src/index.js';

describe('strict config preset', () => {
  it('exports a strict config as an array', () => {
    expect(plugin.configs).toBeDefined();
    const strict = (plugin.configs as Record<string, unknown>).strict;
    expect(Array.isArray(strict)).toBe(true);
  });

  it('includes typescript-eslint strict-type-checked base', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    // strictTypeChecked adds multiple config entries; at least one should have
    // @typescript-eslint rules
    const hasTypescriptEslint = strict.some(
      config => {
        const rules = config.rules as Record<string, unknown> | undefined;
        return rules && Object.keys(rules).some(k => k.startsWith('@typescript-eslint/'));
      }
    );
    expect(hasTypescriptEslint).toBe(true);
  });

  it('configures opinionated @typescript-eslint overrides', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};
    for (const config of strict) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    // Rules NOT in strict-type-checked that our preset must add
    expect(allRules['@typescript-eslint/consistent-type-definitions']).toBeDefined();
    expect(allRules['@typescript-eslint/consistent-type-imports']).toBeDefined();
    expect(allRules['@typescript-eslint/explicit-function-return-type']).toBeDefined();
    expect(allRules['@typescript-eslint/prefer-readonly']).toBeDefined();
    expect(allRules['@typescript-eslint/strict-boolean-expressions']).toBeDefined();
    expect(allRules['@typescript-eslint/naming-convention']).toBeDefined();

    const namingConvention = allRules['@typescript-eslint/naming-convention'] as [
      string,
      ...Array<Record<string, unknown>>,
    ];

    expect(namingConvention.slice(1)).toContainEqual({
      selector: 'variable',
      modifiers: ['const', 'global'],
      filter: { regex: '^__[_A-Z0-9]+__$', match: true },
      format: null,
    });
    expect(namingConvention.slice(1)).toContainEqual({
      selector: 'objectLiteralProperty',
      filter: { regex: '^__[_A-Z0-9]+__$', match: true },
      format: null,
    });
  });

  it('configures import plugin rules', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};
    for (const config of strict) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    expect(allRules['import/no-default-export']).toBe('error');
    expect(allRules['import/no-cycle']).toBe('error');
    expect(allRules['import/no-mutable-exports']).toBe('error');
  });

  it('configures ESLint core rules', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};
    for (const config of strict) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    expect(allRules['no-empty']).toBe('error');
    expect(allRules['prefer-const']).toBe('error');
    expect(allRules['no-var']).toBe('error');
  });

  it('registers typescript-narrows plugin', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const hasNarrowsPlugin = strict.some(config => {
      const plugins = config.plugins as Record<string, unknown> | undefined;
      return plugins && 'typescript-narrows' in plugins;
    });
    expect(hasNarrowsPlugin).toBe(true);
  });
});
