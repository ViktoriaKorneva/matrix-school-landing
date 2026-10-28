# Project instructions

This repository is a public portfolio project. Keep it self-contained and safe
to show to employers.

## Scope and sources

- Product truth: `PRODUCT.md`.
- Acceptance contract: `specs/2026-10-28-matrix-school-portfolio.md`.
- Current work and phase status: `plans/2026-10-28-matrix-school-portfolio.md`.
- Research evidence: `thoughts/research/2026-10-28-portfolio-site.md`.
- Do not copy private workspace files, personal data, secrets, course sources,
  or unrelated project material into this repository.

## Workflow

- Follow the approved plan and keep changes within the active phase.
- Use `bulletproof` for implementation and `impeccable` for UI/design work.
- Do not implement a visual direction before Victoria chooses among three
  materially different completed options.
- Record only factual AI decisions in `docs/ai-decisions.md`; never invent an
  error or correction for portfolio storytelling.
- Before the first public push and before release, inspect the full tracked tree
  and Git history for secrets, personal context, absolute local paths, and
  unrelated files.
- After each commit, push the current branch and verify synchronization.

## Technical boundaries

- Astro + TypeScript + official Node adapter, one same-origin Amvera app.
- Calculator logic stays local and independent of the AI consultant.
- No model credential or private context may reach the browser, repository,
  prompt, logs, or error responses.
- Chat remains disabled until provider privacy terms, live evaluation, and a
  hard global spend/token ceiling are approved and verified.
- No database, accounts, analytics, payments, email capture, personal readings,
  medical/financial/legal advice, or automatic calculator-to-chat data flow.

## Required checks

Use commands defined in `package.json`. Run checks proportional to the change;
run `npm run verify` for technical foundations and final candidates.
