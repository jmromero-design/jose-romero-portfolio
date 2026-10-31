// Eleventy build for the portfolio.
//
// Pages live in src/ (same folder tree as the live URLs). The shared nav,
// footer and closing CTA are includes in src/_includes/. Assets and files that
// are not pages (CSS, JS, images, fonts, markdown twins, robots, llms files)
// stay at the repo root and are copied to _site/ untouched. The sitemap is the
// exception: src/sitemap.njk generates it from the pages that built.
//
// Pages are written to _site/<path>.html (not <path>/index.html) so Vercel's
// cleanUrls + trailingSlash behaviour stays exactly what it was before.

const MONTHS = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
};

const projects = require("./src/_data/projects.js");
const home = require("./src/_data/home.js");
const fs = require("node:fs");
const path = require("node:path");

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
    "llms.txt",
    "llms-full.txt",
  ].forEach((p) => eleventyConfig.addPassthroughCopy(p));

  // "2026-10-27" -> "October 2026" / "octubre de 2026"
  eleventyConfig.addFilter("monthYear", (iso, lang) => {
    const [y, m] = iso.split("-").map(Number);
    const name = MONTHS[lang][m - 1];
    return lang === "es" ? `${name} de ${y}` : `${name} ${y}`;
  });

  // "Ten case studies" / "Diez casos de estudio" from projects.length, so the
  // Work hero cannot drift from the list the same page renders.
  const COUNT_WORDS = {
    en: ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"],
    es: ["Cero", "Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez", "Once", "Doce"],
  };
  eleventyConfig.addFilter("countWord", (n, lang) =>
    (COUNT_WORDS[lang === "es" ? "es" : "en"][n] || String(n))
  );

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

  // Build checks on the written output, which run after every page is built.
  //
  // 1. Every alternate link has to point at a page this build produced. The nav
  //    language toggle reads the same `altUrl`, and `lang-detect.js` redirects
  //    from the alternate itself, so all three break together if a page is added
  //    in one language only. 404 is standalone and emits no alternates.
  // 2. On the Work index pages, every study needs a row and its hover preview
  //    group, matched on data-project, or hovering a row previews nothing.
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
    // Work index pages: each study needs a row and its hover preview group,
    // matched on data-project, or hovering a row silently previews nothing.
    for (const p of projects) {
      if (!Array.isArray(p.images) || p.images.length !== 2) {
        problems.push(`${p.slug}: needs exactly two images, found ${Array.isArray(p.images) ? p.images.length : 0}`);
      }
      for (const img of Array.isArray(p.images) ? p.images : []) {
        const file = path.join(__dirname, "assets", "images", "work", p.slug, img);
        if (!fs.existsSync(file)) problems.push(`${p.slug}: image not found, assets/images/work/${p.slug}/${img}`);
      }
    }
    const keys = new Set(projects.map((p) => p.dataProject));
    if (keys.size !== projects.length) {
      problems.push("projects.js: dataProject keys are not unique");
    }
    for (const r of html) {
      if (!/^\/(es\/)?work\/$/.test(urlOf(r.outputPath))) continue;
      const seen = {};
      for (const m of r.content.matchAll(/data-project="([a-z0-9]+)"/g)) {
        seen[m[1]] = (seen[m[1]] || 0) + 1;
      }
      for (const p of projects) {
        const n = seen[p.dataProject] || 0;
        if (n !== 2) problems.push(`${r.inputPath}: ${p.dataProject} appears ${n} time(s), expected 2 (row + preview)`);
      }
      for (const k of Object.keys(seen)) {
        if (!keys.has(k)) problems.push(`${r.inputPath}: data-project "${k}" has no entry in projects.js`);
      }
    }

    // Sitemap: every built page except the 404 and anything marked noindex, and
    // each of them exactly once.
    const sitemap = results.find((r) => (r.outputPath || "").endsWith("sitemap.xml"));
    const SITE = "https://www.joseromerodesign.com";
    const locs = sitemap
      ? [...sitemap.content.matchAll(/<loc>([^<]+)<\/loc>/g)]
          .map((m) => m[1].replace(SITE, ""))
      : [];
    const inSitemap = new Map();
    for (const loc of locs) inSitemap.set(loc, (inSitemap.get(loc) || 0) + 1);
    const expected = html
      .filter((r) => !/name="robots"[^>]*content="[^"]*noindex/.test(r.content))
      .map((r) => urlOf(r.outputPath))
      .filter((loc) => loc !== "/404/");
    for (const loc of expected) {
      const n = inSitemap.get(loc) || 0;
      if (n !== 1) problems.push(`sitemap.xml: ${loc} appears ${n} time(s), expected 1`);
    }
    for (const loc of inSitemap.keys()) {
      if (!expected.includes(loc)) problems.push(`sitemap.xml: ${loc} is not a page this build should list`);
    }

    // Every page must close the anchors it opens. A stray </a> from a hand
    // edit is invalid HTML that browsers forgive, so nothing else notices it.
    for (const r of html) {
      const open = (r.content.match(/<a[\s>]/g) || []).length;
      const close = (r.content.match(/<\/a>/g) || []).length;
      if (open !== close) problems.push(`${r.inputPath}: ${open} <a> opened, ${close} closed`);
    }

    // Homepage: every entry has to resolve to a study, each featured one needs
    // its row and preview group (two data-project occurrences), and compact
    // links carry none, so a missing include shows up here.
    for (const e of [...home.featured, ...home.more]) {
      if (!e.project) problems.push(`home.js: "${e.slug}" has no entry in projects.js`);
    }
    for (const e of home.featured) {
      if (!Array.isArray(e.sizes) || e.sizes.length !== 2) {
        problems.push(`home.js: "${e.slug}" needs two image sizes`);
      }
    }
    for (const r of html) {
      if (!["/", "/es/"].includes(urlOf(r.outputPath))) continue;
      const seen = {};
      for (const m of r.content.matchAll(/data-project="([a-z0-9]+)"/g)) {
        seen[m[1]] = (seen[m[1]] || 0) + 1;
      }
      for (const e of home.featured) {
        if (!e.project) continue;
        const n = seen[e.project.dataProject] || 0;
        if (n !== 2) problems.push(`${r.inputPath}: ${e.project.dataProject} appears ${n} time(s), expected 2 (row + preview)`);
      }
      for (const k of Object.keys(seen)) {
        if (!home.featured.some((e) => e.project && e.project.dataProject === k)) {
          problems.push(`${r.inputPath}: data-project "${k}" is not a featured homepage study`);
        }
      }
    }

    if (problems.length) throw new Error(problems.join("; "));
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    templateFormats: ["html", "njk"],
  };
};
