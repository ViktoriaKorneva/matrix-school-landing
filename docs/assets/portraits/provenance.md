# Selected fictional portraits

Created 29 October 2026 by the built-in `image_gen.imagegen`, following
Victoria's explicit request in the accepted mockup task. The internal model
identifier and separate tool cost were not exposed. No real-person image
references were used. No new generation occurred during implementation.

Exact original prompts, selected file names, SHA-256 hashes and derivative
settings are retained in [prompts.json](prompts.json). The four original PNGs
under `src/assets/portraits/` are byte-identical to the approved local assets.
The early Irina and Svetlana drafts are not used or copied to production.

| Material | Original | Shipped presentation |
|---|---|---|
| Anna Mironova | `src/assets/portraits/anna-mironova-2026-10-29.png` | Astro WebP, width 800; 4:5 CSS crop; visible AI-origin and fictional-teacher labels |
| Olga | `src/assets/portraits/olga-avatar-2026-10-29.png` | Astro WebP, width 144; circular 72/64px CSS crop; fictional-testimonial label |
| Irina, selected v2 | `src/assets/portraits/irina-avatar-v2-2026-10-29.png` | Same avatar pipeline; selected distinct facial proportions |
| Svetlana, selected v2 | `src/assets/portraits/svetlana-avatar-v2-2026-10-29.png` | Same avatar pipeline; selected distinct facial proportions |

Implementation transformations: local format/size optimization only, no
retouching. The images do not represent actual teachers or learners, prove
customer outcomes, or guarantee uniqueness/non-resemblance to real people.

The source provenance recorded an official-terms check on 29 October 2026:
[Terms of Use](https://openai.com/policies/terms-of-use/) and
[Service Terms](https://openai.com/policies/service-terms/). That historical
check is preserved in the JSON. This migration does not assign a new license,
claim an independent legal review, or constitute publication clearance.
Keep the fictional-origin disclosures when these assets are reused.

Other materials: the page's geometric HTML/SVG and educational text are original
project concept materials from the accepted B/E content contract. The Onest
font remains in its existing Fontsource package under SIL OFL-1.1. No competitor
portrait, logo, review, worksheet or screenshot is reused. Earlier texture
provenance is outside this record; the current page does not use those textures.
