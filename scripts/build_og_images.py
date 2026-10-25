#!/usr/bin/env python3
"""Share images (og:image) in the site's type and colour: a text panel in
Bitter and Outfit on the left, the project's visuals on the right.

The visuals are crops of the June 2026 images, kept in
"Designing the portfolio/og-visuals/" (gitignored). The first run cuts them
from assets/images/og-*.webp, finding where the visuals start; later runs
reuse those crops, so the script never crops its own output.

Renders with headless Chrome at 1200x630, device scale 2, and writes
2400x1260 WebP (quality 82) over assets/images/og-<slug>.webp.

    python3 scripts/build_og_images.py
"""
import html
import pathlib
import subprocess
import tempfile

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMAGES = ROOT / "assets" / "images"
VISUALS = ROOT / "Designing the portfolio" / "og-visuals"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# slug: (eyebrow, title, description)
CARDS = {
    "default": ("Senior product designer", "Jose Romero",
                "12 years in digital products, CRO and behavioural strategy. Now embedded at IKEA."),
    "ai-workflow-framework": ("AI workflow design", "AI Workflow Framework",
                              "A multi-agent workflow for product design, with a person signing off every phase."),
    "ikea-home-services": ("Marketplace · Mobile", "IKEA Home Services",
                           "Homeowners and verified professionals in seven Spanish regions. 500,000+ downloads."),
    "ikea-secondhand-marketplace": ("Circular commerce", "IKEA Second-hand Marketplace",
                                    "Peer-to-peer resale of IKEA products, live in five European countries."),
    "ikea-ways-of-working": ("Design operations", "IKEA Ways of Working",
                             "One system across Figma, Jira, Confluence and Phrase that keeps working when the team changes."),
    "iqos-club-cro": ("CRO · Loyalty", "IQOS Club Spain",
                      "Fast-cycle experiments on a loyalty platform with limited traffic and shared resources."),
    "mapfre-afin": ("FinTech · Mobile", "Mapfre AFIN",
                    "A self-service app for investments, savings and pensions, with an advisor that shows its reasoning."),
    "mapfre-digital-expansion": ("Multi-market platform", "Mapfre Digital Expansion",
                                 "Verti Italy and Germany on one design system, and an agents directory in three countries."),
    "melia-hotels-campaign-platform": ("Web application · Hospitality", "Meliá Campaign Platform",
                                       "A marketing campaign platform for Meliá Hotels International, built from scratch."),
    "santander-nordics-cro": ("CRO · Banking", "Santander Nordics",
                              "Conversion experiments for loans, cards and deposits in four Nordic markets."),
    "xti-ecommerce": ("E-commerce · Fashion", "XTI Store",
                      "A full e-commerce redesign within a Magento migration, designed in one month."),
}


def visual_for(slug):
    """The right-hand visual for a card, cut once from the original image."""
    out = VISUALS / f"{slug}.png"
    if out.exists():
        return out
    im = Image.open(IMAGES / f"og-{slug}.webp").convert("RGB")
    w, h = im.size
    bg = im.getpixel((40, 40))
    px = im.load()

    def busy(x):
        hits = 0
        for y in range(0, h, 4):
            r, g, b = px[x, y]
            if abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2]) > 120:
                hits += 1
                if hits > 12:
                    return True
        return False

    # the old text panel ends before 40% of the width; visuals start after it
    start = next(x for x in range(int(w * 0.40), int(w * 0.75), 2) if busy(x))
    VISUALS.mkdir(parents=True, exist_ok=True)
    crop = im.crop((max(0, start - 40), 0, w, h))
    crop.save(out)
    (VISUALS / f"{slug}.txt").write_text(f"{bg[0]},{bg[1]},{bg[2]}")
    return out


PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: Bitter; font-weight: 100 900; src: url('{fonts}/bitter-latin-normal.woff2'); }}
@font-face {{ font-family: Outfit; font-weight: 100 900; src: url('{fonts}/outfit-latin.woff2'); }}
html, body {{ margin: 0; width: 1200px; height: 630px; overflow: hidden; background: rgb({bg}); }}
.vis {{ position: absolute; top: 0; right: 0; height: 630px; }}
.fade {{ position: absolute; top: 0; height: 630px; left: {left}px; width: 90px;
         background: linear-gradient(90deg, rgb({bg}), rgb({bg} / 0)); }}
.panel {{ position: absolute; inset: 0 auto 0 0; width: {panel}px; box-sizing: border-box;
          padding: 0 40px 0 64px; display: flex; flex-direction: column; justify-content: center; }}
.eyebrow {{ font: 600 15px/1 Outfit; letter-spacing: 0.14em; text-transform: uppercase; color: #66D4C8;
            display: flex; align-items: center; gap: 12px; }}
.eyebrow::after {{ content: ''; width: 36px; height: 1px; background: #4BBFB2; }}
h1 {{ font: 400 {size}px/1.06 Bitter; letter-spacing: -0.01em; color: #F2EEE6; margin: 22px 0 22px; text-wrap: balance; }}
p {{ font: 400 22px/1.5 Outfit; color: #D4CFC6; margin: 0; max-width: 30ch; }}
.site {{ margin-top: 30px; font: 500 19px/1 Outfit; color: #EA6674; display: flex; align-items: center; gap: 12px; }}
.site::before {{ content: ''; width: 24px; height: 2px; background: #EA6674; }}
</style></head><body>
<img class="vis" src="{visual}">
<div class="fade"></div>
<div class="panel">
  <div class="eyebrow">{eyebrow}</div>
  <h1>{title}</h1>
  <p>{desc}</p>
  <div class="site">joseromerodesign.com</div>
</div>
</body></html>"""


def render(slug, eyebrow, title, desc):
    visual = visual_for(slug)
    bg = (VISUALS / f"{slug}.txt").read_text().replace(",", " ")
    vw, vh = Image.open(visual).size
    left = 1200 - round(vw * 630 / vh)          # where the visual starts, in CSS px
    panel = max(left + 30, 470)
    size = 64 if len(title) <= 22 else 54
    page = PAGE.format(fonts=(ROOT / "assets" / "fonts").as_uri(), bg=bg, left=left, panel=panel,
                       visual=visual.as_uri(), eyebrow=html.escape(eyebrow), title=html.escape(title),
                       desc=html.escape(desc), size=size)
    with tempfile.TemporaryDirectory() as tmp:
        src = pathlib.Path(tmp) / "card.html"
        shot = pathlib.Path(tmp) / "card.png"
        src.write_text(page, encoding="utf-8")
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--allow-file-access-from-files", "--force-device-scale-factor=2",
                        "--window-size=1200,630", "--virtual-time-budget=3000",
                        f"--screenshot={shot}", src.as_uri()],
                       check=True, capture_output=True)
        Image.open(shot).convert("RGB").save(IMAGES / f"og-{slug}.webp", "WEBP", quality=82)


if __name__ == "__main__":
    for slug, (eyebrow, title, desc) in CARDS.items():
        render(slug, eyebrow, title, desc)
        print("og-" + slug + ".webp")
