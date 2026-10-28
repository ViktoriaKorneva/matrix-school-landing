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
