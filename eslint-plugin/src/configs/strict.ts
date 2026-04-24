import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import-x';
import type { ESLint, Linter } from 'eslint';

const INJECTED_CONSTANT_REGEX = '^__[_A-Z0-9]+__$'

export function createStrictConfig(plugin: ESLint.Plugin): Linter.Config[] {
  return [
    ...tseslint.configs.strictTypeChecked,
    {
      plugins: {
        'import': importPlugin as unknown as ESLint.Plugin,
      },
      rules: {
        'import/no-default-export': 'error',
        'import/no-cycle': 'error',
        'import/no-mutable-exports': 'error',
      },
    },
    {
      plugins: {
        'typescript-narrows': plugin,
      },
      rules: {
        // ESLint core rules (3)
        'no-empty': 'error',
        'no-var': 'error',
        'prefer-const': 'error',

        // @typescript-eslint rules already in strict-type-checked (17, explicit override to 'error')
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unsafe-assignment': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',
        '@typescript-eslint/no-unsafe-return': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/return-await': ['error', 'always'],
        '@typescript-eslint/only-throw-error': 'error',
        '@typescript-eslint/no-unnecessary-type-parameters': 'error',
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'never' },
        ],

        // @typescript-eslint rules NOT in strict-type-checked (7, explicitly added)
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
        ],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/prefer-readonly-parameter-types': [
          'error',
          { allow: [], treatMethodsAsReadonly: true },
        ],
        '@typescript-eslint/strict-boolean-expressions': 'error',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            modifiers: ['const', 'global'],
            filter: { regex: INJECTED_CONSTANT_REGEX, match: true },
            format: null,
          },
          {
            selector: 'objectLiteralProperty',
            filter: { regex: INJECTED_CONSTANT_REGEX, match: true },
            format: null,
          },
          { selector: 'default', format: ['camelCase'] },
          { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
          {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          { selector: 'typeLike', format: ['PascalCase'] },
          { selector: 'enumMember', format: ['PascalCase'] },
          {
            selector: 'interface',
            format: ['PascalCase'],
            custom: { regex: '^I[A-Z]', match: false },
          },
          {
            selector: 'typeAlias',
            format: ['PascalCase'],
            custom: { regex: '^T[A-Z]', match: false },
          },
        ],

        // typescript-narrows custom rules (2)
        'typescript-narrows/ban-enums': 'error',
        'typescript-narrows/ban-barrel-files': 'error',
      },
    },
  ];
}
