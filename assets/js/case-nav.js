/* Case studies · "More case studies". Lists every other case study under the
   next-project link, so readers can jump anywhere instead of only forward,
   and marks the ones already opened in this browser (localStorage, nothing
   leaves the device). One list, here, for all 20 pages.

   Each entry carries the problems that study answers, in both languages: the
   point of the list is "start with the one closest to yours", so the tags name
   the shape of the problem, not the discipline. Every tag restates something
   the case study itself says. Keep them to two per study and reuse the
   existing wording before inventing a new one. */
(function () {
  const PROJECTS = [
    {
      slug: 'ikea-home-services',
      client: 'Garaje de Ideas × IKEA',
      en: 'IKEA Home Services',
      es: 'IKEA Home Services',
      tags: { en: ['Zero to one', 'Multi-region'], es: ['De cero a uno', 'Multi-región'] },
    },
    {
      slug: 'ikea-secondhand-marketplace',
      client: 'Garaje de Ideas × IKEA',
      en: 'IKEA Second-hand Marketplace',
      es: 'IKEA Second-hand Marketplace',
      tags: { en: ['Zero to one', 'Multi-market'], es: ['De cero a uno', 'Multimercado'] },
    },
    {
      slug: 'santander-nordics-cro',
      client: 'Flat 101 × Santander',
      en: 'Santander Nordics · CRO Programme',
      es: 'Santander Nordics · Programa CRO',
      tags: { en: ['Regulated multi-market', 'Conversion'], es: ['Multimercado regulado', 'Conversión'] },
    },
    {
      slug: 'melia-hotels-campaign-platform',
      client: 'Flat 101 × Meliá',
      en: 'Meliá Hotels · Campaign Platform',
      es: 'Meliá Hotels · Plataforma de Campañas',
      tags: { en: ['Zero to one', 'Internal platform'], es: ['De cero a uno', 'Plataforma interna'] },
    },
    {
      slug: 'mapfre-afin-digital-expansion',
      client: 'Flat 101 × Mapfre España',
      en: 'Mapfre · AFIN Financial App',
      es: 'Mapfre · App AFIN',
      tags: { en: ['Trust', 'Complex decisions'], es: ['Confianza', 'Decisiones complejas'] },
    },
    {
      slug: 'mapfre-digital-expansion',
      client: 'Flat 101 × Mapfre Internacional',
      en: 'Mapfre · Digital Expansion',
      es: 'Mapfre · Expansión Digital',
      tags: { en: ['Multi-market', 'Legacy constraints'], es: ['Multimercado', 'Restricciones heredadas'] },
    },
    {
      slug: 'iqos-club-cro',
      client: 'Flat 101 × Philip Morris',
      en: 'IQOS Club Spain · CRO Programme',
      es: 'IQOS Club España · Programa CRO',
      tags: { en: ['Regulated', 'Conversion'], es: ['Regulado', 'Conversión'] },
    },
    {
      slug: 'xti-ecommerce-redesign',
      client: 'Flat 101 × XTI Store',
      en: 'XTI Store · E-commerce Redesign',
      es: 'XTI Store · Rediseño E-commerce',
      tags: { en: ['Legacy constraints', 'Redesign'], es: ['Restricciones heredadas', 'Rediseño'] },
    },
    {
      slug: 'ikea-ways-of-working',
      client: 'Garaje de Ideas × IKEA',
      en: 'IKEA · Ways of Working System',
      es: 'IKEA · Sistema de Formas de Trabajar',
      tags: { en: ['Ways of working', 'Adoption'], es: ['Formas de trabajo', 'Adopción'] },
    },
    {
      slug: 'ai-workflow-framework',
      client: 'Garaje de Ideas × IKEA',
      en: 'AI Workflow Design Framework',
      es: 'Framework de Diseño de Flujos IA',
      tags: { en: ['AI workflow', 'Ways of working'], es: ['Flujos con IA', 'Formas de trabajo'] },
    },
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
  const items = PROJECTS.filter((p) => p.slug !== here).map((p) => {
    const seen = viewed.includes(p.slug);
    const tags = (p.tags[lang] || []).join(' · ');
    return `<li><a class="cs-more-item${seen ? ' is-viewed' : ''}" href="${pre}/work/${p.slug}/">` +
      `<span class="cs-more-top">` +
      `<span class="cs-more-client">${p.client}</span>` +
      (seen ? `<span class="cs-more-seen">${W.viewed}</span>` : '') + `</span>` +
      `<span class="cs-more-title">${lang === 'es' ? p.es : p.en}</span>` +
      `<span class="cs-more-tags">${tags}</span>` +
      `</a></li>`;
  }).join('');
  host.innerHTML = `<h2 class="cs-more-heading">${W.title}</h2><ul class="cs-more-list">${items}</ul>` +
    `<a class="cs-more-all" href="${pre}/work/">${W.all} <span class="arrow">→</span></a>`;
})();
