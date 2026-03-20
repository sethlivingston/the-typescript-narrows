import type { ESLint } from 'eslint';
import { rules } from './rules/index.js';
import { createStrictConfig } from './configs/strict.js';

// Replaced at build time by tsup define
declare const PACKAGE_VERSION: string;

// Type cast needed: @typescript-eslint/utils RuleModule types are not directly
// compatible with ESLint v10's RuleDefinition types, but they work at runtime.
const plugin: ESLint.Plugin = {
  meta: {
    name: '@sethlivingston/eslint-plugin-typescript-narrows',
    version: PACKAGE_VERSION,
  },
  rules: rules as unknown as ESLint.Plugin['rules'],
  configs: {},
};

// Self-reference: configs need to reference the plugin object
Object.assign(plugin.configs!, {
  strict: createStrictConfig(plugin),
});

export default plugin;
