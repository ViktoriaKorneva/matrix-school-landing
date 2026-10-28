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
