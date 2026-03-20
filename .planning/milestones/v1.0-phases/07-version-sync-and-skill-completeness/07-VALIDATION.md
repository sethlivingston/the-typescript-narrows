---
phase: 7
slug: version-sync-and-skill-completeness
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.x |
| **Config file** | `eslint-plugin/vitest.config.ts` |
| **Quick run command** | `cd eslint-plugin && npm test` |
| **Full suite command** | `cd eslint-plugin && npm test && npm run typecheck` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd eslint-plugin && npm run build && npm test`
- **After every plan wave:** Run `cd eslint-plugin && npm run build && npm test && npm run typecheck`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | LINT-05 | integration | `cd eslint-plugin && npm run build && node -e "const p=require('./dist/index.cjs');const pkg=require('./package.json');if(p.default.meta.version!==pkg.version)throw new Error('mismatch')"` | ✅ | ⬜ pending |
| 07-02-01 | 02 | 1 | SKIL-19 | smoke | `node -e "const fs=require('fs');const s=fs.readFileSync('plugin/the-typescript-narrows/skills/typescript-narrows/SKILL.md','utf-8');const c=s.match(/^- /gm).length;if(c!==59)throw new Error(c+' bullets, expected 59')"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. The version match and bullet count checks are simple one-liners run as post-implementation verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reference file links in SKILL.md resolve | SKIL-19 | Link validation needs filesystem check | Verify all 15 reference file paths in SKILL.md exist on disk |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
