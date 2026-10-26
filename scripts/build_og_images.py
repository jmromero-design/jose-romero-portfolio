#!/usr/bin/env python3
"""Share images (og:image) in the site's type and colour: a text panel in
Bitter and Outfit on the left, the project's visuals on the right.

The visuals are crops of the June 2026 images, kept in
"Designing the portfolio/og-visuals/" (gitignored). The first run cuts them
from assets/images/og-*.webp, finding where the visuals start; later runs
reuse those crops, so the script never crops its own output.

Renders with headless Chrome at 1200x630, device scale 2, and writes
2400x1260 WebP (quality 82) over assets/images/og-<slug>.webp, and
og-<slug>-es.webp for the Spanish pages.

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


CARDS.update({
    "about": ("About", "Hard problems, by choice.",
              "Senior product designer, 12 years in digital products, CRO and design systems. Now embedded at IKEA."),
    "thinking": ("Thinking", "Essays, research and positions",
                 "On AI in design teams, behavioural science and how teams work, from 12 years of practice."),
    "beco-knowledge-graph": ("Research · BECO", "A knowledge graph that grades its own evidence",
                             "420 DOI-verified sources behind 243 behavioural-science concepts."),
    "beco-explorer": ("Interactive · BECO", "Explore the BECO graph",
                      "243 concepts, 420 sources and the studies behind them, on one zoomable map."),
})

# the Spanish pages get their own cards: og-<slug>-es.webp
CARDS_ES = {
    "default": ("Senior product designer", "Jose Romero",
                "12 años en productos digitales, CRO y estrategia conductual. Ahora integrado en IKEA."),
    "ai-workflow-framework": ("Diseño de flujos con IA", "Framework de flujos con IA",
                              "Un flujo multiagente para diseño de producto, con una persona que aprueba cada fase."),
    "ikea-home-services": ("Marketplace · Móvil", "IKEA Home Services",
                           "Propietarios y profesionales verificados en siete regiones españolas. Más de 500.000 descargas."),
    "ikea-secondhand-marketplace": ("Comercio circular", "IKEA Second-hand Marketplace",
                                    "Reventa P2P de productos IKEA, activa en cinco países europeos."),
    "ikea-ways-of-working": ("Operaciones de diseño", "IKEA: formas de trabajar",
                             "Un sistema entre Figma, Jira, Confluence y Phrase que sigue funcionando cuando cambia el equipo."),
    "iqos-club-cro": ("CRO · Fidelización", "IQOS Club España",
                      "Experimentos rápidos en una plataforma de fidelización con poco tráfico y recursos compartidos."),
    "mapfre-afin": ("FinTech · Móvil", "Mapfre AFIN",
                    "Una app de autogestión para inversiones, ahorro y pensiones, con un asesor que explica su razonamiento."),
    "mapfre-digital-expansion": ("Plataforma multimercado", "Mapfre: expansión digital",
                                 "Verti Italia y Alemania en un mismo sistema de diseño, y un directorio de oficinas en tres países."),
    "melia-hotels-campaign-platform": ("Aplicación web · Hostelería", "Meliá: plataforma de campañas",
                                       "Una plataforma de campañas de marketing para Meliá Hotels International, creada desde cero."),
    "santander-nordics-cro": ("CRO · Banca", "Santander Nordics",
                              "Experimentos de conversión para préstamos, tarjetas y depósitos en cuatro mercados nórdicos."),
    "xti-ecommerce": ("E-commerce · Moda", "XTI Store",
                      "Rediseño completo del e-commerce dentro de una migración a Magento, diseñado en un mes."),
}


CARDS_ES.update({
    "about": ("Sobre mí", "Problemas difíciles, por elección.",
              "Senior product designer, 12 años en productos digitales, CRO y sistemas de diseño. Ahora integrado en IKEA."),
    "thinking": ("Reflexiones", "Ensayos, investigación y posiciones",
                 "Sobre IA en equipos de diseño, ciencia del comportamiento y cómo trabajan los equipos."),
    "beco-knowledge-graph": ("Investigación · BECO", "Un grafo que califica su propia evidencia",
                             "420 fuentes verificadas por DOI detrás de 243 conceptos de ciencia del comportamiento."),
    "beco-explorer": ("Interactivo · BECO", "Explora el grafo BECO",
                      "243 conceptos, 420 fuentes y los estudios detrás de ellos, en un mapa con zoom."),
})

# Pages without an original share image take their visual from site assets:
# slug: (source image, ground colour to blend the panel into)
EXTRA_VISUALS = {
    "about": ("assets/images/portrait-standing.webp", (0, 0, 0)),
    "thinking": ("Designing the portfolio/og-visuals/ai-workflow-framework.png", None),
    "beco-knowledge-graph": ("assets/images/thinking/beco-knowledge-graph/graph-map-dark.webp", (9, 9, 8)),
    "beco-explorer": ("assets/images/thinking/beco-knowledge-graph/graph-map-dark.webp", (9, 9, 8)),
}


def extra_visual(slug):
    src, ground = EXTRA_VISUALS[slug]
    im = Image.open(ROOT / src).convert("RGBA")
    if ground:
        # flatten onto the card colour; a bare RGBA->RGB convert keeps the junk
        # colour stored under transparent pixels and shows it as grey blocks
        flat = Image.new("RGBA", im.size, (*ground, 255))
        flat.alpha_composite(im)
        im = flat
    im = im.convert("RGB")
    im = im.resize((round(im.width * 1260 / im.height), 1260), Image.LANCZOS)
    ground = ground or im.getpixel((min(40, im.width - 1), 40))
    VISUALS.mkdir(parents=True, exist_ok=True)
    im.save(VISUALS / f"{slug}.png")
    (VISUALS / f"{slug}.txt").write_text(f"{ground[0]},{ground[1]},{ground[2]}")


def visual_for(slug):
    """The right-hand visual for a card, cut once from the original image."""
    out = VISUALS / f"{slug}.png"
    if out.exists():
        return out
    if slug in EXTRA_VISUALS:
        extra_visual(slug)
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


def render(slug, eyebrow, title, desc, suffix=""):
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
        Image.open(shot).convert("RGB").save(IMAGES / f"og-{slug}{suffix}.webp", "WEBP", quality=82)


if __name__ == "__main__":
    for slug, (eyebrow, title, desc) in CARDS.items():
        render(slug, eyebrow, title, desc)
        print("og-" + slug + ".webp")
    for slug, (eyebrow, title, desc) in CARDS_ES.items():
        render(slug, eyebrow, title, desc, "-es")
        print("og-" + slug + "-es.webp")
