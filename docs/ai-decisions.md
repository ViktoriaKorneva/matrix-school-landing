# AI decision log

This log records selected factual examples of AI-assisted development. It is not
a transcript and does not reconstruct events after the fact.

## 2026-10-28 — Hosting boundary for the AI consultant

**Task:** Decide whether the public portfolio site can run a real AI consultant
on GitHub Pages.

**Proposal considered:** Keep the static frontend on GitHub Pages and connect it
directly or indirectly to a model.

**Verification:** Official GitHub documentation describes Pages as static
hosting and states that server-side languages are unsupported. Official Amvera
documentation supports Docker applications, HTTPS access, runtime secrets, and
GitHub-connected deployment.

**Decision:** Keep source public on GitHub and deploy one same-origin Astro/Node
application to Amvera. The model key remains server-side. A split Pages + API
deployment was rejected because it adds CORS and deployment complexity without
strengthening the portfolio evidence.

**Sources:**

- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.amvera.ru/applications/configuration/docker.html
- https://docs.amvera.ru/applications/configuration/variables.html
- https://docs.amvera.ru/applications/configuration/network.html

## 2026-10-28 — Independent expected values beat self-confirming tests

**Task:** Implement the documented 22-code reduction and test it beyond the
portfolio examples.

**Proposal considered:** Add a large safe-integer case to prove that repeated
digit reduction continues until the value is within 1–22.

**Verification:** The first expected value written for `Number.MAX_SAFE_INTEGER`
was incorrect. Recomputing every step gave
`9007199254740991 → 76 → 13`.

**Decision:** Correct the test expectation to 13 and retain the explicit chain
in the test. The production function was not changed because the independently
checked arithmetic showed that the test, not the implementation, was wrong.

**Evidence:** `src/domain/matrix/matrix.test.ts` and the passing targeted test
run for all 37 domain cases.

## 2026-10-28 — AI comps are proposals, not product truth

**Task:** Choose a visual direction and first-viewport composition for the
fictional school concept.

**Proposal considered:** Preserve the dark navy, paper, vermilion, and amber
energy of the lesson-film direction while combining it with a directly
recognizable nine-node matrix.

**Verification:** Victoria rejected the literal projector because it suggested
cinema rather than the product. Three fused compositions were generated. Their
content was checked against `PRODUCT.md`: an invented login and contact item
were removed, and mismatched or invented calculation text was corrected using
the verified 15.07.1991 example before the designs were presented as candidates.

**Decision:** Composition A is approved. The matrix is the dominant first-screen
object; the date form and primary action remain immediately visible. Cinema
objects are prohibited, while the sequential-lesson idea survives only in the
interaction and content order. «Контур 22» remains a working name.

**Evidence:** `docs/assets/design/approved-homepage-comp.png` and the Phase 3
entry in `plans/2026-10-28-matrix-school-portfolio.md`.

## 2026-10-28 — Arithmetic truth outranks visual mockup text

**Task:** Turn the approved composition into a working calculator lesson
without silently inheriting errors from the generated visual.

**Proposal considered:** Reproduce the approved composition literally,
including its example labels and calculation card.

**Verification:** The visual mixed a `12.04.1990` label with values from the
verified `15.07.1991` control example and associated the D-point explanation
inconsistently. The versioned domain tests establish the authoritative example:
`A=15`, `B=7`, `C=20`, `D=6`, `E=12`, `AB=22`, `BC=9`, `CD=8`, `DA=21`.

**Decision:** Treat the composition as authority for hierarchy, materials, and
spatial intent only. Render every value, formula, and reduction step from the
tested domain contract. Keep the arithmetic explanation separate from the
symbolic reflection so neither can be mistaken for the other.

**Evidence:** `src/domain/matrix/`,
`src/components/calculator/CalculatorLesson.astro`, and the passing unit and
browser tests.

## 2026-10-28 — Finish review changed the material implementation

**Task:** Verify that the implemented page preserved the approved visual world
rather than only its color palette.

**Proposal considered:** A first implementation used mostly smooth CSS surfaces
and a subtle selected-state treatment.

**Verification:** The independent finish review returned `rebuild`: the page
lacked the approved tactile paper/ink character, the matrix was not dominant
enough, and the selected node did not connect clearly to its calculation card.
After the rebuild, the same reviewer confirmed the remaining node-to-card link
as resolved on desktop and mobile and returned `ship`.

**Decision:** Use generated raster fibres as restrained material layers,
strengthen the matrix geometry and headline hierarchy, and draw an explicit
responsive route from the selected node through the matrix to the detail card.

**Evidence:** `src/assets/textures/`,
`src/components/calculator/calculator.css`,
`src/components/calculator/calculator.ts`, and the Phase 4 entry in the plan.

## 2026-10-28 — Finish and code reviews changed the supporting landing

**Task:** Complete the fictional school around the calculator without turning
the working lesson into a secondary marketing widget.

**Proposal considered:** Extend the approved matte-print world with a
status-only header, a numbered three-principle bridge, typographic FAQ
plus/minus signs, and textured vermilion surfaces using the existing navy text.

**Verification:** The independent finish review found that the long page needed
the four approved anchor links, the first-viewport headings overlapped at the
desktop composition, the three principles were not a true sequence, and the FAQ
used font glyphs as icons. The independent code review measured ordinary text
on the multiplied vermilion texture at roughly 4.20–4.23:1, below the 4.5:1 AA
threshold. After one fix batch, the reviewer marked all four material findings
resolved and returned `ship`; black text on the measured vermilion pixels
reached roughly 4.70–4.73:1.

**Decision:** Keep the matrix as the first-viewport proof, restore anchor
navigation, give the two desktop headings independent space, present the three
principles as an unordered set, draw FAQ indicators with CSS lines, and use
dedicated black ink on textured vermilion text surfaces.

**Evidence:** `src/pages/index.astro`,
`src/components/calculator/calculator.css`,
`src/components/landing/`, `tests/e2e/landing.spec.ts`, and the completed Phase
5 entry in the plan.

**Follow-up correction:** Victoria's real Chrome later showed that the main
title still touched the matrix heading on a wide first viewport. The earlier
automation compared element boxes; because each title span is a block, that
measurement did not represent the painted text. Measuring the actual text range
showed only 6.86 pixels at 1712 CSS pixels and 1.81 pixels at 1920. The grid and
display scale were rebalanced, wrapping was retained as a fallback, and new
Range-based browser regressions require at least 24 pixels. The production
render now measures about 87 pixels at both control widths.
