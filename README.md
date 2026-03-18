# The TypeScript Narrows

The TypeScript Narrows is a Claude Skill and an ESLint plugin that complement each other. Together they help AI agents narrow the "five different ways to do X" to a single, opinionated, best-practice way to do X. Some examples:

- No `any`, no `!`, no type assertions — narrow instead
- No `enum` — use `as const` objects with discriminated unions
- No default exports, no barrel files
- No `.forEach()`, no `.reduce()` — use `for...of`
- No floating promises, no misused promises
- `return await` inside try/catch (always)
- `??` over `||`, `?.` over manual null checks
- Exhaustive switch — every union variant handled
- Result types for expected failures, `throw` only for bugs
- `Readonly<T>` params, `readonly` properties, no mutable exports
- Branded types for domain IDs and value objects
- Early returns to fail fast and avoid deep nesting
- `strict: true` plus `noUncheckedIndexedAccess`
- ...and [many more](docs/opinions/INDEX.md)

The Claude skill and the ESLint plugin extend [@typescript-eslint](https://www.npmjs.com/package/typescript-eslint) and cover over 50 opinions on type safety, error handling, async patters, naming conventions, and more.

## Repo Structure

- **Opinions** -- The source of truth for both the Claude Skill and the ESLint plugin ([`docs/opinions/INDEX.md`](docs/opinions/INDEX.md))
- **Claude Skill** -- All opinions structured for AI-assisted TypeScript development ([`skill/the-typescript-narrows/SKILL.md`](skill/the-typescript-narrows/SKILL.md))
- **ESLint Plugin** -- The subset of the opinions that can be enforced with ESLint rules, including typescript-eslint's strict rules and others ([`eslint-plugin/`](eslint/plugin))

## Getting Started

**For AI-assisted development:** Add the Claude skill to your project so Claude follows these opinions when writing TypeScript. See [skill README](skill/the-typescript-narrows/README.md) for installation options.

**For automated enforcement:** Install the ESLint plugin to lint against these opinions in CI and your editor. See [eslint-plugin README](eslint-plugin/README.md) for setup instructions.

Both artifacts work independently, but they're designed to complement each other -- the skill covers opinions that can't be expressed as lint rules.

## Coverage

See [docs/TRACEABILITY.md](docs/TRACEABILITY.md) for the full traceability matrix mapping all opinions to their enforcement mechanisms.

## License

[MIT](LICENSE)
