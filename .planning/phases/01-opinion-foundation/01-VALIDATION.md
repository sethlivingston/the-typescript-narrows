---
phase: 1
slug: opinion-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-17
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | N/A — Phase 1 produces markdown content, not code |
| **Config file** | none |
| **Quick run command** | `ls docs/opinions/*.md | grep -v INDEX | grep -v README | wc -l` |
| **Full suite command** | `bash -c 'count=$(ls docs/opinions/*.md 2>/dev/null | grep -v INDEX | grep -v README | wc -l); echo "Opinions: $count"; grep -L "^severity:" docs/opinions/*.md 2>/dev/null | grep -v INDEX | grep -v README; grep -L "^enforcement:" docs/opinions/*.md 2>/dev/null | grep -v INDEX | grep -v README'` |
| **Estimated runtime** | ~1 second |

---

## Sampling Rate

- **After every task commit:** Run `ls docs/opinions/*.md | grep -v INDEX | grep -v README | wc -l`
- **After every plan wave:** Run full suite command
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 1 second

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | OPIN-01 | smoke | `test -d docs/opinions && echo OK` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | OPIN-01 | smoke | `test -f docs/opinions/INDEX.md && echo OK` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | OPIN-01 | smoke | `test -f docs/opinions/README.md && echo OK` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | OPIN-01, OPIN-02, OPIN-03 | smoke | `ls docs/opinions/*.md \| grep -v INDEX \| grep -v README \| wc -l` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | OPIN-02 | smoke | `grep -L "^severity:" docs/opinions/*.md \| grep -v INDEX \| grep -v README` (should be empty) | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | OPIN-03 | smoke | `grep -L "^enforcement:" docs/opinions/*.md \| grep -v INDEX \| grep -v README` (should be empty) | ❌ W0 | ⬜ pending |
| 01-02-04 | 02 | 1 | OPIN-04 | smoke | `count=$(ls docs/opinions/*.md \| grep -v INDEX \| grep -v README \| wc -l); [ "$count" -le 50 ] && echo OK` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `docs/opinions/` directory — must be created (does not exist yet)
- [ ] No test framework needed — shell one-liners suffice for markdown validation

*Existing infrastructure covers all phase requirements via shell commands.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Opinion stance is clear and unambiguous | OPIN-01 | Content quality cannot be automated | Read each opinion's Stance section; verify it takes a clear position |
| Code examples are correct TypeScript | OPIN-01 | Syntax correctness requires human review | Spot-check Do/Don't code blocks for valid TS |
| Severity classification is appropriate | OPIN-02 | Judgment call on bug-prevention vs maintenance vs style | Review severity assignments against inclusion bar |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 1s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
