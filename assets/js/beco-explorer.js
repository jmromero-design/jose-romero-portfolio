/* ============================================================
   BECO EXPLORER — the knowledge graph as one page: a zoomable map
   and a column of cards that read it. Picking anything in either
   moves the other: a card flies the map there, a dot on the map
   opens its card. Shared by /thinking/beco-explorer/ and its Spanish
   twin (a copy of the BECO lab's file, with the data paths taken from
   BGX_STRINGS.dataDir and .graphUrl); each page supplies its wording in
   window.BGX_STRINGS.

   Data: assets/data/beco-graph/graph.json (nodes with precomputed
   positions, built by scripts/generate_beco_graph_data.py). A concept's
   full detail loads from assets/data/beco-explorer/biases/<id>.json
   only when its card opens.
   ============================================================ */
(function () {
  'use strict';

  const S = window.BGX_STRINGS;
  const app = document.getElementById('bgxApp');
  const stage = document.getElementById('bgxStage');
  const canvas = document.getElementById('bgxCanvas');
  if (!S || !app || !stage || !canvas) return;
  const ctx = canvas.getContext('2d');
  const body = document.getElementById('bgxBody');
  const crumbs = document.getElementById('bgxCrumbs');
  const statsEl = document.getElementById('bgxStats');
  const searchInput = document.getElementById('bgxSearch');
  const colEl = document.getElementById('bgxCol');
  const statusEl = document.getElementById('bgxStatus');
  const panelBtn = document.getElementById('bgxPanel');
  const helpEl = document.getElementById('bgxHelp');
  const resizer = document.getElementById('bgxResize');
  // optional: a page can supply its own starting card (the lab's welcome) as a <template>
  const welcomeTpl = document.getElementById('bgxWelcome');
  const hintEl = document.getElementById('bgxHint');
  const peek = document.getElementById('bgxPeek');
  const gradeBtns = Array.from(document.querySelectorAll('[data-grade]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)');
  // phones and narrow tablets: cards first, the map as a preview above them
  const stacked = window.matchMedia('(max-width: 900px)');

  // Types in ring order, centre outward. Rank is the index.
  const CLUSTER = 0, DOMAIN = 1, TOPIC = 2, CONCEPT = 3, FINDING = 4, APP = 5, SOURCE = 6, AUTHOR = 7;
  const BASE_R = [7, 5, 2.6, 3.4, 1.5, 1.5, 1.8, 1.1];

  let N = 0, X, Y, T, R, label, extra, adj, relAdj, edges, rel, byType, byId;
  let below = new Map();          // node → concepts beneath it, for counts and bars
  let theme = {};
  const cam = { x: 0, y: 0, k: 1 };
  let W = 0, H = 0, dpr = 1, fitK = 1;
  let hover = -1, current = -1, grade = null, focus = null;
  // a specialty (lab only): a named set of starting concepts, lit like a filter
  let spec = null, specs = [], specById = new Map();
  let statsText = '';
  // the lab leaves authors off the map (they stay in the cards); their ring is the
  // busiest and says the least, so the map's edge moves in to the sources
  const showAuthors = !S.hideAuthors;
  const OUT = showAuthors ? 1040 : 925;     // world radius of the rim ticks
  const hidden = (i) => !showAuthors && T[i] === AUTHOR;
  // colour by group: each node takes the hue of the group it sits under (sources and
  // authors stay neutral); the page supplies the hues as --g1..--g8
  let slotOf = null;                      // node → hue slot 0..7, or -1
  let needsDraw = true;

  /* ── theme: every colour comes from the page's tokens ── */
  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    theme = {
      bg: v('--bg-base'), text1: v('--text-primary'), text2: v('--text-secondary'), text3: v('--text-tertiary'),
      border: v('--border-default'), borderStrong: v('--border-strong'),
      teal: v('--teal'), tealText: v('--teal-text'), gold: v('--gold'),
      body: v('--font-body') || 'sans-serif', display: v('--font-display') || 'serif',
    };
    // partial backing: teal pulled halfway to the page background, as on the homepage
    theme.partial = mix(theme.teal, theme.bg, 0.5);
    const g = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => v('--g' + n));
    theme.groups = g.every(Boolean) ? g.map((c) => ({ full: c, half: mix(c, theme.bg, 0.5), soft: mix(c, theme.bg, 0.45), topic: mix(c, theme.bg, 0.25) })) : null;
    needsDraw = true;
  }
  function mix(a, b, t) {
    const rgb = (h) => { const m = h.replace('#', ''); const s = m.length === 3 ? m.replace(/./g, '$&$&') : m; return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)); };
    try { const A = rgb(a), B = rgb(b); return `rgb(${A.map((v, i) => Math.round(v * (1 - t) + B[i] * t)).join(',')})`; } catch (e) { return a; }
  }

  /* ── data ── */
  function load(data) {
    const nodes = data.nodes;
    N = nodes.length;
    X = new Float32Array(N); Y = new Float32Array(N); T = new Uint8Array(N); R = new Float32Array(N);
    label = new Array(N); extra = new Array(N);
    adj = Array.from({ length: N }, () => []);
    relAdj = Array.from({ length: N }, () => []);
    byType = Array.from({ length: 8 }, () => []);
    byId = new Map();
    nodes.forEach((n, i) => {
      T[i] = n[0]; X[i] = n[1]; Y[i] = n[2]; label[i] = n[3]; extra[i] = n[4] || {};
      byType[T[i]].push(i);
      if (extra[i].id) byId.set(extra[i].id, i);
    });
    edges = data.edges; rel = data.rel;
    for (let i = 0; i < edges.length; i += 2) { adj[edges[i]].push(edges[i + 1]); adj[edges[i + 1]].push(edges[i]); }
    for (let i = 0; i < rel.length; i += 2) { relAdj[rel[i]].push(rel[i + 1]); relAdj[rel[i + 1]].push(rel[i]); }
    for (let i = 0; i < N; i++) {
      let r = BASE_R[T[i]];
      if (T[i] === CONCEPT) r += Math.sqrt((extra[i].f || 0) + (extra[i].a || 0)) * 0.7;
      if (T[i] === TOPIC || T[i] === SOURCE) r += Math.min(2, adj[i].length * 0.12);
      R[i] = r;
    }
    for (const t of [CLUSTER, DOMAIN, TOPIC]) for (const i of byType[t]) below.set(i, conceptsUnder(i));
    // hues go round the dial in an alternating order, so neighbouring groups never get neighbouring hues
    const ORDER = [0, 4, 1, 5, 2, 6, 3, 7];
    const slot = new Map();
    byType[CLUSTER].slice().sort((a, b) => Math.atan2(Y[a], X[a]) - Math.atan2(Y[b], X[b])).forEach((c, k) => slot.set(c, ORDER[k % 8]));
    slotOf = new Int8Array(N).fill(-1);
    for (let i = 0; i < N; i++) {
      if (T[i] >= SOURCE) continue;
      const root = T[i] === CLUSTER ? i : chain(i)[0];
      if (root != null && slot.has(root)) slotOf[i] = slot.get(root);
    }
    // names sort the way people expect, not by file order
    for (const t of [CLUSTER, DOMAIN, TOPIC, CONCEPT]) byType[t].sort((a, b) => label[a].localeCompare(label[b]));
    // the database totals when the export carries them; the node counts above double-count a finding cited under more than one concept
    const tot = data.totals;
    statsText = tot ? S.stats(tot.biases, tot.findings, tot.sources, tot.authors)
      : S.stats(byType[CONCEPT].length, byType[FINDING].length, byType[SOURCE].length, byType[AUTHOR].length);
    if (statsEl) statsEl.textContent = statsText;
    buildGrid();
  }
  function conceptsUnder(i) {
    const out = [], seen = new Set([i]), stack = [i];
    while (stack.length) {
      const n = stack.pop();
      for (const m of adj[n]) if (T[m] > T[n] && T[m] <= CONCEPT && !seen.has(m)) { seen.add(m); stack.push(m); if (T[m] === CONCEPT) out.push(m); }
    }
    return out;
  }

  /* ── hit testing: a coarse grid over world space ── */
  const CELL = 40; let grid = new Map();
  function buildGrid() {
    grid = new Map();
    for (let i = 0; i < N; i++) {
      const key = Math.floor(X[i] / CELL) + ',' + Math.floor(Y[i] / CELL);
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(i);
    }
  }
  function nodeAt(sx, sy) {
    const wx = (sx - W / 2) / cam.k + cam.x, wy = (sy - H / 2) / cam.k + cam.y;
    const reach = coarse.matches ? 14 : 8;            // screen pixels
    const span = Math.ceil((reach + 12) / cam.k / CELL);
    let best = -1, bestD = Infinity;
    const cx = Math.floor(wx / CELL), cy = Math.floor(wy / CELL);
    for (let gx = cx - span; gx <= cx + span; gx++) for (let gy = cy - span; gy <= cy + span; gy++) {
      const cell = grid.get(gx + ',' + gy); if (!cell) continue;
      for (const i of cell) {
        if ((focus && !focus.has(i)) || hidden(i)) continue;
        const d = Math.hypot(X[i] - wx, Y[i] - wy) * cam.k - screenR(i);
        // favour the more important node when two are equally close
        const score = d - (7 - T[i]) * 0.6;
        if (d < reach && score < bestD) { bestD = score; best = i; }
      }
    }
    return best;
  }

  /* ── focus: what a node connects to, up to the centre and out to the edge ── */
  function focusOf(i) {
    const set = new Set([i]);
    const up = [i], down = [i];
    while (up.length) {
      const n = up.pop();
      for (const m of adj[n]) if (T[m] < T[n] && !set.has(m)) { set.add(m); up.push(m); }
    }
    while (down.length) {
      const n = down.pop();
      for (const m of adj[n]) if (T[m] > T[n] && !set.has(m)) { set.add(m); down.push(m); }
    }
    if (T[i] === CONCEPT) for (const m of relAdj[i]) set.add(m);
    return set;
  }
  function gradeFocus(g) {
    const set = new Set();
    for (const i of byType[CONCEPT]) if (extra[i].g === g) focusOf(i).forEach((m) => set.add(m));
    return set;
  }

  /* ── camera ── */
  function resize() {
    const box = stage.getBoundingClientRect();
    if (!box.width || !box.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = box.width; H = box.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const prevFit = fitK, wasHome = cam.k === prevFit;
    // leave room round the rim for the cluster names on either side
    const room = rimOn() ? Math.min(H * 0.41, W / 2 - rimWidth()) : Math.min(H * 0.44, W * 0.47);
    fitK = Math.max(60, room) / (OUT + 60);
    if (wasHome || !cam.k) { cam.k = fitK; cam.x = 0; cam.y = 0; }
    needsDraw = true;
  }
  // width the longest cluster name needs beyond the rim
  let rimW = 0;
  const RIM_FONT = () => `600 10.5px ${theme.body}`;
  // long names break after the "&", or at the space nearest the middle
  function rimLines(name) {
    const t = name.toUpperCase();
    const amp = t.indexOf(' & ');
    if (t.length < 18) return [t];
    if (amp > 4) return [t.slice(0, amp + 2), t.slice(amp + 3)];
    const mid = t.length / 2, cut = [...t].reduce((b, ch, i) => (ch === ' ' && Math.abs(i - mid) < Math.abs(b - mid) ? i : b), -1);
    return cut > 0 ? [t.slice(0, cut), t.slice(cut + 1)] : [t];
  }
  function rimWidth() {
    if (!rimW && N) {
      ctx.font = RIM_FONT(); ctx.letterSpacing = '1.4px';
      for (const i of byType[CLUSTER]) rimLines(label[i]).forEach((l) => { rimW = Math.max(rimW, ctx.measureText(l).width); });
      ctx.letterSpacing = '0px';
      rimW += 44;
    }
    return rimW || 200;
  }
  // narrow maps have no room beside them for the names
  const rimOn = () => W >= 640;
  const clampK = (k) => Math.max(fitK * 0.6, Math.min(fitK * 14, k));
  function zoomAt(sx, sy, factor) {
    const k = clampK(cam.k * factor);
    const wx = (sx - W / 2) / cam.k + cam.x, wy = (sy - H / 2) / cam.k + cam.y;
    cam.k = k;
    cam.x = wx - (sx - W / 2) / k; cam.y = wy - (sy - H / 2) / k;
    needsDraw = true;
  }
  let flight = null;
  function flyTo(x, y, k) {
    const from = { ...cam }, to = { x, y, k: clampK(k) };
    if (reduceMotion) { Object.assign(cam, to); needsDraw = true; return; }
    flight = { from, to, start: performance.now(), dur: 700 };
    needsDraw = true;
  }
  const home = () => flyTo(0, 0, fitK);
  function flyToNode(i) {
    if (hidden(i)) return fitTo(adj[i].filter((j) => T[j] === SOURCE));
    const k = Math.max(cam.k, fitK * ({ 0: 1.7, 1: 2.3, 2: 3.2, 3: 3.4 }[T[i]] || 5));
    // full-screen map on phones: the peek bar covers the bottom, so lift the node
    const lift = app.classList.contains('is-exploring') ? (H * 0.12) / k : 0;
    flyTo(X[i], Y[i] + lift, k);
  }

  /* ── drawing ── */
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  // nodes grow as you zoom in, but more slowly than the map, so detail opens
  // up; a smaller map gets proportionally smaller dots
  function screenR(i) { return R[i] * Math.max(0.6, Math.min(1, Math.sqrt(fitK / 0.35))) * Math.max(0.7, Math.min(2.6, Math.sqrt(cam.k / fitK))); }

  function draw(now) {
    if (flight) {
      const t = Math.min(1, (now - flight.start) / flight.dur), e = ease(t);
      cam.x = flight.from.x + (flight.to.x - flight.from.x) * e;
      cam.y = flight.from.y + (flight.to.y - flight.from.y) * e;
      cam.k = flight.from.k * Math.pow(flight.to.k / flight.from.k, e);
      if (t >= 1) flight = null;
      needsDraw = true;
    }
    if (needsDraw && N && W) { needsDraw = !!flight; paint(); }
    requestAnimationFrame(draw);
  }

  function paint() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const k = cam.k, ox = W / 2 - cam.x * k, oy = H / 2 - cam.y * k;
    const sx = (i) => X[i] * k + ox, sy = (i) => Y[i] * k + oy;
    const active = focus;

    // edges: one path per style, so a few thousand lines cost a few strokes
    const zoomed = k / fitK;
    const G = theme.groups;
    ctx.lineWidth = 1;
    const shown = (a, b) => !hidden(a) && !hidden(b);
    const strokeEdges = (color, alpha, pick) => {
      ctx.beginPath();
      for (let e = 0; e < edges.length; e += 2) {
        const a = edges[e], b = edges[e + 1];
        if (!shown(a, b) || !pick(a, b)) continue;
        ctx.moveTo(sx(a), sy(a)); ctx.lineTo(sx(b), sy(b));
      }
      ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.stroke();
    };
    const inner = (a, b) => Math.max(T[a], T[b]) <= CONCEPT;
    if (active) {
      strokeEdges(theme.border, 0.14, (a, b) => !(active.has(a) && active.has(b)) && (inner(a, b) || zoomed > 2));
      if (G) {
        // lit edges take the hue of their group, so a path reads back to where it starts
        const by = new Map();
        for (let e = 0; e < edges.length; e += 2) {
          const a = edges[e], b = edges[e + 1];
          if (!shown(a, b) || !(active.has(a) && active.has(b))) continue;
          const sl = slotOf[T[a] > T[b] && slotOf[a] >= 0 ? a : slotOf[b] >= 0 ? b : a];
          const c = sl >= 0 ? G[sl].full : theme.text2;
          if (!by.has(c)) by.set(c, []);
          by.get(c).push(a, b);
        }
        for (const [c, list] of by) {
          ctx.beginPath();
          for (let n = 0; n < list.length; n += 2) { ctx.moveTo(sx(list[n]), sy(list[n])); ctx.lineTo(sx(list[n + 1]), sy(list[n + 1])); }
          ctx.strokeStyle = c; ctx.globalAlpha = 0.6; ctx.stroke();
        }
      } else strokeEdges(theme.tealText, 0.55, (a, b) => active.has(a) && active.has(b));
    } else {
      strokeEdges(theme.borderStrong, 0.55, inner);
      strokeEdges(theme.border, zoomed > 1.6 ? 0.7 : 0.45, (a, b) => !inner(a, b));
    }
    // related concepts: the cross-links that make it a network
    ctx.beginPath();
    for (let e = 0; e < rel.length; e += 2) {
      const a = rel[e], b = rel[e + 1];
      if (active && !(active.has(a) && active.has(b))) continue;
      const mx = (sx(a) + sx(b)) / 2, my = (sy(a) + sy(b)) / 2;
      // bow toward the map's centre, so cross-links read as arcs through it
      ctx.moveTo(sx(a), sy(a)); ctx.quadraticCurveTo(mx + (ox - mx) * 0.18, my + (oy - my) * 0.18, sx(b), sy(b));
    }
    // with hues on the nodes the arcs step back to a neutral line
    ctx.strokeStyle = G ? theme.text2 : theme.teal; ctx.globalAlpha = active ? 0.6 : G ? 0.12 : 0.16; ctx.stroke();

    // nodes: one path per colour, lit and dimmed apart, back to front by rank;
    // whatever falls outside the lit set loses its hue and fades to grey
    const onScreen = (x, y) => x > -20 && y > -20 && x < W + 20 && y < H + 20;
    const circles = (ids) => { ctx.beginPath(); for (const i of ids) { const x = sx(i), y = sy(i), r = screenR(i); ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); } };
    const dash = (color) => { ctx.setLineDash([2, 2]); ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]); };
    // colorOf gives the fill; outline nodes are filled with the page and drawn with a dashed line instead
    const batch = (list, alpha, colorOf, outline) => {
      const lit = new Map(), dim = [];
      for (const i of list) {
        if (hidden(i) || !onScreen(sx(i), sy(i))) continue;
        if (active && !active.has(i)) { dim.push(i); continue; }
        const c = colorOf(i);
        if (!lit.has(c)) lit.set(c, []);
        lit.get(c).push(i);
      }
      if (dim.length) {
        circles(dim); ctx.globalAlpha = alpha * 0.12;
        if (outline) { ctx.fillStyle = theme.bg; ctx.fill(); dash(theme.text3); } else { ctx.fillStyle = theme.text3; ctx.fill(); }
      }
      for (const [c, ids] of lit) {
        circles(ids); ctx.globalAlpha = alpha;
        if (outline) { ctx.fillStyle = theme.bg; ctx.fill(); dash(c); } else { ctx.fillStyle = c; ctx.fill(); }
      }
    };
    const hue = (i, tone, plain) => (G && slotOf[i] >= 0 ? G[slotOf[i]][tone] : plain);
    const concepts = byType[CONCEPT];
    if (showAuthors) batch(byType[AUTHOR], 0.55, () => theme.text3);
    batch(byType[SOURCE], 1, () => theme.borderStrong);
    batch(byType[APP].concat(byType[FINDING]), 0.8, (i) => hue(i, 'soft', theme.text3));
    batch(concepts.filter((i) => extra[i].g === 'v'), 1, (i) => hue(i, 'full', theme.teal));
    batch(concepts.filter((i) => extra[i].g === 'p'), 1, (i) => hue(i, 'half', theme.partial));
    batch(concepts.filter((i) => extra[i].g === 'n'), 1, (i) => hue(i, 'full', theme.text2), true);
    // concepts often repeated as myths carry a ring in the accent
    ctx.beginPath();
    for (const i of concepts) {
      if (extra[i].m !== 'high' || (active && !active.has(i))) continue;
      const x = sx(i), y = sy(i), r = screenR(i) + 2.2; if (!onScreen(x, y)) continue;
      ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
    }
    ctx.globalAlpha = 1; ctx.strokeStyle = theme.gold; ctx.lineWidth = 1.1; ctx.stroke();
    batch(byType[TOPIC], 1, (i) => hue(i, 'topic', theme.text3));
    batch(byType[DOMAIN], 1, (i) => hue(i, 'full', theme.text2));
    for (const i of byType[CLUSTER]) {
      const x = sx(i), y = sy(i), r = screenR(i);
      const c = hue(i, 'full', theme.text1);
      ctx.globalAlpha = active && !active.has(i) ? 0.1 : 1;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = theme.bg; ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, Math.PI * 2); ctx.fillStyle = c; ctx.fill();
    }
    // the node in hand, and the one under the pointer
    for (const i of [current, hover]) {
      if (i < 0 || hidden(i)) continue;
      ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(sx(i), sy(i), screenR(i) + 4, 0, Math.PI * 2);
      ctx.strokeStyle = theme.text1; ctx.lineWidth = 1.2; ctx.stroke();
    }

    drawRim(ox, oy);
    drawLabels(sx, sy);
    ctx.globalAlpha = 1;
  }

  // Cluster names round the rim, at the angle their own concepts sit, so the
  // overview reads like a dial. They move onto their hubs once you zoom in.
  let rim = [];
  function drawRim(ox, oy) {
    rim = [];
    if (!rimOn() || cam.k / fitK > 2.2) return;
    ctx.font = RIM_FONT();
    ctx.letterSpacing = '1.4px';
    ctx.textBaseline = 'middle';
    // place every name, then push apart any on the same side that overlap
    const items = byType[CLUSTER].map((i) => {
      const a = Math.atan2(Y[i], X[i]), c = Math.cos(a), sn = Math.sin(a);
      const lines = rimLines(label[i]);
      const w = Math.max(...lines.map((l) => ctx.measureText(l).width));
      return { i, c, sn, lines, w, h: lines.length * 14, side: c >= 0 ? 1 : -1, y: sn * (OUT + 45) * cam.k + oy };
    });
    for (const side of [1, -1]) {
      const col = items.filter((it) => it.side === side).sort((p, q) => p.y - q.y);
      for (let n = 1; n < col.length; n++) col[n].y = Math.max(col[n].y, col[n - 1].y + (col[n - 1].h + col[n].h) / 2 + 8);
    }
    for (const it of items) {
      const { i, c, sn, lines, w } = it;
      const x = c * (OUT + 45) * cam.k + ox;
      const col = theme.groups && slotOf[i] >= 0 ? theme.groups[slotOf[i]].full : theme.tealText;
      const lx = it.side > 0 ? x : x - w, ly = it.y - (lines.length - 1) * 7;
      ctx.globalAlpha = focus && !focus.has(i) ? 0.3 : 1;
      // a short tick from the rim toward the name
      ctx.beginPath();
      ctx.moveTo(c * OUT * cam.k + ox, sn * OUT * cam.k + oy);
      ctx.lineTo(c * (OUT + 30) * cam.k + ox, sn * (OUT + 30) * cam.k + oy);
      ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke();
      ctx.textAlign = it.side > 0 ? 'left' : 'right';
      const ax = it.side > 0 ? lx : lx + w;
      lines.forEach((l, n) => {
        ctx.lineWidth = 3.5; ctx.strokeStyle = theme.bg; ctx.lineJoin = 'round';
        ctx.strokeText(l, ax, ly + n * 14);
        ctx.fillStyle = i === hover || i === current ? theme.text1 : col;
        ctx.fillText(l, ax, ly + n * 14);
      });
      ctx.textAlign = 'left';
      rim.push([i, lx - 4, ly - 10, w + 8, it.h + 6]);
    }
    ctx.letterSpacing = '0px';
  }
  const rimAt = (x, y) => { for (const b of rim) if (x >= b[1] && x <= b[1] + b[3] && y >= b[2] && y <= b[2] + b[4]) return b[0]; return -1; };

  // Labels: domains once there's room, concepts and the rest as you zoom in,
  // biggest first, never overlapping.
  function drawLabels(sx, sy) {
    const z = cam.k / fitK;
    const taken = [];
    const fits = (x, y, w, h) => {
      for (const b of taken) if (x < b[0] + b[2] && x + w > b[0] && y < b[1] + b[3] && y + h > b[1]) return false;
      taken.push([x, y, w, h]); return true;
    };
    const want = (i) => {
      const t = T[i];
      if (hidden(i)) return false;
      if (t === CLUSTER && z <= 2.2 && rimOn()) return false;   // named on the rim instead
      // with something lit, name what it holds; evidence only once you are close
      if (focus) return focus.has(i) && (t <= CONCEPT || z > 4.5 || i === current || i === hover || adj[current]?.includes(i) || !!query);
      if (i === hover) return true;
      return (t === CLUSTER && (z > 2.2 || (!rimOn() && z > 1.4))) || (t === DOMAIN && z > 1.25) || (t === CONCEPT && z > 2.1) || (t === TOPIC && z > 4) || (t >= FINDING && z > 7);
    };
    const order = [];
    for (let i = 0; i < N; i++) if (want(i)) order.push(i);
    order.sort((a, b) => (b === hover || b === current) - (a === hover || a === current) || T[a] - T[b] || R[b] - R[a]);
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 1;
    for (const i of order) {
      const t = T[i];
      const x = sx(i), y = sy(i);
      if (x < -50 || y < -20 || x > W + 50 || y > H + 20) continue;
      const big = t === CLUSTER;
      const size = big ? 11 : t === DOMAIN || t === CONCEPT ? 12 : 10.5;
      ctx.font = big ? `600 ${size}px ${theme.body}` : t === DOMAIN ? `italic 500 ${size + 1}px ${theme.display}` : `${t === CONCEPT ? 500 : 400} ${size}px ${theme.body}`;
      let text = big ? label[i].toUpperCase() : label[i];
      if (text.length > 42) text = text.slice(0, 40) + '…';
      ctx.letterSpacing = big ? '1.6px' : '0px';
      const w = ctx.measureText(text).width;
      const rr = screenR(i);
      const lx = big ? x - w / 2 : x + rr + 5, ly = big ? y - rr - 12 : y;
      if (!fits(lx - 3, ly - size / 2 - 2, w + 6, size + 4) && i !== current && i !== hover) continue;
      // a halo in the page colour keeps text legible over lines
      ctx.lineWidth = 3.5; ctx.strokeStyle = theme.bg; ctx.lineJoin = 'round';
      ctx.strokeText(text, lx, ly);
      ctx.fillStyle = big ? (theme.groups && slotOf[i] >= 0 ? theme.groups[slotOf[i]].full : theme.tealText) : t === CONCEPT || t === DOMAIN ? theme.text1 : theme.text2;
      ctx.fillText(text, lx, ly);
    }
    ctx.letterSpacing = '0px';
  }

  /* ── where a node sits: the chain of crumbs back to the clusters ── */
  function parentOf(i) {
    const t = T[i];
    const up = (type) => adj[i].find((j) => T[j] === type);
    if (t === CLUSTER) return -1;
    if (t === DOMAIN) return up(CLUSTER) ?? -1;
    if (t === TOPIC) return up(DOMAIN) ?? -1;
    if (t === CONCEPT) return up(TOPIC) ?? -1;
    if (t === FINDING) return up(CONCEPT) ?? up(TOPIC) ?? -1;
    if (t === APP) return up(CONCEPT) ?? -1;
    if (t === SOURCE) { const f = up(FINDING); return f == null ? -1 : parentOf(f); }
    if (t === AUTHOR) return up(SOURCE) ?? -1;
    return -1;
  }
  function chain(i) {
    const out = [];
    for (let n = i, guard = 0; n !== -1 && guard < 12; n = parentOf(n), guard++) out.unshift(n);
    return out;
  }

  /* ── address: the card explorer's links keep working ── */
  function hashFor(i) {
    if (i === -1) return '';
    const path = chain(i).filter((j) => T[j] >= DOMAIN && T[j] <= CONCEPT);
    if (T[i] === CLUSTER) return '#cluster/' + extra[i].id;
    if (!path.length || T[i] > CONCEPT) return null;     // evidence keeps its concept's address
    return '#' + path.map((j) => ({ 1: 'domain', 2: 'topic', 3: 'bias' }[T[j]] + '/' + extra[j].id)).join('/');
  }
  function fromHash() {
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (parts[0] === 'grade' && parts[1]) return { grade: parts[1] };
    if (parts[0] === 'especialidad' && parts[1]) return { spec: parts[1] };
    if (parts[0] === 'buscar' && parts[1]) return { q: decodeURIComponent(parts.slice(1).join('/')) };
    const id = parts[parts.length - 1];
    return { node: id && byId.has(id) ? byId.get(id) : -1 };
  }

  /* ── navigation: one call moves the map and the cards together ── */
  function go(i, opts = {}) {
    if (query) endSearch();
    if (i !== -1 && opts.open !== false) setPanel(true);
    current = i;
    grade = null; spec = null;
    gradeBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    focus = i === -1 ? null : focusOf(i);
    renderCrumbs();
    renderCard(i);
    if (opts.fly !== false) { if (i === -1) home(); else flyToNode(i); }
    if (opts.push !== false) {
      const h = hashFor(i);
      if (h !== null && h !== location.hash) history.pushState(null, '', h || location.pathname);
    }
    if (app.classList.contains('is-exploring')) showPeek(i);
    needsDraw = true;
  }
  function goGrade(g, opts = {}) {
    if (grade === g) return go(-1, opts);
    if (query) endSearch();
    setPanel(true);
    current = -1;
    grade = g; spec = null;
    focus = gradeFocus(g);
    gradeBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.grade === g)));
    renderCrumbs();
    renderGrade(g);
    if (opts.fly !== false) home();
    if (opts.push !== false) history.pushState(null, '', '#grade/' + g);
    needsDraw = true;
  }

  function goSpec(id, opts = {}) {
    const s = specById.get(id);
    if (!s) return go(-1, opts);
    if (query) endSearch();
    setPanel(true);
    current = -1; grade = null; spec = s;
    gradeBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    const list = s.concepts.map((c) => byId.get(c.id)).filter((j) => j != null);
    // the starting concepts and their path to the centre, so the map names only those
    focus = new Set();
    list.forEach((i) => chain(i).forEach((m) => focus.add(m)));
    renderCrumbs();
    renderSpec(s, list);
    if (opts.fly !== false) fitTo(list);
    if (opts.push !== false) history.pushState(null, '', '#especialidad/' + s.id);
    if (app.classList.contains('is-exploring')) showPeek(-1);
    needsDraw = true;
  }
  // the address of whatever is open, for going back to it after a search
  const stateHash = (b) => (b.spec ? '#especialidad/' + b.spec.id : b.grade ? '#grade/' + b.grade : hashFor(b.node));

  /* ── the column: crumbs and cards ── */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hueVar = (j) => (theme.groups && slotOf && slotOf[j] >= 0 ? ` style="--hue: var(--g${slotOf[j] + 1})"` : '');
  const dot = (j) => `<span class="bgx-dot bgx-dot--${S.typeKey[T[j]]}${T[j] === CONCEPT ? ' bgx-dot--' + extra[j].g : ''}"${hueVar(j)} aria-hidden="true"></span>`;

  function renderCrumbs() {
    const path = current === -1 ? [] : chain(current);
    const items = [`<li><button type="button" class="bgx-crumb" data-node="-1"${path.length || grade || query || spec ? '' : ' aria-current="page"'}>${esc(S.home)}</button></li>`];
    path.forEach((j, n) => {
      const last = n === path.length - 1;
      items.push(`<li><button type="button" class="bgx-crumb" data-node="${j}"${last ? ' aria-current="page"' : ''}>${esc(label[j])}</button></li>`);
    });
    if (grade) items.push(`<li><span class="bgx-crumb" aria-current="page">${esc(S.grade[grade])}</span></li>`);
    if (query) items.push(`<li><span class="bgx-crumb" aria-current="page">${esc(S.search)}</span></li>`);
    if (spec) items.push(`<li><span class="bgx-crumb" aria-current="page">${esc(spec.name)}</span></li>`);
    crumbs.innerHTML = `<ol>${items.join('')}</ol>`;
  }

  // the evidence scale for whatever sits beneath a card
  function bar(list, owner) {
    const c = { v: 0, p: 0, n: 0 };
    list.forEach((j) => { c[extra[j].g] = (c[extra[j].g] || 0) + 1; });
    return `<span class="bgx-bar"${owner != null ? hueVar(owner) : ''} role="img" aria-label="${esc(S.barLabel(c.v, c.p, c.n))}">${['v', 'p', 'n'].map((g) => (c[g] ? `<i class="bgx-bar-${g}" style="flex:${c[g]}"></i>` : '')).join('')}</span>`;
  }
  // the Spanish title of a concept, shown under its English name (only the Spanish build carries it)
  const alt = (j) => (T[j] === CONCEPT && extra[j].n ? `<span class="bgx-alt">${esc(extra[j].n)}</span>` : '');
  const t_alt = (j) => (T[j] === CONCEPT && extra[j].n ? `<p class="bgx-alt-title">${esc(extra[j].n)}</p>` : '');
  function card(j) {
    const t = T[j], x = extra[j];
    let meta = '';
    if (t < CONCEPT) meta = `<span class="bgx-card-meta">${esc(S.concepts((below.get(j) || []).length))}</span>${bar(below.get(j) || [], j)}`;
    else if (t === CONCEPT) meta = `<span class="bgx-card-meta">${esc([S.kind[x.k], S.grade[x.g]].filter(Boolean).join(' · '))}${x.m === 'high' ? ` · <em>${esc(S.mythShort)}</em>` : ''}</span>`;
    else meta = `<span class="bgx-card-meta">${esc(S.type[t])}</span>`;
    const hit = query && hits.get(j) ? `<span class="bgx-alt">${esc(S.matched ? S.matched(hits.get(j)) : hits.get(j))}</span>` : '';
    return `<li><button type="button" class="bgx-card" data-node="${j}">${t >= CONCEPT ? dot(j) : ''}<span class="bgx-card-name">${esc(label[j])}${alt(j)}${hit}</span>${meta}</button></li>`;
  }
  function cards(title, list, max) {
    if (!list.length) return '';
    const limit = max || list.length;
    const more = list.length > limit ? `<p class="bgx-more">${esc(S.more(list.length - limit))}</p>` : '';
    return `<h3 class="bgx-h3">${esc(title)}</h3><ul class="bgx-cards">${list.slice(0, limit).map(card).join('')}</ul>${more}`;
  }
  const kids = (i, t) => adj[i].filter((j) => T[j] === t).sort((a, b) => label[a].localeCompare(label[b]));
  const head = (i, typeText) => `<p class="bgx-type">${esc(typeText)}</p><h2 class="bgx-name" tabindex="-1">${esc(label[i])}</h2>${t_alt(i)}`;

  function renderCard(i) {
    let html = '';
    if (i === -1 && welcomeTpl) return renderWelcome();
    if (i === -1) {
      html = `<h2 class="bgx-name bgx-sr" tabindex="-1">${esc(S.home)}</h2><p class="bgx-lead">${esc(S.intro)}</p>${cards(S.h.clusters, byType[CLUSTER])}`;
    } else {
      const t = T[i], x = extra[i];
      if (t <= TOPIC) {
        html = head(i, S.type[t]);
        if (x.d) html += `<p class="bgx-desc">${esc(x.d)}</p>`;
        const list = below.get(i) || [];
        html += `<p class="bgx-counts">${esc(S.concepts(list.length))}</p>${bar(list, i)}`;
        if (t === TOPIC) {
          html += cards(S.h.concepts, kids(i, CONCEPT));
          html += cards(S.h.loose, kids(i, FINDING));
        } else html += cards(S.h.children[t], kids(i, t + 1));
      } else if (t === CONCEPT) {
        html = head(i, S.kind[x.k] || S.type[t]);
        html += `<p class="bgx-badges"><span class="bgx-grade bgx-grade--${x.g}">${esc(S.grade[x.g])}</span>${x.m === 'high' || x.m === 'moderate' ? `<span class="bgx-myth">${esc(S.myth[x.m])}</span>` : ''}</p>`;
        html += `<div id="bgxDetail" class="bgx-detail"><p class="bgx-desc">${esc(S.loading)}</p></div>`;
        html += cards(S.h.related, relAdj[i].slice().sort((a, b) => label[a].localeCompare(label[b])));
        html += cards(S.h.topics, kids(i, TOPIC));
        loadConcept(i);
      } else if (t === FINDING) {
        html = head(i, S.type[t]);
        if (x.d) html += `<p class="bgx-desc">${esc(x.d)}</p>`;
        if (x.r) html += `<p class="bgx-counts">${esc(S.replication[x.r] || x.r)}</p>`;
        html += cards(S.h.about, adj[i].filter((j) => T[j] < FINDING));
        html += cards(S.h.source, kids(i, SOURCE));
      } else if (t === SOURCE) {
        html = head(i, S.type[t]) + `<p class="bgx-counts">${esc([x.y, x.v].filter(Boolean).join(' · '))}</p>`;
        const supports = new Set();
        kids(i, FINDING).forEach((f) => adj[f].forEach((j) => { if (T[j] === CONCEPT || T[j] === TOPIC) supports.add(j); }));
        html += cards(S.h.supports, Array.from(supports));
        html += cards(S.h.authors, kids(i, AUTHOR), 12);
      } else if (t === AUTHOR) {
        html = head(i, S.type[t]) + cards(S.h.sources, kids(i, SOURCE));
      } else if (t === APP) {
        html = head(i, S.type[t]);
        if (x.e && S.ethics[x.e]) html += `<p class="bgx-counts">${esc(S.ethics[x.e])}</p>`;
        html += cards(S.h.about, kids(i, CONCEPT));
      }
    }
    body.innerHTML = html;
    colEl.scrollTop = 0;
  }

  // A concept's full entry: description, the studies behind it, the
  // real-world examples, fetched only when its card opens.
  function loadConcept(i) {
    fetch(`${S.dataDir || '/assets/data/beco-explorer'}/biases/${encodeURIComponent(extra[i].id)}.json`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((b) => {
        const el = document.getElementById('bgxDetail');
        if (!el || current !== i) return;
        const link = (url, text) => (url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>` : esc(text));
        let html = '';
        if (b.aliases && b.aliases.length) html += `<p class="bgx-aliases">${esc(S.aliases(b.aliases.join(', ')))}</p>`;
        html += `<p class="bgx-desc">${esc(b.description)}</p>`;
        if (b.design_relevance_note) html += `<p class="bgx-note">${esc(b.design_relevance_note)}</p>`;
        if (b.myth_risk_note && (b.myth_risk === 'moderate' || b.myth_risk === 'high')) html += `<p class="bgx-note bgx-note--myth">${esc(b.myth_risk_note)}</p>`;
        html += `<h3 class="bgx-h3">${esc(S.h.findings)}</h3>`;
        html += (b.findings || []).length ? b.findings.map((f) => {
          const cite = [(f.authors || []).filter(Boolean).join(', '), f.source_year].filter(Boolean).join(', ');
          return `<div class="bgx-finding"><p>${esc(f.description)}</p><p class="bgx-cite">${link(f.source_url, f.source_title || S.type[SOURCE])}${f.source_venue ? ' · ' + esc(f.source_venue) : ''}${cite ? ' · ' + esc(cite) : ''}${f.replication_status ? ' · ' + esc(S.replication[f.replication_status] || f.replication_status) : ''}</p></div>`;
        }).join('') : `<p class="bgx-counts">${esc(S.noFindings)}</p>`;
        if ((b.applications || []).length) {
          html += `<h3 class="bgx-h3">${esc(S.h.examples)}</h3>` + b.applications.map((a) => {
            const meta = [a.industry_context, S.ethics[a.ethical_risk]].filter(Boolean).map(esc).join(' · ');
            return `<div class="bgx-finding"><p class="bgx-example-title">${link(a.source_url, a.title)}</p>${a.description ? `<p>${esc(a.description)}</p>` : ''}${meta ? `<p class="bgx-cite">${meta}</p>` : ''}${a.ethical_note ? `<p class="bgx-note">${esc(a.ethical_note)}</p>` : ''}</div>`;
          }).join('');
        }
        el.innerHTML = html;
      })
      .catch(() => { const el = document.getElementById('bgxDetail'); if (el) el.innerHTML = `<p class="bgx-counts">${esc(S.loadError)}</p>`; });
  }

  // The lab's starting card: the page's template, with its slots filled from the graph
  const specChips = (list) => list.map((x) => `<button type="button" class="bgx-chip" data-spec="${esc(x.id)}">${esc(x.name)}</button>`).join('');
  let surveyUrl = null;
  function renderWelcome() {
    body.replaceChildren(welcomeTpl.content.cloneNode(true));
    const slot = (n) => body.querySelector(`[data-slot="${n}"]`);
    const el = {
      stats: slot('stats'), hook: slot('hook'), evidence: slot('evidence'),
      specs: slot('specs'), clusters: slot('clusters'), survey: slot('survey'),
    };
    if (el.stats) el.stats.textContent = statsText;
    if (el.hook) el.hook.innerHTML = `<ul class="bgx-cards">${el.hook.dataset.ids.split(' ').map((id) => byId.get(id)).filter((j) => j != null).map(card).join('')}</ul>`;
    if (el.evidence) {
      const c = { v: 0, p: 0, n: 0 };
      byType[CONCEPT].forEach((j) => { c[extra[j].g] = (c[extra[j].g] || 0) + 1; });
      el.evidence.innerHTML = `<p class="bgx-desc">${esc(S.evidence(byType[CONCEPT].length, c.v, c.p, c.n))}</p>${bar(byType[CONCEPT])}`
        + `<div class="bgx-chips">${['v', 'p', 'n'].map((g) => `<button type="button" class="bgx-chip" data-grade-pick="${g}"><span class="bgx-dot bgx-dot--${g}"></span>${esc(S.grade[g])}: ${c[g]}</button>`).join('')}</div>`;
    }
    if (el.specs) {
      el.specs.innerHTML = specChips(specs);
      el.specs.closest('[data-section]')?.toggleAttribute('hidden', !specs.length);
    }
    if (el.clusters) el.clusters.innerHTML = cards(S.h.clusters, byType[CLUSTER]);
    if (el.survey) {
      const show = (url) => { if (!url) return; el.survey.hidden = false; el.survey.querySelector('a[data-survey]')?.setAttribute('href', url); };
      if (surveyUrl !== null) show(surveyUrl);
      else if (el.survey.dataset.src) fetch(el.survey.dataset.src).then((r) => r.json()).then((cfg) => { surveyUrl = cfg.surveyUrl || ''; if (current === -1 && !grade && !spec && !query) show(surveyUrl); }).catch(() => { surveyUrl = ''; });
    }
    colEl.scrollTop = 0;
  }

  function renderSpec(s, list) {
    body.innerHTML = `<p class="bgx-type">${esc(S.spec.type)}</p><h2 class="bgx-name" tabindex="-1">${esc(s.name)}</h2>`
      + `<h3 class="bgx-h3">${esc(S.spec.decisions)}</h3><p class="bgx-desc">${esc(s.decisions)}</p>`
      + `<h3 class="bgx-h3">${esc(S.spec.help)}</h3><p class="bgx-desc">${esc(s.help)}</p>`
      + cards(S.spec.start, list)
      + `<h3 class="bgx-h3">${esc(S.spec.others)}</h3><div class="bgx-chips">${specChips(specs.filter((x) => x !== s))}</div>`;
    colEl.scrollTop = 0;
  }

  function renderGrade(g) {
    const list = byType[CONCEPT].filter((i) => extra[i].g === g);
    body.innerHTML = `<p class="bgx-type">${esc(S.h.byGrade)}</p><h2 class="bgx-name" tabindex="-1">${esc(S.grade[g])}</h2><p class="bgx-desc">${esc(S.gradeNote[g])}</p>${cards(S.concepts(list.length), list)}`;
    colEl.scrollTop = 0;
  }

  // anything with a data-node in the column navigates; cards also point at the map
  // the new card's heading takes focus, so keyboard and screen-reader users
  // land where the card changed instead of on a button that no longer exists
  const focusCard = () => { const h = body.querySelector('.bgx-name'); if (h) h.focus({ preventScroll: true }); };
  function onPick(e) {
    const sp = e.target.closest('[data-spec]'), gp = e.target.closest('[data-grade-pick]');
    const b = e.target.closest('[data-node]');
    if (!b && !sp && !gp) return;
    if (sp) goSpec(sp.dataset.spec);
    else if (gp) goGrade(gp.dataset.gradePick);
    else go(Number(b.dataset.node));
    focusCard();
    if (stacked.matches) stage.parentElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
  body.addEventListener('click', onPick);
  crumbs.addEventListener('click', (e) => { const b = e.target.closest('[data-node]'); if (b) { go(Number(b.dataset.node)); focusCard(); } });
  body.addEventListener('mouseover', (e) => {
    const b = e.target.closest('[data-node]');
    const h = b ? Number(b.dataset.node) : -1;
    if (h !== hover) { hover = h; needsDraw = true; }
  });
  body.addEventListener('mouseleave', () => { if (hover !== -1) { hover = -1; needsDraw = true; } });
  body.addEventListener('focusin', (e) => {
    const b = e.target.closest('.bgx-card');
    if (b) { hover = Number(b.dataset.node); needsDraw = true; }
  });

  gradeBtns.forEach((b) => b.addEventListener('click', () => goGrade(b.dataset.grade)));

  /* ── search ── */
  // Matches the English name, the Spanish title, the Spanish terms and the English aliases of a concept, and the names of groups,
  // domains and topics. Ignores case and accents, takes the words in any order, accepts the start of a word, a plural, and one typo.
  const norm = (t) => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const stem = (w) => (w.length > 4 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);
  const near = (a, b) => { // one edit apart
    if (a === b) return true;
    const d = a.length - b.length;
    if (d > 1 || d < -1) return false;
    let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
    if (d === 0) return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
    return d > 0 ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
  };
  const fields = new Array(N);
  function fieldsOf(i) {
    if (fields[i]) return fields[i];
    const x = extra[i], f = [[label[i], 0, '']];
    if (x.n) f.push([x.n, 1, '']);
    for (const t of x.t || []) f.push([t, 2, t]);
    for (const t of x.al || []) f.push([t, 2, t]);
    return (fields[i] = f.map(([text, w, shown]) => ({ text: norm(text), words: norm(text).split(' ').map(stem), w, shown })));
  }
  // score of one query word against one field: lower is better, null when it does not match
  function wordScore(q, f) {
    const qs = stem(q);
    let best = null;
    for (const w of f.words) {
      let sc = null;
      if (w === qs) sc = 0;
      else if (w.startsWith(qs)) sc = 1;
      else if (qs.length >= 5 && near(qs, w.slice(0, qs.length)) ) sc = 3;
      else if (qs.length >= 4 && w.includes(qs)) sc = 4;
      if (sc !== null && (best === null || sc < best)) best = sc;
    }
    return best;
  }
  // A search is a state of its own, like an evidence filter: the column lists the
  // results by kind and the map lights them. Clearing it returns to where you were.
  let results = [], hits = new Map(), query = '', before = null, searchTimer;
  function search(raw) {
    const q = norm(raw);
    if (q.length < 2) { if (query) restore(); return; }
    if (!query) before = { node: current, grade, spec };
    query = raw.trim();
    history.replaceState(null, '', '#buscar/' + encodeURIComponent(query));
    hits = new Map();
    const qw = q.split(' ');
    const scored = [];
    for (let i = 0; i < N; i++) {
      if (T[i] === FINDING || T[i] === APP) continue;
      const fs = fieldsOf(i);
      let total = 0, shown = '', ok = true;
      const whole = fs.find((f) => f.text === q || f.text.startsWith(q + ' '));
      for (const w of qw) {
        let best = null, bf = null;
        for (const f of fs) { const sc = wordScore(w, f); if (sc !== null) { const v = sc * 10 + f.w; if (best === null || v < best) { best = v; bf = f; } } }
        if (best === null) { ok = false; break; }
        total += best;
        if (bf.shown && !shown) shown = bf.shown;
      }
      if (!ok) continue;
      if (whole) total -= 20 - whole.w * 5;
      if (shown && fs.some((f) => !f.shown && qw.every((w) => wordScore(w, f) !== null))) shown = '';
      scored.push([i, total, shown]);
    }
    scored.sort((a, b) => a[1] - b[1] || T[b[0]] - T[a[0]] || label[a[0]].length - label[b[0]].length);
    results = scored.slice(0, 80).map((r) => { hits.set(r[0], r[2]); return r[0]; });
    current = -1; grade = null; spec = null; hover = -1;
    gradeBtns.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
    focus = new Set(results);
    app.classList.add('is-searching');
    setPanel(true);
    renderCrumbs();
    renderResults();
    needsDraw = true;
    // the map and the announcement wait until typing pauses
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { statusEl.textContent = S.found(results.length); fitTo(results); }, 280);
  }
  function renderResults() {
    const order = [CONCEPT, TOPIC, DOMAIN, CLUSTER, SOURCE, AUTHOR];
    const title = { [CONCEPT]: S.h.concepts, [TOPIC]: S.h.topics, [DOMAIN]: S.h.children[0], [CLUSTER]: S.h.clusters, [SOURCE]: S.h.sources, [AUTHOR]: S.h.authors };
    let html = `<p class="bgx-type">${esc(S.search)}</p><h2 class="bgx-name" tabindex="-1">«${esc(query)}»</h2><p class="bgx-counts">${esc(S.found(results.length))}</p>`;
    html += results.length ? order.map((t) => cards(title[t], results.filter((i) => T[i] === t), 30)).join('') : `<p class="bgx-desc">${esc(S.noResults)}</p>`;
    body.innerHTML = html;
    colEl.scrollTop = 0;
  }
  // frame every result, without zooming past what a concept would get
  function fitTo(list) {
    if (!showAuthors) list = [...new Set(list.flatMap((i) => (hidden(i) ? adj[i].filter((j) => T[j] === SOURCE) : [i])))];
    if (!list.length || !W) return;
    if (list.length === 1) return flyToNode(list[0]);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const i of list) { x0 = Math.min(x0, X[i]); x1 = Math.max(x1, X[i]); y0 = Math.min(y0, Y[i]); y1 = Math.max(y1, Y[i]); }
    const k = Math.min(fitK * 3.4, (W * 0.8) / Math.max(1, x1 - x0), (H * 0.8) / Math.max(1, y1 - y0));
    flyTo((x0 + x1) / 2, (y0 + y1) / 2, k);
  }
  function endSearch() {
    query = ''; results = []; hits = new Map();
    clearTimeout(searchTimer);
    searchInput.value = '';
    statusEl.textContent = '';
    app.classList.remove('is-searching');
  }
  // back to the card or filter that was open before the search
  function restore() {
    const b = before || { node: -1, grade: null, spec: null };
    endSearch();
    history.replaceState(null, '', stateHash(b) || location.pathname);
    if (b.spec) goSpec(b.spec.id, { push: false });
    else if (b.grade) goGrade(b.grade, { push: false });
    else go(b.node, { push: false, open: false });
  }
  const resultCards = () => Array.from(body.querySelectorAll('.bgx-card'));
  searchInput.addEventListener('input', () => search(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && query) { resultCards()[0]?.focus(); e.preventDefault(); }
    else if (e.key === 'Enter' && results.length) { const i = results[0]; go(i); focusCard(); e.preventDefault(); }
    else if (e.key === 'Escape') { if (query) restore(); else searchInput.blur(); e.preventDefault(); }
  });
  // arrow keys walk the results; up from the first goes back to the box
  body.addEventListener('keydown', (e) => {
    if (!query || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
    const list = resultCards(), n = list.indexOf(document.activeElement);
    if (n === -1) return;
    e.preventDefault();
    if (e.key === 'ArrowDown') list[Math.min(n + 1, list.length - 1)].focus();
    else if (n === 0) searchInput.focus();
    else list[n - 1].focus();
  });

  /* ── zoom buttons ── */
  document.querySelectorAll('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
    const z = b.dataset.zoom;
    if (z === 'reset') { go(-1); return; }
    flyTo(cam.x, cam.y, clampK(cam.k * (z === 'in' ? 1.6 : 1 / 1.6)));
  }));

  /* ── pointer: drag to pan, pinch to zoom, tap to pick ── */
  const pointers = new Map();
  let downAt = null, moved = false, pinch = null;
  const mapLive = () => !stacked.matches || app.classList.contains('is-exploring');
  canvas.addEventListener('pointerdown', (e) => {
    if (!mapLive()) return;
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    downAt = { x: e.clientX, y: e.clientY }; moved = false; flight = null;
    if (pointers.size === 2) {
      const [a, b] = Array.from(pointers.values());
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: cam.k };
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    const box = canvas.getBoundingClientRect();
    if (!pointers.has(e.pointerId)) {
      if (e.pointerType === 'mouse' && mapLive()) {
        const px = e.clientX - box.left, py = e.clientY - box.top;
        const r = rimAt(px, py), h = r !== -1 ? r : nodeAt(px, py);
        if (h !== hover) { hover = h; canvas.style.cursor = h === -1 ? 'grab' : 'pointer'; needsDraw = true; }
      }
      return;
    }
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 4) moved = true;
    if (pointers.size === 2 && pinch) {
      const [a, b] = Array.from(pointers.values());
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((a.x + b.x) / 2 - box.left, (a.y + b.y) / 2 - box.top, clampK(pinch.k * d / pinch.d) / cam.k);
      return;
    }
    cam.x -= (e.clientX - prev.x) / cam.k; cam.y -= (e.clientY - prev.y) / cam.k;
    canvas.style.cursor = 'grabbing';
    needsDraw = true;
  });
  const up = (e) => {
    const box = canvas.getBoundingClientRect();
    if (pointers.has(e.pointerId) && !moved && pointers.size === 1 && e.type === 'pointerup') {
      const px = e.clientX - box.left, py = e.clientY - box.top;
      const r = rimAt(px, py), i = r !== -1 ? r : nodeAt(px, py);
      // a click on empty map lets go of whatever was lit, without moving it
      if (i === -1) { if (current !== -1 || grade) go(-1, { fly: false }); }
      else go(i);
    }
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
    canvas.style.cursor = hover === -1 ? 'grab' : 'pointer';
  };
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('pointerleave', () => { if (hover !== -1) { hover = -1; needsDraw = true; } });

  // Plain scrolling keeps scrolling the page; pinch on a trackpad (sent as
  // ctrl + wheel) or ⌘/ctrl + scroll zooms the map.
  let hintTimer;
  canvas.addEventListener('wheel', (e) => {
    if (!mapLive()) return;
    // a page that never scrolls (the lab) lets the plain wheel zoom, as a map does
    if (!(e.ctrlKey || e.metaKey) && !app.classList.contains('is-exploring') && !S.wheelZoom) {
      hintEl.classList.add('is-on');
      clearTimeout(hintTimer); hintTimer = setTimeout(() => hintEl.classList.remove('is-on'), 1400);
      return;
    }
    e.preventDefault();
    const box = canvas.getBoundingClientRect();
    zoomAt(e.clientX - box.left, e.clientY - box.top, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)));
  }, { passive: false });

  /* ── phones: the map opens full screen; a peek bar names what you tapped ── */
  function explore(on) {
    app.classList.toggle('is-exploring', on);
    document.documentElement.classList.toggle('bgx-lock', on);
    showPeek(on ? current : -1);
    requestAnimationFrame(resize);
  }
  function showPeek(i) {
    if (!peek) return;
    peek.hidden = i === -1;
    if (i !== -1) peek.querySelector('[data-peek-name]').textContent = label[i];
  }
  document.getElementById('bgxOpen')?.addEventListener('click', () => explore(true));
  document.getElementById('bgxDone')?.addEventListener('click', () => explore(false));
  peek?.querySelector('[data-peek-read]')?.addEventListener('click', () => {
    explore(false);
    requestAnimationFrame(() => body.parentElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.target === searchInput || helpEl?.open) return;
    if (app.classList.contains('is-exploring')) explore(false);
    else if (query) restore();
    else if (current !== -1 || grade || spec) go(-1);
  });

  /* ── the column: fold it away for a full-width map, or drag its edge ── */
  function setPanel(open) {
    if (!panelBtn || app.classList.contains('is-collapsed') !== open) return;
    app.classList.toggle('is-collapsed', !open);
    panelBtn.setAttribute('aria-expanded', String(open));
    panelBtn.title = S.panel(open);
  }
  panelBtn?.addEventListener('click', () => setPanel(app.classList.contains('is-collapsed')));
  const COL_KEY = 'beco-explorer-col';
  function setCol(w) {
    const max = Math.max(320, app.clientWidth * 0.6);
    w = Math.round(Math.max(288, Math.min(max, w)));
    app.style.setProperty('--bgx-col', w + 'px');
    resizer.setAttribute('aria-valuenow', String(w));
    resizer.setAttribute('aria-valuemin', '288');
    resizer.setAttribute('aria-valuemax', String(Math.round(max)));
    return w;
  }
  if (resizer) {
    try { const w = Number(localStorage.getItem(COL_KEY)); if (w) setCol(w); } catch (e) { /* storage off: keep the default width */ }
    const save = (w) => { try { localStorage.setItem(COL_KEY, String(w)); } catch (e) { /* not kept */ } };
    resizer.addEventListener('pointerdown', (e) => {
      resizer.setPointerCapture(e.pointerId);
      resizer.classList.add('is-dragging');
      e.preventDefault();
    });
    resizer.addEventListener('pointermove', (e) => {
      if (!resizer.hasPointerCapture(e.pointerId)) return;
      setCol(app.getBoundingClientRect().right - e.clientX);
    });
    const release = (e) => {
      if (!resizer.hasPointerCapture(e.pointerId)) return;
      resizer.releasePointerCapture(e.pointerId);
      resizer.classList.remove('is-dragging');
      save(colEl.getBoundingClientRect().width);
    };
    resizer.addEventListener('pointerup', release);
    resizer.addEventListener('pointercancel', release);
    resizer.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowLeft' ? 32 : e.key === 'ArrowRight' ? -32 : 0;
      if (!step) return;
      e.preventDefault();
      save(setCol(colEl.getBoundingClientRect().width + step));
    });
  }

  /* ── the specialties menu in the bar (lab only) ── */
  const specsWrap = document.getElementById('bgxSpecs');
  const specMenu = document.getElementById('bgxSpecMenu');
  const specBtn = specsWrap?.querySelector('.bgx-specs-btn');
  function fillSpecMenu() {
    if (!specsWrap || !specs.length) return;
    specMenu.innerHTML = specs.map((x) => `<li><button type="button" data-spec="${esc(x.id)}">${esc(x.name)}</button></li>`).join('');
    specsWrap.hidden = false;
  }
  function specMenuOpen(open) {
    specMenu.hidden = !open;
    specBtn.setAttribute('aria-expanded', String(open));
    if (!open) return;
    const items = Array.from(specMenu.querySelectorAll('button'));
    items.forEach((b) => b.setAttribute('aria-current', String(!!spec && spec.id === b.dataset.spec)));
    (items.find((b) => b.getAttribute('aria-current') === 'true') || items[0])?.focus();
  }
  if (specsWrap) {
    specBtn.addEventListener('click', () => specMenuOpen(specMenu.hidden));
    specMenu.addEventListener('click', (e) => {
      const b = e.target.closest('[data-spec]');
      if (!b) return;
      specMenuOpen(false);
      goSpec(b.dataset.spec);
      focusCard();
      if (stacked.matches) stage.parentElement.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
    specsWrap.addEventListener('keydown', (e) => {
      if (specMenu.hidden) return;
      const items = Array.from(specMenu.querySelectorAll('button')), n = items.indexOf(document.activeElement);
      if (e.key === 'Escape') { specMenuOpen(false); specBtn.focus(); e.stopPropagation(); }
      else if (e.key === 'ArrowDown') { items[(n + 1) % items.length].focus(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { items[(n - 1 + items.length) % items.length].focus(); e.preventDefault(); }
    });
    document.addEventListener('click', (e) => { if (!specMenu.hidden && !specsWrap.contains(e.target)) specMenuOpen(false); });
  }

  /* ── the logo goes back to the starting card without leaving the page ── */
  document.querySelectorAll('[data-home]').forEach((a) => a.addEventListener('click', (e) => {
    if (!N) return;
    e.preventDefault();
    if (app.classList.contains('is-exploring')) explore(false);
    if (query) endSearch();
    setPanel(true);
    go(-1);
  }));

  /* ── how to read the map ── */
  document.querySelectorAll('[data-help]').forEach((b) => b.addEventListener('click', () => helpEl?.showModal()));
  helpEl?.querySelector('[data-help-close]')?.addEventListener('click', () => helpEl.close());
  // a click on the backdrop lands on the dialog itself
  helpEl?.addEventListener('click', (e) => { if (e.target === helpEl) helpEl.close(); });

  /* ── once you use the app, it takes the whole screen and the intro scrolls away ── */
  function snapIn() {
    if (stacked.matches) return;
    // a page with a fixed nav above the app sets scroll-margin-top, and the app stops under it
    const top = app.getBoundingClientRect().top - (parseFloat(getComputedStyle(app).scrollMarginTop) || 0);
    if (Math.abs(top) > 2) window.scrollTo({ top: window.scrollY + top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  app.addEventListener('pointerdown', (e) => { if (!e.target.closest('.bgx-resize')) snapIn(); });
  app.addEventListener('focusin', snapIn);
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey || helpEl?.open) return;
    if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    e.preventDefault();
    searchInput.focus();
  });

  // a shorter placeholder where the box is narrow
  if (searchInput.dataset.short) {
    const long = searchInput.placeholder;
    const sync = () => { searchInput.placeholder = stacked.matches ? searchInput.dataset.short : long; };
    sync(); stacked.addEventListener('change', sync);
  }

  /* ── boot ── */
  hintEl.textContent = S.zoomHint(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  readTheme();
  new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('resize', resize);
  // the map's box also changes when the column folds or is dragged
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  stacked.addEventListener('change', () => { if (!stacked.matches) explore(false); resize(); });
  const getSpecs = S.specsUrl ? fetch(S.specsUrl).then((r) => r.json()).catch(() => []) : Promise.resolve([]);
  function enter(st, opts) {
    if (st.q) { searchInput.value = st.q; search(st.q); clearTimeout(searchTimer); statusEl.textContent = S.found(results.length); if (opts.fly !== false) fitTo(results); }
    else if (st.spec && specById.has(st.spec)) goSpec(st.spec, opts);
    else if (st.grade && S.grade[st.grade]) goGrade(st.grade, opts);
    else go(st.node ?? -1, opts);
  }
  Promise.all([fetch(S.graphUrl || '/assets/data/beco-graph/graph.json').then((r) => r.json()), getSpecs])
    .then(([data, sp]) => {
      load(data);
      specs = Array.isArray(sp) ? sp : [];
      specs.forEach((x) => specById.set(x.id, x));
      fillSpecMenu();
      resize();
      const start = fromHash();
      enter(start, { push: false, fly: false });
      if (current !== -1) { const k = clampK(fitK * ({ 0: 1.7, 1: 2.3, 2: 3.2, 3: 3.4 }[T[current]] || 5)); Object.assign(cam, { x: X[current], y: Y[current], k }); }
      else if (focus && focus.size && (spec || query)) fitTo(spec ? spec.concepts.map((c) => byId.get(c.id)).filter((j) => j != null) : results);
      app.classList.add('is-ready');
      requestAnimationFrame(draw);
    })
    .catch(() => { app.classList.add('is-error'); body.innerHTML = `<p class="bgx-counts">${esc(S.loadError)}</p>`; });
  window.addEventListener('popstate', () => {
    if (!N) return;
    const st = fromHash();
    if (!st.q && query) endSearch();
    enter(st, { push: false });
  });
})();
