# Spec: «Контур 22» fictional school portfolio site

**Date:** 2026-10-28

**Author:** Victoria Korneva with Codex

**Product truth:** `PRODUCT.md`
**Detailed stages 9–11 contract:** `plans/2026-10-28-minicourse-funnel-requirements-rights.md`
**Accepted stages 12–14:** `plans/2026-10-28-minicourse-structure-content-prototype.md`

## Problem

Victoria needs a focused public project for a Junior AI Developer vacancy. The
implemented site proves frontend logic, testing, accessibility, and visual
craft, but its earlier product contract centers on a calculator lesson and a
future AI consultant. The accepted concept now centers on a believable small
educational offer and a safe demo registration for a free lesson.

The updated project must prove that Victoria can preserve working technical
assets while researching an audience, choosing a product, shaping a truthful
offer, separating business logic from implemented behavior, specifying a
complete interaction, and managing fictional and generated materials honestly.

## Goal

Deliver a public, reproducible portfolio project in which an employer can:

- understand within 30 seconds that this is a fictional school concept and
  what the mini-course offers;
- understand the audience, result, format, duration, price, and role of the
  free lesson without interpreting the calculator as the product itself;
- complete a local demo registration, see confirmation, change its time, and
  cancel it without entering or transmitting personal data;
- inspect the existing calculator as a preserved supporting technical asset;
- verify research, product decisions, provenance rules, implementation, tests,
  and Git history in the repository.

These are design and verification targets. They are not claimed as achieved
until the corresponding future page and tests exist.

## Scope

### In scope for the finished product

#### Public page

- A fictional online school landing page visibly marked as a portfolio concept.
- The mini-course «Первый разбор: попробуйте себя в консультировании».
- A clear explanation of whom the course is for, its seven-day practical trial,
  one educational analysis, role conversation, feedback, boundaries, 90-day
  access, and one fictional tariff of 4,900 ₽.
- A free 45-minute lesson with the accepted topic and a clear distinction
  between its small exercise and the full mini-course result.
- One primary action: «Записаться на бесплатный открытый урок».
- A complete local demo-registration journey with prepared fictional data.
- Created teacher, learner, testimonial, and educational-work materials when
  their origin and portfolio status follow the accepted disclosure contract.
- The implemented calculator retained as a supporting educational trial or
  separate tool; its final placement follows later structure approval.
- A concise method/symbolic-status disclosure, FAQ, project/repository access,
  and provenance information appropriate to a public portfolio.

#### Public repository

- Source code and locked dependencies.
- Reproducible local setup and build instructions.
- Product, research, funnel, requirements, rights, specification, plan, and
  verification evidence with explicit priority between them.
- Automated tests for implemented calculation and demo-registration contracts.
- A factual selection of AI decision traces without invented errors or review
  theatre.
- A maintained provenance record for original, generated, and licensed
  materials actually used.
- Screenshots and an employer-facing case summary only after the rebuilt page
  is visually approved and verified.

### Out of scope

- A real school, teacher, learner, event, webinar room, video lesson, LMS, or
  educational delivery.
- Real registrations, contact capture, email, webhook, CRM, analytics,
  advertising pixels, accounts, database, payments, checkout, or certificates.
- A live model API, AI consultant, chat UI, or calculator-to-model data flow.
- Server persistence or server sessions for demo registration or calculator
  data.
- Free input of name, email, phone, birth date, or other personal data in the
  demo-registration journey.
- Claims of qualification, clients, income, scientific validity, diagnosis,
  prediction, treatment, compatibility, or guaranteed personal outcome.
- Artificial urgency, scarcity, fabricated demand, or a false live-event
  countdown.
- Copying competitor logos, portraits, screenshots, reviews, proprietary
  interpretations, worksheets, or course materials.
- Page structure, full selling copy, prototype, visual redesign, assets, or code
  as part of stages 9–11; those belong to later separately approved phases.

## Acceptance criteria

### Product truth and offer

- [ ] The page presents «Профессия на пробу», not a profession in seven days.
- [ ] The visitor can identify the audience as a newcomer who has begun
      independent study and is considering consultation practice.
- [ ] The promised result ends with one educational analysis, a 15–20-minute
      role conversation, written curator comments, and a decision about further
      study.
- [ ] Five lessons, five assignments, one 45-minute group practice session,
      approximately 4.5–5 hours, 90-day access, and one 4,900 ₽ tariff are
      consistent wherever they appear.
- [ ] The offer does not promise qualification, clients, income, professional
      readiness, scientific proof, diagnosis, prediction, or guaranteed change.
- [ ] Seven days are a recommended route, not an access cutoff.
- [ ] The free lesson has the accepted 45-minute topic and gives one small
      exercise without giving away or claiming the full mini-course result.
- [ ] The primary action is «Записаться на бесплатный открытый урок».
- [ ] The existing calculator is not described as the mini-course, mandatory
      first action, or evidence that symbolic interpretation is objective.

### Two funnels

- [ ] Documentation and public behavior distinguish the fictional business
      funnel from the real portfolio journey.
- [ ] The fictional funnel is thematic material → landing → free lesson →
      decision about the mini-course.
- [ ] The real journey is portfolio link → page → local demo registration →
      confirmation → change or cancellation.
- [ ] The page does not imply that thematic distribution, webinar delivery,
      follow-up, purchase, or a functioning school is connected.
- [ ] No conversion, revenue, demand, or commercial-performance claim is made
      from the demo journey.

### Portfolio disclosure and created evidence

- [ ] A visible page-level label says that the school is a portfolio concept
      and does not exist; the disclosure is not limited to the footer.
- [ ] Near any teacher, learner, testimonial, or educational-work evidence, one
      clear group-level disclosure says that these are created concept elements
      rather than facts about a functioning school.
- [ ] A card that can be understood outside that group receives an additional
      concise fictional-origin label when needed.
- [ ] Created biographies, testimonials, educational works, and results are not
      presented in research documents as market evidence.
- [ ] Symbolic interpretation is separated from arithmetic and is not presented
      as scientifically proven diagnosis, prediction, or objective truth.
- [ ] No real competitor material is reused as public product content.

### Demo-registration entry and prepared data

- [ ] Activating the primary action opens or exposes the demo-registration
      journey without navigating to a real service.
- [ ] Before selection, the interface says that no real registration, email, or
      event place will be created and that only a prepared example is needed.
- [ ] The fixed topic and 45-minute duration are visible.
- [ ] The only identity is `Марина Соколова` and `student@example.com`, applied
      by «Заполнить пример».
- [ ] Name and email cannot be freely entered or edited.
- [ ] The interface identifies both values as fictional examples.

### Demo schedule

- [ ] The browser locally calculates the nearest three schedule occurrences:
      Tuesday 19:00, Thursday 19:00, and Saturday 12:00.
- [ ] Each newly offered occurrence is at least 24 hours after the controlled
      current time.
- [ ] An existing confirmed future slot is preserved when it becomes less than
      24 hours away or leaves the current nearest-three options; this alone
      does not invalidate it. Record age, slot start, cancellation, and invalid
      data still enforce the existing cleanup rules.
- [ ] Calculation and display use `Europe/Moscow`; the interface explicitly
      states Moscow time.
- [ ] Every option shows full date, weekday, and time.
- [ ] The schedule states that these are demo slots and no events will occur.
- [ ] Current time is injectable/controlled in automated tests.
- [ ] A stable slot identifier is derived from its start time.
- [ ] A stale selected or stored slot is rejected and the current options are
      recalculated.

### Registration states and transitions

- [ ] `initial` shows the topic, duration, three slots, demo disclosure, and
      prepared-example action with no selection.
- [ ] `draft` represents a selected slot and/or applied example.
- [ ] Confirmation is unavailable until both a valid slot and the prepared
      example are present; the missing requirement is explained in text.
- [ ] `confirmed` shows topic, selected time, program, preparation guidance,
      and an explicit statement that nothing was sent and no email will arrive.
- [ ] `editing` preserves the currently confirmed slot until a replacement is
      confirmed; returning without change retains the original confirmation.
- [ ] Saving an edited slot replaces the one active demo booking instead of
      creating another.
- [ ] `cancelled` states that the booking is cancelled and local data removed.
- [ ] From `cancelled`, «Записаться снова» returns to a clean `initial` state.
- [ ] Reopening the primary action with an active booking restores `confirmed`
      instead of creating a second booking.
- [ ] A confirmation without a valid slot, unknown schema version, malformed
      record, or impossible time cannot remain active and safely resets.

### Local persistence and refresh

- [ ] Draft state exists only in page memory and resets on refresh.
- [ ] Only a confirmed record may be stored in `sessionStorage`.
- [ ] The record contains only schema version, status, slot ID/start time, and
      creation time.
- [ ] Prepared name and email are never persisted.
- [ ] Refresh in the same tab restores a valid confirmation.
- [ ] Cancellation immediately removes the stored record.
- [ ] A record is removed after 24 hours, after its slot time, for an unknown
      version, or when parsing/validation fails.
- [ ] A storage-access failure leaves the current in-memory journey usable and
      does not claim refresh persistence.
- [ ] An automatic reset produces a calm, accessible notice that demo data were
      stale or invalid; it does not imply loss of a real application.
- [ ] Closing the tab relies on browser-session cleanup; no durable identity or
      history remains in `localStorage`, cookies, URL, or application storage.

### Network and privacy

- [ ] The complete demo journey performs no fetch, XHR, beacon, API call,
      webhook, form submission, email, analytics, or advertising request.
- [ ] Demo state is absent from URL/query/hash, cookies, `localStorage`, server
      sessions, logs, and application storage.
- [ ] No real contact or other personal data is required or accepted.
- [ ] Network and storage checks cover initial, draft, confirmation, refresh,
      editing, cancellation, repeated registration, stale data, and storage
      failure.
- [ ] A JavaScript failure cannot turn the experience into a real contact form;
      static product and portfolio disclosures remain available.

### Errors and recovery

- [ ] Confirming without a slot associates a text error with the slot group and
      moves or exposes focus intentionally.
- [ ] Confirming without the prepared example identifies «Заполнить пример» as
      the required action.
- [ ] If a slot becomes stale before confirmation, selection is cleared,
      options are regenerated, and the reason is announced.
- [ ] Malformed or incompatible stored state is removed rather than partially
      rendered.
- [ ] Recovery never generates a second active booking or preserves an expired
      one.

### Accessibility and responsiveness

- [ ] The complete page, calculator, and demo-registration journeys are
      keyboard-operable with visible focus.
- [ ] Slots form a programmatically labeled single-selection group.
- [ ] Prepared values have persistent labels and an explicit non-editable/demo
      meaning.
- [ ] Errors are associated with their controls and announced clearly.
- [ ] Confirmation and cancellation focus their state heading; editing focuses
      the slot group; closing returns focus to the trigger.
- [ ] Dynamic status uses a polite live region without repeatedly announcing
      the whole interface.
- [ ] Information does not depend on color, hover, animation, or visual layout.
- [ ] If a modal presentation is later selected, it meets dialog naming, focus,
      closing, and background-inertness requirements; this spec does not require
      a modal visual pattern.
- [ ] At 360 and 390 CSS pixels there is no horizontal scrolling, clipping,
      overlapping control, or hidden action; desktop is checked at 1440 pixels.
- [ ] Controls meet the established 44 × 44 CSS pixel touch-target minimum.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] Text and controls meet WCAG 2.2 AA contrast in every shipped state.
- [ ] At real 200% browser zoom the full primary journey remains readable and
      operable without loss of information.

### Existing calculator preservation

- [ ] The existing versioned five-base/four-diagonal calculation remains
      reproducible and independent of demo registration.
- [ ] Existing calculation, date-validation, semantic-list, keyboard, privacy,
      responsive, and reduced-motion regressions continue to pass after future
      page work.
- [ ] Calculator dates remain absent from URL, storage, cookies, diagnostics,
      analytics, and network requests.
- [ ] Arithmetic and symbolic reflection remain visibly separate.
- [ ] The calculator sends no state to demo registration or any model service.
- [ ] Its final position follows an approved page structure; this specification
      does not require first-viewport dominance or removal.

### Materials and provenance

- [ ] Every used material is classified as original, generated, or licensed.
- [ ] The provenance record includes repository path, purpose, source/author or
      tool/model, date, prompt/references where applicable, terms/license,
      edits, attribution, restrictions, and review date.
- [ ] Generated portraits use fictional people without unlicensed real-person
      references and do not imitate a known person.
- [ ] Testimonials, cases, worksheets, rubrics, feedback, and before/after
      examples are original concept materials, not adapted competitor content.
- [ ] The Onest package license remains documented and is rechecked after a
      package update.
- [ ] Existing generated texture provenance is completed or the textures are
      replaced before final publication.
- [ ] No unverified portrait, logo, screenshot, testimonial, or educational
      material is shipped.

### Verification and repository

- [ ] Type checking, linting, unit tests, production build, and browser tests
      pass using the commands defined in `package.json` after implementation.
- [ ] Dependency and security checks show no unresolved high-severity issue in
      the shipped scope.
- [ ] The repository contains no secrets, personal data, private workspace
      material, unrelated files, or local absolute paths in public artifacts.
- [ ] README explains the product, fictional status, implemented demo,
      preserved calculator, Victoria's role, AI collaboration, verification,
      material provenance, limitations, and local launch.
- [ ] Desktop and mobile screenshots come from the verified implementation and
      do not show stale product claims.
- [ ] Research, created concept details, current implementation, and future
      plans are distinguishable and correctly linked.
- [ ] Victoria can explain the offer, two funnels, state/storage contract,
      calculator role, one provenance decision, and one factual AI decision
      trace.

## Constraints

- Separate public repository: `ViktoriaKorneva/matrix-school-landing`.
- Preserve existing implementation until a later approved structure requires a
  scoped change.
- Astro + TypeScript and the official Node adapter remain the current stack.
- Demo registration and calculator remain browser-local and do not require a
  server to complete their approved journeys.
- A future visual-direction change still requires three materially different
  completed options before selection.
- Current external package APIs and framework behavior must be checked against
  official documentation before code changes that depend on them.
- Publication, real integrations, paid services, and live external actions
  require separate approval.

## Non-goals

- Proving that the symbolic system is scientifically valid.
- Selling or operating an education product.
- Testing commercial conversion or willingness to pay.
- Turning a seven-day course into professional certification.
- Building a webinar, LMS, CRM, checkout, chat, or backend booking service.
- Generating a large volume of pages or process documentation.
- Reproducing a competitor's identity, content, or proprietary method.

## Accepted structure and decisions deferred to later stages

Victoria accepted architecture A, calculator K2, full selling/service copy, and
the annotated prototype on 2026-10-28. The accepted document linked above defines
block order and the optional same-page calculator after course conditions and
testimonials, before the detailed free-lesson invitation. This is documentation
acceptance, not completed implementation or fresh-reader testing.

1. Visual direction and whether demo registration is inline, layered, or modal.
2. Final asset list, generation, art direction, and file-level provenance.
3. Any reconsideration of a model-powered feature or live integration.
