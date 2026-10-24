/* ============================================================
   BECO GRAPH — the whole knowledge graph as one zoomable map.
   Shared by /thinking/beco-graph/ and its Spanish twin; each page
   supplies its wording in window.BGR_STRINGS. Positions come
   precomputed in assets/data/beco-graph/graph.json (built by
   scripts/generate_beco_graph_data.py), so the browser only draws:
   one canvas, about 2,700 nodes, redrawn when the view changes.
   ============================================================ */
(function () {
  'use strict';

  const S = window.BGR_STRINGS;
  const stage = document.getElementById('bgrStage');
  const canvas = document.getElementById('bgrCanvas');
  if (!S || !stage || !canvas) return;
  const ctx = canvas.getContext('2d');
  const panel = document.getElementById('bgrPanel');
  const panelBody = document.getElementById('bgrPanelBody');
  const statsEl = document.getElementById('bgrStats');
  const searchInput = document.getElementById('bgrSearch');
  const searchList = document.getElementById('bgrResults');
  const hintEl = document.getElementById('bgrHint');
  const gradeBtns = Array.from(document.querySelectorAll('[data-grade]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)');

  // Types in ring order, centre outward. Rank is the index.
  const CLUSTER = 0, DOMAIN = 1, TOPIC = 2, CONCEPT = 3, FINDING = 4, APP = 5, SOURCE = 6, AUTHOR = 7;
  const BASE_R = [7, 5, 2.6, 3.4, 1.5, 1.5, 1.8, 1.1];

  let N = 0, X, Y, T, R, label, extra, adj, relAdj, edges, rel;
  let theme = {};
  const cam = { x: 0, y: 0, k: 1 };
  let W = 0, H = 0, dpr = 1, fitK = 1;
  let hover = -1, selected = -1, grade = null, focus = null;
  let intro = reduceMotion ? 1 : 0, introStart = 0;
  let needsDraw = true;

  /* ── theme: every colour comes from the page's tokens ── */
  function readTheme() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    theme = {
      bg: v('--bg-base'), text1: v('--text-primary'), text2: v('--text-secondary'), text3: v('--text-tertiary'),
      border: v('--border-default'), borderStrong: v('--border-strong'),
      teal: v('--teal'), tealText: v('--teal-text'), gold: v('--gold'),
      body: cs.getPropertyValue('--font-body').trim() || 'sans-serif',
      display: cs.getPropertyValue('--font-display').trim() || 'serif',
      light: document.documentElement.getAttribute('data-theme') === 'light',
    };
    // partial backing: teal pulled halfway to the page background, as in the explorer
    theme.partial = mix(theme.teal, theme.bg, 0.5);
    needsDraw = true;
  }
  function hexToRgb(h) {
    const m = h.replace('#', '');
    const s = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
    return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
  }
  function mix(a, b, t) {
    try {
      const A = hexToRgb(a), B = hexToRgb(b);
      return `rgb(${A.map((v, i) => Math.round(v * (1 - t) + B[i] * t)).join(',')})`;
    } catch (e) { return a; }
  }

  /* ── data ── */
  function load(data) {
    const nodes = data.nodes;
    N = nodes.length;
    X = new Float32Array(N); Y = new Float32Array(N); T = new Uint8Array(N); R = new Float32Array(N);
    label = new Array(N); extra = new Array(N);
    adj = Array.from({ length: N }, () => []);
    relAdj = Array.from({ length: N }, () => []);
    nodes.forEach((n, i) => { T[i] = n[0]; X[i] = n[1]; Y[i] = n[2]; label[i] = n[3]; extra[i] = n[4] || {}; });
    edges = data.edges; rel = data.rel;
    for (let i = 0; i < edges.length; i += 2) { adj[edges[i]].push(edges[i + 1]); adj[edges[i + 1]].push(edges[i]); }
    for (let i = 0; i < rel.length; i += 2) { relAdj[rel[i]].push(rel[i + 1]); relAdj[rel[i + 1]].push(rel[i]); }
    for (let i = 0; i < N; i++) {
      let r = BASE_R[T[i]];
      if (T[i] === CONCEPT) r += Math.sqrt((extra[i].f || 0) + (extra[i].a || 0)) * 0.7;
      if (T[i] === TOPIC || T[i] === SOURCE) r += Math.min(2, adj[i].length * 0.12);
      R[i] = r;
    }
    const count = (t) => T.reduce((s, v) => s + (v === t ? 1 : 0), 0);
    statsEl.textContent = S.stats(count(CONCEPT), count(FINDING), count(SOURCE), count(AUTHOR));
    buildGrid();
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
        if (focus && !focus.has(i)) continue;
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
    for (let i = 0; i < N; i++) if (T[i] === CONCEPT && extra[i].g === g) focusOf(i).forEach((m) => set.add(m));
    return set;
  }

  /* ── camera ── */
  function resize() {
    const box = stage.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = box.width; H = box.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const prevFit = fitK, wasHome = cam.k === prevFit;
    // leave room round the rim for the cluster names on either side
    const room = rimOn() ? Math.min(H * 0.4, W / 2 - shiftPx() - rimWidth()) : Math.min(H * 0.4, W * 0.5);
    fitK = Math.max(60, room) / 1100;
    if (wasHome || !cam.k) { cam.k = fitK; cam.x = homeX(); cam.y = homeY(); }
    needsDraw = true;
  }
  // wide screens: the map sits right of centre, clear of the heading and tools
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
      for (let i = 0; i < N; i++) if (T[i] === CLUSTER) rimLines(label[i]).forEach((l) => { rimW = Math.max(rimW, ctx.measureText(l).width); });
      ctx.letterSpacing = '0px';
      rimW += 44;
    }
    return rimW || 200;
  }
  // narrow screens have no room beside the map for the names
  const rimOn = () => W >= 700;
  const shiftPx = () => (W > 1000 ? W * 0.075 : 0);
  const homeX = () => -shiftPx() / fitK;
  // and a little below centre, so the top of the map clears the nav
  const homeY = () => -36 / fitK;
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
  }
  // keep the selected node clear of the panel on wide screens
  const panelOffset = () => (panel && !coarse.matches && W > 900 && selected !== -1 ? Math.min(200, W * 0.14) : 0);

  /* ── drawing ── */
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  // nodes grow as you zoom in, but more slowly than the map, so detail opens up
  // and a smaller map (phones) gets proportionally smaller dots
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
    if (intro < 1) {
      if (!introStart) introStart = now;
      intro = Math.min(1, (now - introStart) / 1900);
      needsDraw = true;
    }
    if (!needsDraw || !N) { requestAnimationFrame(draw); return; }
    needsDraw = !!flight || intro < 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const k = cam.k, ox = W / 2 - cam.x * k, oy = H / 2 - cam.y * k;
    const sx = (i) => X[i] * reveal(i) * k + ox, sy = (i) => Y[i] * reveal(i) * k + oy;
    const active = focus;
    const vis = (i) => !active || active.has(i);
    const alphaFor = (i) => (introAlpha(i)) * (vis(i) ? 1 : 0.1);

    // edges: one path per style, so a few thousand lines cost a few strokes
    const zoomed = k / fitK;
    ctx.lineWidth = 1;
    const strokeEdges = (color, alpha, pick) => {
      ctx.beginPath();
      for (let e = 0; e < edges.length; e += 2) {
        const a = edges[e], b = edges[e + 1];
        if (!pick(a, b)) continue;
        ctx.moveTo(sx(a), sy(a)); ctx.lineTo(sx(b), sy(b));
      }
      ctx.strokeStyle = color; ctx.globalAlpha = alpha * Math.min(1, intro * 1.4); ctx.stroke();
    };
    const inner = (a, b) => Math.max(T[a], T[b]) <= CONCEPT;
    if (active) {
      strokeEdges(theme.border, 0.14, (a, b) => !(active.has(a) && active.has(b)) && (inner(a, b) || zoomed > 2));
      strokeEdges(theme.tealText, 0.55, (a, b) => active.has(a) && active.has(b));
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
      const cx = mx + (ox - mx) * 0.18, cy = my + (oy - my) * 0.18;
      ctx.moveTo(sx(a), sy(a)); ctx.quadraticCurveTo(cx, cy, sx(b), sy(b));
    }
    ctx.strokeStyle = theme.teal; ctx.globalAlpha = (active ? 0.6 : 0.16) * Math.min(1, intro * 1.4); ctx.stroke();

    // nodes, back to front by rank so concepts sit over their evidence
    for (let t = AUTHOR; t >= CLUSTER; t--) {
      for (let i = 0; i < N; i++) {
        if (T[i] !== t) continue;
        const a = alphaFor(i); if (a <= 0.01) continue;
        const x = sx(i), y = sy(i), rr = screenR(i);
        if (x < -20 || y < -20 || x > W + 20 || y > H + 20) continue;
        ctx.globalAlpha = a;
        drawNode(i, x, y, rr);
      }
    }

    drawRim(ox, oy);
    drawLabels(sx, sy);
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  function reveal(i) {
    if (intro >= 1) return 1;
    const t = Math.max(0, Math.min(1, (intro - T[i] * 0.07) / 0.45));
    return 0.55 + 0.45 * ease(t);
  }
  function introAlpha(i) {
    if (intro >= 1) return 1;
    return Math.max(0, Math.min(1, (intro - T[i] * 0.07) / 0.35));
  }

  function drawNode(i, x, y, r) {
    const t = T[i], hot = i === hover || i === selected;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (t === CONCEPT) {
      const g = extra[i].g;
      if (g === 'n') {
        ctx.fillStyle = theme.bg; ctx.fill();
        ctx.setLineDash([2, 2]); ctx.strokeStyle = theme.text2; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
      } else {
        ctx.fillStyle = g === 'v' ? theme.teal : theme.partial; ctx.fill();
      }
      if (extra[i].m === 'high') {
        ctx.beginPath(); ctx.arc(x, y, r + 2.2, 0, Math.PI * 2);
        ctx.strokeStyle = theme.gold; ctx.lineWidth = 1.1; ctx.stroke();
      }
    } else if (t === CLUSTER) {
      ctx.fillStyle = theme.bg; ctx.fill();
      ctx.strokeStyle = theme.text1; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, Math.PI * 2); ctx.fillStyle = theme.text1; ctx.fill();
    } else if (t === DOMAIN) {
      ctx.fillStyle = theme.text2; ctx.fill();
    } else if (t === TOPIC) {
      ctx.fillStyle = theme.text3; ctx.fill();
    } else if (t === SOURCE) {
      ctx.fillStyle = theme.borderStrong; ctx.fill();
    } else {
      ctx.fillStyle = theme.text3; ctx.globalAlpha *= t === AUTHOR ? 0.55 : 0.8; ctx.fill();
    }
    if (hot) {
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = theme.text1; ctx.lineWidth = 1.2; ctx.stroke();
    }
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
    const items = [];
    for (let i = 0; i < N; i++) {
      if (T[i] !== CLUSTER) continue;
      const a = Math.atan2(Y[i], X[i]), c = Math.cos(a), sn = Math.sin(a);
      const lines = rimLines(label[i]);
      const w = Math.max(...lines.map((l) => ctx.measureText(l).width));
      items.push({ i, c, sn, lines, w, h: lines.length * 14, side: c >= 0 ? 1 : -1, y: sn * 1085 * cam.k + oy });
    }
    for (const side of [1, -1]) {
      const col = items.filter((it) => it.side === side).sort((p, q) => p.y - q.y);
      for (let n = 1; n < col.length; n++) col[n].y = Math.max(col[n].y, col[n - 1].y + (col[n - 1].h + col[n].h) / 2 + 8);
    }
    for (const it of items) {
      const { i, c, sn, lines, w } = it;
      const x = c * 1085 * cam.k + ox;
      const lx = it.side > 0 ? x : x - w, ly = it.y - (lines.length - 1) * 7;
      ctx.globalAlpha = Math.min(1, intro * 1.5) * (focus && !focus.has(i) ? 0.3 : 1);
      // a short tick from the rim toward the name
      ctx.beginPath();
      ctx.moveTo(c * 1040 * cam.k + ox, sn * 1040 * cam.k + oy);
      ctx.lineTo(c * 1070 * cam.k + ox, sn * 1070 * cam.k + oy);
      ctx.strokeStyle = theme.teal; ctx.lineWidth = 1; ctx.stroke();
      ctx.textAlign = it.side > 0 ? 'left' : 'right';
      const ax = it.side > 0 ? lx : lx + w;
      lines.forEach((l, n) => {
        ctx.lineWidth = 3.5; ctx.strokeStyle = theme.bg; ctx.lineJoin = 'round';
        ctx.strokeText(l, ax, ly + n * 14);
        ctx.fillStyle = i === hover || i === selected ? theme.text1 : theme.tealText;
        ctx.fillText(l, ax, ly + n * 14);
      });
      ctx.textAlign = 'left';
      rim.push([i, lx - 4, ly - 10, w + 8, it.h + 6]);
    }
    ctx.letterSpacing = '0px';
  }
  const rimAt = (x, y) => { for (const b of rim) if (x >= b[1] && x <= b[1] + b[3] && y >= b[2] && y <= b[2] + b[4]) return b[0]; return -1; };

  // Labels: clusters always, domains once there's room, concepts and the rest
  // as you zoom in, biggest first, never overlapping.
  function drawLabels(sx, sy) {
    const z = cam.k / fitK;
    const taken = [];
    const fits = (x, y, w, h) => {
      for (const b of taken) if (x < b[0] + b[2] && x + w > b[0] && y < b[1] + b[3] && y + h > b[1]) return false;
      taken.push([x, y, w, h]); return true;
    };
    const order = [];
    const want = (i) => {
      const t = T[i];
      if (t === CLUSTER && z <= 2.2 && rimOn()) return false;   // named on the rim instead
      if (focus) return focus.has(i) && (t <= CONCEPT || z > 2.2 || i === selected || i === hover);
      if (i === hover) return true;
      return (t === CLUSTER && (z > 2.2 || (!rimOn() && z > 1.4))) || (t === DOMAIN && z > 1.25) || (t === CONCEPT && z > 2.1) || (t === TOPIC && z > 4) || (t >= FINDING && z > 7);
    };
    for (let i = 0; i < N; i++) if (want(i)) order.push(i);
    order.sort((a, b) => (b === hover || b === selected) - (a === hover || a === selected) || T[a] - T[b] || R[b] - R[a]);
    ctx.textBaseline = 'middle';
    for (const i of order) {
      const t = T[i];
      const x = sx(i), y = sy(i);
      if (x < -50 || y < -20 || x > W + 50 || y > H + 20) continue;
      const big = t === CLUSTER;
      const size = big ? 11 : t === DOMAIN ? 12 : t === CONCEPT ? 12 : 10.5;
      ctx.font = big ? `600 ${size}px ${theme.body}` : t === DOMAIN ? `italic 500 ${size + 1}px ${theme.display}` : `${t === CONCEPT ? 500 : 400} ${size}px ${theme.body}`;
      let text = big ? label[i].toUpperCase() : label[i];
      if (text.length > 42) text = text.slice(0, 40) + '…';
      if (big) ctx.letterSpacing = '1.6px'; else ctx.letterSpacing = '0px';
      const w = ctx.measureText(text).width;
      const rr = screenR(i);
      const lx = big ? x - w / 2 : x + rr + 5, ly = big ? y - rr - 12 : y;
      if (!fits(lx - 3, ly - size / 2 - 2, w + 6, size + 4) && i !== selected && i !== hover) continue;
      ctx.globalAlpha = introAlpha(i);
      // a halo in the page colour keeps text legible over lines
      ctx.lineWidth = 3.5; ctx.strokeStyle = theme.bg; ctx.lineJoin = 'round';
      ctx.strokeText(text, lx, ly);
      ctx.fillStyle = big ? theme.tealText : t === CONCEPT || t === DOMAIN ? theme.text1 : theme.text2;
      ctx.fillText(text, lx, ly);
    }
    ctx.letterSpacing = '0px';
  }

  /* ── selection and the panel ── */
  function select(i, fly) {
    selected = i;
    grade = null;
    gradeBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    focus = i === -1 ? null : focusOf(i);
    stage.classList.remove('has-grade');
    stage.classList.toggle('has-selection', i !== -1);
    renderPanel(i);
    if (i !== -1 && fly) {
      const k = Math.max(cam.k, fitK * ({ 0: 1.6, 1: 2.2, 2: 3.2, 3: 3.4 }[T[i]] || 5));
      // phones: the details open as a sheet from the bottom, so lift the node above it
      const lift = W < 760 ? (H * 0.22) / k : 0;
      flyTo(X[i] + (panelOffset() ? panelOffset() / k : 0), Y[i] + lift, k);
    }
    needsDraw = true;
  }

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const linkTo = (j) => `<button type="button" class="bgr-link" data-node="${j}"><span class="bgr-dot bgr-dot--${S.typeKey[T[j]]}${T[j] === CONCEPT ? ' bgr-dot--' + extra[j].g : ''}"></span>${esc(label[j])}</button>`;
  const neighbours = (i, t) => adj[i].filter((j) => T[j] === t);
  function list(title, items, max) {
    if (!items.length) return '';
    const shown = items.slice(0, max || 8).map(linkTo).join('');
    const more = items.length > (max || 8) ? `<p class="bgr-more">${S.more(items.length - (max || 8))}</p>` : '';
    return `<h3 class="bgr-h3">${esc(title)}</h3><div class="bgr-links">${shown}</div>${more}`;
  }

  function renderPanel(i) {
    if (i === -1) { panel.hidden = true; panelBody.innerHTML = ''; return; }
    const t = T[i], x = extra[i];
    let html = `<p class="bgr-type">${esc(t === CONCEPT && x.k ? S.kind[x.k] || S.type[t] : S.type[t])}</p><h2 class="bgr-name">${esc(label[i])}</h2>`;
    if (t === CONCEPT) {
      html += `<p class="bgr-badges"><span class="bgr-grade bgr-grade--${x.g}">${esc(S.grade[x.g])}</span>${x.m === 'high' ? `<span class="bgr-myth">${esc(S.mythHigh)}</span>` : ''}</p>`;
      html += `<p class="bgr-desc" id="bgrDesc">${esc(S.loading)}</p>`;
      html += `<p class="bgr-counts">${esc(S.counts(x.f || 0, x.a || 0))}</p>`;
      html += list(S.h.related, relAdj[i]);
      html += list(S.h.topics, neighbours(i, TOPIC));
      html += list(S.h.findings, neighbours(i, FINDING), 6);
      if (x.h) html += `<a class="bgr-out" href="${S.explorerPath}${esc(x.h)}">${esc(S.openInExplorer)} <span aria-hidden="true">→</span></a>`;
      fetch(`/assets/data/beco-explorer/biases/${encodeURIComponent(conceptId(i))}.json`)
        .then((r) => r.json())
        .then((d) => { const el = document.getElementById('bgrDesc'); if (el && selected === i) el.textContent = d.description || ''; })
        .catch(() => { const el = document.getElementById('bgrDesc'); if (el) el.remove(); });
    } else if (t === FINDING) {
      if (x.d) html += `<p class="bgr-desc">${esc(x.d)}</p>`;
      if (x.r) html += `<p class="bgr-counts">${esc(S.replication[x.r] || x.r)}</p>`;
      html += list(S.h.about, adj[i].filter((j) => T[j] < FINDING));
      html += list(S.h.source, neighbours(i, SOURCE));
    } else if (t === SOURCE) {
      html += `<p class="bgr-counts">${esc([x.y, x.v].filter(Boolean).join(' · '))}</p>`;
      const concepts = new Set();
      neighbours(i, FINDING).forEach((f) => adj[f].forEach((j) => { if (T[j] <= CONCEPT) concepts.add(j); }));
      html += list(S.h.supports, Array.from(concepts));
      html += list(S.h.authors, neighbours(i, AUTHOR), 10);
    } else if (t === AUTHOR) {
      html += list(S.h.sources, neighbours(i, SOURCE), 10);
    } else if (t === APP) {
      if (x.e && S.ethics[x.e]) html += `<p class="bgr-counts">${esc(S.ethics[x.e])}</p>`;
      html += list(S.h.about, neighbours(i, CONCEPT));
    } else {
      const below = [];
      focusOf(i).forEach((j) => { if (T[j] === CONCEPT) below.push(j); });
      html += `<p class="bgr-counts">${esc(S.beneath(below.length))}</p>`;
      html += list(S.h.children[t], neighbours(i, t + 1), 12);
      // findings filed under a topic before they've been tied to a named concept
      if (t === TOPIC) html += list(S.h.findings, neighbours(i, FINDING), 6);
    }
    panelBody.innerHTML = html;
    panel.hidden = false;
    panelBody.scrollTop = 0;
  }
  function conceptId(i) { return (extra[i].h || '').split('/bias/')[1] || ''; }

  panel.addEventListener('click', (e) => {
    const b = e.target.closest('[data-node]');
    if (b) select(Number(b.dataset.node), true);
    if (e.target.closest('[data-close]')) select(-1);
  });

  /* ── grade filter: light every concept with that grade, and its evidence ── */
  gradeBtns.forEach((b) => b.addEventListener('click', () => {
    const g = b.dataset.grade;
    const on = grade !== g;
    selected = -1; renderPanel(-1); stage.classList.remove('has-selection');
    grade = on ? g : null;
    focus = on ? gradeFocus(g) : null;
    gradeBtns.forEach((x) => x.setAttribute('aria-pressed', String(on && x === b)));
    stage.classList.toggle('has-grade', on);
    needsDraw = true;
  }));

  /* ── search ── */
  let results = [];
  function search(q) {
    q = q.trim().toLowerCase();
    searchList.innerHTML = '';
    results = [];
    if (q.length < 2) { searchInput.setAttribute('aria-expanded', 'false'); return; }
    for (let i = 0; i < N && results.length < 40; i++) {
      if (T[i] === FINDING || T[i] === APP) continue;
      const name = label[i].toLowerCase();
      const at = name.indexOf(q);
      if (at !== -1) results.push([i, at === 0 ? 0 : 1]);
    }
    results.sort((a, b) => a[1] - b[1] || T[a[0]] - T[b[0]] || label[a[0]].length - label[b[0]].length);
    results = results.slice(0, 8).map((r) => r[0]);
    searchList.innerHTML = results.length
      ? results.map((i, n) => `<li role="option" id="bgrOpt${n}" data-node="${i}"><span class="bgr-dot bgr-dot--${S.typeKey[T[i]]}${T[i] === CONCEPT ? ' bgr-dot--' + extra[i].g : ''}"></span>${esc(label[i])}<small>${esc(S.type[T[i]])}</small></li>`).join('')
      : `<li class="bgr-empty">${esc(S.noResults)}</li>`;
    searchInput.setAttribute('aria-expanded', 'true');
  }
  searchInput.addEventListener('input', () => search(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && results.length) { pick(results[0]); e.preventDefault(); }
    if (e.key === 'Escape') { searchInput.value = ''; search(''); }
  });
  searchList.addEventListener('click', (e) => { const li = e.target.closest('[data-node]'); if (li) pick(Number(li.dataset.node)); });
  function pick(i) { searchInput.value = ''; search(''); select(i, true); }

  /* ── zoom buttons ── */
  document.querySelectorAll('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
    const z = b.dataset.zoom;
    if (z === 'reset') { select(-1); grade = null; focus = null; gradeBtns.forEach((x) => x.setAttribute('aria-pressed', 'false')); flyTo(homeX(), homeY(), fitK); return; }
    const k = clampK(cam.k * (z === 'in' ? 1.6 : 1 / 1.6));
    flyTo(cam.x, cam.y, k);
  }));

  /* ── pointer: drag to pan, pinch to zoom, tap to select ── */
  const pointers = new Map();
  let downAt = null, moved = false, pinch = null;
  canvas.addEventListener('pointerdown', (e) => {
    if (coarse.matches && !stage.classList.contains('is-exploring')) return;
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
      if (e.pointerType === 'mouse') {
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
      const mx = (a.x + b.x) / 2 - box.left, my = (a.y + b.y) / 2 - box.top;
      zoomAt(mx, my, clampK(pinch.k * d / pinch.d) / cam.k);
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
      select(i === selected ? -1 : i, i !== -1);
      if (i === -1 && grade) { grade = null; focus = null; gradeBtns.forEach((x) => x.setAttribute('aria-pressed', 'false')); }
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
    if (!(e.ctrlKey || e.metaKey) && !stage.classList.contains('is-exploring')) {
      hintEl.classList.add('is-on');
      clearTimeout(hintTimer); hintTimer = setTimeout(() => hintEl.classList.remove('is-on'), 1400);
      return;
    }
    e.preventDefault();
    const box = canvas.getBoundingClientRect();
    zoomAt(e.clientX - box.left, e.clientY - box.top, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)));
  }, { passive: false });

  /* ── phones: an explicit explore mode, so the page still scrolls ── */
  const exploreBtn = document.getElementById('bgrExplore');
  const doneBtn = document.getElementById('bgrDone');
  function explore(on) {
    stage.classList.toggle('is-exploring', on);
    document.documentElement.classList.toggle('bgr-lock', on);
    requestAnimationFrame(() => { resize(); if (!on) { select(-1); flyTo(homeX(), homeY(), fitK); } });
  }
  if (exploreBtn) exploreBtn.addEventListener('click', () => explore(true));
  if (doneBtn) doneBtn.addEventListener('click', () => explore(false));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (selected !== -1 || grade) { select(-1); grade = null; focus = null; needsDraw = true; }
    else if (stage.classList.contains('is-exploring')) explore(false);
  });

  /* ── boot ── */
  hintEl.textContent = S.zoomHint(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  readTheme();
  new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  window.addEventListener('resize', resize);
  resize();
  fetch('/assets/data/beco-graph/graph.json')
    .then((r) => r.json())
    .then((data) => {
      load(data);
      resize();
      stage.classList.add('is-ready');
      introStart = 0;
      requestAnimationFrame(draw);
    })
    .catch(() => { stage.classList.add('is-error'); });
})();
