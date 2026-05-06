import { createRule } from '../utils/create-rule.js';

export const noUnsafeTypeAssertion = createRule({
  name: 'no-unsafe-type-assertion',
  meta: {
    type: 'problem',
    docs: {
      description: 'Permit only as-unknown and double-cast-through-unknown type assertion patterns',
      opinionId: 'no-unsafe-type-assertion',
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      unsafeAssertion: 'Unsafe type assertion. Use `as unknown as T` to cross a type boundary explicitly, or eliminate the assertion with a type guard.',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSAsExpression(node) {
        const { typeAnnotation } = node;

        // Allow: x as unknown
        if (typeAnnotation.type === 'TSUnknownKeyword') return;

        // Allow: x as never  (exhaustiveness-check pattern: assertNever(x as never))
        if (typeAnnotation.type === 'TSNeverKeyword') return;

        // Allow: x as const
        // Note: in @typescript-eslint v8, `as const` parses as TSTypeReference{typeName:'const'},
        // not TSTypeOperator — verified against the upstream isConst() helper.
        if (
          typeAnnotation.type === 'TSTypeReference' &&
          typeAnnotation.typeName.type === 'Identifier' &&
          typeAnnotation.typeName.name === 'const'
        ) return;

        // Allow: (x as unknown) as T  (double-cast through unknown, with or without parens)
        if (
          node.expression.type === 'TSAsExpression' &&
          node.expression.typeAnnotation.type === 'TSUnknownKeyword'
        ) return;

        context.report({ node, messageId: 'unsafeAssertion' });
      },
    };
  },
});
