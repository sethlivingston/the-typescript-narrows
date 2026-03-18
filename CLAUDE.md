# The TypeScript Narrows

Opinionated TypeScript guidance shipped as two independent artifacts from one monorepo.

## Repo layout

```
docs/opinions/       Source-of-truth opinion corpus (markdown + frontmatter)
docs/opinions/INDEX.md  Master index of all opinions
skill/               Claude Skill — references all opinions for AI-assisted dev
eslint-plugin/       ESLint plugin (TypeScript, tsup, vitest)
scripts/             generate-traceability.mjs — rebuilds docs/TRACEABILITY.md
```

## Building and testing

Only the ESLint plugin has a build/test cycle:

```sh
cd eslint-plugin
npm ci            # install deps
npm run build     # tsup → dist/
npm test          # vitest
npm run typecheck # tsc --noEmit
```

The skill is plain markdown — no build step.

## Adding an opinion

Use the `/add-opinion` slash command. It walks through creating the corpus file, updating INDEX.md, updating the skill reference, updating SKILL.md, and optionally adding/creating ESLint rules. Example:

```
/add-opinion ban default parameters in favor of options objects
```

## Releasing

Use the `/release` slash command. Artifacts are versioned and released independently via prefixed git tags.

```
/release eslint-plugin 1.1.0        # release only the plugin
/release skill 1.1.0                # release only the skill
/release eslint-plugin 1.1.0 skill 1.1.0  # release both
```

**Tag convention:** `eslint-plugin/v{semver}` and `skill/v{semver}`. Pushing a tag triggers the matching GitHub Actions workflow in `.github/workflows/`.

**npm publishing** requires an `NPM_TOKEN` secret configured in the repo's GitHub settings.

## Traceability

After adding or changing opinions, regenerate the traceability matrix:

```sh
node scripts/generate-traceability.mjs
```

## Conventions

- Commit messages: `type(scope): description` (e.g., `feat(opinions): add prefer-readonly-map`)
- One opinion per corpus file in `docs/opinions/`
- Opinion enforcement is either `both` (skill + lint) or `skill-only`
- Custom ESLint rules live in `eslint-plugin/src/rules/` and follow the `createRule` pattern from `utils/create-rule.ts`
