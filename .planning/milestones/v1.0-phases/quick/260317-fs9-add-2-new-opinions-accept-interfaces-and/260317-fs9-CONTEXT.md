# Quick Task 260317-fs9: Add 2 new opinions (accept-interfaces, wrap-error-cause) - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Task Boundary

Add 2 new opinions to the corpus and skill: accept-interfaces (accept interfaces, return concrete types) and wrap-error-cause (wrap errors with { cause: err } when rethrowing). Full 3-layer flow: corpus file → skill reference file → SKILL.md index. Update INDEX.md (56→58) and SKILL.md opinion count.

</domain>

<decisions>
## Implementation Decisions

### Topic placement for accept-interfaces
- Place in **Functions** section of SKILL.md (alongside prefer-arrow-functions)
- Rationale: Functions section is about how you write functions — params/returns fit naturally

### Scope of accept-interfaces
- **Functions only** — function params use interfaces, return concrete types
- Do not extend to constructors or React component props; keep the opinion focused and clean

### wrap-error-cause examples
- **ES2022 Error cause only** — show `new Error('context', { cause: err })`
- No custom error class examples; most projects don't need custom classes for this pattern

### Claude's Discretion
- Severity tags and enforcement levels as specified by user (both [M], both skill-only)
- Code example length (3-8 lines per existing convention)

</decisions>

<specifics>
## Specific Ideas

- accept-interfaces: Go-inspired "accept interfaces, return structs". Function parameters should use narrow interfaces; return types should be concrete.
- wrap-error-cause: Uses ES2022 Error cause property. Pairs with existing typed-errors and error-discrimination opinions. Go-inspired (fmt.Errorf("context: %w", err)).

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements fully captured in decisions above

</canonical_refs>
