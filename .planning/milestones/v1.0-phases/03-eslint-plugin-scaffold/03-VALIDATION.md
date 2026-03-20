---
phase: 3
slug: eslint-plugin-scaffold
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 + @typescript-eslint/rule-tester 8.57.1 |
| **Config file** | `eslint-plugin/vitest.config.ts` (Wave 0 creates) |
| **Quick run command** | `cd eslint-plugin && npx vitest run` |
| **Full suite command** | `cd eslint-plugin && npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd eslint-plugin && npx vitest run`
- **After every plan wave:** Run `cd eslint-plugin && npx vitest run && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | LINT-05 | unit | `cd eslint-plugin && npm run build && ls dist/` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | LINT-01 | integration | `cd eslint-plugin && npx vitest run tests/integration/smoke.test.ts -t "activates"` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | LINT-02 | integration | `cd eslint-plugin && npx vitest run tests/integration/smoke.test.ts -t "violations"` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | LINT-04 | unit | `cd eslint-plugin && npx vitest run tests/configs/strict.test.ts` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 2 | LINT-03 | integration | `cd eslint-plugin && npx vitest run tests/integration/smoke.test.ts -t "composes"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `eslint-plugin/package.json` — Package with all dependencies
- [ ] `eslint-plugin/tsconfig.json` — TypeScript configuration
- [ ] `eslint-plugin/vitest.config.ts` — Vitest configuration
- [ ] `eslint-plugin/tests/setup.ts` — RuleTester/Vitest wiring
- [ ] `eslint-plugin/tests/integration/smoke.test.ts` — Integration smoke test stubs
- [ ] `eslint-plugin/tests/rules/placeholder.test.ts` — Placeholder rule tests
- [ ] `eslint-plugin/tests/configs/strict.test.ts` — Preset config validation
- [ ] Framework install: `cd eslint-plugin && npm install`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| npm publish readiness | LINT-05 | Requires actual registry interaction | Run `npm pack --dry-run` and verify correct files included |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
