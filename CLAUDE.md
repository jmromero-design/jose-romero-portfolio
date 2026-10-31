# Jose Romero Portfolio — Claude Reference

Static HTML/CSS portfolio built with Eleventy (migration started on branch `eleventy` 2026-10-27 and merged to `main` that day; see § Build). No framework, no JS bundler: pages are plain HTML in `src/` and the output is plain HTML in `_site/`.
Deploy: push to `main` on `jmromero-design/jose-romero-portfolio` → Vercel auto-deploys.
Live: https://www.joseromerodesign.com (the bare domain redirects here; canonicals, sitemap, llms.txt and JSON-LD all use www) · Vercel project: `prj_yrqqL9ZRSixjZM1rjNRp8hW6iTEj`

---

## Copy standard — human-voice skill applies to every word on this site

All prose on this site — hero copy, case-study body text, About bio, article body text, alt text, meta descriptions, in either EN or ES — must comply with the global `human-voice` skill (`~/.agents/skills/human-voice/SKILL.md`). That protocol supersedes any tone guidance elsewhere in this file when they conflict. Before writing or editing any copy here, apply it: no banned AI-tell vocabulary, no mirrored "not X, it's Y" constructions, no mechanical rule-of-three padding, no manufactured pull-quotes restating their own paragraph, and run its mandatory self-audit pass before delivering. The one exception is the fixed canonical CTA copy below (§ Canonical CTA copy) and the third-party testimonial quotes in about.html/es/about.html — those are locked/attributed content, not prose to improve.

---

## Content consistency (set 2026-10-24)

AI search tools quote this site, so facts and conventions must match on every page:

- **British spelling** in all English prose: behavioural, organisation, optimisation, prioritise, colour. Never inside code, class names, URLs or published titles quoted from sources.
- **Facts that appear on several pages** must read the same everywhere, including `llms.txt` and `middleware.js`: e.g. IKEA Home Services is live in "seven Spanish **regions**"; BECO counts come from `assets/data/beco-explorer/tree.json` totals (452 sources, 254 named concepts, 465 findings, 227 real-world examples as of 2026-10-26).
- **One `<h1>` per page.** Slide or section headings are `<h2>`.
- **Meta descriptions ≤ 160 characters** (og:/twitter:description too); titles ≤ 60.
- **Markdown for AI tools:** every page except the homepage has a generated markdown twin under `md/<path>/index.md`, served by `middleware.js` to requests with `Accept: text/markdown` and linked from each page's `<head>`; `llms-full.txt` concatenates the English ones. **After editing any page copy, run `npm run build:all`** or the markdown goes stale. The homepage's agent summary is hand-written in `middleware.js`; update it when the homepage story changes.
- **Structured data:** the Person has one `@id` (`https://www.joseromerodesign.com/#person`) that articles, case studies and index pages reference; every page but the homepages has a `BreadcrumbList`; Work and Thinking are `CollectionPage` + `ItemList` (add new entries there); the explorer is a `Dataset`. New pages should follow the same pattern.
- **Dates:** case studies carry `temporalCoverage` / `datePublished` / `dateModified` in their JSON-LD; the Thinking articles carry Article JSON-LD and a visible "Published · Updated" line. When an article's or case study's content changes, update `dateModified` and the visible "Updated" date.

---

## Build (Eleventy)

- **Pages live in `src/`** with the same folder tree as the URLs (`src/work/<slug>.html`, `src/es/…`). Edit those, never `_site/` (generated, gitignored).
- **The `<head>` comes from front matter** (since phase 2, 2026-10-27): each page's front matter holds `title`, `description`, `ogImage`, plus optional `ogTitle`, `ogDescription`, `twitterDescription`, `ogType`, `robots`. `src/_includes/base.njk` builds the canonical, markdown-twin link, Open Graph, Twitter and hreflang tags from those and the page's folder, and adds the stylesheet, fonts, favicons, language detection and Vercel analytics. Pages start with `{% extends "base.njk" %}` and fill three blocks: `head` (JSON-LD, extra preloads), `styles` (the page's `<style>`) and `body` (`<body>` to `</html>`). `404.html` stays standalone.
- **Build fails on broken content rules:** title over 60 characters, any description (meta, og, twitter) over 160, or not exactly one `<h1>` (`eleventy.config.js`, transform `content-rules`). A second `eleventy.after` check fails the build when an `hreflang` alternate points at a page this build did not produce, which is what catches an English-only page before the nav toggle and the language redirect send visitors to a 404.
- **Asset versions live in `src/_data/site.js`** (`cssVersion`, `mainJsVersion`, `langJsVersion`). Bump them there after changing `main.css`, `main.js` or `lang-detect.js`; no page needs editing.
- **Case-study list:** `src/_data/projects.js` holds the ten studies and every fact their surfaces read: canonical EN/ES titles, client line, the two row images, `wide`, `current`, `previewSwap`, and the per-language Work row copy. See Next-project chain below.
- **Decision logs:** `src/_data/decisions.js` holds three decisions per case study (EN and ES) and `src/_includes/decisions.njk` renders them before the last section; each entry must restate something the page already says. A new case study needs an entry there and the `decisions.njk` include in the page, plus the `case-switcher.njk` include that lists the others.
- **BECO totals** for the explorer's stats line come from `src/_data/beco.js` (reads each language's `graph.json`), so the line is in the HTML before the graph loads.
- **Accessibility check:** `Designing the portfolio/tools/a11y_audit.js` runs in the browser on a built page (alt text, names, headings, landmarks, target sizes, contrast, focus and reduced-motion rules). Turn off transitions first or colours are read mid-fade.
- **Shared parts are includes** in `src/_includes/`: `nav.njk`, `footer.njk`, `cta.njk`, `case-switcher.njk` (the "All case studies" list under each case study) and the Work row pair `work-row.njk` / `work-preview.njk`. A page calls them with `{% include "nav.njk" %}` and so on. Language comes from the folder (`src/es/` = Spanish), the language-toggle target is computed, and the nav's current section is the page's front matter `navCurrent: work|about|thinking`.
- **Standard closing CTA:** the page's front matter holds `ctaHeading`, `ctaBody` and `ctaCv` (true adds the Download CV button), and the page body has `{% include "cta.njk" %}`. The homepages, Thinking indexes and a few special pages keep their own CTA markup inline (different animation classes).
- **Footer date:** `src/_data/site.js` → `updated: "2026-10-29"`. Change it by hand when the site's content changes; every page's "Updated October 2026" follows. Also holds the email and LinkedIn URLs.
- **Commands:** `npm start` (live server on :3456 via `.claude/launch.json`), `npm run build` (writes `_site/`), `npm run build:all` (clears `_site` and starts clean, regenerates markdown twins and `llms-full.txt` including deleting twins for pages that no longer exist, then builds again). `vercel.json` runs `npm run build:all`, so the twins are regenerated on every deploy and a push cannot ship stale markdown; the build image ships Python for the converter.
- Not pages, so they stay at the repo root and are copied untouched: `assets/`, `md/`, favicons, `robots.txt`, `llms*.txt`. `middleware.js` also stays at the root. `sitemap.xml` is no longer one of them: `src/sitemap.njk` generates it from the pages that built, leaving out the 404 and anything with `robots: "noindex"`, keeping the three hreflang alternates and dropping `lastmod`, `changefreq` and `priority` (there is no reliable per-page date yet, and the other two are ignored). The build fails if a page is missing from it or listed twice.
- `scripts/build_markdown.py` reads the built pages in `_site/`; `scripts/build_hero_map.mjs` writes into `src/index.html` and `src/es/index.html`.
- `Designing the portfolio/tools/compare_build.py` diffs `_site/` against the pre-migration pages on `main` (whitespace-normalised), for checking a build change.

---

## File structure

```
src/                       Pages (see Build). Below, URLs; every path is under src/ in the repo
/                          EN pages (root)
/es/                       ES pages (mirrors EN exactly)
/work/<slug>/              EN case studies (10 total)
/es/work/<slug>/           ES case studies
/thinking/<slug>/          EN articles
/es/thinking/<slug>/       ES articles
assets/css/main.css        All global styles (versioned ?v=54 via src/_data/site.js)
assets/js/main.js          All JS — theme, nav, icons, scroll (versioned ?v=19)
assets/images/work/<slug>/ WebP images per case study
assets/fonts/              Self-hosted Bitter (variable, display) + Outfit woff2 files
Designing the portfolio/   Local working folder — gitignored, not deployed
```

**39 live pages** as of 2026-10-29: 19 EN, 19 ES and the standalone `404.html`. (Earlier notes said 35 on 2026-10-24 and 31 on 2026-06-24; the build output is the reliable count.) The two newest pairs: `/thinking/beco-knowledge-graph/`, a presentation-style visual explainer using its own `bko-` prefixed page-specific styles; and `/thinking/beco-explorer/`, the graph as one page: a canvas node-link map plus a column of cards that read whatever you pick, prefixed `bgx-`, drawn and wired by the shared `assets/js/beco-explorer.js` with wording passed in `window.BGX_STRINGS` — see each file itself, neither is a template to generalize; `/thinking/beco-graph/` redirects there). The explorer loads `assets/data/beco-graph/graph.json` (nodes, links, precomputed layout, built by `scripts/generate_beco_graph_data.py` from the export in `assets/data/beco-explorer/`) and fetches `assets/data/beco-explorer/biases/<id>.json` when a concept's card opens. The Spanish page reads its own copy of the data, `assets/data/beco-explorer-es/` and `assets/data/beco-graph-es/` (set through `dataDir` and `graphUrl` in its `BGX_STRINGS`); both languages come from the `beco-lab` repo's `snapshot/current/en/` and `snapshot/current/es/` (copy the two folders, graph included, after a lab snapshot and translation round). After any BECO ingest round you want reflected publicly, run `scripts/generate_beco_explorer_data.py` (Aura export: `tree.json` + `biases/`), then `scripts/generate_beco_graph_data.py`; nothing regenerates automatically. **After regenerating, also update the hard-coded counts in the homepage BECO feature** (`.bx` section in `index.html` and `es/index.html`: source and concept totals in the paragraph, the verified / partial / no-backing split in the bar's `flex` values, legend and `aria-label`), computed from `tree.json`. Since 2026-10-27 the explorer follows the lab's layout: a short intro that scrolls away on first use, a toolbar (search, evidence filters, zoom, fold the card column, help dialog), search as a map state (`#buscar/<q>`), a draggable column edge, hue by cluster (`--g1`…`--g8` in each page's CSS) and no author ring on the map (`hideAuthors`). The site nav stays fixed on this page and the app stops under it (`scroll-margin-top`). `assets/js/beco-explorer.js` is a copy of the `beco-lab` repo's file with two edits, the `dataDir` and `graphUrl` fetch paths: when the lab's copy changes, copy it over and reapply those two. EN pages at root, ES pages under `/es/` with identical structure.

---

## CSS editing rules

1. **Global styles go in `main.css` only.** Never add global patterns to a page `<style>` block.
2. **Page-specific styles go in a `<style>` block in the page's `<head>`.** Never pollute `main.css` with single-page rules. **Exception:** component families shared across an EN+ES page pair (e.g. `.home-hero`, `.about-intro-grid`) may live in `main.css` to avoid duplicating identical rules in both language files.
3. **After any change to `main.css` or `main.js`, bump `cssVersion` / `mainJsVersion` in `src/_data/site.js`.** Current: `main.css?v=55` / `main.js?v=20`. Pages read them from there.
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

01 → 02 → … → 10 → 01 (loops), generated from `src/_data/projects.js` (slug plus EN and ES titles, in reading order) by `src/_includes/next-project.njk`; the same list feeds the Work pages' `ItemList` JSON-LD (`project-items.njk`) and both Work index pages: `src/_includes/work-row.njk` renders one row and `src/_includes/work-preview.njk` its hover preview group, so a study is edited in one place and the row count, the hero's "Ten case studies" (`countWord` filter) and `numberOfItems` follow. Each entry needs exactly two `images`; `previewSwap` decides which of the two sits in front in the hover preview (the pages mix the two orders, so it is per study); `dataProject` is the key `main.js` matches a row to its group, so it must be unique and identical in both places. The build fails if a project lacks two images, if a `dataProject` repeats, or if a Work page does not render exactly two `data-project` occurrences per study. Adding a case study still means its page pair, an entry here, a `decisions.js` entry, an `llms.txt` line, an About link and an OG card; the sitemap picks it up on the next build. The Work rows, the hero count, the ItemList and the switcher all follow from this file.

The **switcher** (`src/_includes/case-switcher.njk`) renders the other nine studies for the current page from `slug`, `client`, `en`/`es` and `tags`, so the list is in the HTML and needs no JavaScript; `main.js` only adds the viewed marks from localStorage. Each study's **problem tags** (EN and ES, in `tags`) are the quiet metadata under the title that answers "start with the one closest to your problem": `Zero to one`, `Regulated multi-market`, `Conversion`, `Legacy constraints`, `Ways of working`, `AI workflow`, `Trust`, `Adoption`… Every tag must restate something the case study itself says, keep to two per study, and reuse existing wording before adding a new tag. The Work page rows keep their own discipline/domain string (`v4-row-tags`), which is a different vocabulary.

---

## Canonical CTA copy

Every page ends with a closing section (`.v4-cta` / `.cta-section`). Since 2026-10-26 it answers the page:

- **Home, About, Work, Contact** keep the canonical copy below, unchanged.
- **Case studies:** heading `Have a problem<br><em class="accent-italic">shaped like this one?</em>` (ES `¿Tienes un reto<br><em class="accent-italic">parecido a este?</em>`); body = one sentence naming that study's problem, then the canonical body line.
- **Thinking index and the AI article:** `Thinking about<br><em class="accent-italic">the same questions?</em>` (ES `¿Le das vueltas<br><em class="accent-italic">a las mismas preguntas?</em>`), a line inviting readers to compare notes, then the canonical body line.
- **BECO explorer:** `Using behavioural science<br><em class="accent-italic">in product decisions?</em>` (ES `¿Usas ciencia del comportamiento<br><em class="accent-italic">en decisiones de producto?</em>`), one line on BECO, then the canonical body line.

The canonical copy (fixed, do not paraphrase):

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
- LinkedIn banner (`Designing the portfolio/linkedin-banner.png`, 1584×396 plus a 3168×792 `@2x`): built by `python3 scripts/build_linkedin_banner.py`, which pulls the tokens from `main.css` and the complexity map, its CSS and its four pressure colours out of the homepage hero, so it follows the site. It also writes the banner's HTML next to the PNG. Not part of the deployed site.
- Work card images: two overlapping frames (`wc-phone--back` / `wc-phone--front` for mobile-first projects; `wc-desktop--back` / `wc-desktop--front` for desktop/artifact projects).

---

## EN / ES parity

Every EN page has a matching ES equivalent. When editing content or structure, apply the same change to both. The language toggle in the nav (`/lang-detect.js`) handles redirects, and it reads the page's own `<link rel="alternate" hreflang="es">` rather than keeping a list of translated paths, so a new page is covered the day it is added and a page without an alternate is left alone. Alternate `hreflang` links are in each page's `<head>`, and the build fails if one points at a page that was not built.

---

## What not to do

- **Don't hardcode hex values** — always use CSS custom properties.
- **Don't add `<br>` after `<em class="accent-italic">`** — the break goes *before*, not after.
- **Don't put page-specific rules in main.css** — use a `<style>` block in the page `<head>`.
- **Don't add global rules to a page `<style>` block** — they won't apply to other pages.
- **Don't forget to bump `cssVersion` / `mainJsVersion`** in `src/_data/site.js` after any CSS or JS change.
- **Don't re-add Lucide** — icons are already inlined in `main.js`.
- **Don't add card numbers** — intentionally removed June 2026.
- **Don't use `min-width` on SVG diagrams** — all diagrams are mobile-first portrait viewBox.
