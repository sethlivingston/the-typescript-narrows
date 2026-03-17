import { createRule } from '../utils/create-rule.js';

export const banEnums = createRule({
  name: 'ban-enums',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ban TypeScript enums; use as const objects instead',
      opinionId: 'ban-enums',
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      banned: 'Do not use enums; use as const objects instead. (ban-enums)',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSEnumDeclaration(node) {
        context.report({ node, messageId: 'banned' });
      },
    };
  },
});
