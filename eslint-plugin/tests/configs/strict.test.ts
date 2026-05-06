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
    expect(namingConvention.slice(1)).toContainEqual({
      selector: 'objectLiteralProperty',
      modifiers: ['requiresQuotes'],
      format: null,
    });

    // #31 fix 1: classProperty with leadingUnderscore allow
    expect(namingConvention.slice(1)).toContainEqual({
      selector: 'classProperty',
      format: ['camelCase'],
      leadingUnderscore: 'allow',
    });
    // #31 fix 2: PascalCase allowed for variables
    expect(namingConvention.slice(1)).toContainEqual({
      selector: 'variable',
      format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
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

  it('registers no-unsafe-type-assertion rule in plugin', () => {
    expect(plugin.rules).toBeDefined();
    expect((plugin.rules as Record<string, unknown>)['no-unsafe-type-assertion']).toBeDefined();
  });

  it('configures consistent-type-assertions with assertionStyle: as (#30)', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};
    for (const config of strict) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    const cta = allRules['@typescript-eslint/consistent-type-assertions'] as [string, Record<string, unknown>];
    expect(cta[0]).toBe('error');
    expect(cta[1].assertionStyle).toBe('as');
    expect(cta[1].objectLiteralTypeAssertions).toBe('never');
  });

  it('configures no-unnecessary-condition with allowConstantLoopConditions (#32)', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};
    for (const config of strict) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    const nuc = allRules['@typescript-eslint/no-unnecessary-condition'] as [string, Record<string, unknown>];
    expect(nuc[0]).toBe('error');
    expect(nuc[1].allowConstantLoopConditions).toBe(true);
  });

  it('configures no-unused-vars with argsIgnorePattern (#33)', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};
    for (const config of strict) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    const nuv = allRules['@typescript-eslint/no-unused-vars'] as [string, Record<string, unknown>];
    expect(nuv[0]).toBe('error');
    expect(nuv[1].argsIgnorePattern).toBe('^_');
    expect(nuv[1].caughtErrorsIgnorePattern).toBe('^_');
    expect(nuv[1].varsIgnorePattern).toBe('^_');
    expect(nuv[1].ignoreRestSiblings).toBe(true);
  });

  it('enables no-unsafe-type-assertion in strict config (#29)', () => {
    const strict = (plugin.configs as Record<string, unknown>).strict as Array<Record<string, unknown>>;
    const allRules: Record<string, unknown> = {};
    for (const config of strict) {
      if (config.rules) {
        Object.assign(allRules, config.rules as Record<string, unknown>);
      }
    }

    expect(allRules['typescript-narrows/no-unsafe-type-assertion']).toBe('error');
  });
});

