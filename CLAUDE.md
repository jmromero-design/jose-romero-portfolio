# Jose Romero Portfolio — Claude Reference

Static HTML/CSS portfolio. No build step, no framework, no JS bundler.
Deploy: push to `main` on `jmromero-design/jose-romero-portfolio` → Vercel auto-deploys.
Live: https://joseromerodesign.com · Vercel project: `prj_yrqqL9ZRSixjZM1rjNRp8hW6iTEj`

---

## File structure

```
/                          EN pages (root)
/es/                       ES pages (mirrors EN exactly)
/work/<slug>/              EN case studies (10 total)
/es/work/<slug>/           ES case studies
/thinking/<slug>/          EN articles
/es/thinking/<slug>/       ES articles
assets/css/main.css        All global styles (versioned ?v=17)
assets/js/main.js          All JS — theme, nav, icons, scroll (versioned ?v=10)
assets/images/work/<slug>/ WebP images per case study
assets/fonts/              Self-hosted Fraunces + Outfit woff2 files
Designing the portfolio/   Local working folder — gitignored, not deployed
```

**31 live pages** as of 2026-06-24. EN pages at root, ES pages under `/es/` with identical structure.

---

## CSS editing rules

1. **Global styles go in `main.css` only.** Never add global patterns to a page `<style>` block.
2. **Page-specific styles go in a `<style>` block in the page's `<head>`.** Never pollute `main.css` with single-page rules.
3. **After any change to `main.css` or `main.js`, increment the version query string in all 31 HTML files.** Current: `main.css?v=17` / `main.js?v=10`. Find with: `grep -rn "main.css?v=" . --include="*.html"`.
4. **Mobile breakpoints in main.css:** `@media (max-width: 768px)` for tablet/mobile, `@media (max-width: 480px)` for narrow mobile (gutter shrinks to `1.25rem` here). Two separate `@media (max-width: 480px)` blocks exist — mind cascade order.
5. **`h1 br { display: none }` at `≤768px`** is a global rule — it hides hard breaks before `<em class="accent-italic">` so the italic accent flows inline on mobile. Don't remove it.

---

## Design tokens

All tokens are CSS custom properties on `:root`. Reference them by name — never hardcode hex values.

### Colours

| Token | Dark | Light | Use |
|-------|------|-------|-----|
| `--bg-base` | `#090908` | `#F7F4EF` | Page background |
| `--bg-surface` | `#111110` | `#EDEAE4` | Card backgrounds |
| `--bg-surface-2` | `#181816` | `#E4E0D9` | Nested surfaces |
| `--text-primary` | `#F2EEE6` | `#1A1917` | Headings, body |
| `--text-secondary` | `#D4CFC6` | `#2E2B28` | Supporting text |
| `--text-tertiary` | `#84817D` | `#6B6864` | Labels, metadata |
| `--gold` | `#E8955A` | `#B85520` | Accent, interactive hover, `<em>` colour |
| `--teal` | `#4BBFB2` | `#1F8A80` | Eyebrow labels, informational tags, links |
| `--teal-text` | `#66D4C8` | `#0E5750` | Teal text on surfaces (contrast-safe) |

**Colour intent:** gold = brand accent and interactive feedback. Teal = informational and structural. Never swap them.

### Typography

| Token | Value | Use |
|-------|-------|-----|
| `--font-display` | Fraunces (self-hosted) | Headings, nav logo, pull quotes, `.lead` |
| `--font-body` | Outfit (self-hosted) | All body text, UI labels, tags, eyebrows |
| `--text-xs` | `0.875rem` | Tags, labels, captions |
| `--text-sm` | `0.875rem` | Small body |
| `--text-base` | `1rem` | Base body |
| `--text-lg` | `1.125rem` | `.body-lg` paragraphs |
| `--text-xl` | `1.25rem` | Lead-in text, nav logo (desktop) |
| `--text-2xl` | `1.5rem` | Card titles |
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

Dark mode is the default. Light mode is set via `[data-theme="light"]` on `<html>`. Persisted to `localStorage` key `jr-theme`. System preference fallback via `@media (prefers-color-scheme: light)` requires no JS.

When editing colours or backgrounds always verify both modes. Never hardcode `#090908` or `#F7F4EF` — use `var(--bg-base)`.

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
- Body: `Open to senior product design roles and selective consulting engagements — in English or Spanish.`

**ES:**
- Heading: `Tu problema más difícil<br><em class="accent-italic">es un buen punto de partida.</em>`
- Body: `Abierto a roles de product design senior y proyectos de consultoría selectivos — en inglés o español.`

**Exception:** `about.html` and `es/about.html` include an extra Download CV / Descargar CV `btn-ghost` button below the body.

---

## Images

- Format: WebP, quality 82, width 620px, via Pillow. Must `.convert('RGB')` before saving (avoids RGBA error).
- Output path: `assets/images/work/<case-study-slug>/`
- Source PNGs: `Designing the portfolio/project_images/<slug>/` (local, gitignored)
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
- **Don't forget to bump `?v=N`** after any CSS or JS change — applies to all 31 HTML files.
- **Don't re-add Lucide** — icons are already inlined in `main.js`.
- **Don't add card numbers** — intentionally removed June 2026.
- **Don't use `min-width` on SVG diagrams** — all diagrams are mobile-first portrait viewBox.
