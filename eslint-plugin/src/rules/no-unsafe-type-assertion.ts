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

        // Allow: x as const
        if (
          typeAnnotation.type === 'TSTypeReference' &&
          typeAnnotation.typeName.type === 'Identifier' &&
          typeAnnotation.typeName.name === 'const'
        ) return;

        // Allow: (x as unknown) as T — the inner expression is a TSAsExpression whose type is TSUnknownKeyword
        if (
          node.expression.type === 'TSAsExpression' &&
          node.expression.typeAnnotation.type === 'TSUnknownKeyword'
        ) return;

        context.report({ node, messageId: 'unsafeAssertion' });
      },
    };
  },
});
