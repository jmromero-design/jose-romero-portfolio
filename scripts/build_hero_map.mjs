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
const slab = (cls, h, rx, t, attrs = '') =>
  `<g class="${cls}"${attrs}>${sq(h, rx, t, 'hm-edge')}${sq(h, rx, 0, 'hm-top')}${sq(h, rx, 0, 'hm-sheen')}</g>`;

// tag above, then the wording centred in the core, one line per entry
function coreText({ tag, lines }) {
  const LH = 9, top = C[1] - ((lines.length - 1) * LH) / 2 + 5;
  return [`<text class="hm-core-a" x="${C[0]}" y="${top - 11}" text-anchor="middle">${tag}</text>`,
    ...lines.map((t, i) => `<text class="hm-core-c" x="${C[0]}" y="${top + i * LH}" text-anchor="middle">${t}</text>`)].join('\n  ');
}

// ---------------------------------------------------------------------------
// Motion. The map tells one story: complexity, then a decision inside it.
//
// Entry (plays once, one continuous ease-out from start to finish): every
// part starts invisible, pulled into a knot near the centre and turned one
// way, and comes to light as the knot unwinds around the centre into the
// layout. Small parts swing further than large ones, so each size moves at its
// own rate. While the base is still settling, the slabs grow from small and
// spin into place, a beat behind it, the routes draw and the outcome arrives,
// so no phase waits for another. Only then do the labels come to light, so
// they never add noise to the movement.
//
// Loop (after the entry): satellites and specks sway slowly around their
// pillar, about 25 degrees each way, each at its own pace, and turn back at
// each end like a pendulum, so the loop has no seam. Labels sway with their
// node but stay level. The stack, routes and outcome hold still: the
// complexity keeps moving around a decision that stays put.
//
// A part says how it arrives with data-in (swirl, spin, fade, pop, draw,
// label) and when with --e; ENTRY_CSS below plays them. The pause control and
// its states (data-motion on <html>) are handled there and in
// assets/js/hero-motion.js.
// ---------------------------------------------------------------------------
const T = 0.85; // overall entry speed: 1 = timings as written, lower = faster
const f3 = (n) => Number(n.toFixed(3));
const sec = (n) => `${f3(n * T)}s`;
const px = (n) => `${f1(n)}px`;
let seed = 7;   // fixed, so every build draws the same knot
const rnd = () => {
  seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// The knot. `pull`: share of the way to the centre a part starts (0 = in
// place, 1 = at the centre). `turn`: how far round the centre it swings while
// unwinding, in degrees; small parts turn more. `tilt`: its own starting
// rotation; only thin lines tilt enough to cross.
const KNOT_MAX = 300; // farthest part from the centre
const TWIST = 0.32;   // sideways share of the pull, the same way for every part
function knot([x, y], pull, turn, tilt = 0) {
  const dx = x - C[0], dy = y - C[1], d = Math.hypot(dx, dy);
  const k = pull * (0.85 + 0.3 * rnd()), tw = TWIST * (0.8 + 0.4 * rnd());
  const sw = turn * (0.85 + 0.3 * rnd());
  return [
    `--x:${px(-dx * k - dy * tw * k)};--y:${px(-dy * k + dx * tw * k)}`,
    `--px:${px(dx)};--py:${px(dy)};--nx:${px(-dx)};--ny:${px(-dy)}`,
    `--sw0:${f1(sw * 1.6)}deg;--r:${f1(tilt * (0.5 + 0.5 * rnd()))}deg`,
    // everything starts together; parts with farther to travel take longer
    `--e:${sec(rnd() * 0.1)};--sd:${sec(2.2 + (Math.min(d, KNOT_MAX) / KNOT_MAX) * 0.35)}`,
  ].join(';');
}
// attributes for a part: how it arrives, plus its own inline style
const IN = (kind, style, extra = '') => ` data-in="${kind}"${extra} style="${style}"`;
const swirl = (pos, pull, turn, tilt, own = '', extra = '') => IN('swirl', `${own ? `${own};` : ''}${knot(pos, pull, turn, tilt)}`, extra);
const timed = (kind, e, o = {}) => IN(kind, [o.style, `--e:${sec(e)}`, o.dur && `--dur:${sec(o.dur)}`, o.s && `--s:${o.s}`, o.rot !== undefined && `--rot:${o.rot}deg`].filter(Boolean).join(';'));
// a slow sway around a pillar: amplitude in degrees, a half-swing in seconds,
// and a start part-way through, so no two parts move together
const sway = (pivot, amp) => {
  const per = 26 + rnd() * 22;
  return `<g class="hm-sway" style="--ox:${px(pivot[0])};--oy:${px(pivot[1])};--amp:${f1(amp * (0.8 + 0.2 * rnd()))}deg;--per:${f1(per)}s;--ph:-${f1(rnd() * per * 2)}s">`;
};
const LABELS_AT = 2.4; // labels come to light as the last movement settles

function svg(lang) {
  seed = 7;
  const L = LABELS[lang];
  const out = [];
  const F = ['b', 'u', 't', 'o'];
  // A pause chosen on an earlier visit is applied by base.njk before this
  // draws (data-motion-skip on <html>), so the map opens finished.
  out.push(`<svg class="hm" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice" role="presentation" focusable="false">`);
  out.push(`<defs>
  <linearGradient id="hmSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" style="stop-color:var(--text-primary);stop-opacity:.07"/><stop offset="55%" style="stop-color:var(--text-primary);stop-opacity:0"/></linearGradient>
  <radialGradient id="hmGlow"><stop offset="0%" style="stop-color:var(--gold);stop-opacity:.22"/><stop offset="100%" style="stop-color:var(--gold);stop-opacity:0"/></radialGradient>
  <radialGradient id="hmFade" cx="50%" cy="50%" r="60%"><stop offset="70%" style="stop-color:var(--bg-base);stop-opacity:0"/><stop offset="100%" style="stop-color:var(--bg-base);stop-opacity:1"/></radialGradient>
</defs>`);

  // base: platforms, circles, then the small parts that sway
  out.push(`<g class="hm-base">`);
  F.forEach((f) => {
    const { x, y } = BASE[f];
    const r = (dy, cls) => `<rect class="${cls}" x="${x[0]}" y="${y[0] + dy}" width="${x[1] - x[0]}" height="${y[1] - y[0]}" rx="18"/>`;
    const pc = [(x[0] + x[1]) / 2, (y[0] + y[1]) / 2];
    out.push(`<g class="hm-plat"${swirl(pc, 0.35, 25, 4, `--c:var(--st-${f})`)}>${r(5, 'hm-edge')}${r(0, 'hm-top')}${r(0, 'hm-sheen')}</g>`);
  });
  F.forEach((f) => {
    out.push(`<circle class="hm-venn" pathLength="1"${swirl(VENN[f], 0.5, 40, 0, `--c:var(--st-${f})`, ' data-draw')} cx="${VENN[f][0]}" cy="${VENN[f][1]}" r="142"/>`);
  });
  // phones bring the small parts in as one group (hm-fine); wide screens swirl each
  out.push(`<g class="hm-fine"${timed('fade', 1.2, { dur: 0.9 })}>`);
  for (const [f, x, y, r] of SPECKS) {
    const [qx, qy] = PILLAR[f];
    const d = Math.hypot(qx - x, qy - y);
    const ex = qx - ((qx - x) / d) * 26, ey = qy - ((qy - y) / d) * 26;
    const k = knot([x, y], 0.7, 100, 22); // a speck and its thread travel together
    out.push(sway(PILLAR[f], 16));
    out.push(`<line class="hm-thread"${IN('swirl', k, ' data-solo')} x1="${x}" y1="${y}" x2="${f1(ex)}" y2="${f1(ey)}"/>`);
    out.push(`<circle class="hm-speck"${IN('swirl', k, ' data-solo')} cx="${x}" cy="${y}" r="${r}"/><circle class="hm-speck-c"${IN('swirl', `--c:var(--st-${f});${k}`, ' data-solo')} cx="${x}" cy="${y}" r="${f1(r * 0.36)}"/>`);
    out.push(`</g>`);
  }
  SATS.forEach((s, i) => {
    const [qx, qy] = PILLAR[s.f];
    const d = Math.hypot(qx - s.c[0], qy - s.c[1]);
    const k = (n) => [s.c[0] + ((qx - s.c[0]) / d) * n, s.c[1] + ((qy - s.c[1]) / d) * n];
    const [ax, ay] = k(s.r + 1.5), [bx, by] = k(d - 26);
    const kn = knot(s.c, 0.65, 90, 0);
    out.push(sway(PILLAR[s.f], 25));
    out.push(`<line class="hm-link" pathLength="1"${IN('swirl', `--c:var(--st-${s.f});${knot(s.c, 0.65, 90, 24)}`, ' data-solo data-draw')} x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(bx)}" y2="${f1(by)}"/>`);
    out.push(`<g class="hm-node"${IN('swirl', `--c:var(--st-${s.f});${kn}`, ' data-solo')}><circle class="hm-node-edge" cx="${s.c[0]}" cy="${s.c[1] + 2}" r="${s.r}"/><circle class="hm-node-top" cx="${s.c[0]}" cy="${s.c[1]}" r="${s.r}"/><circle class="hm-node-c" cx="${s.c[0]}" cy="${s.c[1]}" r="2.6"/></g>`);
    // the label sways with its node and turns back against the sway to stay level
    out.push(`<g class="hm-upright"><text class="hm-sat-label"${timed('label', LABELS_AT + 0.1 + rnd() * 0.3)} x="${s.lab[0]}" y="${s.lab[1]}" text-anchor="middle">${L.sats[i]}</text></g>`);
    out.push(`</g>`);
  });
  out.push(`</g>`); // hm-fine
  out.push(`</g>`); // hm-base

  // the stack: Evidence and the four middle layers grow from small and spin
  // into place, the same way the knot turns, each a beat behind the one below
  out.push(`<circle class="hm-glow"${timed('fade', 0.5, { dur: 1.6 })} cx="${C[0]}" cy="${C[1]}" r="140"/>`);
  out.push(slab('hm-slab hm-evidence', EVIDENCE.h, EVIDENCE.rx, EVIDENCE.t, timed('spin', 0.45, { dur: 1.9, s: 0.12, rot: 140 })));
  MIDDLE.forEach((m, i) => out.push(slab('hm-slab hm-mid', m.h, m.rx, m.t, timed('spin', 0.53 + i * 0.07, { dur: 1.85 - i * 0.05, s: 0.15, rot: 120 - i * 15 }))));

  // routes, drawn over the slabs, with a plug where each one steps up
  out.push(`<g class="hm-routes">`);
  F.forEach((f, i) => {
    const R = ROUTES[f];
    const d = `M${R[0].join(' ')} C${R[1].join(' ')} ${R[2].join(' ')} ${R[3].join(' ')}`;
    const e = 1.15 + i * 0.08;
    out.push(`<g style="--c:var(--st-${f})">`);
    out.push(`<path class="hm-route" pathLength="1"${timed('draw', e, { dur: 1.25 })} d="${d}"/>`);
    [[EVIDENCE.h, EVIDENCE.rx, 0.45], [MIDDLE[0].h, MIDDLE[0].rx, 0.7]].forEach(([h, rx, lag]) => {
      const [x, y] = entry(R, h, rx);
      out.push(`<circle class="hm-plug"${timed('pop', e + lag, { dur: 0.5 })} cx="${f1(x)}" cy="${f1(y)}" r="2.4"/>`);
    });
    out.push(`<circle class="hm-spark" r="1.9"><animateMotion dur="5.5s" begin="${f1(2.7 + i * 0.6)}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" path="${d}"/></circle>`);
    out.push(`</g>`);
  });
  out.push(`</g>`);
  F.forEach((f, i) => {
    const [x, y, a] = ROUTE_LAB[f];
    out.push(`<text class="hm-route-label"${timed('label', LABELS_AT + 0.05 * i, { style: `--c:var(--st-${f})` })} x="${x}" y="${y}" text-anchor="${a}">${L.routes[f]}</text>`);
  });

  // pillars: raised pucks on their platforms where each route begins; drawn
  // after the routes so each route starts under its puck
  F.forEach((f, i) => {
    const [x, y] = PILLAR[f];
    const top = y < C[1];
    out.push(`<g class="hm-pillar"${swirl(PILLAR[f], 0.6, 75, 0, `--c:var(--st-${f})`)}><circle class="hm-pillar-edge" cx="${x}" cy="${y + 4}" r="24"/><circle class="hm-pillar-top" cx="${x}" cy="${y}" r="24"/><circle class="hm-pillar-ring" cx="${x}" cy="${y}" r="15"/><circle class="hm-pillar-c" cx="${x}" cy="${y}" r="5.5"/></g>`);
    out.push(`<text class="hm-pname"${timed('label', LABELS_AT - 0.1 + i * 0.05, { style: `--c:var(--st-${f})` })} x="${x}" y="${top ? y - 33 : y + 43}" text-anchor="middle">${L.pillars[f]}</text>`);
  });

  // cap: the outcome, rings around the core
  out.push(slab('hm-slab hm-cap', CAP.h, CAP.rx, CAP.t, timed('spin', 0.9, { dur: 1.6, s: 0.3, rot: 70 })));
  out.push(`<g class="hm-mark"${timed('pop', 1.45, { dur: 1.0, s: 0.7 })}>
  <circle class="hm-ring hm-ring--outer" cx="${C[0]}" cy="${C[1]}" r="148"/>
  <circle class="hm-ring hm-ring--mid" cx="${C[0]}" cy="${C[1]}" r="96"/>
  <circle class="hm-ring hm-ring--gold" cx="${C[0]}" cy="${C[1]}" r="35"/>
  <circle class="hm-core" cx="${C[0]}" cy="${C[1]}" r="30"/>
  ${coreText(L.core)}
</g>`);
  out.push(`<rect class="hm-fade" width="400" height="460"/>`);
  out.push(`</svg>`);
  return out.join('\n');
}

// The CSS that plays the motion and styles the pause control. Written between
// the hero-entry markers in both homepages, so English and Spanish cannot
// drift apart.
const ENTRY_CSS = `/* hero-entry:start (written by scripts/build_hero_map.mjs; edit it there) */
    .hm { --t0: 0.3s; }
    .hm .hm-route { fill: none; stroke: var(--c); stroke-width: 1.6; stroke-linecap: round; opacity: 0.85; stroke-dasharray: 1; }

    /* entry */
    .hm [data-in] {
      transform-box: fill-box; transform-origin: center;
      animation-duration: var(--dur, 0.5s);
      animation-delay: calc(var(--t0) + var(--e, 0s));
      animation-timing-function: var(--ease, cubic-bezier(0.2, 0.8, 0.2, 1));
      animation-fill-mode: backwards;
    }
    .hm [data-in="fade"]  { animation-name: hmFade; }
    .hm [data-in="label"] { animation-name: hmFade; animation-duration: 0.9s; animation-timing-function: ease; }
    .hm [data-in="pop"]   { animation-name: hmPop; --ease: cubic-bezier(0.22, 1, 0.36, 1); }
    .hm [data-in="draw"]  { animation-name: hmDraw; --ease: cubic-bezier(0.33, 1, 0.68, 1); }
    /* the slabs and the cap grow from small and spin into place */
    .hm [data-in="spin"] {
      animation-name: hmSpin, hmAppear;
      animation-duration: var(--dur), calc(var(--dur) * 0.4);
      animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1), ease-out;
    }
    /* the knot turns round the map's centre, so swirling parts use the view box */
    .hm [data-in="swirl"] {
      transform-box: view-box; transform-origin: 200px 230px;
      animation-name: hmSwirl, hmAppear;
      animation-duration: var(--sd), calc(var(--sd) * 0.35);
      animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1), ease-out;
    }
    .hm [data-in="swirl"][data-draw] {
      animation-name: hmSwirl, hmAppear, hmDraw;
      animation-duration: var(--sd), calc(var(--sd) * 0.35), var(--sd);
      animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1), ease-out, cubic-bezier(0.33, 1, 0.68, 1);
      stroke-dasharray: 1;
    }
    /* phones: the small parts arrive as one group, without the knot */
    .hm [data-in][data-solo] { animation-name: none; }
    @media (min-width: 1151px) {
      .hm .hm-fine[data-in] { animation-name: none; }
      .hm [data-in="swirl"][data-solo] { animation-name: hmSwirl, hmAppear; }
      .hm [data-in="swirl"][data-solo][data-draw] { animation-name: hmSwirl, hmAppear, hmDraw; }
    }
    @keyframes hmFade   { from { opacity: 0; } }
    @keyframes hmAppear { from { opacity: 0; } }
    @keyframes hmPop    { from { opacity: 0; transform: scale(var(--s, 0.4)); } }
    @keyframes hmSpin   { from { transform: rotate(var(--rot)) scale(var(--s)); } }
    @keyframes hmDraw   { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    /* one spiral, eased out: from the turned knot to its place, no stop on the way */
    @keyframes hmSwirl {
      from { transform: rotate(var(--sw0)) translate(var(--x), var(--y)) translate(var(--px), var(--py)) rotate(var(--r)) translate(var(--nx), var(--ny)); }
      to   { transform: rotate(0deg) translate(0px, 0px) translate(var(--px), var(--py)) rotate(0deg) translate(var(--nx), var(--ny)); }
    }

    /* loop: satellites and specks sway round their pillar and back, like a
       pendulum; labels turn back against the sway to stay level */
    .hm .hm-sway {
      transform-box: view-box; transform-origin: var(--ox) var(--oy);
      animation: hmSway var(--per) ease-in-out var(--ph) infinite alternate;
    }
    .hm .hm-upright {
      transform-box: fill-box; transform-origin: center;
      animation: hmUpright var(--per) ease-in-out var(--ph) infinite alternate;
    }
    @keyframes hmSway    { from { transform: rotate(calc(var(--amp) * -1)); } to { transform: rotate(var(--amp)); } }
    @keyframes hmUpright { from { transform: rotate(var(--amp)); } to { transform: rotate(calc(var(--amp) * -1)); } }
    @media (max-width: 1150px) { .hm { --t0: 0.7s; } }

    /* pause control, two attributes on <html>: data-motion="paused" freezes
       every motion where it is; data-motion-skip (a pause chosen on an
       earlier visit) skips the entry for this visit, so the map opens
       finished and resuming plays only the loop */
    [data-motion="paused"] .hm *, .v4-hero-illo.is-off .hm * { animation-play-state: paused !important; }
    [data-motion-skip] .hm [data-in] { animation: none !important; }
    .v4-motion {
      display: inline-flex; align-items: center; gap: var(--sp-2);
      min-height: 2.25rem; padding: var(--sp-1) var(--sp-3);
      margin-left: auto; align-self: flex-end;
      font-family: var(--font-body); font-size: var(--text-xs); letter-spacing: 0.04em;
      color: var(--text-tertiary); background: none;
      border: 1px solid var(--border-default); border-radius: 999px; cursor: pointer;
      transition: color var(--ease-fast), border-color var(--ease-fast);
    }
    .v4-motion:hover { color: var(--text-primary); border-color: var(--border-strong); }
    .v4-motion:focus-visible { outline: 2px solid var(--teal); outline-offset: 3px; }
    .v4-motion-icon { width: 10px; height: 10px; flex: none; position: relative; }
    .v4-motion-icon::before, .v4-motion-icon::after {
      content: ''; position: absolute; top: 0; width: 3px; height: 10px; border-radius: 1px; background: currentColor;
    }
    .v4-motion-icon::before { left: 1px; }
    .v4-motion-icon::after  { right: 1px; }
    .v4-motion[data-paused] .v4-motion-icon::before {
      left: 1px; width: 0; height: 0; border-radius: 0; background: none;
      border-style: solid; border-width: 5px 0 5px 9px; border-color: transparent transparent transparent currentColor;
    }
    .v4-motion[data-paused] .v4-motion-icon::after { display: none; }
    @media (max-width: 1150px) { .v4-motion { margin-left: 0; align-self: flex-start; } }

    @media (prefers-reduced-motion: reduce) {
      .hm [data-in], .hm .hm-sway, .hm .hm-upright { animation: none !important; }
      .v4-motion { display: none; }
    }
    /* hero-entry:end */`;

for (const [file, lang] of [['src/index.html', 'en'], ['src/es/index.html', 'es']]) {
  let s = readFileSync(file, 'utf8');
  const re = /(<!-- hero-map:start -->)[\s\S]*?(<!-- hero-map:end -->)/;
  if (!re.test(s)) throw new Error(`${file}: hero-map markers not found`);
  s = s.replace(re, `$1\n${svg(lang)}\n        $2`);
  const css = /\/\* hero-entry:start[\s\S]*?hero-entry:end \*\//;
  if (!css.test(s)) throw new Error(`${file}: hero-entry markers not found`);
  s = s.replace(css, () => ENTRY_CSS);
  writeFileSync(file, s);
  console.log(`${file}: hero map written`);
}
