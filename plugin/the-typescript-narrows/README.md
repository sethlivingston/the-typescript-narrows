# The TypeScript Narrows (Claude Plugin)

Structured TypeScript opinions for AI-assisted development -- one opinion per decision point.

## Install

Add the marketplace, then install the plugin:

    claude plugin add-marketplace github:sethlivingston/claude-marketplace
    claude plugin install the-typescript-narrows

The skill triggers automatically when Claude generates TypeScript, reviews TypeScript code, or decides between multiple valid TypeScript patterns.

**Alternative: Reference from GitHub directly**

    github:sethlivingston/the-typescript-narrows/plugin/the-typescript-narrows

## What This Does

This skill provides over 50 opinionated TypeScript guidelines covering type safety, error handling, async patterns, naming conventions, and more. Each opinion includes a stance, rationale, and do/don't code examples. See [SKILL.md](SKILL.md) for the full reference.

## Companion ESLint Plugin

For automated enforcement of over half of these opinions, use the [`eslint-plugin-typescript-narrows`](https://www.npmjs.com/package/eslint-plugin-typescript-narrows) npm package.

## License

[MIT](LICENSE)
