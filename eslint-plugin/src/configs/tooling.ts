import type { ESLint, Linter } from 'eslint';
import { createStrictConfig } from './strict.js';
import { scopeConfigsToFiles } from './shared.js';

const toolingConfigNames = [
  'eslint.config',
  'vite.config',
  'vitest.config',
  'tsup.config',
  'jest.config',
  'playwright.config',
  'rollup.config',
  'webpack.config',
  'postcss.config',
  'prettier.config',
  'stylelint.config',
  'tailwind.config',
  'commitlint.config',
] as const;

const toolingExtensions = [
  'js',
  'cjs',
  'mjs',
  'ts',
  'tsx',
  'cts',
  'mts',
] as const;

const toolingFiles = toolingConfigNames.flatMap(configName =>
  toolingExtensions.map(extension => `**/${configName}.${extension}`),
);

export function createToolingConfig(plugin: ESLint.Plugin): Linter.Config[] {
  return [
    ...scopeConfigsToFiles(createStrictConfig(plugin), toolingFiles),
    {
      files: [...toolingFiles],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ];
}
