# Research: portfolio site for an AI junior vacancy

**Date:** 2026-10-28
**Task size:** L
**Status:** completed for planning; visual competitor QA remains a later task

## Problem and research question

The portfolio must prove the full workflow named in the vacancy, not merely show
a decorative landing page. The research therefore asks:

1. Which calculation can be implemented reproducibly without pretending that
   the niche has one universal standard?
2. What patterns are already common among matrix and numerology products?
3. Which product shape best demonstrates research, product thinking, Codex
   direction, frontend logic, AI-agent configuration, testing, mobile care, and
   Git/GitHub practice?

## Evidence required by the vacancy

| Vacancy expectation | Verifiable evidence in this project |
|---|---|
| Study an unfamiliar esoteric direction | Versioned method, sources, glossary, explicit limits |
| Analyse competitors | Dated comparison and decisions traceable to findings |
| Design structure, functions, and scenarios | Product record, spec, and implemented visitor journey |
| Set tasks for Codex | A small set of real task briefs with acceptance criteria |
| Manage AI development | At least one factual decision trace: task → proposal → verification → accept/change/reject |
| Test and improve | Independent arithmetic examples, interaction checks, responsive and accessibility QA |
| Use Git and GitHub | Focused public repository, meaningful history, reproducible setup |
| Additional portfolio proof: configure an AI consultant | Grounded prompt/knowledge base, server-side model adapter, safety and live-behavior tests |

The project should be legible at three depths:

- **30 seconds:** live link, one strong screenshot, clear statement of the
  problem, central interaction, and Victoria’s role.
- **3–5 minutes:** complete a calculation, inspect its explanation, ask the AI
  consultant one supported question, and scan the case summary and checks.
- **10 minutes:** reproduce tests, inspect research and task briefs, and trace
  decisions through Git history.

## Calculation research

### Material disagreement in the niche

Sites use the same “destiny matrix” label for different arithmetic:

- a multi-point 1–22 matrix that reduces values above 22 by summing digits;
- a single “arcana” from day + month, subtracting 22 when needed;
- a single value from all date digits, with either subtraction or digit-sum
  reduction.

These methods can return different values for the same date. The project must
not call one of them the universal official standard.

### Recommended version

Implement **“Demonstration calculation of 22 symbolic codes, version 1”**:
five base points plus four diagonal points.

```text
sumDigits(n): sum the decimal digits of positive integer n

reduce22(n):
  require integer n >= 1
  while n > 22:
    n = sumDigits(n)
  return n

calculate(day, month, year):
  validate the calendar date

  A = reduce22(day)
  B = month
  C = reduce22(sumDigits(year))
  D = reduce22(A + B + C)
  E = reduce22(A + B + C + D)

  AB = reduce22(A + B)
  BC = reduce22(B + C)
  CD = reduce22(C + D)
  DA = reduce22(D + A)
```

Reduction is applied after each complete named formula. It must not be applied
to arbitrary partial sums.

### Independently documented control examples

| Date | A | B | C | D | E | AB | BC | CD | DA | Source status |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 15.07.1991 | 15 | 7 | 20 | 6 | 12 | 22 | 9 | 8 | 21 | A–E published by VIDOMO; diagonals independently derived from published formulas |
| 06.05.1995 | 6 | 5 | 6 | 17 | 7 | 11 | 11 | 5 | 5 | A–E published by MyMatrix22; diagonals independently derived from published formulas |
| 29.02.2000 | 11 | 2 | 2 | 15 | 3 | 13 | 4 | 17 | 8 | Independently derived for leap-date boundary testing |
| 31.12.1999 | 4 | 12 | 10 | 8 | 7 | 16 | 22 | 18 | 12 | Independently derived for maximum day/month testing |
| 22.01.2000 | 22 | 1 | 2 | 7 | 5 | 5 | 3 | 9 | 11 | Independently derived to prove that 22 stays 22 |

Boundary rules for the implementation:

- `reduce22(22) = 22`, `reduce22(23) = 5`, `reduce22(29) = 11`.
- Reject impossible calendar dates such as 29.02.1900 and 31.04.
- Treat the date as calendar components, independent of time zone.
- Accept dates from 1900-01-01 through the current local calendar date,
  inclusive. Pass “today” into validation as a controlled value so tests do not
  depend on the machine clock.
- Time, place, name, and gender are not needed for this arithmetic and must not
  be requested.

### Interpretation boundary

Arithmetic is reproducible; symbolic interpretation is not scientific,
psychological, medical, or financial diagnosis. The project will use original,
short reflection prompts rather than claims about character, health, money,
death, compatibility, or future events.

Suggested public disclosure:

> “The destiny matrix is an esoteric system of symbolic interpretation. The
> result follows the published formula stated on this site and is not a
> scientific diagnosis or forecast.”

## Competitor sample

The research reviewed public pages of eight current services. No forms were
submitted, no accounts were created, and no marketing claims were treated as
independent facts.

| Product | Observed model | Strong pattern | Weakness / risk relevant to this project |
|---|---|---|---|
| [Numeria](https://numeria.ru/calculators/matrica-sudby/) | Free calculations, paid reports, courses, club | Broad ladder from curiosity to practitioner tools | Catalogue, promotions, and many methods compete for attention |
| [Matrix Life](https://appmatrix.life/obuchenie/) | Course tiers plus calculator access | Calculator remains useful after training | Income framing and many offers distract from learning |
| [Совершенство](https://matritca-sudby.ru/) | Reports, subscriptions, consultations, training | Multiple output formats including audio | Strong health/money claims and tariff overload |
| [Sudba22](https://www.sudba22.ru/) | Free result leading to 15 lessons | Tight connection between result and curriculum | Locked zones and urgency make the path feel like a paywall |
| [ОСОЗНАЮ](https://osoznau.ru/matrica-sudby) | Free tools leading to deeper reports | Progressive disclosure and optional extra data | Large adjacent catalogue obscures the main job |
| [DestinyNumbers](https://destinynumbers.org/ru/) | One profile feeding many thematic readings | Reuse of one input across different views | Too much input and system mixing before first value |
| [Astro-Charts](https://astro-charts.com/) | Free chart tools plus paid reports | The free tool stands as a product | Specialist terms can block a newcomer |
| [Astrodienst AstroClick](https://www.astro.com/cgi/aclch.cgi?btyp=ack&lang=r) | Large portal with interactive chart reading | Clicking a point reveals contextual meaning | Catalogue density and service structure appear before a simple path |

### Verification limitation

The environment could read live public content but did not provide a usable
interactive browser during this pass. Text, fields, links, and published offers
were inspected; visual composition, responsive rendering, and calculator output
were **not** visually verified. Those are separate implementation-phase tasks.

## Product opportunity

The pattern “free matrix → paid interpretation or course” is already common.
The strongest differentiated portfolio concept is an **interactive textbook**:

1. A visitor uses an example or enters a date.
2. The site builds a readable matrix.
3. Selecting a point reveals its formula and the exact arithmetic for this date.
4. A short symbolic prompt is clearly separated from the calculation.
5. A three-minute sample lesson teaches how to read that one position.
6. The fictional curriculum shows how the learning path continues. The sample
   lesson uses one compact template populated with the selected point; it does
   not become nine separate lessons.

This shape directly demonstrates state design, a testable calculation core,
interactive SVG or an equivalent accessible representation, mobile adaptation,
and a purposeful link between product and curriculum.

## AI consultant and hosting research

GitHub Pages publishes static HTML, CSS, and JavaScript. It cannot run the
server-side code needed to protect an AI provider key. A Pages frontend could
call an external backend, but that would split deployment and add CORS and
failure modes without improving the portfolio proof.

Amvera can run a Dockerized web application, expose it over HTTPS, store model
credentials as secrets, and connect a public GitHub repository through a
webhook. The recommended shape is therefore:

```text
Browser
  ├─ local calculator (no network, no persistence)
  └─ POST /api/chat (same origin)
       ├─ input/rate/timeout limits
       ├─ public/auditable system prompt + curated knowledge base
       ├─ provider adapter using a server-side secret
       └─ bounded response or explicit unavailable/refusal state
```

The consultant is a **school guide**, not a fortune-teller. It answers questions
about the documented formula, how to read the interface, what the sample lesson
teaches, and what the fictional curriculum contains. It must not receive a date
from the calculator automatically or make personal health, money, legal,
relationship, diagnostic, or predictive claims.

The provider remains replaceable through environment variables and a small
adapter. Amvera publishes an OpenAI-compatible inference API, but current model
quality and cost must be checked with a bounded evaluation before choosing it.
The project must run tests with a deterministic fake provider; paid live calls
are never required for routine CI. Before public live mode, the exact
provider/model/prompt/knowledge-base tuple must pass a bounded live evaluation.
Any critical failure leaves chat disabled.

Safety does not depend on hiding the system prompt. The browser can submit only
an approved text field; the server owns the session history, system instruction,
knowledge base, provider URL, model, and generation settings. Model output is
rendered as plain text, never executable HTML. Origin and JSON content-type
checks reduce browser-based cross-origin abuse but do not replace rate and
global spend controls.

### Hosting alternatives

1. **GitHub Pages + model call from browser:** rejected; exposes the provider
   key or relies on an unsafe public credential.
2. **GitHub Pages frontend + Amvera API:** technically workable, but rejected as
   unnecessary split deployment and CORS complexity.
3. **One application on Amvera + public GitHub source:** recommended; one origin,
   server-side secrets, one deployable artifact, and a clearer employer story.

Relevant official documentation:

- [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
- [GitHub Pages does not support server-side languages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
- [Amvera Docker deployment](https://docs.amvera.ru/applications/configuration/docker.html).
- [Amvera variables and secrets](https://docs.amvera.ru/applications/configuration/variables.html).
- [Amvera public HTTPS access](https://docs.amvera.ru/applications/configuration/network.html).
- [Amvera LLM Inference API](https://docs.amvera.ru/LLM/doc-inference-ru.html).

## Alternatives considered

### 1. Static school landing page

- **Pros:** fastest, easy to polish visually.
- **Cons:** weak evidence of logic, testing, and product depth.
- **Verdict:** insufficient for the vacancy by itself.

### 2. Standalone calculator

- **Pros:** strongest focus on frontend logic and tests.
- **Cons:** misses commercial page structure and the school concept.
- **Verdict:** better than a static page, but incomplete proof.

### 3. School landing + calculator as a result paywall

- **Pros:** mirrors real niche funnels.
- **Cons:** too close to Sudba22 and other existing patterns.
- **Verdict:** rejected as insufficiently specific.

### 4. School landing + interactive educational calculator

- **Pros:** proves research, product reasoning, frontend logic, UX, content
  boundaries, testing, and visual craft in one coherent flow.
- **Cons:** requires careful scope control and two representations of the matrix
  for desktop and mobile/accessibility.
- **Verdict:** recommended.

## Risks and constraints

- **Method drift:** different schools calculate and name positions differently.
  Mitigation: version the method, publish the formula, and test against named
  examples.
- **Misleading claims:** symbolic language can sound diagnostic. Mitigation:
  strict copy boundary and disclosures beside results.
- **Decorative overbuild:** occult visuals can obscure the task. Mitigation:
  the first viewport must demonstrate the interaction, not just atmosphere.
- **Mobile diagram failure:** labels become unreadable. Mitigation: diagram as
  overview plus a semantic list/selector for reading details.
- **Portfolio documentation theatre:** too many process files weaken the proof.
  Mitigation: keep public evidence compact and factual.
- **Public chat abuse and cost:** an anonymous endpoint can be automated.
  Mitigation: bounded messages and output, per-client rate limits, concurrency
  and timeout limits, one provider attempt without automatic retries, monitoring,
  and an environment kill switch. Live mode stays off until the chosen provider
  has a verified hard spend/token ceiling or the app has an equivalently durable
  global guard that survives restart and concurrent requests.
- **Prompt injection / unsupported answers:** a public user can ask for hidden
  instructions or unrelated advice. Mitigation: narrow public knowledge,
  explicit refusal contract, adversarial tests, no tools, no private context,
  and no secrets in the prompt.
- **Chat privacy:** free text can contain personal data. Mitigation: visible
  warning and provider disclosure, no automatic calculator context, only
  short-lived in-memory session state, no request-body logging, and verification
  of the selected provider’s retention/processing terms before live mode.

## Best practices and sources

- [MyMatrix22 calculation method](https://mymatrix22.com/ru/calculation-method)
  — formulas, method version, and published control example.
- [VIDOMO about and method](https://www.vidomo.org/ru/about) — control example,
  acknowledgement of method variants, and separation of arithmetic from
  interpretation.
- [A. Matrix, “Матрица Судьбы от А до Я”, published fragment](https://content.img-gorod.ru/pim/products/images/29/f1/01920373-b6e3-7405-b1f7-08356cb229f1.pdf)
  — five base points for this author’s version; not evidence of scientific
  validity.
- [FateByDate formula article](https://fatebydate.ru/blog/kak-uznat-svoj-arkan/)
  — evidence that another published algorithm uses subtraction of 22.

## Conclusion and recommendation

**Recommended approach:** build a compact fictional school around one
versioned, explainable calculator that acts as the first lesson, plus a bounded
AI school consultant served from the same Amvera application.

**Key reasons:**

1. It maps directly to every high-value requirement in the vacancy.
2. It is more specific than the common calculation-to-paywall funnel.
3. The arithmetic can be tested independently while the symbolic layer remains
   clearly bounded and honest.
4. The consultant adds relevant AI-agent evidence without becoming the primary
   product or blocking the calculator when the model is unavailable.

**Main risk:** losing focus by expanding into accounts, payments, AI-generated
interpretations, compatibility, health, money, or multiple esoteric systems.
Those features are outside the MVP.
