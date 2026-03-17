# The TypeScript Narrows

Opinionated TypeScript guidance that eliminates the "five ways to skin a cat" problem. This project provides a single, well-reasoned opinion for every common TypeScript decision point -- 59 opinions covering type safety, error handling, async patterns, naming conventions, and more. It ships as two complementary artifacts: an AI skill for Claude and an ESLint plugin for automated enforcement.

## Artifacts

- **Claude Skill** -- [`skill/the-typescript-narrows/`](skill/the-typescript-narrows/SKILL.md) provides all 59 opinions as structured guidance for AI-assisted TypeScript development.
- **ESLint Plugin** -- [`eslint-plugin-typescript-narrows`](eslint-plugin/) enforces 35 of the 59 opinions through lint rules, combining typescript-eslint configurations, import-x rules, and two custom rules.

## Philosophy

Every opinion follows "one opinion per decision point": given a TypeScript pattern where multiple valid approaches exist, this project picks one and explains why. Opinions are classified into three severity tiers -- Bug prevention (can cause runtime errors), Maintenance (makes code harder to work with over time), and Style (consistency with no functional impact).

## Coverage

See [docs/TRACEABILITY.md](docs/TRACEABILITY.md) for the full traceability matrix mapping all 59 opinions to their enforcement mechanisms.

## License

[MIT](LICENSE)
