import { RuleTester } from '@typescript-eslint/rule-tester';
import { placeholder } from '../../src/rules/placeholder.js';

const ruleTester = new RuleTester();

ruleTester.run('placeholder', placeholder, {
  valid: [
    'const x = 1;',
    'function foo() { return 42; }',
  ],
  invalid: [
    {
      code: 'debugger;',
      errors: [{ messageId: 'placeholder' }],
    },
    {
      code: 'function foo() { debugger; return 42; }',
      errors: [{ messageId: 'placeholder' }],
    },
  ],
});
