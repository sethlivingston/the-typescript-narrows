import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ESLint } from 'eslint';
import plugin from '../../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function createESLintWithStrict(
  extraConfigs: ESLint.ConfigData[] = [],
): ESLint {
  const strict = (plugin.configs as Record<string, unknown>)
    .strict as ESLint.ConfigData[];

  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      ...strict,
      ...extraConfigs,
      {
        languageOptions: {
          parserOptions: {
            projectService: {
              allowDefaultProject: ['*.ts', '*.tsx'],
            },
            tsconfigRootDir: __dirname,
          },
        },
      },
    ],
  });
}

function createESLintWithConfigs(
  configs: ESLint.ConfigData[],
  allowDefaultProject: string[] = ['*.ts', '*.tsx'],
): ESLint {
  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      ...configs,
      {
        languageOptions: {
          parserOptions: {
            projectService: {
              allowDefaultProject,
            },
            tsconfigRootDir: __dirname,
          },
        },
      },
    ],
  });
}

describe('strict preset integration', () => {
  it('activates with a single import and reports expected violations', async () => {
    const eslint = createESLintWithStrict();

    // Sample code that should trigger @typescript-eslint/no-explicit-any
    const results = await eslint.lintText(
      `export const x: any = 'hello';\n`,
      { filePath: join(__dirname, 'test.ts') },
    );

    const messages = results[0].messages;
    const ruleIds = messages.map(m => m.ruleId);

    // no-explicit-any should fire
    expect(ruleIds).toContain('@typescript-eslint/no-explicit-any');
  });

  it('composes alongside other user configs without conflicts', async () => {
    const userConfig = {
      rules: {
        'no-console': 'warn' as const,
      },
    };

    const eslint = createESLintWithStrict([userConfig]);

    const results = await eslint.lintText(
      `export function greet(): string { console.log('hi'); return 'hi'; }\n`,
      { filePath: join(__dirname, 'test.ts') },
    );

    const messages = results[0].messages;
    const ruleIds = messages.map(m => m.ruleId);

    // User's no-console rule should also work alongside our preset
    expect(ruleIds).toContain('no-console');
  });

  it('reports ban-enums violations in strict preset', async () => {
    const eslint = createESLintWithStrict();
    const results = await eslint.lintText(
      `export enum Status { Active, Inactive }\n`,
      { filePath: join(__dirname, 'test.ts') },
    );
    const ruleIds = results[0].messages.map(m => m.ruleId);
    expect(ruleIds).toContain('typescript-narrows/ban-enums');
  });

  it('reports ban-barrel-files violations in strict preset', async () => {
    const eslint = createESLintWithStrict();
    const results = await eslint.lintText(
      `export { User } from './user';\nexport { Order } from './order';\n`,
      { filePath: join(__dirname, 'index.ts') },
    );
    const ruleIds = results[0].messages.map(m => m.ruleId);
    expect(ruleIds).toContain('typescript-narrows/ban-barrel-files');
  });

  it('allows __NAME__ build-time injected constants in strict preset', async () => {
    const eslint = createESLintWithStrict();
    const results = await eslint.lintText(
      `declare const __ONEWAY_HTTP_EXPECTED_ROOT_TARGET__: 'browser' | 'node';

export const define = {
  __ONEWAY_HTTP_EXPECTED_ROOT_TARGET__: JSON.stringify('browser'),
};

export const expectedRootTarget = __ONEWAY_HTTP_EXPECTED_ROOT_TARGET__;
`,
      { filePath: join(__dirname, 'injected-constants.ts') },
    );

    const ruleIds = results[0].messages.map(m => m.ruleId);
    expect(ruleIds).not.toContain('@typescript-eslint/naming-convention');
  });
});

describe('test preset integration', () => {
  it('relaxes ceremony-heavy rules in test files while keeping no-floating-promises enabled', async () => {
    const strict = (plugin.configs as Record<string, unknown>)
      .strict as ESLint.ConfigData[];
    const testConfig = (plugin.configs as Record<string, unknown>)
      .test as ESLint.ConfigData[];
    const eslint = createESLintWithConfigs([...strict, ...testConfig]);

    const results = await eslint.lintText(
      `import { expect, it } from 'vitest';

it('works', async () => {
  const subject = (input: { value: string }) => {
    input.value = 'next';
  };

  subject({ value: 'first' });
  Promise.resolve('done');
  expect(1).toBe(1);
});
`,
      { filePath: join(__dirname, 'example.spec.tsx') },
    );

    const ruleIds = results[0].messages.map(m => m.ruleId);

    expect(ruleIds).not.toContain('@typescript-eslint/explicit-function-return-type');
    expect(ruleIds).not.toContain('@typescript-eslint/prefer-readonly-parameter-types');
    expect(ruleIds).not.toContain('@typescript-eslint/require-await');
    expect(ruleIds).toContain('@typescript-eslint/no-floating-promises');
  });
});

describe('tooling preset integration', () => {
  it('allows default exports for tooling entrypoints', async () => {
    const strict = (plugin.configs as Record<string, unknown>)
      .strict as ESLint.ConfigData[];
    const tooling = (plugin.configs as Record<string, unknown>)
      .tooling as ESLint.ConfigData[];
    const eslint = createESLintWithConfigs([...strict, ...tooling]);

    const results = await eslint.lintText(
      `export default {
  test: {
    globals: true,
  },
};
`,
      { filePath: join(__dirname, 'vitest.config.ts') },
    );

    const ruleIds = results[0].messages.map(m => m.ruleId);

    expect(ruleIds).not.toContain('import/no-default-export');
  });

  it('keeps default exports disallowed for ordinary source files', async () => {
    const strict = (plugin.configs as Record<string, unknown>)
      .strict as ESLint.ConfigData[];
    const tooling = (plugin.configs as Record<string, unknown>)
      .tooling as ESLint.ConfigData[];
    const eslint = createESLintWithConfigs([...strict, ...tooling]);

    const results = await eslint.lintText(
      `export default function greet(): string {
  return 'hi';
}
`,
      { filePath: join(__dirname, 'source.ts') },
    );

    const ruleIds = results[0].messages.map(m => m.ruleId);

    expect(ruleIds).toContain('import/no-default-export');
  });
});
