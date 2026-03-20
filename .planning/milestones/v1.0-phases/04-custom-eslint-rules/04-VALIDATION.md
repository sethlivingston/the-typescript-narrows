---
phase: 4
slug: custom-eslint-rules
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 + @typescript-eslint/rule-tester 8.57.1 |
| **Config file** | `eslint-plugin/vitest.config.ts` |
| **Quick run command** | `cd eslint-plugin && npm test` |
| **Full suite command** | `cd eslint-plugin && npm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd eslint-plugin && npm test`
- **After every plan wave:** Run `cd eslint-plugin && npm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | LINT-06 | unit | `cd eslint-plugin && npx vitest run tests/rules/ban-enums.test.ts` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | LINT-08 | unit | `cd eslint-plugin && npx vitest run tests/rules/ban-enums.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 1 | LINT-06 | unit | `cd eslint-plugin && npx vitest run tests/rules/ban-barrel-files.test.ts` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 1 | LINT-08 | unit | `cd eslint-plugin && npx vitest run tests/rules/ban-barrel-files.test.ts` | ❌ W0 | ⬜ pending |
| 04-XX-XX | XX | 2 | LINT-06 | integration | `cd eslint-plugin && npx vitest run tests/integration/smoke.test.ts` | ✅ (needs update) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `eslint-plugin/tests/rules/ban-enums.test.ts` — stubs for LINT-06, LINT-08 (ban-enums)
- [ ] `eslint-plugin/tests/rules/ban-barrel-files.test.ts` — stubs for LINT-06, LINT-08 (ban-barrel-files)
- [ ] Update `eslint-plugin/tests/integration/smoke.test.ts` — replace placeholder tests with custom rule tests
- [ ] Remove `eslint-plugin/tests/rules/placeholder.test.ts` — obsolete after placeholder removal

*Existing infrastructure covers framework installation.*

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
