import { RuleTester } from '@typescript-eslint/rule-tester';
import { banEnums } from '../../src/rules/ban-enums.js';

const ruleTester = new RuleTester();

ruleTester.run('ban-enums', banEnums, {
  valid: [
    'const Status = { Active: "active", Inactive: "inactive" } as const;',
    'type Status = "active" | "inactive";',
    'const status: "active" | "inactive" = "active";',
    'const obj = { a: 1, b: 2 };',
    'interface User { name: string; }',
    'class User { name: string = ""; }',
    'function getStatus(): string { return "active"; }',
    'const Direction = { Up: 0, Down: 1, Left: 2, Right: 3 } as const; type Direction = typeof Direction[keyof typeof Direction];',
  ],
  invalid: [
    {
      code: 'enum Status { Active, Inactive }',
      errors: [{ messageId: 'banned' as const }],
    },
    {
      code: 'const enum Direction { Up, Down }',
      errors: [{ messageId: 'banned' as const }],
    },
    {
      code: 'enum Color { Red = "red", Blue = "blue" }',
      errors: [{ messageId: 'banned' as const }],
    },
    {
      code: 'enum Num { A = 0, B = 1 }',
      errors: [{ messageId: 'banned' as const }],
    },
  ],
});
