# Matrix School Landing

Portfolio project in progress: a fictional online school built around an
explainable “destiny matrix” calculator and a bounded AI school consultant.

The project is designed to demonstrate the complete AI-assisted development
cycle: domain and competitor research, product decisions, precise Codex tasks,
frontend and server implementation, automated checks, responsive/accessibility
QA, and a public Git history.

## Current status

Research, specification, the technical foundation, and the versioned
calculation core are complete. Visual direction work comes next. No live demo
is published yet.

## Product boundaries

- The school and curriculum are fictional portfolio content.
- The calculation is a versioned implementation of published arithmetic, not a
  scientific, psychological, medical, or financial diagnostic method.
- The calculator runs locally in the browser and does not persist a birth date.
- The AI consultant is secondary, uses a curated public knowledge base, and
  remains disabled until a provider, privacy terms, live evaluation, and hard
  spend limit are approved.
- No testimonials, customers, qualifications, commercial results, or personal
  readings are fabricated.

## Planning evidence

- [Product record](PRODUCT.md)
- [Research and recommendation](thoughts/research/2026-10-28-portfolio-site.md)
- [Acceptance contract](specs/2026-10-28-matrix-school-portfolio.md)
- [Implementation plan](plans/2026-10-28-matrix-school-portfolio.md)
- [AI decision log](docs/ai-decisions.md)

## Local commands

```bash
npm install
npm run verify
npm run dev
```

Production server after `npm run build`:

```bash
npm start
```

The only runnable route in the foundation phase is `GET /api/health`.
