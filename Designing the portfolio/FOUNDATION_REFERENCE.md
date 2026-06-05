# FOUNDATION REFERENCE — Jose Romero Design Portfolio
# Design system v2.1 — Updated June 2026
# Changes: Type scale revised to 16px base (12px minimum). Spacing expanded for
# breathing room. Viewport-height section logic added. Responsive breakpoints defined.
# Load this document at the start of every build session.

---

## APPROVED DECISIONS (locked — do not change without explicit instruction)

Typography:   Fraunces (display/headings) + Outfit (body/UI)
Gold role:    Interactive elements ONLY — buttons, CTAs, links, active states
Teal role:    Informational/structural/decorative — eyebrows, tags, stats, covers, graph elements
Modes:        Dark default + light mode via [data-theme="light"] attribute on <html>
Logo:         "Jose" regular + "Romero" italic — Fraunces, both in --text-primary colour
Font floor:   12px minimum across ALL elements. No exceptions.
Body base:    16px (1rem). All sizing derived from this anchor.

---

## FONTS

Load via single Google Fonts link in every page <head>:

https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400;1,9..144,500&family=Outfit:wght@300;400;500;600&display=swap

Fraunces  → h1, h2, h3, h4, pull quotes, stat numbers, logo, italic accents in headlines
Outfit    → body text, nav, labels, eyebrows, tags, metadata, buttons

---

## TYPE SCALE

Rule: 16px is the body anchor. 12px is the hard floor — nothing goes below this.
All values use rem. All fluid sizes use clamp() in production CSS.

  --text-xs:    0.75rem   / 12px   ← absolute minimum (labels, captions, copyright)
  --text-sm:    0.875rem  / 14px   ← secondary body, card summaries, meta
  --text-base:  1rem      / 16px   ← primary body text (Outfit 300, line-height 1.8)
  --text-lg:    1.125rem  / 18px   ← .body-lg, lead-in paragraphs
  --text-xl:    1.25rem   / 20px   ← sub-headings, pull quotes (min), nav logo
  --text-2xl:   1.5rem    / 24px   ← h4, card titles
  --text-3xl:   2rem      / 32px   ← h3, section sub-headings
  --text-4xl:   2.75rem   / 44px   ← h2 at smaller viewports
  --text-5xl:   3.75rem   / 60px   ← h1 at smaller viewports, h2 at large
  --text-6xl:   5.25rem   / 84px   ← h1 hero on large screens

Heading scale (production clamp values):
  h1 hero:     clamp(2.75rem, 7vw, 5.25rem)    — 44px → 84px
  h2 section:  clamp(2rem, 5vw, 3.75rem)        — 32px → 60px
  h3 sub:      clamp(1.5rem, 3.5vw, 2.75rem)    — 24px → 44px
  h4 card:     1.5rem / 24px

Eyebrow:       12px / Outfit 600 / letter-spacing 0.14em / uppercase / teal
Nav links:     14px / Outfit 400
Body:          16px / Outfit 300 / line-height 1.8
Body large:    18px / Outfit 300 / line-height 1.85
Card summary:  14px / Outfit 300 / line-height 1.75
Caption / xs:  12px / Outfit 300 / letter-spacing 0.06em

---

## SPACING SCALE

  --sp-1:   0.25rem  /  4px
  --sp-2:   0.5rem   /  8px
  --sp-3:   0.75rem  / 12px
  --sp-4:   1rem     / 16px
  --sp-5:   1.25rem  / 20px
  --sp-6:   1.5rem   / 24px
  --sp-8:   2rem     / 32px
  --sp-10:  2.5rem   / 40px
  --sp-12:  3rem     / 48px
  --sp-16:  4rem     / 64px
  --sp-20:  5rem     / 80px
  --sp-24:  6rem     / 96px
  --sp-32:  8rem     / 128px
  --sp-40:  10rem    / 160px

  --nav-height:  72px
  --gutter:      clamp(1.5rem, 5vw, 4rem)   ← horizontal page margins
  --max-width:   1200px

---

## SECTION RHYTHM & VIEWPORT-HEIGHT LOGIC

There are three tiers of section. Decide which tier each section gets
before writing any padding values.

  TIER 1 — HERO (full viewport):
    Use for: Page hero, homepage hero, About intro
    Rule:    min-height: 100dvh
             padding-top: calc(var(--nav-height) + clamp(3rem, 6vw, 6rem))
             padding-bottom: clamp(3rem, 6vw, 6rem)
    Result:  Content always fills the entire first screen, regardless of
             device. Scroll cue (↓) should be present.

  TIER 2 — SPACIOUS (breathing sections):
    Use for: Experience/CV, About capabilities, Thinking pieces, Work index
    Rule:    min-height: 70dvh (guidance only — do not force on short content)
             padding-block: clamp(5rem, 10vw, 8rem)
    Result:  Sections feel substantial. Never cramped. Borders between
             sections reinforce the breathing room visually.

  TIER 3 — STANDARD (compact sections):
    Use for: Stats bar, short-list rows, closing CTA, footer
    Rule:    padding-block: clamp(3rem, 6vw, 5rem)
    Result:  Efficient use of space for supporting content.

  Between-section borders: 1px solid var(--border-default)
  All section containers: max-width 1200px, horizontal gutter via --gutter

  Inter-element spacing within sections:
    eyebrow → heading:    var(--sp-4)  / 16px
    heading → body:       var(--sp-6)  / 24px
    body → body:          var(--sp-4)  / 16px
    body → CTA:           var(--sp-8)  / 32px
    section header → grid: var(--sp-12) / 48px
    role block to block:  var(--sp-8)  / 32px

---

## RESPONSIVE BREAKPOINTS

  1200px   Max content width — layout unchanged above this
  1024px   3-col grids reduce to 2-col
   900px   About intro grid stacks (portrait above text)
            Role block meta stacks above body
   768px   Nav collapse to hamburger
            2-col grids stack to 1-col
            Hero font scales down
   480px   Gutter reduces to 1.25rem
            Stats bar scrolls horizontally (do not stack — loses at-a-glance value)

Preview files must test at: 1280px · 768px · 375px

---

## COLOUR TOKENS — DARK MODE (default)

Backgrounds:
  --bg-base:          #090908
  --bg-surface:       #111110
  --bg-surface-2:     #181816
  --bg-hover:         #1E1E1B

Borders:
  --border-subtle:    #1E1E1B
  --border-default:   #2A2A27
  --border-strong:    #3A3A36

Text:
  --text-primary:     #F2EEE6   warm white
  --text-secondary:   #9A9690   muted warm gray
  --text-tertiary:    #5C5955   very muted

Gold (interactive only):
  --gold:             #E8955A   base
  --gold-bright:      #F0A870   hover
  --gold-dim:         #9A5A28   borders, dim states
  --gold-tint:        rgba(232,149,90,0.10)
  --gold-tint-strong: rgba(232,149,90,0.18)

Teal (informational/decorative):
  --teal:             #4BBFB2   base
  --teal-bright:      #6DD4C8   hover
  --teal-dim:         #2A7A72   borders, dim states
  --teal-tint:        rgba(75,191,178,0.08)
  --teal-tint-strong: rgba(75,191,178,0.15)

## COLOUR TOKENS — LIGHT MODE [data-theme="light"]

Backgrounds:
  --bg-base:          #F7F4EF
  --bg-surface:       #EDEAE4
  --bg-surface-2:     #E4E0D9
  --bg-hover:         #DDD9D2

Borders:
  --border-subtle:    #DDD9D2
  --border-default:   #C8C3BB
  --border-strong:    #B0ABA2

Text:
  --text-primary:     #1A1917
  --text-secondary:   #5A5650
  --text-tertiary:    #8A8680

Gold:
  --gold:             #B85520
  --gold-bright:      #D06030
  --gold-dim:         #8A3E14

Teal:
  --teal:             #1F8A80
  --teal-bright:      #2AA898
  --teal-dim:         #145E58

---

## COLOUR GRAMMAR

Use gold for:         Buttons, CTAs, nav contact link, active nav underline,
                      pull quote border, "Current" tags, links on hover,
                      headline italic accents (em tags in h1/h2)

Use teal for:         Eyebrow labels, informational tags, stat/metric values,
                      project cover placeholder graphics, chart/graph elements,
                      nav link hover underline, focus rings, section dividers,
                      background grid patterns, sub-project borders in about page

Never mix:            Do not use gold for structural decoration.
                      Do not use teal for interactive elements.

---

## STANDARD PAGE TEMPLATE

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] — Jose Romero</title>
  <meta name="description" content="[140-160 char description]">
  <link rel="canonical" href="https://joseromerodesign.com/[path]/">
  <meta property="og:title" content="[Page Title] — Jose Romero">
  <meta property="og:description" content="[description]">
  <meta property="og:image" content="https://joseromerodesign.com/assets/images/og-default.webp">
  <meta property="og:url" content="https://joseromerodesign.com/[path]/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Jose Romero">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[Page Title] — Jose Romero">
  <meta name="twitter:image" content="https://joseromerodesign.com/assets/images/og-default.webp">
  <script type="application/ld+json">{ ... }</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400;1,9..144,500&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="icon" href="/assets/images/logo.svg" type="image/svg+xml">
</head>
<body>

  <nav class="nav" role="navigation" aria-label="Main navigation">
    <a href="/" class="nav-logo" aria-label="Jose Romero — Home">
      Jose <span class="logo-surname">Romero</span>
    </a>
    <ul class="nav-links" role="list">
      <li><a href="/work/">Work</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="/thinking/">Thinking</a></li>
      <li><a href="mailto:joseromero.next@gmail.com" class="nav-cta">Contact</a></li>
    </ul>
    <button class="theme-toggle" aria-label="Toggle colour mode" title="Toggle colour mode">○</button>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </nav>

  <main id="main">
    [PAGE CONTENT]
  </main>

  <footer class="footer" role="contentinfo">
    <div class="footer-inner">
      <div>
        <p class="footer-name">Jose <span>Romero</span></p>
        <p class="footer-sub">Senior Product Designer</p>
        <p class="footer-sub">Zaragoza, Spain · Open to remote</p>
      </div>
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="/work/">Work</a>
        <a href="/about/">About</a>
        <a href="/thinking/">Thinking</a>
        <a href="https://www.linkedin.com/in/joseromerodesign/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="mailto:joseromero.next@gmail.com">Email</a>
      </nav>
    </div>
    <p class="footer-copy">© 2026 Jose Romero. All rights reserved.</p>
  </footer>

  <script src="/assets/js/main.js" defer></script>
</body>
</html>
```

---

## KEY CSS CLASSES — QUICK REFERENCE

### Typography
.eyebrow              Teal uppercase label with short line after (Outfit 12px 600)
.eyebrow--bare        Same but no trailing line
.accent-italic        Gold italic — use as <em class="accent-italic"> inside h1/h2
.lead                 Large italic Fraunces intro text (min 20px)
.body-lg              18px Outfit 300 for long-form sections
.pull-quote           Left gold border, large italic Fraunces quote block

### Layout
.container            1200px max, auto margins, responsive gutter
.container--narrow    760px max (long-form reading pages)
.section              Responsive padding block (min 6rem → max 10rem)
.section--hero        Full viewport height (min-height: 100dvh), nav offset via padding-top
.section--spacious    min-height 70dvh, centered content — for standalone statements
.grid-auto            Auto-fill cards: minmax(340px, 1fr)
.divider              1px border-default
.divider--teal        Gradient from teal-dim to transparent

### Interactive (gold)
.btn-primary          Gold outlined button with tint background
.btn-ghost            Text-only with arrow, hover turns gold
.nav-cta              Nav contact link — gold outlined
.tag--gold            Gold pill — "Current", featured items only

### Informational (teal)
.eyebrow              Teal label
.tag--teal            Teal pill — client, category labels
.stat-value           Teal large number (Fraunces 300)
.stat-label           Uppercase gray label below stat
.cover-*              CSS-only project covers in teal palette

### Cards
.card                 Dark surface, border, hover lift + teal ring
.card-image           16/9 container
.card-body            Padded content area
.card-title           Fraunces 24px heading
.card-summary         13px Outfit 300 gray text
.card-footer          Separated bottom row with client + arrow

### Case study
.cs-hero              Hero with nav offset
.cs-details-bar       Horizontal project metadata strip
.cs-cover             21/9 full-width cover image area
.cs-section           Bordered content section
.next-project         Bottom navigation to next case study

### Page-specific
.home-hero            Full-viewport hero with teal grid background
.thinking-piece       Two-col (large number / content) layout
.about-intro-grid     Two-col (portrait / text) layout
.role-block           Two-col experience entry (meta / body)
.role-sub-project     Left teal-bordered sub-item within role
.skill-item           Hoverable capability card
.work-list-item       Horizontal project row for work index

### Animation
.reveal               Scroll-triggered fade-up (.visible added by JS)
.hero-animate         Staggered hero entrance (CSS, no JS needed)

### Theme
.theme-toggle         Toggle button (JS handles click + localStorage)
                      Place in nav between .nav-links and .nav-toggle

---

## PROJECT COVER PLACEHOLDER CLASSES

All use teal palette. Replace the inner div with <img> when real assets available.

.cover-ikea-home       Grid + concentric circle
.cover-ikea-second     Layered rings + recycling symbol
.cover-santander       Data chart / area graph
.cover-melia           Rotated architectural frames
.cover-iqos            Radial glow + vertical line
.cover-mapfre          Mobile phone outline
.cover-xti             Horizontal editorial lines
.cover-wow             Grid + rounded square

Usage:
<div class="card-image">
  <div class="cover-placeholder cover-ikea-home"></div>
</div>

When replacing with real image:
<div class="card-image">
  <img src="/assets/images/ikea-home-services/cover.webp"
       alt="IKEA Home Services app interface"
       loading="lazy" width="800" height="450">
</div>

---

## THEME TOGGLE IMPLEMENTATION

HTML (in nav, after .nav-links):
<button class="theme-toggle" aria-label="Toggle colour mode">○</button>

JS handles:
  - Reading localStorage on page load
  - Setting [data-theme="dark"|"light"] on <html>
  - Updating icon (○ dark mode indicator / ● light mode indicator)
  - Falling back to prefers-color-scheme if no preference saved

CSS handles:
  - All token overrides under [data-theme="light"]
  - System preference fallback via @media (prefers-color-scheme: light)
  - 0.3s background transition for smooth switching

---

## VERCEL.JSON (place at repository root)

{
  "cleanUrls": true,
  "trailingSlash": true,
  "redirects": [
    { "source": "/applied-cro-in-the-financial-sector-case-study", "destination": "/work/santander-nordics-cro/", "permanent": true },
    { "source": "/fashion-ecommerce-design-website", "destination": "/work/xti-ecommerce-redesign/", "permanent": true },
    { "source": "/iqos-club-cro-success-case-study", "destination": "/work/iqos-club-cro/", "permanent": true },
    { "source": "/improving-the-digital-experience-for-a-financial-app", "destination": "/work/mapfre-afin-digital-expansion/", "permanent": true },
    { "source": "/marketing-campaign-management-platform", "destination": "/work/melia-hotels-campaign-platform/", "permanent": true },
    { "source": "/dian-rene-music-services-website", "destination": "/work/", "permanent": true },
    { "source": "/sports-betting-web-application", "destination": "/work/", "permanent": true },
    { "source": "/delivery-service-website-design", "destination": "/work/", "permanent": true },
    { "source": "/creative-agency-portfolio-website", "destination": "/work/", "permanent": true },
    { "source": "/topics/projects", "destination": "/work/", "permanent": true }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}

---

## SESSION STATUS

Last completed: Foundation (CSS + JS + reference doc) — FINAL
Next session:   Build index.html (Phase 2)
Files ready:    assets/css/main.css  ✓
                assets/js/main.js    ✓
                FOUNDATION_REFERENCE.md ✓
Still needed before index.html is complete:
                assets/images/portrait.webp  (Jose to provide)
                assets/images/og-default.webp (can generate placeholder)
