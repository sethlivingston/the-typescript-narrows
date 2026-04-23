import type { ESLint, Linter } from 'eslint';
import { createStrictConfig } from './strict.js';
import { scopeConfigsToFiles } from './shared.js';

const testFiles = [
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.test.mts',
  '**/*.test.cts',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/*.spec.mts',
  '**/*.spec.cts',
  '**/__tests__/**/*.ts',
  '**/__tests__/**/*.tsx',
  '**/__tests__/**/*.mts',
  '**/__tests__/**/*.cts',
  'tests/**/*.ts',
  'tests/**/*.tsx',
  'tests/**/*.mts',
  'tests/**/*.cts',
] as const satisfies readonly string[];

export function createTestConfig(plugin: ESLint.Plugin): Linter.Config[] {
  return [
    ...scopeConfigsToFiles(createStrictConfig(plugin), testFiles),
    {
      files: [...testFiles],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        '@typescript-eslint/require-await': 'off',
      },
    },
  ];
}
