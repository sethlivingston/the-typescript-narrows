# The TypeScript Narrows

Opinionated TypeScript guidance that eliminates the "five ways to skin a cat" problem. This project provides a single, well-reasoned opinion for every common TypeScript decision point -- over 50 opinions covering type safety, error handling, async patterns, naming conventions, and more. It ships as two complementary artifacts: an AI skill for Claude and an ESLint plugin for automated enforcement.

## Artifacts

- **Claude Skill** -- [`skill/the-typescript-narrows/`](skill/the-typescript-narrows/SKILL.md) provides all opinions as structured guidance for AI-assisted TypeScript development.
- **ESLint Plugin** -- [`eslint-plugin-typescript-narrows`](eslint-plugin/) enforces over half of the opinions through lint rules, combining typescript-eslint configurations, import-x rules, and two custom rules.

## Philosophy

Every opinion follows "one opinion per decision point": given a TypeScript pattern where multiple valid approaches exist, this project picks one and explains why. Opinions are classified into three severity tiers -- Bug prevention (can cause runtime errors), Maintenance (makes code harder to work with over time), and Style (consistency with no functional impact).

## Getting Started

**For AI-assisted development:** Add the Claude skill to your project so Claude follows these opinions when writing TypeScript. See [skill README](skill/the-typescript-narrows/README.md) for installation options.

**For automated enforcement:** Install the ESLint plugin to lint against these opinions in CI and your editor. See [eslint-plugin README](eslint-plugin/README.md) for setup instructions.

Both artifacts work independently, but they're designed to complement each other -- the skill covers opinions that can't be expressed as lint rules.

## Coverage

See [docs/TRACEABILITY.md](docs/TRACEABILITY.md) for the full traceability matrix mapping all opinions to their enforcement mechanisms.

## License

[MIT](LICENSE)
