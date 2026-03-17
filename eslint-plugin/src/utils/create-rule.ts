import { ESLintUtils } from '@typescript-eslint/utils';

export interface NarrowsRuleDocs {
  description: string;
  opinionId: string;
  recommended: boolean;
  requiresTypeChecking: boolean;
}

export const createRule = ESLintUtils.RuleCreator<NarrowsRuleDocs>(
  name =>
    `https://github.com/sethlivingston/the-typescript-narrows/blob/main/docs/opinions/${name}.md`,
);
