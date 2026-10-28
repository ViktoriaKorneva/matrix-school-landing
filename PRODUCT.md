# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + TypeScript with the official standalone Node adapter, a small
client-side calculator island, and a server-side chat endpoint, packaged as one
Node application for Amvera. Victoria approved this stack and deployment
boundary on 2026-10-28. It keeps the landing content-first while the calculator
stays typed and testable and the model key never reaches the browser.

## Users

### Primary evaluator

A hiring manager reviewing a junior AI developer. They need quick evidence that
the candidate can research an unfamiliar domain, shape a product, direct Codex,
verify the result, and finish a presentable web project.

### Demonstration visitor

A curious newcomer who wants to understand how a simplified 22-code “destiny
matrix” is calculated and learn to read its basic positions without registering
or providing contact data.

## Product Purpose

Create a public portfolio concept for a fictional online school. The site must
combine a persuasive landing page with a working educational calculator so that
the result demonstrates product research, interface design, frontend logic,
AI-assisted development, testing, and Git discipline.

Success means an employer can understand the project in 30 seconds, complete
the core calculation and see the AI consultant in 3–5 minutes, and verify the
decisions and tests in the repository within 10 minutes.

## Positioning

The calculator is not a paywall for a longer interpretation. It is an
interactive lesson: a visitor can select a point, see the arithmetic that
produced it, read a bounded symbolic interpretation, and understand what a
related lesson would teach.

## Operating Context

- The public site is a portfolio demonstration, not a real school or service.
- The main journey is: open → enter a birth date or use an example → see the
  matrix → choose a point → inspect the calculation → complete a short lesson →
  review the fictional curriculum.
- The repository is part of the deliverable and must explain research,
  decisions, AI collaboration, and verification without exposing private
  workspace materials.
- A bounded AI school consultant answers questions about the method, fictional
  curriculum, and site navigation from a curated public knowledge base.

## Capabilities and Constraints

- One reproducible versioned calculation: five base points and four diagonals.
- Calculation happens locally in the browser; no account, analytics, payment,
  or collection of contact data.
- The AI consultant calls a model only through a same-origin server endpoint.
  API keys remain server-side in Amvera secrets and never enter client assets.
- The consultant is not a personal reader: it does not receive the calculator
  date automatically, diagnose a person, or answer health, financial, legal,
  compatibility, or predictive questions.
- Chat history may exist ephemerally in server memory for a short session but is
  not written to application storage. The interface warns users that deliberately
  submitted text is sent to the selected model provider and not to share contact,
  payment, health, or other sensitive information.
- The live consultant has bounded input, output, conversation length, timeout,
  rate, concurrency, and spend exposure, plus a kill switch and a clear
  unavailable state. Live mode remains disabled until a provider-side hard cap
  or an equivalently durable global budget guard is verified.
- A date is used only for the current calculation and is not persisted or sent
  in a URL, storage, cookie, diagnostic output, analytics, or network request.
- Arithmetic and symbolic interpretation are presented as separate layers.
- The site must work on desktop and mobile and remain usable with keyboard
  navigation and reduced motion.
- The fictional school, curriculum, and sample content must be clearly marked
  as a portfolio concept.
- No fabricated testimonials, student counts, qualifications, revenue claims,
  scientific claims, health predictions, financial advice, or compatibility
  verdicts.

## Evidence on Hand

- The vacancy explicitly accepts educational projects and evaluates research,
  product thinking, Codex task setting, testing, visual quality, mobile quality,
  Git, and GitHub.
- Published sources document a reproducible five-point calculation and examples.
- Competitor research confirms that “free calculation → paid course” is common;
  the educational interaction is the intended differentiation.
- There are no real customers, students, testimonials, commercial results, or
  school credentials to claim.

## Product Principles

1. Show the mechanism instead of asking the visitor to trust a claim.
2. Teach one coherent method well instead of aggregating many esoteric systems.
3. Make the arithmetic verifiable and label interpretation as symbolic.
4. Make the AI consultant grounded, bounded, and replaceable; a graceful
   unavailable state must not break the calculator or landing page.
5. Let the working product prove AI-development skill; documentation supports
   the proof but does not overwhelm it.
6. Keep every public statement honest about the project’s fictional and
   educational status.

## Accessibility & Inclusion

- The primary journey must be keyboard-operable with visible focus.
- Errors must be connected to the date input and announced clearly.
- The diagram must have an equivalent readable list on small screens and for
  assistive technology.
- Information cannot depend on color, hover, or motion alone.
- Motion must respect `prefers-reduced-motion`.
- The verified responsive floor is 360 CSS pixels wide, with a second mobile
  check at 390 CSS pixels and a desktop check at 1440 CSS pixels.
