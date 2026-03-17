import { createRule } from '../utils/create-rule.js';

export const placeholder = createRule({
  name: 'placeholder',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Placeholder rule to prove custom rule infrastructure works',
      opinionId: 'placeholder',
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      placeholder: 'This is a placeholder rule. (placeholder)',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      DebuggerStatement(node) {
        context.report({ node, messageId: 'placeholder' });
      },
    };
  },
});
