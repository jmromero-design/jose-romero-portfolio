// The ten case studies, in reading order, and the facts each surface needs.
//
// What reads from here:
//   - the next-project chain (src/_includes/next-project.njk) and the Work
//     pages' ItemList structured data (project-items.njk), from `en` / `es`
//   - the Work index rows and their hover previews (work-row.njk,
//     work-preview.njk), from `client`, `images`, `wide`, `current` and `work`
//   - the case-study switcher (case-nav.js), from `slug`, `client`, `en`, `es`
//     and `tags`
//
// Adding a case study still means its own page pair, an entry here, a
// decisions.js entry, an llms.txt line, an About link and an OG card. `images`
// takes exactly two files, in the order the row shows them. `previewSwap` puts
// the second one in the hover preview's foreground: the pages have always mixed
// the two orders (six swapped, four not) because the front frame is chosen per
// project, so the flag keeps each as it was rather than tidying them alike.
// `dataProject` is the key main.js uses to match a row to its hover preview, so
// it must be unique and must match the preview group.
module.exports = [
  {
    slug: "ikea-home-services",
    dataProject: "hs",
    client: "Garaje de Ideas × IKEA",
    en: "IKEA Home Services",
    es: "IKEA Home Services",
    images: ["hs-homepage.webp", "hs-service-info.webp"],
    previewSwap: true,
    wide: false,
    current: true,
    work: {
      en: {
        desc: "Peer-to-peer home improvement marketplace, launched Spain 2024. 500,000+ downloads · 21,000 service requests · 4.9/5 satisfaction.",
        tags: "Product Design · Marketplace · Mobile",
      },
      es: {
        desc: "Marketplace P2P de mejoras del hogar, lanzado en España en 2024. Más de 500.000 descargas · 21.000 solicitudes de servicio · 4.9/5 de satisfacción.",
        tags: "Diseño de Producto · Marketplace · Móvil",
      },
    },
  },
  {
    slug: "ikea-secondhand-marketplace",
    dataProject: "sh",
    client: "Garaje de Ideas × IKEA",
    en: "IKEA Second-hand Marketplace",
    es: "IKEA Second-hand Marketplace",
    images: ["sh-homepage.webp", "sh-product-page.webp"],
    previewSwap: true,
    wide: false,
    current: true,
    work: {
      en: {
        desc: "Peer-to-peer IKEA resale platform, now live in five European countries.",
        tags: "Product Design · Marketplace · Circular Commerce",
      },
      es: {
        desc: "Plataforma de reventa IKEA P2P, activa en cinco países europeos.",
        tags: "Diseño de Producto · Marketplace · Comercio Circular",
      },
    },
  },
  {
    slug: "santander-nordics-cro",
    dataProject: "sn",
    client: "Flat 101 × Santander",
    en: "Santander Nordics · CRO Programme",
    es: "Santander Nordics · Programa CRO",
    images: ["sn-funnel-step2-variant.webp", "sn-funnel-step2-original.webp"],
    previewSwap: true,
    wide: false,
    current: false,
    work: {
      en: {
        desc: "Lead UX/CRO designer across four Nordic markets throughout the Flat 101 engagement.",
        tags: "CRO · Banking · Multi-market",
      },
      es: {
        desc: "Diseñador líder UX/CRO en cuatro mercados nórdicos a lo largo del proyecto en Flat 101.",
        tags: "CRO · Banca · Multipaís",
      },
    },
  },
  {
    slug: "melia-hotels-campaign-platform",
    dataProject: "melia",
    client: "Flat 101 × Meliá",
    en: "Meliá Hotels · Campaign Platform",
    es: "Meliá Hotels · Plataforma de Campañas",
    images: ["artifact1-overview.webp", "artifact5-budget.webp"],
    previewSwap: true,
    wide: true,
    current: false,
    work: {
      en: {
        desc: "3-year engagement. Platform built from zero, live across all Meliá markets.",
        tags: "Product Design · Web Application · Hospitality",
      },
      es: {
        desc: "Proyecto de 3 años. Plataforma construida desde cero, activa en todos los mercados de Meliá.",
        tags: "Diseño de Producto · Aplicación Web · Hostelería",
      },
    },
  },
  {
    slug: "mapfre-afin-digital-expansion",
    dataProject: "afin",
    client: "Flat 101 × Mapfre España",
    en: "Mapfre · AFIN Financial App",
    es: "Mapfre · App AFIN",
    images: ["afin-m-proposal.webp", "afin-m-start.webp"],
    previewSwap: true,
    wide: false,
    current: false,
    work: {
      en: {
        desc: "Self-service financial app: progressive disclosure IA and a Financial Advisor feature built around user trust and autonomy.",
        tags: "Product Design · Mobile & Web · FinTech",
      },
      es: {
        desc: "App financiera de autoservicio: arquitectura IA de divulgación progresiva y funcionalidad de Asesor Financiero basada en la confianza del usuario.",
        tags: "Diseño de Producto · Móvil y Web · FinTech",
      },
    },
  },
  {
    slug: "mapfre-digital-expansion",
    dataProject: "mde",
    client: "Flat 101 × Mapfre Internacional",
    en: "Mapfre · Digital Expansion",
    es: "Mapfre · Expansión Digital",
    images: ["verti-home-desktop.webp", "offices-desktop.webp"],
    previewSwap: false,
    wide: true,
    current: false,
    work: {
      en: {
        desc: "Lead designer on Verti platform redesign, Insurance Offices & Agents Directory (Latin America), and international CRO.",
        tags: "Platform Design · Multi-market · Design System",
      },
      es: {
        desc: "Diseño líder en el rediseño de Verti, Directorio de Oficinas y Agentes (Latinoamérica) y CRO internacional.",
        tags: "Diseño de Plataforma · Multipaís · Sistema de Diseño",
      },
    },
  },
  {
    slug: "iqos-club-cro",
    dataProject: "iqos",
    client: "Flat 101 × Philip Morris",
    en: "IQOS Club Spain · CRO Programme",
    es: "IQOS Club España · Programa CRO",
    images: ["hp-v6-desktop.webp", "hp-control-desktop.webp"],
    previewSwap: true,
    wide: true,
    current: false,
    work: {
      en: {
        desc: "Project lead, ongoing optimisation of Philip Morris loyalty portal.",
        tags: "CRO · Loyalty · Behavioural Economics",
      },
      es: {
        desc: "Project lead, optimización continua del portal de fidelización de Philip Morris.",
        tags: "CRO · Fidelización · Economía Conductual",
      },
    },
  },
  {
    slug: "xti-ecommerce-redesign",
    dataProject: "xti",
    client: "Flat 101 × XTI Store",
    en: "XTI Store · E-commerce Redesign",
    es: "XTI Store · Rediseño E-commerce",
    images: ["plp-m-s1.webp", "pdp-m-s1.webp"],
    previewSwap: false,
    wide: false,
    current: false,
    work: {
      en: {
        desc: "Full redesign within Magento platform constraints.",
        tags: "E-commerce · UI Design · Fashion",
      },
      es: {
        desc: "Rediseño completo dentro de las restricciones de la plataforma Magento.",
        tags: "E-commerce · Diseño UI · Moda",
      },
    },
  },
  {
    slug: "ikea-ways-of-working",
    dataProject: "wow",
    client: "Garaje de Ideas × IKEA",
    en: "IKEA · Ways of Working System",
    es: "IKEA · Sistema de Formas de Trabajar",
    images: ["artifact1-wow-system-architecture.webp", "artifact3-skapa-decision-framework.webp"],
    previewSwap: false,
    wide: true,
    current: true,
    work: {
      en: {
        desc: "Cross-tool workflow architecture built from first principles.",
        tags: "Design Operations · Systems · Facilitation",
      },
      es: {
        desc: "Arquitectura de flujo de trabajo cross-tool construida desde los principios.",
        tags: "Operaciones de Diseño · Sistemas · Facilitación",
      },
    },
  },
  {
    slug: "ai-workflow-framework",
    dataProject: "ai",
    client: "Garaje de Ideas × IKEA",
    en: "AI Workflow Design Framework",
    es: "Framework de Diseño de Flujos IA",
    images: ["artifact1-multi-agent-orchestration.webp", "artifact2-five-phase-workflow.webp"],
    previewSwap: false,
    wide: true,
    current: false,
    work: {
      en: {
        desc: "Multi-agent process architecture, designing AI into the workflow rather than just using it.",
        tags: "AI Workflow Design · Process Architecture · Facilitation",
      },
      es: {
        desc: "Arquitectura de proceso multi-agente, diseñando la IA en el flujo de trabajo en lugar de solo usarla.",
        tags: "Diseño de Flujos IA · Arquitectura de Procesos · Facilitación",
      },
    },
  },
];
