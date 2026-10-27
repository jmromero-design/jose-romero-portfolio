// Builds the homepage hero map: the "How I work" stack seen from above.
// The four base platforms keep the old map's circles, pillars and
// satellites; Evidence sits on them as its own slab; Framing to Systems
// are pressed into a few contour steps; the outcome cap holds the centre.
// Positions follow the original 400×460 map, so the hero composition holds.
//
// Writes inline SVG between <!-- hero-map:start --> and <!-- hero-map:end -->
// in src/index.html and src/es/index.html. Re-run after editing anything here:
//   node scripts/build_hero_map.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const LABELS = {
  en: {
    pillars: { b: 'Business', u: 'Users', t: 'Technology', o: 'Organisation' },
    sats: ['Strategy', 'Research', 'Journeys', 'Stakeholders', 'Systems', 'Data', 'Process', 'Teams'],
    routes: { b: 'Viability', u: 'Desirability', t: 'Feasibility', o: 'Scalability' },
    // same wording as the stack's outcome
    core: { tag: 'Outcome', lines: ['A decision', 'you can build'] },
  },
  es: {
    pillars: { b: 'Negocio', u: 'Usuarios', t: 'Tecnología', o: 'Organización' },
    sats: ['Estrategia', 'Investigación', 'Recorridos', 'Stakeholders', 'Sistemas', 'Datos', 'Proceso', 'Equipos'],
    routes: { b: 'Viabilidad', u: 'Deseabilidad', t: 'Factibilidad', o: 'Escalabilidad' },
    core: { tag: 'Resultado', lines: ['Una decisión', 'lista para', 'construir'] },
  },
};

const C = [200, 230];
const f1 = (n) => Number(n.toFixed(1));

// Base: one platform per pressure, each holding its own circle.
const BASE = {
  b: { x: [6, 194],   y: [6, 224] },
  u: { x: [206, 394], y: [6, 224] },
  t: { x: [6, 194],   y: [236, 454] },
  o: { x: [206, 394], y: [236, 454] },
};
const VENN = { b: [142, 142], u: [258, 142], t: [142, 318], o: [258, 318] };
const PILLAR = { b: [108, 142], u: [292, 142], t: [108, 326], o: [292, 326] };

// Second-ring nodes, two per pressure, with their label positions.
const SATS = [
  { f: 'b', c: [68, 100],  r: 10, lab: [68, 122] },
  { f: 'b', c: [150, 74],  r: 10, lab: [150, 96] },
  { f: 'u', c: [252, 74],  r: 10, lab: [252, 96] },
  { f: 'u', c: [332, 100], r: 10, lab: [332, 122] },
  { f: 't', c: [68, 368],  r: 10, lab: [68, 390] },
  { f: 't', c: [150, 394], r: 10, lab: [150, 416] },
  { f: 'o', c: [332, 368], r: 10, lab: [332, 390] },
  { f: 'o', c: [252, 394], r: 10, lab: [252, 416] },
];
// Outer specks, each tied back to its pillar.
const SPECKS = [
  ['b', 40, 90, 4.5], ['b', 74, 34, 5.5], ['b', 172, 44, 4], ['b', 40, 156, 3], ['b', 184, 54, 3],
  ['u', 228, 44, 4.5], ['u', 326, 34, 5.5], ['u', 366, 98, 4], ['u', 358, 154, 3], ['u', 216, 54, 3],
  ['t', 40, 378, 4.5], ['t', 74, 434, 5.5], ['t', 172, 424, 4], ['t', 22, 312, 3], ['t', 108, 450, 3],
  ['o', 360, 378, 4.5], ['o', 326, 434, 5.5], ['o', 228, 424, 4], ['o', 378, 312, 3], ['o', 292, 450, 3],
];

// Stack, outside in: Evidence, the pressed middle layers, the cap.
const EVIDENCE = { h: 84, rx: 24, t: 5 };
const MIDDLE = [62, 56, 50, 44].map((h, i) => ({ h, rx: 20 - i, t: 2.4 }));
const CAP = { h: 40, rx: 16, t: 4 };

// The old map's four routes, pillar to centre.
const ROUTES = {
  b: [[108, 142], [161.333, 153.478], [192, 182.812], [200, 230]],
  u: [[292, 142], [282.667, 181.536], [252, 210.87], [200, 230]],
  t: [[108, 326], [117.333, 284.261], [148, 252.261], [200, 230]],
  o: [[292, 326], [240, 319.043], [209.333, 287.043], [200, 230]],
};
const ROUTE_LAB = { b: [166, 157, 'start'], u: [278, 201, 'start'], t: [124, 276, 'end'], o: [226, 312, 'end'] };

const bez = ([p0, p1, p2, p3], t) => [0, 1].map((k) =>
  (1 - t) ** 3 * p0[k] + 3 * (1 - t) ** 2 * t * p1[k] + 3 * (1 - t) * t ** 2 * p2[k] + t ** 3 * p3[k]);
// first point where a route enters a centred rounded square
function entry(route, h, rx) {
  const inside = ([x, y]) => {
    const dx = Math.abs(x - C[0]), dy = Math.abs(y - C[1]);
    if (dx > h || dy > h) return false;
    const ex = dx - (h - rx), ey = dy - (h - rx);
    return ex <= 0 || ey <= 0 || ex * ex + ey * ey <= rx * rx;
  };
  for (let i = 0; i <= 400; i++) { const p = bez(route, i / 400); if (inside(p)) return p; }
  return route[3];
}

const sq = (h, rx, dy = 0, cls = '') =>
  `<rect${cls ? ` class="${cls}"` : ''} x="${C[0] - h}" y="${f1(C[1] - h + dy)}" width="${h * 2}" height="${h * 2}" rx="${rx}"/>`;
const slab = (cls, h, rx, t) =>
  `<g class="${cls}">${sq(h, rx, t, 'hm-edge')}${sq(h, rx, 0, 'hm-top')}${sq(h, rx, 0, 'hm-sheen')}</g>`;

// tag above, then the wording centred in the core, one line per entry
function coreText({ tag, lines }) {
  const LH = 9, top = C[1] - ((lines.length - 1) * LH) / 2 + 5;
  return [`<text class="hm-core-a" x="${C[0]}" y="${top - 11}" text-anchor="middle">${tag}</text>`,
    ...lines.map((t, i) => `<text class="hm-core-c" x="${C[0]}" y="${top + i * LH}" text-anchor="middle">${t}</text>`)].join('\n  ');
}

function svg(lang) {
  const L = LABELS[lang];
  const out = [];
  out.push(`<svg class="hm" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice" role="presentation" focusable="false">`);
  out.push(`<defs>
  <linearGradient id="hmSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" style="stop-color:var(--text-primary);stop-opacity:.07"/><stop offset="55%" style="stop-color:var(--text-primary);stop-opacity:0"/></linearGradient>
  <radialGradient id="hmGlow"><stop offset="0%" style="stop-color:var(--gold);stop-opacity:.22"/><stop offset="100%" style="stop-color:var(--gold);stop-opacity:0"/></radialGradient>
  <radialGradient id="hmFade" cx="50%" cy="50%" r="60%"><stop offset="70%" style="stop-color:var(--bg-base);stop-opacity:0"/><stop offset="100%" style="stop-color:var(--bg-base);stop-opacity:1"/></radialGradient>
</defs>`);

  // base
  out.push(`<g class="hm-base">`);
  for (const f of ['b', 'u', 't', 'o']) {
    const { x, y } = BASE[f];
    const r = (dy, cls) => `<rect class="${cls}" x="${x[0]}" y="${y[0] + dy}" width="${x[1] - x[0]}" height="${y[1] - y[0]}" rx="18"/>`;
    out.push(`<g class="hm-plat" style="--c:var(--st-${f})">${r(5, 'hm-edge')}${r(0, 'hm-top')}${r(0, 'hm-sheen')}</g>`);
  }
  for (const f of ['b', 'u', 't', 'o']) {
    out.push(`<circle class="hm-venn" style="--c:var(--st-${f})" cx="${VENN[f][0]}" cy="${VENN[f][1]}" r="142"/>`);
  }
  for (const [f, x, y, r] of SPECKS) {
    const [px, py] = PILLAR[f];
    const d = Math.hypot(px - x, py - y);
    const ex = px - ((px - x) / d) * 26, ey = py - ((py - y) / d) * 26;
    out.push(`<line class="hm-thread" x1="${x}" y1="${y}" x2="${f1(ex)}" y2="${f1(ey)}"/>`);
    out.push(`<circle class="hm-speck" cx="${x}" cy="${y}" r="${r}"/><circle class="hm-speck-c" style="--c:var(--st-${f})" cx="${x}" cy="${y}" r="${f1(r * 0.36)}"/>`);
  }
  SATS.forEach((s, i) => {
    const [px, py] = PILLAR[s.f];
    const d = Math.hypot(px - s.c[0], py - s.c[1]);
    const k = (n) => [s.c[0] + ((px - s.c[0]) / d) * n, s.c[1] + ((py - s.c[1]) / d) * n];
    const [ax, ay] = k(s.r + 1.5), [bx, by] = k(d - 26);
    out.push(`<line class="hm-link" style="--c:var(--st-${s.f})" x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx)}" y2="${f1(by)}"/>`);
    out.push(`<g class="hm-node" style="--c:var(--st-${s.f})"><circle class="hm-node-edge" cx="${s.c[0]}" cy="${s.c[1] + 2}" r="${s.r}"/><circle class="hm-node-top" cx="${s.c[0]}" cy="${s.c[1]}" r="${s.r}"/><circle class="hm-node-c" cx="${s.c[0]}" cy="${s.c[1]}" r="2.6"/></g>`);
    out.push(`<text class="hm-sat-label" x="${s.lab[0]}" y="${s.lab[1]}" text-anchor="middle">${L.sats[i]}</text>`);
  });
  out.push(`</g>`);

  // stack
  out.push(`<circle class="hm-glow" cx="${C[0]}" cy="${C[1]}" r="140"/>`);
  out.push(slab('hm-slab hm-evidence', EVIDENCE.h, EVIDENCE.rx, EVIDENCE.t));
  MIDDLE.forEach((m) => out.push(slab('hm-slab hm-mid', m.h, m.rx, m.t)));

  // routes, drawn over the slabs, with a plug where each one steps up
  out.push(`<g class="hm-routes">`);
  for (const f of ['b', 'u', 't', 'o']) {
    const R = ROUTES[f];
    const d = `M${R[0].join(' ')} C${R[1].join(' ')} ${R[2].join(' ')} ${R[3].join(' ')}`;
    out.push(`<g style="--c:var(--st-${f})">`);
    out.push(`<path class="hm-route" pathLength="1" d="${d}"/>`);
    for (const [h, rx] of [[EVIDENCE.h, EVIDENCE.rx], [MIDDLE[0].h, MIDDLE[0].rx]]) {
      const [x, y] = entry(R, h, rx);
      out.push(`<circle class="hm-plug" cx="${f1(x)}" cy="${f1(y)}" r="2.4"/>`);
    }
    out.push(`<circle class="hm-spark" r="1.9"><animateMotion dur="5.5s" begin="${({ b: 2.6, u: 3.4, t: 4.1, o: 4.8 })[f]}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" path="${d}"/></circle>`);
    out.push(`</g>`);
  }
  out.push(`</g>`);

  // pillars: raised pucks where each pressure's route begins
  for (const f of ['b', 'u', 't', 'o']) {
    const [x, y] = PILLAR[f];
    const top = y < C[1];
    out.push(`<g class="hm-pillar" style="--c:var(--st-${f})"><circle class="hm-pillar-edge" cx="${x}" cy="${y + 4}" r="24"/><circle class="hm-pillar-top" cx="${x}" cy="${y}" r="24"/><circle class="hm-pillar-ring" cx="${x}" cy="${y}" r="15"/><circle class="hm-pillar-c" cx="${x}" cy="${y}" r="5.5"/></g>`);
    out.push(`<text class="hm-pname" style="--c:var(--st-${f})" x="${x}" y="${top ? y - 33 : y + 43}" text-anchor="middle">${L.pillars[f]}</text>`);
  }

  // cap: the outcome, rings around the core
  out.push(slab('hm-slab hm-cap', CAP.h, CAP.rx, CAP.t));
  out.push(`<g class="hm-mark">
  <circle class="hm-ring hm-ring--outer" cx="${C[0]}" cy="${C[1]}" r="148"/>
  <circle class="hm-ring hm-ring--mid" cx="${C[0]}" cy="${C[1]}" r="96"/>
  <circle class="hm-ring hm-ring--gold" cx="${C[0]}" cy="${C[1]}" r="35"/>
  <circle class="hm-core" cx="${C[0]}" cy="${C[1]}" r="30"/>
  ${coreText(L.core)}
</g>`);
  for (const f of ['b', 'u', 't', 'o']) {
    const [x, y, a] = ROUTE_LAB[f];
    out.push(`<text class="hm-route-label" style="--c:var(--st-${f})" x="${x}" y="${y}" text-anchor="${a}">${L.routes[f]}</text>`);
  }
  out.push(`<rect class="hm-fade" width="400" height="460"/>`);
  out.push(`</svg>`);
  return out.join('\n');
}

for (const [file, lang] of [['src/index.html', 'en'], ['src/es/index.html', 'es']]) {
  const s = readFileSync(file, 'utf8');
  const re = /(<!-- hero-map:start -->)[\s\S]*?(<!-- hero-map:end -->)/;
  if (!re.test(s)) throw new Error(`${file}: hero-map markers not found`);
  writeFileSync(file, s.replace(re, `$1\n${svg(lang)}\n        $2`));
  console.log(`${file}: hero map written`);
}
