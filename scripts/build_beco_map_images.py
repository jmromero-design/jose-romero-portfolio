#!/usr/bin/env python3
"""Still images of the BECO map, drawn the way the explorer draws it at rest.

Reads assets/data/beco-graph/graph.json and paints nodes, tree edges and the
related-concept arcs with the explorer's own sizes, order and colours, once
per theme, flattened onto the section colour it sits on (pages fade its edge
with a radial mask). Used by the homepage BECO feature and the Thinking
index preview card.

Writes assets/images/thinking/beco-knowledge-graph/graph-map-{dark,light}.webp
(900x900). Re-run after scripts/generate_beco_graph_data.py.

    python3 scripts/build_beco_map_images.py
"""
import base64
import json
import pathlib
import subprocess
import tempfile

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
GRAPH = ROOT / "assets" / "data" / "beco-graph" / "graph.json"
OUT = ROOT / "assets" / "images" / "thinking" / "beco-knowledge-graph"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# the site's tokens (main.css); "bg" fills unbacked concepts, "ground" is the
# section the image sits on (homepage BECO feature), flattened in because a
# transparent WebP of a few thousand fine lines weighs ~4x more
THEMES = {
    "dark": dict(bg="#111110", text1="#F2EEE6", text2="#D4CFC6", text3="#84817D", border="#2A2A27",
                 borderStrong="#3A3A36", teal="#4BBFB2", gold="#EA6674", partial="#2A6460", ground=(9, 9, 8)),
    "light": dict(bg="#FBFCFD", text1="#0E1A23", text2="#24333D", text3="#586873", border="#C2CED5",
                  borderStrong="#9AABB5", teal="#136F67", gold="#B4233F", partial="#87B5B2", ground=(238, 243, 246)),
}

PAGE = """<!doctype html><html><head><meta charset="utf-8"><style>
html, body { margin: 0; background: transparent; } canvas { display: block; width: 600px; height: 600px; }
</style></head><body><canvas id="c" width="1200" height="1200"></canvas><script>
const G = JSON.parse(atob('%s')), th = %s;
const BASE_R = [7, 5, 2.6, 3.4, 1.5, 1.5, 1.8, 1.1];
const N = G.nodes.length, X = [], Y = [], T = [], R = [], ex = [], adj = Array.from({length: N}, () => 0);
G.nodes.forEach((n, i) => { T[i] = n[0]; X[i] = n[1]; Y[i] = n[2]; ex[i] = n[4] || {}; });
for (let e = 0; e < G.edges.length; e += 2) { adj[G.edges[e]]++; adj[G.edges[e + 1]]++; }
for (let i = 0; i < N; i++) {
  let r = BASE_R[T[i]];
  if (T[i] === 3) r += Math.sqrt((ex[i].f || 0) + (ex[i].a || 0)) * 0.7;
  if (T[i] === 2 || T[i] === 6) r += Math.min(2, adj[i] * 0.12);
  R[i] = r;
}
const ctx = document.getElementById('c').getContext('2d');
ctx.scale(2, 2);
const k = 0.285, ox = 300, oy = 300, sx = (i) => X[i] * k + ox, sy = (i) => Y[i] * k + oy;
const inner = (a, b) => Math.max(T[a], T[b]) <= 3;
const strokeEdges = (color, alpha, pick) => {
  ctx.beginPath();
  for (let e = 0; e < G.edges.length; e += 2) { const a = G.edges[e], b = G.edges[e + 1]; if (!pick(a, b)) continue; ctx.moveTo(sx(a), sy(a)); ctx.lineTo(sx(b), sy(b)); }
  ctx.lineWidth = 0.7; ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.stroke();
};
strokeEdges(th.borderStrong, 0.6, inner);
strokeEdges(th.border, 0.5, (a, b) => !inner(a, b));
ctx.beginPath();
for (let e = 0; e < G.rel.length; e += 2) {
  const a = G.rel[e], b = G.rel[e + 1], mx = (sx(a) + sx(b)) / 2, my = (sy(a) + sy(b)) / 2;
  ctx.moveTo(sx(a), sy(a)); ctx.quadraticCurveTo(mx + (ox - mx) * 0.18, my + (oy - my) * 0.18, sx(b), sy(b));
}
ctx.lineWidth = 0.7; ctx.strokeStyle = th.teal; ctx.globalAlpha = 0.2; ctx.stroke();
const byType = (t) => [...Array(N).keys()].filter((i) => T[i] === t);
const batch = (list, alpha, fill, after) => {
  ctx.beginPath();
  for (const i of list) { ctx.moveTo(sx(i) + R[i], sy(i)); ctx.arc(sx(i), sy(i), R[i], 0, Math.PI * 2); }
  ctx.globalAlpha = alpha; if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (after) after();
};
const concepts = byType(3);
batch(byType(7), 0.55, th.text3);
batch(byType(6), 1, th.borderStrong);
batch(byType(5).concat(byType(4)), 0.8, th.text3);
batch(concepts.filter((i) => ex[i].g === 'v'), 1, th.teal);
batch(concepts.filter((i) => ex[i].g === 'p'), 1, th.partial);
batch(concepts.filter((i) => ex[i].g === 'n'), 1, th.bg, () => { ctx.setLineDash([2, 2]); ctx.strokeStyle = th.text2; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]); });
ctx.beginPath();
for (const i of concepts) { if (ex[i].m !== 'high') continue; const r = R[i] + 2.2; ctx.moveTo(sx(i) + r, sy(i)); ctx.arc(sx(i), sy(i), r, 0, Math.PI * 2); }
ctx.globalAlpha = 1; ctx.strokeStyle = th.gold; ctx.lineWidth = 1.1; ctx.stroke();
batch(byType(2), 1, th.text3);
batch(byType(1), 1, th.text2);
for (const i of byType(0)) {
  ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(sx(i), sy(i), R[i], 0, Math.PI * 2);
  ctx.fillStyle = th.bg; ctx.fill(); ctx.strokeStyle = th.text1; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.beginPath(); ctx.arc(sx(i), sy(i), R[i] * 0.35, 0, Math.PI * 2); ctx.fillStyle = th.text1; ctx.fill();
}
</script></body></html>"""


def main():
    data = base64.b64encode(GRAPH.read_bytes()).decode()
    for name, th in THEMES.items():
        with tempfile.TemporaryDirectory() as tmp:
            src = pathlib.Path(tmp) / "map.html"
            shot = pathlib.Path(tmp) / "map.png"
            ground = th.pop("ground")
            src.write_text(PAGE % (data, json.dumps(th)), encoding="utf-8")
            subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                            "--default-background-color=00000000", "--force-device-scale-factor=2",
                            "--window-size=600,600", "--virtual-time-budget=4000",
                            f"--screenshot={shot}", src.as_uri()], check=True, capture_output=True)
            out = OUT / f"graph-map-{name}.webp"
            im = Image.open(shot).convert("RGBA")
            flat = Image.new("RGBA", im.size, (*ground, 255))
            flat.alpha_composite(im)
            flat.convert("RGB").resize((900, 900), Image.LANCZOS).save(out, "WEBP", quality=75, method=6)
            print(out.relative_to(ROOT), out.stat().st_size)


if __name__ == "__main__":
    main()
