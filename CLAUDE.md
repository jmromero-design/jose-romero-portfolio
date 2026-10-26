# Jose Romero Portfolio — Claude Reference

Static HTML/CSS portfolio. No build step, no framework, no JS bundler.
Deploy: push to `main` on `jmromero-design/jose-romero-portfolio` → Vercel auto-deploys.
Live: https://www.joseromerodesign.com (the bare domain redirects here; canonicals, sitemap, llms.txt and JSON-LD all use www) · Vercel project: `prj_yrqqL9ZRSixjZM1rjNRp8hW6iTEj`

---

## Copy standard — human-voice skill applies to every word on this site

All prose on this site — hero copy, case-study body text, About bio, article body text, alt text, meta descriptions, in either EN or ES — must comply with the global `human-voice` skill (`~/.agents/skills/human-voice/SKILL.md`). That protocol supersedes any tone guidance elsewhere in this file when they conflict. Before writing or editing any copy here, apply it: no banned AI-tell vocabulary, no mirrored "not X, it's Y" constructions, no mechanical rule-of-three padding, no manufactured pull-quotes restating their own paragraph, and run its mandatory self-audit pass before delivering. The one exception is the fixed canonical CTA copy below (§ Canonical CTA copy) and the third-party testimonial quotes in about.html/es/about.html — those are locked/attributed content, not prose to improve.

---

## Content consistency (set 2026-10-24)

AI search tools quote this site, so facts and conventions must match on every page:

- **British spelling** in all English prose: behavioural, organisation, optimisation, prioritise, colour. Never inside code, class names, URLs or published titles quoted from sources.
- **Facts that appear on several pages** must read the same everywhere, including `llms.txt` and `middleware.js`: e.g. IKEA Home Services is live in "seven Spanish **regions**"; BECO counts come from `assets/data/beco-explorer/tree.json` totals (420 sources, 243 named concepts, 222 real-world examples as of 2026-10-24).
- **One `<h1>` per page.** Slide or section headings are `<h2>`.
- **Meta descriptions ≤ 160 characters** (og:/twitter:description too); titles ≤ 60.
- **Markdown for AI tools:** every page except the homepage has a generated markdown twin under `md/<path>/index.md`, served by `middleware.js` to requests with `Accept: text/markdown` and linked from each page's `<head>`; `llms-full.txt` concatenates the English ones. **After editing any page copy, run `python3 scripts/build_markdown.py`** or the markdown goes stale. The homepage's agent summary is hand-written in `middleware.js`; update it when the homepage story changes.
- **Structured data:** the Person has one `@id` (`https://www.joseromerodesign.com/#person`) that articles, case studies and index pages reference; every page but the homepages has a `BreadcrumbList`; Work and Thinking are `CollectionPage` + `ItemList` (add new entries there); the explorer is a `Dataset`. New pages should follow the same pattern.
- **Dates:** case studies carry `temporalCoverage` / `datePublished` / `dateModified` in their JSON-LD; the Thinking articles carry Article JSON-LD and a visible "Published · Updated" line. When an article's or case study's content changes, update `dateModified` and the visible "Updated" date.

---

## File structure

```
/                          EN pages (root)
/es/                       ES pages (mirrors EN exactly)
/work/<slug>/              EN case studies (10 total)
/es/work/<slug>/           ES case studies
/thinking/<slug>/          EN articles
/es/thinking/<slug>/       ES articles
assets/css/main.css        All global styles (versioned ?v=48)
assets/js/main.js          All JS — theme, nav, icons, scroll (versioned ?v=19)
assets/images/work/<slug>/ WebP images per case study
assets/fonts/              Self-hosted Bitter (variable, display) + Outfit woff2 files
Designing the portfolio/   Local working folder — gitignored, not deployed
```

**35 live pages** as of 2026-10-24 (was 31 as of 2026-06-24; +1 EN/ES pair `/thinking/beco-knowledge-graph/`, a presentation-style visual explainer using its own `bko-` prefixed page-specific styles; +1 EN/ES pair `/thinking/beco-explorer/`, the graph as one page: a canvas node-link map plus a column of cards that read whatever you pick, prefixed `bgx-`, drawn and wired by the shared `assets/js/beco-explorer.js` with wording passed in `window.BGX_STRINGS` — see each file itself, neither is a template to generalize; `/thinking/beco-graph/` redirects there). The explorer loads `assets/data/beco-graph/graph.json` (nodes, links, precomputed layout, built by `scripts/generate_beco_graph_data.py` from the export in `assets/data/beco-explorer/`) and fetches `assets/data/beco-explorer/biases/<id>.json` when a concept's card opens. After any BECO ingest round you want reflected publicly, run `scripts/generate_beco_explorer_data.py` (Aura export: `tree.json` + `biases/`), then `scripts/generate_beco_graph_data.py`; nothing regenerates automatically. **After regenerating, also update the hard-coded counts in the homepage BECO feature** (`.bx` section in `index.html` and `es/index.html`: source and concept totals in the paragraph, the verified / partial / no-backing split in the bar's `flex` values, legend and `aria-label`), computed from `tree.json`. EN pages at root, ES pages under `/es/` with identical structure.

---

## CSS editing rules

1. **Global styles go in `main.css` only.** Never add global patterns to a page `<style>` block.
2. **Page-specific styles go in a `<style>` block in the page's `<head>`.** Never pollute `main.css` with single-page rules. **Exception:** component families shared across an EN+ES page pair (e.g. `.home-hero`, `.about-intro-grid`) may live in `main.css` to avoid duplicating identical rules in both language files.
3. **After any change to `main.css` or `main.js`, increment the version query string in all 39 HTML files.** Current: `main.css?v=48` / `main.js?v=19`. Find with: `grep -rn "main.css?v=" . --include="*.html"`.
4. **Mobile breakpoints in main.css:** `@media (max-width: 768px)` for tablet/mobile, `@media (max-width: 480px)` for narrow mobile (gutter shrinks to `1.25rem` here). Two separate `@media (max-width: 480px)` blocks exist — mind cascade order.
5. **`h1 br { display: none }` at `≤768px`** is a global rule — it hides hard breaks before `<em class="accent-italic">` so the italic accent flows inline on mobile. Don't remove it.

---

## Design tokens

All tokens are CSS custom properties on `:root`. Reference them by name — never hardcode hex values.

### Colours

| Token | Dark | Light | Use |
|-------|------|-------|-----|
| `--bg-base` | `#090908` | `#FBFCFD` | Page background |
| `--bg-surface` | `#111110` | `#EAEFF2` | Card backgrounds |
| `--bg-surface-2` | `#181816` | `#DFE6EA` | Nested surfaces |
| `--text-primary` | `#F2EEE6` | `#0E1A23` | Headings, body |
| `--text-secondary` | `#D4CFC6` | `#24333D` | Supporting text |
| `--text-tertiary` | `#84817D` | `#586873` | Labels, metadata |
| `--gold` | `#EA6674` | `#B4233F` | Accent (warm crimson since 2026-10-24; the token keeps its old name), interactive hover, `<em>` colour |
| `--teal` | `#4BBFB2` | `#136F67` | Eyebrow labels, informational tags, links |
| `--teal-text` | `#66D4C8` | `#0B4E48` | Teal text on surfaces (contrast-safe) |

**Colour intent:** gold = brand accent and interactive feedback. Teal = informational and structural. Never swap them. The accent leans red, so never use it to mean a *middle* grade or status (it reads as a warning): BECO backing grades are a teal scale (solid teal verified, teal mixed 50% toward `--bg-base` partial, dashed outline none). Red-for-risk (myth-risk tags) is fine.

### Typography

| Token | Value | Use |
|-------|-------|-----|
| `--font-display` | Bitter (self-hosted variable slab, 300–500 + italic; replaced Fraunces 2026-10-24) | Headings, nav logo, pull quotes, `.lead`. Runs ~25% wider than Fraunces, so the homepage hero is sized down and EN is split over 4 lines like ES |
| `--font-body` | Outfit (self-hosted) | All body text, UI labels, tags, eyebrows |
| `--text-xs` | `0.9375rem` (15px) | Tags, labels, captions |
| `--text-sm` | `1rem` (16px) | Small body |
| `--text-base` | `1.125rem` (18px, since 2026-10-25) | Base body; prose is weight 400, not 300 |
| `--text-lg` | `1.25rem` | `.body-lg` paragraphs |
| `--text-xl` | `1.375rem` | Lead-in text, nav logo (desktop) |
| `--text-2xl` | `1.625rem` | Card titles |
| `--text-3xl` | `2rem` | Section headings |
| `--text-4xl` | `2.75rem` | Large headings |
| `--text-5xl` | `3.75rem` | |
| `--text-6xl` | `5.25rem` | Hero h1 max |

**h1 sizing pattern:** `clamp(2.25rem, 7vw, var(--text-6xl))` — minimum is `2.25rem`, not `var(--text-4xl)`.

### Spacing

`--sp-1` = 0.25rem through `--sp-40` = 10rem. Always use the scale — no arbitrary rem/px values.

### Other tokens

```css
--nav-height: 72px
--gutter: clamp(1.5rem, 5vw, 4rem)   /* shrinks to 1.25rem at ≤480px */
--max-width: 1200px
--radius-sm: 3px  --radius-md: 6px  --radius-lg: 12px
--ease-fast: 180ms  --ease-base: 280ms  --ease-slow: 420ms
```

---

## Theming

Dark mode is the default. Light mode is set via `[data-theme="light"]` on `<html>`. Persisted to `localStorage` key `jr-theme`. System preference fallback via `@media (prefers-color-scheme: light)` requires no JS; it repeats the light tokens, so change both blocks together.

**Light mode is "drafting paper" (since 2026-10-25):** near-white paper (`--bg-base`) with ink-navy text, and a cool blue-grey ground (`--bg-tint`) on chosen sections so pages alternate: every page opening, the closing CTA, the homepage stack and BECO sections, and About's Experience. The grid is a detail, never page-wide: a faint corner fade on inner page openings (`--grid-line`), a softer bottom-left fade on a few paper sections that would feel empty (homepage positioning, Thinking and testimonials, About's Career; `--grid-line-soft`), plus the grids components already carry (CTA, homepage About card). The BECO explorer stays plain paper throughout. No dot texture in light mode. Grain is a static 160px tile: in light mode `noise-ink-soft.webp` on the paper (barely visible) and `noise-ink.webp` on the blue-grey ground; `noise-chalk.webp` page-wide in dark mode. Images cache for a day, so bump a `?v=` on a tile URL when you regenerate it set as a background image; never bring back a `position: fixed` texture layer, which repaints on scroll and fought the glass elements. See "LIGHT MODE SECTIONS" in main.css. The earlier warm off-white read as the generic AI look; don't drift back to warm greys or cream.

When editing colours or backgrounds always verify both modes. Never hardcode `#090908` or `#FBFCFD` — use `var(--bg-base)`.

---

## Components

### Heading accent pattern

```html
<h1>Main heading text<br>
  <em class="accent-italic">italic gold accent.</em>
</h1>
```

The `<br>` creates a clean two-line split on desktop. On mobile it's hidden (`h1 br { display: none }` in main.css ≤768px) so the `<em>` flows inline. Always pair `<br>` + `<em class="accent-italic">` — never put the accent on its own line with a block element.

### Eyebrow label

```html
<span class="eyebrow">Section label</span>
<!-- auto-appends a teal line via ::after -->

<span class="eyebrow eyebrow--bare">Label without line</span>
```

Teal, uppercase, `letter-spacing: 0.14em`. Appears above section headings and in card tops.

### Tags

```html
<span class="tag">Neutral</span>
<span class="tag tag--teal">Informational</span>   <!-- teal bg tint, teal border -->
<span class="tag tag--gold">Current / active</span> <!-- gold bg tint, gold border -->
```

Used in card tops (homepage, case study pages). No numbers alongside tags — card numbers were removed June 2026.

### Card top (homepage + case study list cards)

```html
<div class="card-top">
  <div class="card-tags">
    <span class="tag tag--gold">Client · Status</span>
    <span class="tag">Discipline</span>
    <span class="tag">Domain</span>
  </div>
</div>
```

Left-aligned flex, no number element. Do not add a number span — they were intentionally removed.

### Work list cards (work.html)

```html
<div class="card-top">
  <div class="work-card-tags">Discipline · Domain · Subdomain</div>
</div>
```

Tags are a plain text string (not pill spans), left-aligned, teal uppercase. The eyebrow text separator is `·` (middle dot, `&middot;`).

### Buttons

```html
<a href="…" class="btn btn-primary">Primary CTA <span class="arrow">→</span></a>
<a href="…" class="btn btn-ghost">Secondary <span class="arrow">→</span></a>
```

`.arrow` spans are auto-replaced with SVG by `main.js` — always use the text `→` inside `.arrow`, never hardcode an SVG.

### Icons

Five icons inlined in `main.js`: `sun`, `moon`, `arrow-right`, `chevron-right`, `external-link`. No Lucide library — `lucide.min.js` was deleted June 2026. Do not re-add it.

### Reveal animation

```html
<div class="reveal">…</div>
```

Elements with `.reveal` start hidden (`opacity: 0, translateY(20px)`) and animate in via IntersectionObserver in `main.js`. Add to any new section-level element. Do not add to inline elements.

---

## Page templates

### Every page structure

```
nav (.nav)
main#main
  sections…
  .cta-section         ← required on every page
footer (.site-footer)
```

### Case study page structure

```
nav
main#main
  hero section (breadcrumb + eyebrow + h1 + description + tags)
  .cs-details-bar      (role, duration, client, team metadata)
  body sections (.cs-section)
  .cta-section
  .next-project        ← links to next case study in chain
footer
```

### Next-project chain (case studies)

01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09 → 10 → 01 (loops). Applies EN and ES separately. If adding or reordering a case study, update both the outgoing link on the previous study and the incoming URL on the following one.

---

## Canonical CTA copy

Every page ends with `.cta-section`. Copy is fixed — do not paraphrase.

**EN:**
- Heading: `Your hardest problem<br><em class="accent-italic">is a good place to start.</em>`
- Body: `Open to senior product design roles and selective consulting engagements, in English or Spanish.`

**ES:**
- Heading: `Tu problema más difícil<br><em class="accent-italic">es un buen punto de partida.</em>`
- Body: `Abierto a roles de product design senior y proyectos de consultoría selectivos, en inglés o español.`

**Exception:** `about.html` and `es/about.html` include an extra Download CV / Descargar CV `btn-ghost` button below the body.

---

## Images

- Format: WebP, quality 82, width 620px, via Pillow. Must `.convert('RGB')` before saving (avoids RGBA error).
- Output path: `assets/images/work/<case-study-slug>/`
- Source PNGs: `Designing the portfolio/project_images/<slug>/` (local, gitignored)
- CVs (`assets/cv/jose-romero-cv-en.pdf`, `-es.pdf`): built by `python3 scripts/build_cv.py` (copy in its `CV` dict, rendered in Bitter + Outfit to one A4 page via headless Chrome). Keep its facts identical to the site; re-run after any change to roles, outcomes or figures, and check both still fit one page.
- Share images (`assets/images/og-*.webp`, 2400×1260): built by `python3 scripts/build_og_images.py` (Bitter + Outfit text panel rendered in headless Chrome, project visuals from `Designing the portfolio/og-visuals/`). English cards come from `CARDS`, Spanish ones (`og-<slug>-es.webp`, used by every `/es/` page) from `CARDS_ES`. Edit the copy there and re-run; then bump the `?v=` on the `og:image` / `twitter:image` meta tags so social previews refresh.
- Work card images: two overlapping frames (`wc-phone--back` / `wc-phone--front` for mobile-first projects; `wc-desktop--back` / `wc-desktop--front` for desktop/artifact projects).

---

## EN / ES parity

Every EN page has a matching ES equivalent. When editing content or structure, apply the same change to both. The language toggle in the nav (`/lang-detect.js`) handles redirects. Alternate `hreflang` links are in each page's `<head>`.

---

## What not to do

- **Don't hardcode hex values** — always use CSS custom properties.
- **Don't add `<br>` after `<em class="accent-italic">`** — the break goes *before*, not after.
- **Don't put page-specific rules in main.css** — use a `<style>` block in the page `<head>`.
- **Don't add global rules to a page `<style>` block** — they won't apply to other pages.
- **Don't forget to bump `?v=N`** after any CSS or JS change — applies to all 39 HTML files.
- **Don't re-add Lucide** — icons are already inlined in `main.js`.
- **Don't add card numbers** — intentionally removed June 2026.
- **Don't use `min-width` on SVG diagrams** — all diagrams are mobile-first portrait viewBox.
