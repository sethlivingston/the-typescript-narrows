Release one or both artifacts in this monorepo.

## Input

The user provides `$ARGUMENTS` which should specify what to release. Examples:
- "eslint-plugin 1.2.0" — release only the ESLint plugin at v1.2.0
- "skill 2.0.0" — release only the skill at v2.0.0
- "both 1.1.0" — release both artifacts at v1.1.0
- "eslint-plugin 1.2.0 skill 1.1.0" — release both at different versions

## Release Process

### For the ESLint plugin (`eslint-plugin/v*` tags):

1. Update `eslint-plugin/package.json` version field to the new version
2. Run `cd eslint-plugin && npm run build && npm test` to verify everything passes
3. Commit: `chore(eslint-plugin): bump version to {version}`
4. Tag: `git tag eslint-plugin/v{version}`

### For the skill (`skill/v*` tags):

1. Tag: `git tag skill/v{version}`

(The skill has no build step or version file — the tag is the version.)

### After tagging:

1. Push the commit(s) and tag(s): `git push && git push --tags`
2. Report what was released and remind the user:
   - For eslint-plugin: The GitHub Action will run tests, publish to npm, and create a GitHub Release
   - For skill: The GitHub Action will create a GitHub Release
   - The user needs `NPM_TOKEN` configured as a repository secret for npm publishing

## Tag Convention

- ESLint plugin: `eslint-plugin/v{semver}` (e.g., `eslint-plugin/v1.0.0`)
- Skill: `skill/v{semver}` (e.g., `skill/v1.0.0`)

GitHub Actions workflows in `.github/workflows/` trigger on these tag patterns to automate releases.
