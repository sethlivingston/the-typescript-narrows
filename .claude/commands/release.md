Release one or both artifacts in this monorepo.

## Input

The user provides `$ARGUMENTS` which should specify what to release. Examples:
- "eslint-plugin 1.2.0" — release only the ESLint plugin at v1.2.0
- "plugin 2.0.0" — release only the plugin at v2.0.0
- "eslint-plugin 1.2.0 plugin 1.1.0" — release both at different versions

## Release Process

### For the ESLint plugin (`eslint-plugin/v*` tags):

1. Update `eslint-plugin/package.json` version field to the new version
2. Run `cd eslint-plugin && npm run build && npm test && npm run typecheck` to verify everything passes
3. Commit on a branch: `chore(eslint-plugin): bump version to {version}`
4. Open and merge a PR so the version bump lands on protected `main`
5. Fast-forward local `main` to the merged commit
6. Tag from `main`: `git tag eslint-plugin/v{version}`

### For the plugin (`plugin/v*` tags):

1. Tag: `git tag plugin/v{version}`

(The plugin has no build step or version file — the tag is the version.)

### After tagging:

1. Push only the tag(s): `git push origin refs/tags/eslint-plugin/v{version}` and/or `git push origin refs/tags/plugin/v{version}`
2. Report what was released and remind the user:
   - For eslint-plugin: The GitHub Action will run tests, publish to npm, and create a GitHub Release
   - For plugin: The GitHub Action will create a GitHub Release
   - npm publishing uses trusted publishing via GitHub Actions OIDC, so the npm package must trust this repository's release workflow

## Tag Convention

- ESLint plugin: `eslint-plugin/v{semver}` (e.g., `eslint-plugin/v1.0.0`)
- Plugin: `plugin/v{semver}` (e.g., `plugin/v1.0.0`)

GitHub Actions workflows in `.github/workflows/` trigger on these tag patterns to automate releases.
