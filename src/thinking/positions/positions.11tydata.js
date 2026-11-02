// Data for the position pages, /thinking/positions/<slug>/ and the Spanish
// twins under /es/ (whose directory data file re-exports this one). The page
// file is a one-line extend of position.njk; its name is the slug, and
// everything else comes from src/_data/positions.js.
const { list } = require("../../_data/positions.js");

const langOf = (d) => (d.page.filePathStem.startsWith("/es/") ? "es" : "en");
const entry = (d) => {
  const p = list.find((x) => x.slug === d.page.fileSlug);
  if (!p) throw new Error(`${d.page.inputPath}: no position "${d.page.fileSlug}" in src/_data/positions.js`);
  return p;
};

module.exports = {
  navCurrent: "thinking",
  ogType: "article",
  ctaCv: false,
  eleventyComputed: {
    position: (d) => entry(d)[langOf(d)],
    positionSlug: (d) => entry(d).slug,
    otherPositions: (d) => list.filter((x) => x.slug !== d.page.fileSlug).map((x) => ({ slug: x.slug, ...x[langOf(d)] })),
    title: (d) => `${entry(d)[langOf(d)].topic} · Jose Romero`,
    description: (d) => entry(d)[langOf(d)].description,
    ogImage: (d) => `https://www.joseromerodesign.com/assets/images/og-thinking${langOf(d) === "es" ? "-es" : ""}.webp?v=2`,
    ctaHeading: (d) => (langOf(d) === "es"
      ? "¿Le das vueltas<br><em class=\"accent-italic\">a las mismas preguntas?</em>"
      : "Thinking about<br><em class=\"accent-italic\">the same questions?</em>"),
    ctaBody: (d) => (langOf(d) === "es"
      ? "Siempre me alegra comparar notas sobre IA en equipos de diseño, ciencia del comportamiento y cómo trabajan los equipos. Abierto a roles de product design senior y proyectos de consultoría selectivos, en inglés o español."
      : "I’m always glad to compare notes on AI in design teams, behavioural science and how teams work. Open to senior product design roles and selective consulting engagements, in English or Spanish."),
  },
};
