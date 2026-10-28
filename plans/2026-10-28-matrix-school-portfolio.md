# Plan: fictional destiny-matrix school portfolio site

**Spec:** `specs/2026-10-28-matrix-school-portfolio.md`
**Status:** in_progress — plan and stack approved; technical foundation underway;
Amvera selected for the live application

## Stage 0 product frame

### 1. Whose job and what trigger

When a hiring manager reviews a junior AI developer without commercial web
experience, they want compact, reproducible evidence of the complete working
process so they can decide whether the candidate can be trusted with real
projects.

### 2. Current alternatives and where they fail

- A résumé claim is fast but does not prove execution.
- A generic educational app proves some code but not domain research or a
  commercial web journey.
- A static themed landing page proves polish but little logic or verification.
- A standalone calculator proves logic but not the school/product context.

The combined educational landing and calculator closes all four gaps without
requiring a real client or fabricated outcomes.

### 3. Commercial threshold

Not applicable as a sellable product. This is explicitly a portfolio concept;
no customer economics or demand claims will be made.

### 4. Observable result

A reviewer can open the public link, calculate a versioned nine-point matrix,
inspect how one point was obtained, complete a compact lesson, ask a bounded AI
school consultant a supported question, and reproduce the project’s checks from
the public repository.

### 5. Format

A unique portfolio project, not a reusable commercial service. Calculation
rules, interpretation content, consultant knowledge, and model-provider access
must remain separated so each layer can be tested and replaced independently.

### 6. Registry location

The project lives only in this standalone folder and public repository. The
global knowledge project remains an internal methodology source and receives no
project implementation files.

## Challenge log

**Problem:** prove the exact capabilities named in the vacancy with one project
that remains small enough to finish and explain.

**Chosen solution:** a fictional school landing page whose central interaction
is a versioned, explainable matrix calculator used as the first sample lesson,
with a bounded AI school consultant as a secondary proof of agent setup.

**Alternatives considered:**

1. Static landing only — rejected because it under-proves logic and testing.
2. Calculator only — rejected because it under-proves product structure and
   persuasive web design.
3. Calculator as a teaser/paywall — rejected because the pattern is already
   common and would imitate the closest competitor.
4. Full school platform — rejected because accounts, payments, LMS features,
   and backend infrastructure do not improve the hiring proof proportionally.
5. GitHub Pages plus a browser-side model key — rejected because static hosting
   cannot protect the credential.
6. GitHub Pages plus a separate Amvera API — rejected because the split adds
   CORS, deployment, and failure complexity without improving the proof.

**Why the chosen solution is better:** each major surface and artifact maps to a
vacancy requirement, while the same calculation core supports product,
technical, UX, accessibility, and testing evidence. The consultant adds a
second, clearly bounded AI capability without weakening the calculator.

## Problems

| # | Problem | Solution | Status |
|---|---|---|---|
| 1 | The niche has conflicting formulas | Publish and test one explicitly versioned method | researched |
| 2 | The common funnel is already occupied | Teach inside the result instead of hiding it | researched |
| 3 | A diagram can fail on mobile and assistive tech | Pair the overview with a semantic point list/detail view | planned |
| 4 | Fictional content can look deceptive | Mark the concept and prohibit fabricated proof | planned |
| 5 | AI process evidence can become theatre | Record factual decision traces during each phase; publish only the best 2–3 | planned |
| 6 | A new stack can add unnecessary complexity | Confirm the smallest suitable stack before scaffolding | pending decision |
| 7 | A public AI endpoint can leak keys or spend | Same-origin server, Amvera secret, limits, kill switch, provider budget | planned |
| 8 | Chat may invent or accept unsafe scope | Curated public knowledge, refusal contract, adversarial and live tests | planned |
| 9 | Free text may contain personal data | Warning, no calculator context, no app persistence or body logs | planned |

## Challenge loop

### Does this solve the problem?

Yes. Research, method documentation, central interaction, visual system,
automated tests, responsive/accessibility QA, public Git history, and selected
Codex briefs each cover an explicit vacancy criterion. No acceptance criterion
depends on a real customer or invented result.

### Is this the most efficient solution?

- Plain static HTML/CSS/JavaScript is smallest for the landing and calculator,
  but it still needs a separate server once the AI consultant is real.
- React/Vite plus a separate API is familiar and capable, but adds a client-only
  SPA and split runtime to a content-led product.
- GitHub Pages plus an Amvera API works technically, but splits origins and
  deployment for no portfolio benefit.
- Astro + TypeScript with a Node adapter keeps the page content-led, isolates
  the calculator as typed client logic, and serves `/api/chat` from the same
  Amvera application. It is the recommended balance, subject to Victoria’s
  confirmation and current official framework documentation.

### Is there code for code’s sake?

The only server-side scope is the bounded chat endpoint and static/site serving.
The following remain excluded: database, authentication, payments, email
capture, analytics, agent tools, personal AI readings, several calculators,
blog, admin, and LMS. Each would increase build and review surface without
improving the core hiring evidence.

## Phases

### Phase 0: research and public contract

- **Status:** completed
- **Files:** `PRODUCT.md`, `thoughts/research/`, `specs/`, `plans/`
- **Changes:** domain/competitor research, product truth, acceptance criteria,
  challenge loop, stack decision, hosting boundary, and AI-consultant scope.
- **Verification:** sources opened; agent findings checked against published
  formulas and current competitor pages; no implementation claim made.
- **Exit gate:** completed 2026-10-28 — Victoria approved Astro + TypeScript +
  Node adapter and the Amvera single-application architecture; public project
  instructions contain no private workspace material.

### Phase 1: repository and technical foundation

- **Status:** in_progress
- **Files:** project configuration, source skeleton, test configuration,
  employer-facing `README.md`, project `AGENTS.md`, server entry/configuration,
  provider interface and deterministic fake
- **Changes:** initialize the agreed stack, configure scripts and deterministic
  checks, create the single-app server boundary without a live model call,
  create a small ongoing AI decision log, run a pre-publication privacy gate,
  create the public GitHub repository, establish the first meaningful commit
  and push.
- **Verification:** clean install; typecheck, lint, test, and build commands run;
  the complete tracked tree and Git history contain no secrets, personal
  context, local absolute paths, or internal-project materials; repository
  visibility and branch synchronization verified.
- **Impact:** foundation choices affect every later phase; no page-specific
  styling yet.

### Phase 2: calculation domain and tests

- **Status:** pending
- **Files:** calculation module, date validation, domain types/data, unit tests,
  method documentation
- **Changes:** implement `reduce22`, calendar validation, five base points, four
  diagonals, transparent calculation steps, and control examples.
- **Verification:** published examples, leap-year boundaries, future dates,
  impossible dates, 22 boundary, controlled “today”, time-zone-independent
  arithmetic, and all nine expected values for independent examples.
- **Impact:** later UI consumes a stable domain contract; presentation cannot
  silently alter calculation rules.

### Phase 3: product structure and design direction

- **Status:** pending
- **Files:** content model, surface brief, three direction concepts/approved
  visualization, then the chosen page structure
- **Changes:** use `impeccable` to present three materially different completed
  directions; Victoria chooses one before UI implementation.
- **Verification:** each direction proves the first-viewport interaction,
  visitor path, mobile strategy, and honest content boundary.
- **Impact:** establishes the visual world later recorded in `DESIGN.md`.

### Phase 4: interactive calculator lesson

- **Status:** pending
- **Files:** date form, matrix overview, semantic selector/list, point detail,
  lesson state, component styles and interaction tests
- **Changes:** build the core journey and all required states.
- **Verification:** keyboard flow, validation, restart/change date, point
  selection, exact formula substitution, mobile reading alternative, reduced
  motion, 360/390 pixel widths, 200% zoom, accessible result announcement, and
  absence of entered dates from storage, URLs, diagnostics, and network calls.
- **Impact:** central product proof; landing sections must support rather than
  compete with it.

### Phase 5: landing content and system completion

- **Status:** pending
- **Files:** page sections, curriculum, method/disclosure, FAQ, footer,
  responsive styles, public assets
- **Changes:** complete the chosen visual direction around the working lesson.
- **Verification:** content truth audit; semantic heading order; links; responsive
  layout; no invented proof; no copied competitor language or imagery.
- **Impact:** turns the tool into a coherent school concept without changing the
  calculation contract.

### Phase 6: bounded AI school consultant

- **Status:** pending
- **Files:** `/api/chat` endpoint, provider adapter, public system prompt,
  curated knowledge base, chat interface and states, automated safety/contract
  tests, Amvera/Docker configuration
- **Changes:** implement a same-origin consultant for method, interface,
  curriculum, and site-navigation questions; add refusals, limits, timeout,
  rate/concurrency control, plain-text response rendering, short-lived in-memory
  sessions, provider kill switch, and explicit no-persistence behavior. The
  browser sends only `{ message }`; the server owns all roles, history, prompt,
  knowledge, provider, model, and generation settings.
- **Verification:** deterministic fake-provider tests; exact input/history/output
  bounds; one attempt/no automatic retry; refusal and prompt-injection cases;
  injected roles/configuration ignored; HTML/script response rendered as text;
  no calculator context; provider failures; no key in client assets/repository;
  no request/response-body logging; same-origin/JSON checks; rate/concurrency/
  timeout behavior; global hard-budget gate verified across concurrent requests
  and restart. After separate provider/cost approval, the exact live tuple must
  pass the bounded grounding/safety suite or chat remains disabled.
- **Impact:** the calculator and landing must remain fully usable when chat is
  disabled or unavailable.

### Phase 7: integrated QA and independent reviews

- **Status:** pending
- **Files:** test evidence, screenshots, verified fixes only
- **Changes:** run all gates, desktop/mobile visual inspection in bounded passes,
  Impeccable detector, independent finish review, code review, and read-only
  security review.
- **Verification:** acceptance-criteria trace, clean install, typecheck, lint,
  tests, build, dependency audit, responsive/accessibility checks, no secrets.
- **Impact:** only reproducible defects are fixed; no scope expansion.

### Phase 8: employer packaging and publication

- **Status:** pending
- **Files:** final `README.md`, selected AI workflow evidence, screenshots,
  verification summary, repository metadata
- **Changes:** package the 30-second/3–5-minute/10-minute reading paths; select
  2–3 factual AI decision traces already recorded during development; deploy
  the verified application to Amvera; push the final commit; verify the live
  link and GitHub synchronization.
- **Verification:** fresh-reader walkthrough, live calculation, bounded chat,
  repository link, public-file/privacy/key audit, provider cost controls, and
  final acceptance checklist.
- **Impact:** publication does not introduce forms, analytics, or data storage.

## Required gates

Exact commands will be fixed after stack selection. Each phase runs checks
proportional to the changed area; clean installation and the full gate set run
for the technical foundation and the final candidate. Reproducible equivalents
must exist for:

- type checking;
- linting;
- automated tests;
- production build;
- dependency/security review when dependencies change and on the final candidate;
- changed-scope self-audit and impact analysis.

## Open decisions before implementation

1. Approve Astro + TypeScript as the recommended stack.
2. Amvera is selected for the live application; public source remains on GitHub.
3. Provider/model selection happens only after a bounded quality/cost check and
   separate approval of any paid API use and hard budget ceiling. The selected
   provider’s retention/processing terms must be disclosed before live mode.
4. After research and product structure, choose one of three visual directions.

## Changelog

| Date | Phase | Changes |
|---|---|---|
| 2026-10-28 | 0 | Created standalone folder; completed domain, competitor, and vacancy-evidence research; drafted product contract, spec, and plan |
| 2026-10-28 | 0 | Incorporated independent plan review: early privacy gate, continuous AI decision evidence, deterministic date/mobile/accessibility acceptance, and proportional gates |
| 2026-10-28 | 0 | Added a bounded AI school consultant, rejected unsafe/split GitHub Pages architectures, and selected single-app Amvera deployment |
| 2026-10-28 | 0 | Victoria approved Astro + TypeScript + Node adapter and the Amvera architecture; Phase 0 closed and Phase 1 started |
