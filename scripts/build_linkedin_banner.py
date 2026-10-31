#!/usr/bin/env python3
"""LinkedIn banner in the site's own type, colour and hero map.

Renders 1584x396 CSS px at device scale 2 (3168x792), then downsamples a
1x copy. Nothing is redrawn by hand: the design tokens come from
assets/css/main.css, and the complexity map, its CSS and its four pressure
colours are lifted from the homepage hero (src/index.html), so the banner
follows the portfolio whenever those change.

    python3 scripts/build_linkedin_banner.py
"""
import pathlib
import re
import subprocess
import tempfile

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "Designing the portfolio"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

W, H = 1584, 396          # LinkedIn's recommended banner size, 4:1
SCALE = 2


def tokens():
    css = (ROOT / "assets" / "css" / "main.css").read_text(encoding="utf-8")
    block = re.search(r"\n:root \{(.*?)\n\}\n", css, re.S)
    if not block:
        raise SystemExit("main.css: could not find the :root token block")
    return ":root {" + block.group(1) + "\n}"


def hero_map():
    page = (ROOT / "src" / "index.html").read_text(encoding="utf-8")
    svg = re.search(r"<!-- hero-map:start -->(.*?)<!-- hero-map:end -->", page, re.S)
    if not svg:
        raise SystemExit("src/index.html: hero-map markers not found")
    styles = re.search(r"(\n    \.hm \{ width: 100%;.*?\n    \}\n)(?=\n    /\* Legibility gradient)", page, re.S)
    if not styles:
        raise SystemExit("src/index.html: .hm style block not found")
    # last declaration wins: the oklch overrides in the hero's @supports block
    pressure = {}
    for name, value in re.findall(r"(--st-[a-z]):\s*([^;]+);", page):
        pressure[name] = value.strip()
    if len(pressure) != 4:
        raise SystemExit("src/index.html: expected four --st-* pressure colours")
    press_css = "\n".join(f"  {k}: {v};" for k, v in pressure.items())
    return svg.group(1).strip(), styles.group(1), press_css


def font_faces():
    fonts = (ROOT / "assets" / "fonts")
    faces = [
        ("Bitter", "normal", "bitter-latin-normal.woff2"),
        ("Bitter", "italic", "bitter-latin-italic.woff2"),
        ("Outfit", "normal", "outfit-latin.woff2"),
    ]
    return "\n".join(
        f"@font-face {{ font-family: '{family}'; font-style: {style}; font-weight: 100 900; "
        f"font-display: block; src: url('{(fonts / f).as_uri()}') format('woff2'); }}"
        for family, style, f in faces
    )


PAGE = """<!doctype html>
<html lang="en" data-theme="dark">
<head><meta charset="utf-8"><style>
{fonts}
{tokens}
html, body {{ margin: 0; width: {w}px; height: {h}px; overflow: hidden; }}
body {{
  background-color: var(--bg-base);
  background-image: url('{noise}');
  color: var(--text-primary);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}}

.banner {{
  position: relative; width: 100%; height: 100%; overflow: hidden;
{pressure}
}}

/* The hero's complexity map, windowed on its middle band (viewBox y 78-318
   of 460, see render()) so the four platforms and the four routes fill the
   height. At 396px tall the drawing is 498px wide (396 x 400/318); the box
   matches that so the mask percentages stay honest, and the last 76px run
   past the right edge. */
.banner-illo {{
  position: absolute; top: 0; bottom: 0; right: -76px; width: 498.1px;
  z-index: 0;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.75) 11%, #000 26%);
  mask-image: linear-gradient(to right, transparent 0%, rgba(0,0,0,0.75) 11%, #000 26%);
}}
.banner-illo svg {{ width: 100%; height: 100%; }}
{map_css}
/* Banner only: the satellite labels sit too close to the platform names at
   this crop, so the four platforms and the four routes carry the map. The
   route sparks are animation-only, and a still frame should not depend on
   where they happened to be. */
.banner-illo .hm-sat-label,
.banner-illo .hm-spark {{ display: none; }}
/* Four platforms cropped mid-panel leave their seams running through the
   picture; toned toward the ground they still hold the network but stop
   reading as boxes. */
.banner-illo .hm-plat .hm-top {{
  fill: color-mix(in srgb, var(--bg-surface) 45%, var(--bg-base));
  stroke: var(--border-subtle);
}}

/* Legibility gradient: the hero's, retuned for a 4:1 canvas */
.banner::before {{
  content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background: linear-gradient(to right,
    var(--bg-base) 44%,
    color-mix(in srgb, var(--bg-base) 55%, transparent) 64%,
    transparent 84%);
}}

.banner-type {{
  /* The headline sits where the previous banner put it and where it has been
     tested live: left edge at 43% of the width, block centred at 48.6% of
     the height, clear of the profile photo in the bottom-left corner. */
  position: absolute; left: 682px; top: 48.6%; transform: translateY(-50%);
  z-index: 2;
}}
.banner h1 {{
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 66px;
  line-height: 1.05;
  letter-spacing: -0.018em;
  color: var(--text-primary);
  margin: 0;
}}
.banner h1 span {{ display: block; }}
.banner h1 .accent {{
  font-style: italic;
  color: var(--gold);
  padding-left: 0.62em;
}}
</style></head>
<body>
<div class="banner">
  <div class="banner-illo" aria-hidden="true">{svg}</div>
  <div class="banner-type">
    <h1><span>Design that works</span><span class="accent">inside complexity.</span></h1>
  </div>
</div>
</body></html>"""


def render():
    svg, map_css, pressure = hero_map()
    # Window the map on its middle band and letterbox instead of slice-cropping
    # an already small drawing. Fail loudly if the hero's viewBox changes.
    if 'viewBox="0 0 400 460"' not in svg:
        raise SystemExit("hero map viewBox changed; retune the banner crop")
    svg = svg.replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMidYMid meet"')
    svg = svg.replace('viewBox="0 0 400 460"', 'viewBox="0 78 400 318"')
    page = PAGE.format(
        fonts=font_faces(), tokens=tokens(), w=W, h=H,
        noise=(ROOT / "assets" / "images" / "texture" / "noise-chalk.webp").as_uri(),
        pressure=pressure, map_css=map_css, svg=svg,
    )
    OUT.mkdir(exist_ok=True)
    (OUT / "linkedin-banner.html").write_text(page, encoding="utf-8")
    with tempfile.TemporaryDirectory() as tmp:
        src = pathlib.Path(tmp) / "banner.html"
        shot = pathlib.Path(tmp) / "banner.png"
        src.write_text(page, encoding="utf-8")
        subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
             "--allow-file-access-from-files", "--force-color-profile=srgb",
             f"--force-device-scale-factor={SCALE}", f"--window-size={W},{H}",
             "--virtual-time-budget=4000", f"--screenshot={shot}", src.as_uri()],
            check=True, capture_output=True,
        )
        im = Image.open(shot).convert("RGB")
    if im.size != (W * SCALE, H * SCALE):
        raise SystemExit(f"unexpected render size {im.size}")

    big = OUT / "linkedin-banner@2x.png"
    small = OUT / "linkedin-banner.png"
    im.save(big, "PNG", optimize=True)
    im.resize((W, H), Image.LANCZOS).save(small, "PNG", optimize=True)
    jpg = OUT / "linkedin-banner.jpg"
    im.resize((W, H), Image.LANCZOS).save(jpg, "JPEG", quality=95, subsampling=0)
    for p in (big, small, jpg):
        print(f"{p.relative_to(ROOT)}  {Image.open(p).size}  {p.stat().st_size // 1024} KB")
    print((OUT / "linkedin-banner.html").relative_to(ROOT))


if __name__ == "__main__":
    render()
