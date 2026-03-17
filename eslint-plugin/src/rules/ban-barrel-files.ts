import { basename } from 'node:path';
import { createRule } from '../utils/create-rule.js';
import { minimatch } from 'minimatch';

type Options = [{ allowPatterns?: string[] }];

const INDEX_BASENAMES = new Set([
  'index.ts',
  'index.js',
  'index.mts',
  'index.mjs',
]);

export const banBarrelFiles = createRule<Options, 'banned'>({
  name: 'ban-barrel-files',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ban barrel files (index.ts re-export files)',
      opinionId: 'ban-barrel-files',
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      banned:
        'Do not use barrel files; import from source modules directly. (ban-barrel-files)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowPatterns: {
            type: 'array',
            items: { type: 'string' },
            description:
              'Glob patterns for allowed barrel file paths (e.g., "src/index.ts")',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{}],
  create(context, [options]) {
    return {
      'Program:exit'(node) {
        const filename = context.filename;
        const base = basename(filename);

        if (!INDEX_BASENAMES.has(base)) {
          return;
        }

        if (
          options.allowPatterns?.some(pattern => minimatch(filename, pattern))
        ) {
          return;
        }

        if (node.body.length === 0) {
          return;
        }

        const isAllReExports = node.body.every(stmt => {
          if (
            stmt.type === 'ExportNamedDeclaration' &&
            stmt.source != null
          ) {
            return true;
          }
          if (stmt.type === 'ExportAllDeclaration') {
            return true;
          }
          return false;
        });

        if (isAllReExports) {
          context.report({ node, messageId: 'banned' });
        }
      },
    };
  },
});
