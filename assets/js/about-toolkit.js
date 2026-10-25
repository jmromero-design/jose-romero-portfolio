/* About · toolkit. The skills I bring and the tools I use for them, drawn
   as an isometric stack of three layers: research and experimentation at
   the base, design and delivery above it, AI on top. Mirrored like the
   homepage stack, so it faces the panel beside it. Picking a skill lights
   the tools it draws on and threads them to one point; picking a tool opens
   a skill that uses it. Wording lives in the page markup, so EN and ES share
   this file. Logos are Simple Icons (CC0, simple-icons@16.30.0); tools
   without one get a typographic mark in the same style. */
(function () {
  const root = document.getElementById('toolkit');
  if (!root) return;
  const stage = root.querySelector('.tk-stage');
  const caption = root.querySelector('.tk-caption');
  const panel = root.querySelector('.tk-panel');
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = window.matchMedia('(max-width: 900px)');

  const ICONS = {
    hotjar: 'M10.119 9.814C12.899 8.27 16.704 6.155 16.704 0h-4.609c0 3.444-1.676 4.375-4.214 5.786C5.1 7.33 1.295 9.444 1.295 15.6h4.61c0-3.444 1.676-4.376 4.214-5.786zM18.096 8.4c0 3.444-1.677 4.376-4.215 5.785-2.778 1.544-6.585 3.66-6.585 9.815h4.609c0-3.444 1.676-4.376 4.214-5.786 2.78-1.544 6.586-3.658 6.586-9.814h-4.609z',
    googleanalytics: 'M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z',
    figma: 'M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z',
    miro: 'M17.392 0H13.9L17 4.808 10.444 0H6.949l3.102 6.3L3.494 0H0l3.05 8.131L0 24h3.494L10.05 6.985 6.949 24h3.494L17 5.494 13.899 24h3.493L24 3.672 17.392 0z',
    notion: 'M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z',
    jira: 'M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z',
    confluence: 'M.87 18.257c-.248.382-.53.875-.763 1.245a.764.764 0 0 0 .255 1.04l4.965 3.054a.764.764 0 0 0 1.058-.26c.199-.332.454-.763.733-1.221 1.967-3.247 3.945-2.853 7.508-1.146l4.957 2.337a.764.764 0 0 0 1.028-.382l2.364-5.346a.764.764 0 0 0-.382-1 599.851 599.851 0 0 1-4.965-2.361C10.911 10.97 5.224 11.185.87 18.257zM23.131 5.743c.249-.405.531-.875.764-1.25a.764.764 0 0 0-.256-1.034L18.675.404a.764.764 0 0 0-1.058.26c-.195.335-.451.763-.734 1.225-1.966 3.246-3.945 2.85-7.508 1.146L4.437.694a.764.764 0 0 0-1.027.382L1.046 6.422a.764.764 0 0 0 .382 1c1.039.49 3.105 1.467 4.965 2.361 6.698 3.246 12.392 3.029 16.738-4.04z',
    githubcopilot: 'M23.922 16.997C23.061 18.492 18.063 22.02 12 22.02 5.937 22.02.939 18.492.078 16.997A.641.641 0 0 1 0 16.741v-2.869a.883.883 0 0 1 .053-.22c.372-.935 1.347-2.292 2.605-2.656.167-.429.414-1.055.644-1.517a10.098 10.098 0 0 1-.052-1.086c0-1.331.282-2.499 1.132-3.368.397-.406.89-.717 1.474-.952C7.255 2.937 9.248 1.98 11.978 1.98c2.731 0 4.767.957 6.166 2.093.584.235 1.077.546 1.474.952.85.869 1.132 2.037 1.132 3.368 0 .368-.014.733-.052 1.086.23.462.477 1.088.644 1.517 1.258.364 2.233 1.721 2.605 2.656a.841.841 0 0 1 .053.22v2.869a.641.641 0 0 1-.078.256Zm-11.75-5.992h-.344a4.359 4.359 0 0 1-.355.508c-.77.947-1.918 1.492-3.508 1.492-1.725 0-2.989-.359-3.782-1.259a2.137 2.137 0 0 1-.085-.104L4 11.746v6.585c1.435.779 4.514 2.179 8 2.179 3.486 0 6.565-1.4 8-2.179v-6.585l-.098-.104s-.033.045-.085.104c-.793.9-2.057 1.259-3.782 1.259-1.59 0-2.738-.545-3.508-1.492a4.359 4.359 0 0 1-.355-.508Zm2.328 3.25c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm-5 0c.549 0 1 .451 1 1v2c0 .549-.451 1-1 1-.549 0-1-.451-1-1v-2c0-.549.451-1 1-1Zm3.313-6.185c.136 1.057.403 1.913.878 2.497.442.544 1.134.938 2.344.938 1.573 0 2.292-.337 2.657-.751.384-.435.558-1.15.558-2.361 0-1.14-.243-1.847-.705-2.319-.477-.488-1.319-.862-2.824-1.025-1.487-.161-2.192.138-2.533.529-.269.307-.437.808-.438 1.578v.021c0 .265.021.562.063.893Zm-1.626 0c.042-.331.063-.628.063-.894v-.02c-.001-.77-.169-1.271-.438-1.578-.341-.391-1.046-.69-2.533-.529-1.505.163-2.347.537-2.824 1.025-.462.472-.705 1.179-.705 2.319 0 1.211.175 1.926.558 2.361.365.414 1.084.751 2.657.751 1.21 0 1.902-.394 2.344-.938.475-.584.742-1.44.878-2.497Z',
    claude: 'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z',
    neo4j: 'M9.629 13.227c-.593 0-1.139.2-1.58.533l-2.892-1.976a2.61 2.61 0 0 0 .101-.711 2.633 2.633 0 0 0-2.629-2.629A2.632 2.632 0 0 0 0 11.073a2.632 2.632 0 0 0 2.629 2.629c.593 0 1.139-.2 1.579-.533L7.1 15.145c-.063.226-.1.465-.1.711 0 .247.037.484.1.711l-2.892 1.976a2.608 2.608 0 0 0-1.579-.533A2.632 2.632 0 0 0 0 20.639a2.632 2.632 0 0 0 2.629 2.629 2.632 2.632 0 0 0 2.629-2.629c0-.247-.037-.485-.101-.711l2.892-1.976c.441.333.987.533 1.58.533a2.633 2.633 0 0 0 2.629-2.629c0-1.45-1.18-2.629-2.629-2.629ZM16.112.732c-4.72 0-7.888 2.748-7.888 8.082v3.802a3.525 3.525 0 0 1 3.071.008v-3.81c0-3.459 1.907-5.237 4.817-5.237s4.817 1.778 4.817 5.237v8.309H24V8.814C24 3.448 20.832.732 16.112.732Z',
    python: 'M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z',
  };

  // layer 0 = research & experimentation, 1 = design & delivery, 2 = AI
  const TOOLS = [
    { id: 'optimizely', name: 'Optimizely', layer: 0, mono: 'Op' },
    { id: 'contentsquare', name: 'ContentSquare', layer: 0, mono: 'Cs' },
    { id: 'hotjar', name: 'Hotjar', layer: 0 },
    { id: 'googleanalytics', name: 'Google Analytics', layer: 0 },
    { id: 'abtasty', name: 'AB Tasty', layer: 0, mono: 'AB' },
    { id: 'vwo', name: 'VWO', layer: 0, mono: 'VWO' },
    { id: 'optimalworkshop', name: 'Optimal Workshop', layer: 0, mono: 'OW' },
    { id: 'figma', name: 'Figma', layer: 1 },
    { id: 'figjam', name: 'FigJam', layer: 1, mono: 'FJ' },
    { id: 'miro', name: 'Miro', layer: 1 },
    { id: 'notion', name: 'Notion', layer: 1 },
    { id: 'jira', name: 'Jira', layer: 1 },
    { id: 'confluence', name: 'Confluence', layer: 1 },
    { id: 'phrase', name: 'Phrase', layer: 1, mono: 'Ph' },
    { id: 'microsoft365', name: 'Microsoft 365', layer: 1, mono: '365' },
    { id: 'githubcopilot', name: 'GitHub Copilot', layer: 2 },
    { id: 'vscode', name: 'VS Code', layer: 2, mono: 'VS' },
    { id: 'claude', name: 'Claude', layer: 2 },
    { id: 'anarlog', name: 'Anarlog', layer: 2, mono: 'An' },
    { id: 'neo4j', name: 'Neo4j', layer: 2 },
    { id: 'python', name: 'Python', layer: 2 },
  ];
  const byId = Object.fromEntries(TOOLS.map((t) => [t.id, t]));

  const purpose = {};
  root.querySelectorAll('.tk-tools [data-tool]').forEach((li) => {
    purpose[li.dataset.tool] = li.querySelector('.tk-tool-what').textContent.trim();
  });
  const layerNames = [stage.dataset.l0, stage.dataset.l1, stage.dataset.l2];

  const el = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  // a logo or monogram, drawn in a 24-unit box
  const mark = (t, parent, chip) => {
    if (ICONS[t.id]) return el('path', { d: ICONS[t.id], class: 'tk-logo' }, parent);
    const size = chip ? (t.mono.length > 2 ? 11 : 15) : (t.mono.length > 2 ? 9.5 : 12);
    const tx = el('text', { x: 12, y: 12, class: 'tk-mono', 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': size }, parent);
    tx.textContent = t.mono;
    return tx;
  };

  /* ── geometry ── plane coords (u, v) on a surface at height z project to
     screen as ((v − u)·cos30, (u + v)·sin30 − z): the long side runs from
     lower left to upper right, as on the homepage. */
  const K = 46, C = Math.cos(Math.PI / 6), S = 0.5;
  const COLS = 4, ROWS = 2, PAD = 0.22, BAND = 0.42;
  const W = COLS + PAD * 2, D = ROWS + PAD * 2 + BAND;
  const T = 9, GAP = 150, TILE = 0.8, TH = 5;
  const iso = (u, v, z) => [(v - u) * C * K, (u + v) * S * K - z];
  const pts = (list) => list.map((p) => p.map((n) => n.toFixed(2)).join(',')).join(' ');
  // something lying on a surface and reading along −u (up and to the right)
  const onPlane = (u, v, z, s) => {
    const [x, y] = iso(u, v, z);
    return `matrix(${C * K * s} ${-S * K * s} ${C * K * s} ${S * K * s} ${x.toFixed(2)} ${y.toFixed(2)})`;
  };

  const svg = el('svg', { class: 'tk-svg', role: 'presentation', focusable: 'false' });
  stage.appendChild(svg);

  function block(parent, u0, v0, w, d, z, h, cls) {
    const g = el('g', { class: cls }, parent);
    const a = iso(u0, v0, z), b = iso(u0 + w, v0, z), c = iso(u0 + w, v0 + d, z), e = iso(u0, v0 + d, z);
    const dn = (p) => [p[0], p[1] + h];
    el('polygon', { class: 'tk-side tk-side--l', points: pts([b, c, dn(c), dn(b)]) }, g);
    el('polygon', { class: 'tk-side tk-side--r', points: pts([e, c, dn(c), dn(e)]) }, g);
    el('polygon', { class: 'tk-top', points: pts([a, b, c, e]) }, g);
    return g;
  }

  const tiles = {};
  for (let i = 0; i < 3; i++) {
    const z = i * GAP;
    const g = el('g', { class: 'tk-layer', 'data-layer': i, style: `--i:${i}` }, svg);
    block(g, 0, 0, W, D, z, T, 'tk-slab');
    const list = TOOLS.filter((t) => t.layer === i);
    const cols = Math.min(COLS, Math.ceil(list.length / ROWS));
    const off = (COLS - cols) / 2;
    list.forEach((t, n) => {
      const col = n % cols, row = Math.floor(n / cols);
      const u0 = PAD + off + (cols - 1 - col) + (1 - TILE) / 2, v0 = PAD + row + (1 - TILE) / 2;
      const tg = block(g, u0, v0, TILE, TILE, z + TH, TH, 'tk-tile');
      tg.dataset.tool = t.id;
      const m = el('g', { class: 'tk-mark', transform: onPlane(u0 + TILE * 0.85, v0 + TILE * 0.15, z + TH, (TILE * 0.7) / 24) }, tg);
      mark(t, m);
      tiles[t.id] = { g: tg, at: iso(u0 + TILE / 2, v0 + TILE / 2, z + TH) };
    });
    // the layer's name lies on the slab's front band, reading up and to the right
    const lab = el('text', { class: 'tk-lname', transform: onPlane(W - PAD, D - BAND * 0.32, z, 1 / K) }, g);
    lab.textContent = String(layerNames[i]).replace('|', ' ');
  }
  const threads = el('g', { class: 'tk-threads' }, svg);
  const [hx, hy] = iso(W / 2, D / 2, 2 * GAP + 95);
  const hub = el('g', { class: 'tk-hub' }, svg);
  el('circle', { class: 'tk-hub-ring', cx: hx, cy: hy, r: 9 }, hub);
  el('circle', { class: 'tk-hub-dot', cx: hx, cy: hy, r: 3.5 }, hub);
  const hubLabel = el('text', { class: 'tk-hub-label', x: hx, y: hy - 18, 'text-anchor': 'middle' }, hub);

  // fit the viewBox to the drawing at rest, again once the label font is in
  function fit() {
    svg.classList.add('is-measuring');
    const box = svg.getBBox();
    svg.classList.remove('is-measuring');
    svg.setAttribute('viewBox', [box.x - 8, hy - 44, box.width + 16, box.y + box.height - hy + 52].map((n) => n.toFixed(1)).join(' '));
  }
  fit();
  if (document.fonts) document.fonts.ready.then(fit);

  /* ── state: one skill open at a time ── */
  const skills = [...root.querySelectorAll('.tk-skill')];
  let open = null;
  const toolsOf = (li) => li.dataset.tools.split(/\s+/).filter((id) => byId[id]);

  function drawThreads(ids) {
    threads.textContent = '';
    ids.forEach((id, n) => {
      const [x, y] = tiles[id].at;
      const p = el('path', {
        class: 'tk-thread', pathLength: 1, style: `--dl:${(n * 0.04).toFixed(2)}s`,
        d: `M${x.toFixed(1)} ${y.toFixed(1)} C${x.toFixed(1)} ${(y - 70).toFixed(1)} ${hx.toFixed(1)} ${(hy + 90).toFixed(1)} ${hx.toFixed(1)} ${hy.toFixed(1)}`,
      }, threads);
      el('circle', { class: 'tk-anchor', cx: x.toFixed(1), cy: y.toFixed(1), r: 2.6 }, threads);
      requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('is-drawn')));
    });
  }

  function render() {
    const lit = open ? toolsOf(open) : [];
    root.classList.toggle('has-skill', !!open);
    TOOLS.forEach((t) => tiles[t.id].g.classList.toggle('is-lit', lit.includes(t.id)));
    hubLabel.textContent = open ? open.querySelector('.tk-skill-name').textContent : '';
    drawThreads(lit);
    skills.forEach((li) => {
      const on = li === open;
      li.classList.toggle('is-open', on);
      li.querySelector('.tk-skill-btn').setAttribute('aria-expanded', String(on));
    });
  }

  // Phones: opening a skill hides the rest of the panel and slides the open
  // skill's card up over the drawing, stopping just below its lowest lit
  // tool, then scrolls so the drawing's top sits under the nav. Desktop just
  // brings the open skill into view if it isn't.
  let focusTimer;
  function focus(how) {
    clearTimeout(focusTimer);
    if (!narrow.matches || !open) panel.style.marginTop = '';
    if (!open) return;
    if (!narrow.matches) {
      if (how !== 'list') {
        const r = open.getBoundingClientRect();
        if (r.top < 90 || r.top > innerHeight - 120) open.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      return;
    }
    focusTimer = setTimeout(() => {
      const current = parseFloat(panel.style.marginTop) || 0;
      const naturalTop = panel.getBoundingClientRect().top - current;
      const lowest = Math.max(...toolsOf(open).map((id) => tiles[id].g.getBoundingClientRect().bottom));
      const overlap = Math.max(0, naturalTop - (lowest + 16));
      panel.style.marginTop = overlap ? `-${overlap}px` : '';
      const top = hub.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
    }, 30);
  }
  narrow.addEventListener('change', () => focus('list'));

  function setOpen(li, how) {
    open = li && open !== li ? li : null;
    render();
    focus(how);
  }

  /* ── each skill's panel: its tools by layer, and the skills it shares tools with ── */
  const overlapLabel = root.dataset.overlap;
  skills.forEach((li) => {
    const ids = toolsOf(li);
    const box = li.querySelector('.tk-uses');
    [2, 1, 0].forEach((k) => {
      const mine = ids.filter((id) => byId[id].layer === k);
      if (!mine.length) return;
      const row = document.createElement('div');
      row.className = 'tk-uses-row';
      const name = document.createElement('span');
      name.className = 'tk-uses-layer';
      name.textContent = String(layerNames[k]).replace('|', ' ');
      const ul = document.createElement('ul');
      ul.className = 'tk-chips';
      mine.forEach((id) => {
        const t = byId[id];
        const chip = document.createElement('li');
        chip.className = 'tk-chip';
        const ic = document.createElementNS(NS, 'svg');
        ic.setAttribute('viewBox', '0 0 24 24');
        ic.setAttribute('aria-hidden', 'true');
        mark(t, ic, true);
        chip.append(ic, t.name);
        // naming a tool points it out in the drawing
        chip.addEventListener('pointerenter', () => tiles[id].g.classList.add('is-hover'));
        chip.addEventListener('pointerleave', () => tiles[id].g.classList.remove('is-hover'));
        ul.appendChild(chip);
      });
      row.append(name, ul);
      box.appendChild(row);
    });
    const shared = skills
      .filter((o) => o !== li)
      .map((o) => ({ o, n: toolsOf(o).filter((id) => ids.includes(id)).length }))
      .filter((x) => x.n >= 2)
      .sort((a, b) => b.n - a.n)
      .slice(0, 3);
    if (shared.length) {
      const p = document.createElement('p');
      p.className = 'tk-overlap';
      p.append(overlapLabel + ' ');
      shared.forEach(({ o }) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'tk-overlap-btn';
        b.textContent = o.querySelector('.tk-skill-name').textContent;
        b.addEventListener('click', () => {
          setOpen(o, 'jump');
          o.querySelector('.tk-skill-btn').focus({ preventScroll: true });
        });
        p.appendChild(b);
      });
      box.appendChild(p);
    }
    li.querySelector('.tk-skill-btn').addEventListener('click', () => setOpen(li, 'list'));
  });
  TOOLS.forEach((t) => {
    if (!skills.some((li) => toolsOf(li).includes(t.id))) console.warn(`Toolkit: no skill uses ${t.id}`);
    if (!purpose[t.id]) console.warn(`Toolkit: no description for ${t.id}`);
  });

  /* ── tiles: hover says what the tool is for and marks the skills using it;
     a click opens one of those skills ── */
  const restCaption = () => {
    caption.textContent = caption.dataset.default;
    caption.classList.remove('is-on');
    skills.forEach((li) => li.classList.remove('is-uses'));
  };
  svg.addEventListener('pointerover', (e) => {
    const g = e.target.closest('.tk-tile');
    if (!g) return;
    const t = byId[g.dataset.tool];
    caption.textContent = '';
    const strong = document.createElement('strong');
    strong.textContent = t.name;
    caption.append(strong, ' ' + (purpose[t.id] || ''));
    caption.classList.add('is-on');
    skills.forEach((li) => li.classList.toggle('is-uses', toolsOf(li).includes(t.id)));
    g.classList.add('is-hover');
  });
  svg.addEventListener('pointerout', (e) => {
    const g = e.target.closest('.tk-tile');
    if (!g || g.contains(e.relatedTarget)) return;
    g.classList.remove('is-hover');
    restCaption();
  });
  svg.addEventListener('click', (e) => {
    const g = e.target.closest('.tk-tile');
    if (!g) return;
    if (open && toolsOf(open).includes(g.dataset.tool)) return;
    const first = skills.find((li) => toolsOf(li).includes(g.dataset.tool));
    if (first) setOpen(first, 'jump');
  });
  restCaption();

  // clicking outside the drawing's tiles and the panel, or Escape, closes the open skill
  document.addEventListener('click', (e) => {
    if (open && !e.target.closest('.tk-tile, .tk-panel')) setOpen(null);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) setOpen(null); });

  render();
  // layers rise into place the first time the section comes into view
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      if (es.some((x) => x.isIntersecting)) { root.classList.add('is-built'); io.disconnect(); }
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(stage);
  } else root.classList.add('is-built');
})();
