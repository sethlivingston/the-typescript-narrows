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
              allowDefaultProject: ['*.ts'],
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
});
