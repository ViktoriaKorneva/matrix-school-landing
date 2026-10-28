# Spec: fictional destiny-matrix school portfolio site

**Date:** 2026-10-28
**Author:** Victoria Korneva with Codex

## Problem

Victoria needs a focused public project for a Junior AI Developer vacancy. Her
existing projects show useful technical work but do not directly demonstrate
domain research, competitor analysis, product design, Codex direction, frontend
quality, and verification in the employer’s esoteric web domain.

## Goal

Deliver a public, reproducible portfolio project in which an employer can:

- understand the product and Victoria’s contribution within 30 seconds;
- complete the main calculation-and-learning journey and inspect the AI
  consultant within 3–5 minutes;
- inspect research, decisions, tests, and Git history within 10 minutes.

## Scope

### In scope

#### Public site

- A fictional online school landing page clearly marked as a portfolio concept.
- A first viewport that demonstrates the calculator/lesson rather than relying
  on generic promises.
- A date input with an optional ready-made example.
- A versioned calculation of five base points and four diagonals.
- An interactive matrix overview.
- A readable point selector/list for mobile and assistive technology.
- For a selected point: its role, exact formula, substituted values, result,
  short symbolic reflection prompt, and a compact sample lesson.
- A fictional curriculum explaining what the full learning path would contain.
- A concise method explanation, disclosure, FAQ, and repository link.
- Clear empty, invalid, calculated, selected-point, and restart states.
- A bounded AI school consultant grounded in a curated public knowledge base.
- Clear chat states: closed, ready, sending, answered, refused, rate-limited,
  unavailable, and restart.

#### Public repository

- Source code and locked dependencies.
- Reproducible local setup and build instructions.
- Automated tests for the calculation core and input boundaries.
- Compact product, research, specification, plan, and verification evidence.
- A small factual selection of real Codex task briefs and decision traces:
  task → proposal → verification → accept/change/reject.
- Screenshots and a concise employer-facing case summary once the build is
  visually approved.

### Out of scope

- Real school operations, customers, teachers, certificates, testimonials,
  prices, payments, CRM, email capture, analytics, or accounts.
- Server-side persistence or storage of birth dates.
- AI-generated personal readings or automatic transmission of calculator data
  to the consultant.
- Application persistence of chat history or birth dates.
- Compatibility, children, health, money, career, death, or forecast modules.
- Multiple numerology systems, astrology charts, Tarot readings, or a content
  blog.
- Admin panels, LMS features, lesson progress sync, or user authentication.

## Acceptance criteria

### Product and honesty

- [ ] The site names itself as a fictional portfolio concept in a visible,
      non-disruptive way.
- [ ] No public copy presents invented people, reviews, figures, credentials, or
      commercial outcomes as real.
- [ ] Arithmetic is explicitly separated from symbolic interpretation.
- [ ] The disclosure appears near the result, not only in the footer.

### Core journey

- [ ] The primary action is visually dominant and named in plain language. A
      five-second first-impression check is recorded as a usability target, not
      claimed as achieved unless tested with a person who has not seen the page.
- [ ] The visitor can run a ready-made example without entering personal data.
- [ ] A date from 1900-01-01 through the current local calendar date, inclusive,
      produces all five base values and four diagonal values using the
      documented version-1 formula.
- [ ] Selecting any rendered point shows the formula and substituted arithmetic
      for that point.
- [ ] The visitor can restart or change the date without reloading the page.
- [ ] The journey connects the selected point to a 60–90 second sample lesson and the
      fictional curriculum without hiding the calculation behind a paywall.

### AI consultant

- [ ] The consultant answers questions about the documented method, interface,
      sample lesson, and fictional curriculum from a curated public knowledge
      base.
- [ ] The consultant identifies itself as AI and the school as a portfolio
      concept.
- [ ] It refuses unsupported personal readings and health, financial, legal,
      compatibility, diagnostic, or predictive advice in plain language.
- [ ] Requests to expose or override instructions do not change the consultant’s
      allowed scope or reveal credentials, private context, or server details.
      The public/auditable system prompt is not treated as a secret.
- [ ] The calculator never sends a date or calculated profile to the chat
      endpoint automatically.
- [ ] The chat UI warns users not to submit contact, payment, health, or other
      sensitive information.
- [ ] The server accepts only `{ message: string }` from the browser. Session
      history, system instruction, knowledge base, provider endpoint, model, and
      generation settings are controlled server-side.
- [ ] The server requires same-origin requests with JSON content type, limits a
      message to 600 Unicode characters, caps history at six turns, caps output
      at 350 tokens, makes one provider attempt with no automatic retry, uses a
      20-second timeout, limits a client to 5 messages per 10 minutes and 20 per
      day, limits global concurrent model calls to 3, and exposes a configuration
      kill switch.
- [ ] Chat history is limited to six user/assistant turns, held only in server
      memory for at most 30 minutes, and not written to application storage.
- [ ] Request and response bodies are absent from application logs, SDK error
      output, and hosting diagnostics under tested failure paths.
- [ ] Model output is rendered as plain text without HTML interpretation or
      automatic clickable URLs.
- [ ] Public live mode remains disabled until a provider-side hard spend/token
      cap or an equivalently durable global budget guard is verified against
      concurrent requests and application restart.
- [ ] Provider credentials exist only in server-side environment secrets; the
      client build and public repository contain no key or usable placeholder.
- [ ] A provider outage, timeout, invalid response, or disabled chat produces a
      useful unavailable state and does not affect the calculator or landing.
- [ ] Routine automated tests use a deterministic fake provider; live model
      evaluation is bounded, explicitly triggered, and recorded separately.
- [ ] The exact provider/model/prompt/knowledge-base tuple passes a bounded live
      safety and grounding suite before public live mode; critical failures keep
      chat disabled, and the suite is repeated after model or material prompt/KB
      changes.
- [ ] Before sending the first message, the UI states that chat text is sent to
      the named provider and points to a concise processing disclosure based on
      verified provider terms.

### Validation and edge cases

- [ ] Invalid dates are rejected with a specific inline message.
- [ ] Future dates are rejected because the field is described as a birth date;
      validation receives “today” as a controlled calendar value for tests.
- [ ] Leap-year behavior is correct, including 29.02.2000 as valid and
      29.02.1900 as invalid.
- [ ] The number 22 remains 22; values greater than 22 follow repeated digit-sum
      reduction after a complete named formula.
- [ ] Calculation uses calendar components and does not vary by time zone.

### Accessibility and responsiveness

- [ ] The complete primary journey is keyboard-operable with visible focus.
- [ ] The input has a persistent label, appropriate autocomplete behavior, and
      an error association that assistive technology can announce.
- [ ] Matrix meaning is available as structured text; the SVG or visual diagram
      is not the only source of information.
- [ ] At 360 and 390 CSS pixel widths there is no horizontal scrolling, clipped
      content, overlapping controls, or unreadable point detail; desktop is
      checked at 1440 CSS pixels.
- [ ] Primary form controls and point selectors have touch targets of at least
      44 × 44 CSS pixels.
- [ ] Motion respects `prefers-reduced-motion`, and content does not depend on
      animation to become visible.
- [ ] Text and interactive controls meet WCAG 2.2 AA contrast requirements in
      the shipped states.
- [ ] At 200% browser zoom the primary journey remains readable and operable
      without loss of information.
- [ ] Calculation completion moves or exposes focus intentionally and announces
      the updated result through an accessible status mechanism.
- [ ] The diagram and point list share selection semantics; if the diagram is a
      decorative duplicate for assistive technology, it is excluded from the
      accessibility tree.
- [ ] The chat can be opened, used, and closed by keyboard; sending and answer
      states are announced without stealing focus, closing returns focus to the
      launcher, and long/unavailable/rate-limited states remain usable at 360
      CSS pixels with the on-screen keyboard open.

### Verification and repository

- [ ] Automated tests include the two externally documented control examples
      and independent boundary examples.
- [ ] Tests cover reduction, impossible dates, leap years, future dates, and all
      returned points.
- [ ] Type checking, linting, tests, and production build pass from a clean
      install using documented commands.
- [ ] Dependency and security checks show no unresolved high-severity issue in
      the shipped scope.
- [ ] The repository contains no secrets, personal data, private workspace
      material, or unrelated project files.
- [ ] README explains the live demo, problem, central interaction, Victoria’s
      role, AI collaboration, verification, limitations, and local launch.
- [ ] Desktop and mobile screenshots are captured from the verified build.
- [ ] Victoria can explain the formula, architecture, one key product decision,
      and one real AI decision trace (accepted, changed, or rejected after
      verification).
- [ ] A privacy-oriented browser check confirms that the entered date is absent
      from URL/query/hash, local/session storage, cookies, diagnostics, and
      outgoing network requests.
- [ ] A network/privacy check confirms chat requests go only to the same-origin
      endpoint, contain only the message deliberately entered into chat, and
      receive no calculator state. A date typed manually into chat is treated as
      deliberately submitted chat text, not an automatic calculator leak.
- [ ] Adversarial chat tests cover prompt extraction, instruction override,
      injected roles/model settings/provider URLs, unsupported facts, sensitive
      advice, oversized input, HTML/script output, repeated/concurrent requests,
      and provider failure.

## Constraints

- Separate folder and separate public repository:
  `ViktoriaKorneva/matrix-school-landing`.
- The public repository remains on GitHub; the live application is deployed as
  one same-origin Node application on Amvera because AI credentials require a
  server-side boundary.
- The core calculation continues to run locally in the browser and remains
  fully usable when the server-side consultant is unavailable.
- The final design process must present three materially different directions
  before one is selected.
- Implementation follows the project’s approved plan, the `bulletproof`
  workflow, and `impeccable` for product/design decisions.
- Current external package APIs and framework behavior must be checked against
  official documentation before implementation.

## Non-goals

- Proving that the esoteric system is scientifically valid.
- Selling or operating a real education product.
- Demonstrating maximum framework complexity.
- Generating a large volume of pages, copy, or process documentation.
- Reproducing the visual identity, wording, illustrations, or proprietary
  interpretations of any researched competitor.

## Open decisions before code

1. Confirm the recommended stack: Astro + TypeScript and a focused test runner,
   versus plain HTML/CSS/JavaScript or a React/Vite SPA.
2. Amvera is the planned deployment target; exact provider/model choice follows
   a separate bounded quality/cost evaluation and does not change the UI
   contract.
3. The technical contract uses 1900-01-01 through today as an interface limit,
   not a rule of the esoteric method; no separate product decision is required.
