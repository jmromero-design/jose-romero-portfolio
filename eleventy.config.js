// Eleventy build for the portfolio.
//
// Pages live in src/ (same folder tree as the live URLs). The shared nav,
// footer and closing CTA are includes in src/_includes/. Everything that is
// not a page (CSS, JS, images, fonts, data, markdown twins, robots, sitemap,
// llms files) stays at the repo root and is copied to _site/ untouched.
//
// Pages are written to _site/<path>.html (not <path>/index.html) so Vercel's
// cleanUrls + trailingSlash behaviour stays exactly what it was before.

const MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
};

module.exports = function (eleventyConfig) {
  [
    "assets",
    "md",
    "apple-touch-icon.png",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "favicon.ico",
    "favicon.svg",
    "robots.txt",
    "sitemap.xml",
    "llms.txt",
    "llms-full.txt",
  ].forEach((p) => eleventyConfig.addPassthroughCopy(p));

  // "2026-10-27" -> "October 2026" / "octubre de 2026"
  eleventyConfig.addFilter("monthYear", (iso, lang) => {
    const [y, m] = iso.split("-").map(Number);
    const name = MONTHS[lang][m - 1];
    return lang === "es" ? `${name} de ${y}` : `${name} ${y}`;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk"],
  };
};
