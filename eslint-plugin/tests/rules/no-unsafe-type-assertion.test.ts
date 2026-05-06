import { RuleTester } from '@typescript-eslint/rule-tester';
import { noUnsafeTypeAssertion } from '../../src/rules/no-unsafe-type-assertion.js';

const ruleTester = new RuleTester();

ruleTester.run('no-unsafe-type-assertion', noUnsafeTypeAssertion, {
  valid: [
    'const u = value as unknown;',
    'const b = (value as unknown) as BodyOpaque;',
    'const b2 = value as unknown as BodyOpaque;',
    'const c = { x: 1 } as const;',
    'const d = [1, 2] as const;',
    'const n = value as never;',
  ],
  invalid: [
    {
      code: 'const a = value as string;',
      errors: [{ messageId: 'unsafeAssertion' as const }],
    },
    {
      code: 'const e = result as { kind: string };',
      errors: [{ messageId: 'unsafeAssertion' as const }],
    },
    {
      code: 'const f = {} as SomeInterface;',
      errors: [{ messageId: 'unsafeAssertion' as const }],
    },
    {
      code: 'const g = value as SomeClass;',
      errors: [{ messageId: 'unsafeAssertion' as const }],
    },
    {
      code: 'const h = (value as Foo) as Bar;',
      errors: [
        { messageId: 'unsafeAssertion' as const },
        { messageId: 'unsafeAssertion' as const },
      ],
    },
  ],
});
