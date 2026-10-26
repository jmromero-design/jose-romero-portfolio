/* Case studies · "More case studies". Lists every other case study under the
   next-project link, so readers can jump anywhere instead of only forward,
   and marks the ones already opened in this browser (localStorage, nothing
   leaves the device). One list, here, for all 20 pages. */
(function () {
  const PROJECTS = [
    ['ikea-home-services', 'Garaje de Ideas × IKEA', 'IKEA Home Services', 'IKEA Home Services'],
    ['ikea-secondhand-marketplace', 'Garaje de Ideas × IKEA', 'IKEA Second-hand Marketplace', 'IKEA Second-hand Marketplace'],
    ['santander-nordics-cro', 'Flat 101 × Santander', 'Santander Nordics · CRO Programme', 'Santander Nordics · Programa CRO'],
    ['melia-hotels-campaign-platform', 'Flat 101 × Meliá', 'Meliá Hotels · Campaign Platform', 'Meliá Hotels · Plataforma de Campañas'],
    ['mapfre-afin-digital-expansion', 'Flat 101 × Mapfre España', 'Mapfre · AFIN Financial App', 'Mapfre · App AFIN'],
    ['mapfre-digital-expansion', 'Flat 101 × Mapfre Internacional', 'Mapfre · Digital Expansion', 'Mapfre · Expansión Digital'],
    ['iqos-club-cro', 'Flat 101 × Philip Morris', 'IQOS Club Spain · CRO Programme', 'IQOS Club España · Programa CRO'],
    ['xti-ecommerce-redesign', 'Flat 101 × XTI Store', 'XTI Store · E-commerce Redesign', 'XTI Store · Rediseño E-commerce'],
    ['ikea-ways-of-working', 'Garaje de Ideas × IKEA', 'IKEA · Ways of Working System', 'IKEA · Sistema de Formas de Trabajar'],
    ['ai-workflow-framework', 'Garaje de Ideas × IKEA', 'AI Workflow Design Framework', 'Framework de Diseño de Flujos IA'],
  ];
  const WORDS = {
    en: { title: 'All case studies', viewed: 'Viewed', all: 'Back to the full index' },
    es: { title: 'Todos los casos de estudio', viewed: 'Visto', all: 'Volver al índice completo' },
  };
  const KEY = 'jr-viewed';
  const lang = document.documentElement.lang === 'es' ? 'es' : 'en';
  const pre = lang === 'es' ? '/es' : '';
  const here = (location.pathname.match(/\/work\/([a-z0-9-]+)/) || [])[1];

  let viewed = [];
  try { viewed = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { viewed = []; }
  if (here && !viewed.includes(here)) {
    viewed.push(here);
    try { localStorage.setItem(KEY, JSON.stringify(viewed)); } catch (e) { /* private mode: no marks */ }
  }

  const host = document.querySelector('[data-case-more]');
  if (!host) return;
  const W = WORDS[lang];
  const items = PROJECTS.filter((p) => p[0] !== here).map(([slug, client, en, es]) => {
    const seen = viewed.includes(slug);
    return `<li><a class="cs-more-item${seen ? ' is-viewed' : ''}" href="${pre}/work/${slug}/">` +
      `<span class="cs-more-client">${client}</span>` +
      `<span class="cs-more-title">${lang === 'es' ? es : en}</span>` +
      (seen ? `<span class="cs-more-seen">${W.viewed}</span>` : '') + '</a></li>';
  }).join('');
  host.innerHTML = `<h2 class="cs-more-heading">${W.title}</h2><ul class="cs-more-list">${items}</ul>` +
    `<a class="cs-more-all" href="${pre}/work/">${W.all} <span class="arrow">→</span></a>`;
})();
