# Matrix School Landing

Portfolio project in progress: the fictional school «Контур 22», its seven-day
introductory course, a working browser-local demo registration, and an optional
explainable calculator. The school and events do not exist.

The project is designed to demonstrate the complete AI-assisted development
cycle: domain and competitor research, product decisions, precise Codex tasks,
frontend and server implementation, automated checks, responsive/accessibility
QA, and a public Git history.

## Current status

The approved A «Матовая практика» page and corrected drawing case are implemented,
including the fictional teacher portrait and three testimonial avatars. One
inline demo journey supports preparation, confirmation, refresh, replacement,
cancellation, repeat, expiry, corruption, and individual storage failures.
The existing version-1 nine-point calculator remains local and independent.
Victoria reviewed the local page and explicitly accepted/closed the bounded
implementation task on 29 October 2026. The broader Phase 8 is not automatically
closed. The bounded Phase 9 boundary/data verification passed locally and Victoria
accepted its results on 29 October; evidence is recorded in the
[boundary report](plans/2026-10-29-minicourse-boundary-verification.md).
The bounded Phase 10 local QA is now reported in the
[integrated QA report](plans/2026-10-29-minicourse-integrated-qa.md), accepted by
Victoria on 29 October. Real 200% browser zoom, screen-reader operation, a fresh reader,
historical raster provenance and the public commit-email decision remain open.
Victoria subsequently authorized committing/pushing this accepted state and a
[new-chat handoff for remaining release gates](plans/2026-10-29-minicourse-release-gates-handoff.md).
Application deployment and Phase 11 packaging remain outside that authorization.

## Product boundaries

- The school and curriculum are fictional portfolio content.
- The calculation is a versioned implementation of published arithmetic, not a
  scientific, psychological, medical, or financial diagnostic method.
- The calculator runs locally in the browser and does not persist a birth date.
- The teacher, learners, testimonials and educational works are explicitly
  labeled created concept materials; they are not evidence of real outcomes.
- No real registration, lesson, message, payment, analytics, CRM, account,
  database or model call is connected. The historical fake-provider/server
  foundation is retained; there is no active AI consultant.

## Demo data and schedule

Only «Заполнить пример» applies Марина Соколова / student@example.com. There is
no free contact input. The next three Tuesday/Thursday 19:00 and Saturday 12:00
slots are calculated and displayed in Europe/Moscow, at least 24 hours ahead.
Existing future confirmations remain valid inside that lead time or outside
the offered three. No event occurs.

Drafts stay in memory. Only `kontur22.demo.v1` in sessionStorage may contain a
confirmation: schemaVersion, status, slotId, slotStartIso, createdAtIso. No
identity, calculator date, history, URL state, cookies or localStorage is used.
Expiry is the earlier of creation + 24 hours and slot start. Replacement keeps
the original creation time. Refresh restores only valid confirmations and does
not open or focus the region. Browser session restoration is browser-managed;
closing a tab is not a durable-storage guarantee.

First-write/read denial permits an honestly labeled memory-only journey.
Failed replacement retains the old confirmation. Failed cancellation does not
claim deletion. Invalid data are rejected even if cleanup is denied. Demo
actions make no fetch/XHR/beacon/form request and never use server storage.

## Planning evidence

- [Product record](PRODUCT.md)
- [Research and recommendation](thoughts/research/2026-10-28-portfolio-site.md)
- [Acceptance contract](specs/2026-10-28-matrix-school-portfolio.md)
- [Implementation plan](plans/2026-10-28-matrix-school-portfolio.md)
- [AI decision log](docs/ai-decisions.md)
- [Accepted content and state contract](plans/2026-10-28-minicourse-structure-content-prototype.md)
- [Implemented design system](DESIGN.md)
- [Portrait provenance and exact prompts](docs/assets/portraits/provenance.md)

## Local commands

```bash
npm install
npx playwright install chromium
npm run verify
npm run dev
```

Production server after `npm run build`:

```bash
npm start
```

The production browser gate can also be reproduced independently after a build:

```bash
npm run build
npm run test:e2e:production
```

It starts a fresh standalone Node server on loopback port 4323 and refuses to
reuse an existing server. Local server logs and session-file evidence are saved
under the Git-ignored `.impeccable/phase9/` directory. This check expects no
pre-existing server session files and never deletes them.

Local routes:

- `GET /` — the mini-course page, local demo registration, and optional calculator.
- `GET /api/health` — the deterministic health endpoint.

## Verification and practical limits

`npm run verify` runs Astro check, ESLint, Vitest, production build and Playwright
against both the dev server and a separate production server.
The 29 October integrated QA passed 73 unit tests and 56 browser tests in each
mode; the local production session directory stayed empty and server logs
contained no demo/calculator data. Two new tests cover a complete keyboard-only
journey and public page/reference/asset integrity. An isolated locked install,
production build and runtime image smoke also passed. No product-code defect
was reproduced. Two local paths in handoffs and Anna's crop metadata were corrected.
Tests cover the calendar/record/state machine, individual storage failures,
keyboard/focus, no-JS and detectable module failure, local data/network limits,
the preserved calculator, text contrast and responsive control sizes.
Screenshots were rendered at 360/390/1440 and 1712/1920px. The 180 CSS px reflow
check is not real UI zoom. Screen-reader operation, actual browser 200% zoom and
fresh-reader comprehension remain unverified. The public-tree/history audit ran:
no credential-like values were found in scanned non-sensitive source/history,
but sensitive file contents were excluded. One author/committer email in the
six-commit history needs an explicit publication decision; history was not changed.

Victoria directed product and design decisions, supplied corrections and
acceptance boundaries; Codex implemented and checked the agreed scope. The
implementation log records actual decisions rather than invented mistakes.
The current review was performed in the main session without helper agents.
Portrait PNG originals are retained, and Astro creates local WebP derivatives.
Onest remains covered by the existing package's OFL-1.1 license. Historical
texture files and the earlier PNG comp are unused by the page but remain in the
tracked tree/history; their incomplete generation provenance is an open release gate.
