# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Source of truth

This file is the compact product truth. Detailed accepted decisions live in:

- `plans/2026-10-28-minicourse-concept-offer.md` — concept and offer;
- `plans/2026-10-28-minicourse-funnel-requirements-rights.md` — funnel,
  demo-registration contract, materials, provenance, and disclosure;
- `plans/2026-10-28-minicourse-structure-content-prototype.md` — accepted
  architecture A, supporting calculator K2, full copy, and annotated prototype;
- `specs/2026-10-28-matrix-school-portfolio.md` — acceptance contract;
- `plans/2026-10-28-matrix-school-portfolio.md` — phase status and next work.

Research files preserve evidence and uncertainty. They do not override accepted
product decisions or turn created details of the fictional school into market
facts.

## Platform and stack

Astro + TypeScript with the official standalone Node adapter. The existing
client-side calculator remains local, typed, and independently testable. The
approved portfolio demo registration must also work entirely in the browser.

The repository contains an earlier fake chat-provider boundary and a disabled
health status, but an AI consultant, live model API, model credentials, and
chat UI are not part of the current product scope. They may return only after a
separate product, privacy, cost, and implementation decision.

## Users

### Primary evaluator

A hiring manager reviewing a junior AI developer. They need compact,
reproducible evidence that Victoria can research an unfamiliar domain, shape a
truthful offer, direct AI-assisted work, design a safe interaction, verify the
result, and finish a presentable public project.

### Demonstration visitor

A newcomer who has already watched, read, or tried a calculator, is considering
learning consultation, but has not yet assembled a coherent explanation for
another person. They want a small practical trial before buying a large
program.

This visitor is modeled as an adult woman for the creative concept, but gender
and age are not eligibility rules or measured market distributions.

## Product purpose

Create a public portfolio concept for the fictional online school «Контур 22».
The page presents a believable seven-day introductory mini-course and proves
Victoria's product, interface, frontend, accessibility, testing, and Git work
without operating a real school or collecting personal data.

The concept is **«Профессия на пробу»**. The working course name is **«Первый
разбор: попробуйте себя в консультировании»**. A learner completes one guided
educational analysis, rehearses a 15–20-minute role conversation, receives
fictional-school written feedback, and decides whether to continue studying.
The course does not qualify a consultant in seven days.

The page's target action is **«Записаться на бесплатный открытый урок»**. On the
portfolio site this opens a local demo, not a real registration.

## Product contract

- Recommended route: 7 days, approximately 4.5–5 hours.
- Five recorded lessons and five short assignments.
- One fictional educational case and one completed learning analysis.
- One 15–20-minute role conversation.
- One 45-minute group practice session within the fictional offer.
- One set of written curator comments within two business days within the
  fictional offer.
- Lesson access for 90 days.
- One fictional tariff: 4,900 ₽.
- Result: a practical trial and a reasoned next-step decision, not professional
  qualification, clients, income, prediction, diagnosis, or objective personal
  assessment.

The free lesson is titled **«Как проходит первый учебный разбор — и что в
работе консультанта важнее расчёта»** and lasts 45 minutes in the fictional
offer. It shows one transition from a ready scheme to a plain-language
explanation, includes a small exercise, and introduces the teaching approach.
The full analysis, conversation, and feedback remain part of the mini-course.

## Two journeys

### Fictional business funnel

Thematic material → landing page → free lesson → decision about the mini-course.

Only the landing page exists. The thematic acquisition, lesson delivery,
follow-up, and purchase are product logic for the fictional business and are
not connected services.

### Real portfolio journey

Employer's link → page → local demo registration → confirmation → change or
cancel.

The demo uses prepared fictional data, creates no place on an event, sends no
email, and stores no server record. It supports one active demo booking in the
current tab.

## Demo-registration contract

- Prepared identity: `Марина Соколова`, `student@example.com`; no free contact
  input or editing.
- Three locally generated future demo slots follow the Moscow schedule:
  Tuesday 19:00, Thursday 19:00, Saturday 12:00, each at least 24 hours away.
- The 24-hour lead time applies to newly offered slots. An existing confirmed
  future slot remains valid when it is less than 24 hours away or leaves the
  current nearest-three list. The record's 24-hour age limit, slot start,
  cancellation, and invalid-data cleanup still apply.
- Every slot shows a full date and explicit Moscow time and is labeled as a
  non-occurring demo event.
- States: initial, draft, confirmed, editing, cancelled, plus recoverable error
  handling.
- One active booking only; changing replaces its slot; cancelling removes it;
  a new demo can start after cancellation.
- Only a versioned confirmed record may use `sessionStorage`. Draft state stays
  in memory. Confirmation survives refresh in the same tab; cancellation,
  tab close, a 24-hour age limit, an expired slot, or invalid data clears it.
- The record contains only schema version, state, slot identity/start, and
  creation time. Prepared name and email are not persisted.
- No fetch/XHR/beacon/form submission, analytics, cookies, `localStorage`, URL
  state, email, webhook, CRM, database, or server session.
- The interface states before and after confirmation that nothing is sent and
  no real event exists.

The complete state, error, accessibility, storage, and copy contract is in
`plans/2026-10-28-minicourse-funnel-requirements-rights.md`.

## Existing calculator

The implemented calculator remains a working portfolio asset. Victoria accepted
architecture A and calculator K2: a separate optional section on the same page,
after course contents, conditions, and created testimonials, before the detailed
free-lesson invitation. It is not the mandatory first-viewport action or a
prerequisite for demo registration. Placement is specified; code is unchanged.

Existing calculator boundaries remain:

- one reproducible versioned calculation with five base points and four
  diagonals;
- local browser calculation with no persistence or network transmission of the
  entered date;
- arithmetic visibly separated from symbolic interpretation;
- no medical, psychological, legal, financial, compatibility, diagnostic, or
  predictive claims;
- no account, analytics, payment, or contact collection.

## Portfolio status, created world, and materials

The school, teacher Anna Mironova, learners, testimonials, educational works,
feedback, and outcomes are created elements of the portfolio concept. They may
be used when their fictional origin is clear and recorded; they are not market
research or evidence of real customers.

Disclosure uses three layers:

1. a visible page-level status: the school is a portfolio concept and does not
   exist;
2. one clear disclosure near teacher/student/testimonial/work evidence that
   these are created concept elements;
3. contextual demo-registration notices before selection and on confirmation.

Original, generated, and licensed materials must have recorded provenance.
Real competitor portraits, logos, screenshots, testimonials, or proprietary
learning materials are not reused. Generated portraits represent fictional
people without an unlicensed real-person reference. Exact tool terms are
checked and recorded when an asset is created.

The current Onest font package includes OFL-1.1. Existing generated texture
provenance is incomplete and must be completed or the textures replaced before
final publication.

## Capabilities and constraints

- The public site is a portfolio demonstration, not a real school or service.
- No real students, teachers, events, applications, messages, payments,
  certificates, qualifications, commercial results, or school operations.
- No database, accounts, analytics, CRM, email capture, advertising trackers,
  model API, AI consultant, or automatic data flow between features.
- No real personal data is needed in the approved primary journey.
- Symbolic material is not presented as scientifically proven diagnosis,
  prediction, or objective truth about a person.
- No promises of qualification, clients, income, personal transformation,
  artificial urgency, scarcity, or guaranteed outcome.
- Existing implementation and calculator are preserved until a later approved
  structure explicitly changes their presentation.
- Research sources remain evidence only; they are not permission to copy.

## Evidence on hand

- The vacancy accepts educational portfolio projects and evaluates research,
  product thinking, Codex task setting, testing, visual quality, mobile quality,
  Git, and GitHub.
- Existing code provides a verified local calculator and responsive landing
  foundation.
- Open research supports the category and qualitative audience signals but does
  not prove demand, willingness to pay 4,900 ₽, market size, or conversion.
- There are no real customers, students, testimonials, school credentials, or
  commercial results.

## Product principles

1. Sell a small observable learning trial, not a seven-day profession.
2. Separate the fictional business funnel from what actually works on the
   portfolio site.
3. Let a visitor complete the demo without real data or hidden external
   effects.
4. Show mechanism, criteria, and learning artifacts instead of unsupported
   authority or generic praise.
5. Keep market evidence, created concept details, and implementation facts
   explicitly distinct.
6. Preserve the working calculator as evidence without letting the old concept
   override the accepted course offer.
7. Make every public claim honest about the project's fictional and symbolic
   status.

## Accessibility and inclusion

- The complete page and demo-registration journey must be keyboard-operable
  with visible focus.
- Slot selection, prepared data, errors, confirmation, editing, cancellation,
  and restored/reset state must have programmatic labels and screen-reader
  announcements.
- Information cannot depend on color, hover, or motion alone.
- Focus moves intentionally between trigger, state heading, slot group, and
  return action without trapping the user.
- Motion respects `prefers-reduced-motion`.
- The verified responsive floor remains 360 CSS pixels, with checks at 390 and
  1440 CSS pixels and a real 200% browser-zoom check still required before
  final release.
