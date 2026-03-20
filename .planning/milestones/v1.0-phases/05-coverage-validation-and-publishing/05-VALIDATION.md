---
phase: 5
slug: coverage-validation-and-publishing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.x |
| **Config file** | `eslint-plugin/vitest.config.ts` |
| **Quick run command** | `node scripts/generate-traceability.mjs --validate` |
| **Full suite command** | `cd eslint-plugin && npx vitest run && cd .. && node scripts/generate-traceability.mjs --validate` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node scripts/generate-traceability.mjs --validate`
- **After every plan wave:** Run `cd eslint-plugin && npx vitest run && node scripts/generate-traceability.mjs --validate`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | COVR-01, COVR-02, COVR-03 | script | `node scripts/generate-traceability.mjs --validate` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 2 | COVR-01 | script | `npm pack --dry-run` (in eslint-plugin/) | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 2 | COVR-03 | manual | `npm publish --dry-run` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/generate-traceability.mjs` — traceability generator with `--validate` flag
- [ ] `docs/TRACEABILITY.md` — generated output (created by script)
- [ ] `eslint-plugin/README.md` — package documentation
- [ ] `skill/the-typescript-narrows/README.md` — skill documentation
- [ ] `LICENSE` (root) — MIT license
- [ ] `eslint-plugin/LICENSE` — MIT license
- [ ] `skill/the-typescript-narrows/LICENSE` — MIT license
- [ ] `README.md` (root) — project landing page

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| npm publish succeeds | COVR-03 | Requires npm auth and human approval | Run `cd eslint-plugin && npm publish` and verify package appears on npmjs.com |
| Skill installable from GitHub | COVR-03 | Requires external GitHub access | Clone repo, copy `skill/the-typescript-narrows/` to `.claude/skills/`, verify Claude loads it |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
