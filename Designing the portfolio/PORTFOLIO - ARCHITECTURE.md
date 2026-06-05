# Jose Romero Design — Architecture & Implementation Plan
# Reference document for all build sessions
# Version 1.0 — June 2026

---

## 1. PROJECT OVERVIEW

Site: joseromerodesign.com
Deployment: Vercel (free tier, static)
Source: GitHub repository connected to Vercel for auto-deploy on push
Domain: joseromerodesign.com → pointed to Vercel via DNS (A record / CNAME)
Type: Static multi-page HTML/CSS/JS — no framework, no CMS, no build pipeline
Language: English-first

Copy reference: COPY_DOCUMENT_v2.md (always use latest version)

---

## 2. FILE & FOLDER STRUCTURE

```
joseromerodesign.com/          ← repository root
│
├── index.html                 ← Homepage
├── about.html                 ← About page
├── work.html                  ← Work index
├── thinking.html              ← Thinking / philosophy page
│
├── work/                      ← Individual case studies
│   ├── ikea-home-services.html
│   ├── ikea-secondhand-marketplace.html
│   ├── santander-nordics-cro.html
│   ├── melia-hotels-campaign-platform.html
│   ├── mapfre-afin-digital-expansion.html
│   ├── iqos-club-cro.html
│   ├── xti-ecommerce-redesign.html
│   └── ikea-ways-of-working.html
│
├── assets/
│   ├── css/
│   │   └── main.css           ← Single global stylesheet (design system)
│   ├── js/
│   │   └── main.js            ← Single global script file
│   └── images/
│       ├── logo.svg           ← Wordmark / logo
│       ├── portrait.webp      ← Jose's portrait photo
│       ├── og-default.webp    ← Default Open Graph image (1200×630)
│       ├── ikea-home-services/
│       ├── ikea-secondhand/
│       ├── santander/
│       ├── melia/
│       ├── mapfre/
│       ├── iqos/
│       ├── xti/
│       └── ikea-wow/          ← Ways of Working
│
├── llms.txt                   ← AI crawler summary (root level)
├── robots.txt                 ← Crawler rules (root level)
├── sitemap.xml                ← Full sitemap (root level)
└── vercel.json                ← Redirects, headers, routing config
```

---

## 3. URL STRUCTURE

All URLs use trailing slash convention. Canonical = with trailing slash.

| Page                              | URL                                                      |
|-----------------------------------|----------------------------------------------------------|
| Homepage                          | joseromerodesign.com/                                    |
| About                             | joseromerodesign.com/about/                              |
| Work index                        | joseromerodesign.com/work/                               |
| Thinking                          | joseromerodesign.com/thinking/                           |
| IKEA Home Services                | joseromerodesign.com/work/ikea-home-services/            |
| IKEA Second-hand Marketplace      | joseromerodesign.com/work/ikea-secondhand-marketplace/   |
| Santander Nordics CRO             | joseromerodesign.com/work/santander-nordics-cro/         |
| Meliá Hotels Campaign Platform    | joseromerodesign.com/work/melia-hotels-campaign-platform/|
| Mapfre AFIN & Digital Expansion   | joseromerodesign.com/work/mapfre-afin-digital-expansion/ |
| IQOS Club CRO                     | joseromerodesign.com/work/iqos-club-cro/                 |
| XTI E-commerce Redesign           | joseromerodesign.com/work/xti-ecommerce-redesign/        |
| IKEA Ways of Working              | joseromerodesign.com/work/ikea-ways-of-working/          |

Note: vercel.json handles trailing slash rewrites so
/about and /about/ both resolve correctly without duplication.

---

## 4. VERCEL CONFIGURATION (vercel.json)

Full file content — place at repository root:

```json
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
```

---

## 5. DESIGN SYSTEM CONVENTIONS

### Visual identity (do not deviate from these across sessions)

Background base:      #0A0A0A   (near-black, not pure black)
Surface:              #111111   (cards, elevated elements)
Surface hover:        #1A1A1A
Border subtle:        #222222
Border default:       #2E2E2E

Text primary:         #F0EDE6   (warm white, not pure white)
Text secondary:       #9A9690   (muted, warm gray)
Text tertiary:        #5C5955   (very muted, hints)

Accent gold:          #C9A84C   (primary accent — Jose's existing brand colour)
Accent gold hover:    #D4B86A
Accent gold subtle:   rgba(201, 168, 76, 0.12)  (backgrounds, highlights)

Danger / error:       #E05252
Success:              #52A882

### Typography

Display / headings:   'Cormorant Garamond', Georgia, serif
                      (elegant, editorial — matches gold-on-dark brand)
Body / UI:            'DM Sans', system-ui, sans-serif
                      (clean, modern, readable at small sizes)
Mono (code, labels):  'DM Mono', monospace

Load via Google Fonts:
  Cormorant Garamond: weights 300, 400, 500, 600 (italic variants too)
  DM Sans: weights 300, 400, 500
  DM Mono: weight 400

Type scale:
  --text-xs:    0.75rem   / 12px
  --text-sm:    0.875rem  / 14px
  --text-base:  1rem      / 16px
  --text-lg:    1.125rem  / 18px
  --text-xl:    1.25rem   / 20px
  --text-2xl:   1.5rem    / 24px
  --text-3xl:   2rem      / 32px
  --text-4xl:   2.75rem   / 44px
  --text-5xl:   3.75rem   / 60px
  --text-6xl:   5rem      / 80px

Heading sizes by level:
  h1 (page hero):     var(--text-5xl) / var(--text-6xl) on large screens
  h2 (section):       var(--text-3xl) / var(--text-4xl)
  h3 (subsection):    var(--text-2xl)
  h4 (card title):    var(--text-xl)
  Eyebrow labels:     var(--text-xs), letter-spacing 0.12em, uppercase,
                      color: accent gold

### Spacing scale

--space-1:    0.25rem   / 4px
--space-2:    0.5rem    / 8px
--space-3:    0.75rem   / 12px
--space-4:    1rem      / 16px
--space-6:    1.5rem    / 24px
--space-8:    2rem      / 32px
--space-12:   3rem      / 48px
--space-16:   4rem      / 64px
--space-24:   6rem      / 96px
--space-32:   8rem      / 128px

### Layout

Max content width:    1200px (--max-width)
Gutter (sides):       clamp(1.5rem, 5vw, 4rem)
Section spacing:      var(--space-24) top/bottom minimum
Grid columns:         CSS Grid, 12-column base
                      Project cards: repeat(auto-fill, minmax(340px, 1fr))

### Components (defined once in main.css, reused everywhere)

.btn-primary       Gold outlined button — border: 1px solid accent,
                   color: accent, hover: bg accent, color: #0A0A0A
.btn-ghost         No border, text only with → arrow, hover underline
.eyebrow           Uppercase label, xs size, gold color, letter-spacing
.card              Dark surface, 1px border, subtle hover lift (transform)
.tag               Small pill label — surface bg, secondary text
.divider           1px horizontal rule, border-color: var(--border-default)
.section-label     Eyebrow used as section heading prefix

### Motion

Transitions:       200ms ease for color/border changes
                   300ms ease for transform/opacity changes
Page load:         Staggered fade-in on hero elements (CSS, no JS required)
                   opacity 0 → 1, translateY 20px → 0
Scroll:            Intersection Observer for section reveals (main.js)
                   Simple: opacity 0 → 1 when element enters viewport
No parallax.       No heavy animations. Performance over spectacle.

### Images

Format:            WebP preferred, JPEG fallback
Max width:         Project cover images: 1600px wide
                   Portrait: 800px wide
Compression:       Quality 80–85% for photos, lossless for UI screenshots
Alt text:          Always present, descriptive
Loading:           loading="lazy" on all images below the fold
                   loading="eager" on hero image only

---

## 6. HTML PAGE TEMPLATE

Every HTML page follows this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] — Jose Romero</title>
  <meta name="description" content="[Page meta description]">

  <!-- Canonical -->
  <link rel="canonical" href="https://joseromerodesign.com/[path]/">

  <!-- Open Graph -->
  <meta property="og:title" content="[Page Title] — Jose Romero">
  <meta property="og:description" content="[Page meta description]">
  <meta property="og:image" content="https://joseromerodesign.com/assets/images/og-default.webp">
  <meta property="og:url" content="https://joseromerodesign.com/[path]/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Jose Romero">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[Page Title] — Jose Romero">
  <meta name="twitter:image" content="https://joseromerodesign.com/assets/images/og-default.webp">

  <!-- Schema.org JSON-LD (homepage only: Person schema; case studies: CreativeWork schema) -->
  <script type="application/ld+json">
  { ... }
  </script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/main.css">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/assets/images/logo.svg">
</head>
<body>

  <!-- NAV -->
  <nav class="nav" role="navigation" aria-label="Main navigation">
    <a href="/" class="nav-logo" aria-label="Jose Romero — Home">
      <span>Jose Romero</span>
    </a>
    <ul class="nav-links">
      <li><a href="/work/">Work</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="/thinking/">Thinking</a></li>
      <li><a href="mailto:joseromero.next@gmail.com" class="nav-cta">Contact</a></li>
    </ul>
    <button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">
      <span></span><span></span>
    </button>
  </nav>

  <!-- MAIN CONTENT -->
  <main id="main">
    [page content]
  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-left">
        <p class="footer-name">Jose Romero</p>
        <p class="footer-sub">Senior Product Designer</p>
        <p class="footer-sub">Zaragoza, Spain · Open to remote</p>
      </div>
      <nav class="footer-nav" aria-label="Footer navigation">
        <a href="/work/">Work</a>
        <a href="/about/">About</a>
        <a href="/thinking/">Thinking</a>
        <a href="https://www.linkedin.com/in/joseromerodesign/" target="_blank" rel="noopener">LinkedIn</a>
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

## 7. CASE STUDY PAGE TEMPLATE

Each case study follows this content section order:

1. Breadcrumb:  Work → [Project Name]
2. Hero:        Eyebrow (tags) + Headline + Subheading
3. Details bar: Client · Role · Period · Scope (horizontal on desktop, stacked mobile)
4. Cover image: Full-width project image
5. Sections:    Context / Challenge / My Role / Approach / Execution / Outcomes / Learnings
   (not all sections required — use what's appropriate per project)
6. Next project: Card linking to next case study (circular)

Section rules:
- Each section has an eyebrow label + h2 heading + body text
- Images appear inline within sections — never as decorative separators
- Metrics/outcomes displayed in a simple stat grid when quantitative data exists
- Pull quotes (key insights) styled distinctively — larger type, left gold border

---

## 8. SEO & AI VISIBILITY CHECKLIST

Per-page requirements (verify before considering any page complete):

[ ] <title> tag — unique, under 60 chars, ends with "— Jose Romero"
[ ] <meta description> — unique, 140–160 chars, includes primary keyword
[ ] <link rel="canonical"> — correct absolute URL with trailing slash
[ ] Open Graph tags — title, description, image, url, type
[ ] Twitter card tags
[ ] JSON-LD schema — Person (homepage), CreativeWork (case studies)
[ ] Heading hierarchy — one h1 per page, logical h2/h3 structure
[ ] Image alt text — all images
[ ] Internal links — every page linked from at least one other page
[ ] lang="en" on <html> tag

Site-level files (verify exist and are correct):
[ ] /llms.txt — AI crawler summary
[ ] /robots.txt — allows all crawlers including AI bots
[ ] /sitemap.xml — all URLs, correct lastmod dates
[ ] /vercel.json — redirects from old WordPress URLs, cache headers

---

## 9. BUILD SEQUENCE

Phases in order. Do not start a phase until the previous is deployed and verified.

### Phase 1 — Foundation (Session 1)
Files: vercel.json · robots.txt · sitemap.xml · llms.txt
Assets: assets/css/main.css (complete design system)
        assets/js/main.js (nav toggle, scroll reveals)
Outcome: Empty but correctly configured site. All URLs resolve.
         Design system defined and testable.

### Phase 2 — Homepage (Session 2)
Files: index.html
Includes: Hero · Selected work grid (8 cards) · About teaser ·
          Thinking teaser · Footer
JSON-LD: Person schema
Outcome: Primary landing page live.

### Phase 3 — About + Thinking (Session 3)
Files: about.html · thinking.html
Outcome: Both static content pages live. Full professional narrative visible.

### Phase 4 — Work index (Session 4)
Files: work.html
Outcome: Project list page live. All case study links present
         (pointing to pages not yet built — acceptable at this stage).

### Phase 5 — Case studies, batch 1 (Session 5)
Files: work/ikea-home-services.html
       work/ikea-secondhand-marketplace.html
       work/santander-nordics-cro.html
Outcome: Three highest-priority case studies live.

### Phase 6 — Case studies, batch 2 (Session 6)
Files: work/melia-hotels-campaign-platform.html
       work/mapfre-afin-digital-expansion.html
       work/iqos-club-cro.html
Outcome: Six of eight full case studies live.

### Phase 7 — Case studies, batch 3 (Session 7)
Files: work/xti-ecommerce-redesign.html
       work/ikea-ways-of-working.html
Outcome: All case studies live. Site complete v1.

### Phase 8 — Polish & verification (Session 8)
Tasks: Full SEO checklist pass · All internal links verified ·
       Image optimisation pass · Mobile QA · Performance check ·
       DNS cutover from WordPress to Vercel
Outcome: joseromerodesign.com live on new stack.

---

## 10. SESSION HANDOFF PROTOCOL

At the start of any new session continuing this project:

1. Load this document (ARCHITECTURE.md) first
2. Load COPY_DOCUMENT_v2.md (or latest version)
3. State which Phase is being worked on
4. State which files were completed in the previous session
5. Do not deviate from design system colours, fonts, or spacing
   without explicit instruction from Jose

Current status (update this section after each session):
  Last completed phase: 0 — Documents only, no code written yet
  Next session starts at: Phase 1 — Foundation files

---

## 11. OPEN DECISIONS (resolve before or during relevant build phase)

1. Portrait photo — Jose to provide high-res image before Phase 2
2. Project cover images — Jose to provide or confirm which existing
   WordPress images can be reused (hosted at joseromerodesign.com/wp-content/)
3. Logo/wordmark — use text-only wordmark initially, or SVG mark?
   Current WordPress site uses a gold horizontal logo.
   Recommend: text-only "Jose Romero" in Cormorant Garamond for Phase 1,
   replace with SVG mark when/if provided
4. Contact method — mailto link confirmed (no form).
   Email: joseromero.next@gmail.com
5. Short engagements (Mutua, AXA, Bankinter, Subaru, Affinity) —
   listed on work index as brief entries only, no full case study pages.
   Confirm this is correct before Phase 4.
6. AFIN case study visual assets — existing WordPress case study at
   /improving-the-digital-experience-for-a-financial-app/ has screenshots.
   Confirm Jose approves reuse before Phase 6.

---

