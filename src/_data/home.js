// Homepage curation. Identity, client, images and canonical names come from
// projects.js; this file holds only what the homepage decides: which studies it
// shows, in what order, as a full row or a one-line link, and the shorter copy
// it uses for them.
//
// The homepage shows nine of the ten studies. Meliá is deliberately absent,
// because it is the one engagement described in the internal-tool framing
// rather than a product the reader can go and use. Keep that choice explicit
// here rather than inferring it from what is missing.
const projects = require("./projects.js");
const bySlug = new Map(projects.map((p) => [p.slug, p]));

// Full rows: thumbnails, a description, and a hover preview (sizes are the
// intrinsic width and height of each image, in images order).
const featured = [
  {
    slug: "ikea-home-services",
    sizes: [[620, 1348], [620, 1348]],
    desc: {
      en: "Peer-to-peer services marketplace, live in seven Spanish regions. 500,000+ downloads, 4.9/5 satisfaction.",
      es: "Marketplace P2P de servicios, activo en siete regiones españolas. Más de 500.000 descargas, 4.9/5 de satisfacción.",
    },
    tags: { en: "Product Design · Marketplace", es: "Diseño de Producto · Marketplace" },
  },
  {
    slug: "mapfre-afin-digital-expansion",
    sizes: [[361, 750], [361, 749]],
    desc: {
      en: "Self-service financial management for one of Spain's largest insurers, built around user trust.",
      es: "Gestión financiera de autoservicio para una de las mayores aseguradoras de España, construida sobre la confianza del usuario.",
    },
    tags: { en: "Product Design · FinTech", es: "Diseño de Producto · FinTech" },
  },
  {
    slug: "santander-nordics-cro",
    sizes: [[620, 1711], [620, 1718]],
    desc: {
      en: "Data-driven experimentation across four regulated markets: Denmark, Sweden, Finland, Norway.",
      es: "Experimentación basada en datos en cuatro mercados regulados: Dinamarca, Suecia, Finlandia y Noruega.",
    },
    tags: { en: "CRO · Banking", es: "CRO · Banca" },
  },
];

// One-line links under "More case studies".
const more = [
  { slug: "ikea-secondhand-marketplace", tags: { en: "Circular Commerce", es: "Comercio Circular" } },
  { slug: "ikea-ways-of-working", tags: { en: "Design Ops", es: "Design Ops" } },
  { slug: "ai-workflow-framework", tags: { en: "Framework · Process Architecture", es: "Framework · Arquitectura de Proceso" } },
  { slug: "mapfre-digital-expansion", tags: { en: "Multi-market · CRO", es: "Multi-mercado · CRO" } },
  { slug: "iqos-club-cro", tags: { en: "Behavioural Economics · Loyalty", es: "Economía Conductual · Fidelización" } },
  { slug: "xti-ecommerce-redesign", tags: { en: "E-commerce · Behavioural Data", es: "E-commerce · Datos de Comportamiento" } },
];

const resolve = (entry, feature) => ({ ...entry, feature, project: bySlug.get(entry.slug) });

module.exports = {
  featured: featured.map((e) => resolve(e, true)),
  more: more.map((e) => resolve(e, false)),
};
