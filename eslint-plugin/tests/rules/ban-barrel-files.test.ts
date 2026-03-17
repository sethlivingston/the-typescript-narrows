import { RuleTester } from '@typescript-eslint/rule-tester';
import { banBarrelFiles } from '../../src/rules/ban-barrel-files.js';

const ruleTester = new RuleTester();

ruleTester.run('ban-barrel-files', banBarrelFiles, {
  valid: [
    {
      code: 'export function greet(): string { return "hi"; }',
      filename: '/project/src/utils/index.ts',
    },
    {
      code: "export { User } from './user';\nexport { Order } from './order';",
      filename: '/project/src/index.ts',
      options: [{ allowPatterns: ['**/src/index.ts'] }],
    },
    {
      code: "export { User } from './user';",
      filename: '/project/src/models/types.ts',
    },
    {
      code: "export { User } from './user';\nexport const VERSION = '1.0';",
      filename: '/project/src/index.ts',
    },
    {
      code: '',
      filename: '/project/src/index.ts',
    },
    {
      code: 'export const x = 1;',
      filename: '/project/src/index.ts',
    },
  ],
  invalid: [
    {
      code: "export { User } from './user';\nexport { Order } from './order';",
      filename: '/project/src/models/index.ts',
      errors: [{ messageId: 'banned' as const }],
    },
    {
      code: "export * from './user';\nexport * from './order';",
      filename: '/project/src/models/index.ts',
      errors: [{ messageId: 'banned' as const }],
    },
    {
      code: "export type { User } from './user';\nexport type { Order } from './order';",
      filename: '/project/src/index.ts',
      errors: [{ messageId: 'banned' as const }],
    },
  ],
});
