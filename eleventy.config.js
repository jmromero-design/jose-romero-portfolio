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

  // Build-time checks for the site's content rules (see CLAUDE.md): titles
  // <= 60 characters, meta/og/twitter descriptions <= 160, one <h1> per page.
  // A page that breaks one fails the build, so it never reaches Vercel.
  eleventyConfig.addTransform("content-rules", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const where = this.page.inputPath;
    const problems = [];
    const title = (content.match(/<title>(.*?)<\/title>/s) || [])[1];
    if (title && title.length > 60) problems.push(`title is ${title.length} characters (max 60)`);
    for (const m of content.matchAll(/<meta\s+(?:name|property)="((?:og:|twitter:)?description)"\s+content="([^"]*)"/g)) {
      if (m[2].length > 160) problems.push(`${m[1]} is ${m[2].length} characters (max 160)`);
    }
    const h1 = (content.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) problems.push(`${h1} <h1> elements (need exactly 1)`);
    if (problems.length) throw new Error(`${where}: ${problems.join("; ")}`);
    return content;
  });

  // Every alternate link has to point at a page this build produced. The nav
  // language toggle reads the same `altUrl`, and `lang-detect.js` now redirects
  // from the alternate itself, so all three break together if a page is added
  // in one language only. 404 is standalone and emits no alternates.
  eleventyConfig.on("eleventy.after", ({ results }) => {
    const html = results.filter((r) => (r.outputPath || "").endsWith(".html") && r.content);
    // Pages are written as <path>.html (see src.11tydata.js), so an index page
    // keeps its /index.html and every other page loses its trailing slash.
    const urlOf = (outputPath) => {
      const rel = outputPath.split(/[\\/]_site[\\/]/).pop() || "";
      if (rel === "index.html") return "/";
      if (rel.endsWith("/index.html") || rel.endsWith("\\index.html")) return "/" + rel.slice(0, -"index.html".length);
      return "/" + rel.replace(/\.html$/, "/");
    };
    const built = new Set(html.map((r) => urlOf(r.outputPath)));
    const problems = [];
    for (const r of html) {
      for (const m of r.content.matchAll(
        /<link rel="alternate" hreflang="(en|es|x-default)" href="([^"]+)">/g
      )) {
        const target = new URL(m[2]).pathname;
        if (!built.has(target)) {
          problems.push(`${r.inputPath}: hreflang ${m[1]} -> ${target}, which this build did not produce`);
        }
      }
    }
    if (problems.length) throw new Error(`Broken language alternates: ${problems.join("; ")}`);
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk"],
  };
};
