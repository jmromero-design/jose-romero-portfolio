// Data for every page. `lang` comes from the folder (/es/ is Spanish);
// `altUrl` is the same page in the other language, used by the nav toggle.
const clean = (stem) => (stem.endsWith("/index") ? stem.slice(0, -5) : stem + "/");

module.exports = {
  permalink: (d) => `${d.page.filePathStem}.html`,
  eleventyComputed: {
    lang: (d) => (d.page.filePathStem.startsWith("/es/") ? "es" : "en"),
    // "page" on a section's own index page, "true" on pages inside the section
    navCurrentValue: (d) => (d.page.filePathStem.replace(/^\/es/, "") === "/" + d.navCurrent ? "page" : "true"),
    cleanUrl: (d) => clean(d.page.filePathStem),
    // the same page in each language (EN is also the x-default)
    enUrl: (d) => { const u = clean(d.page.filePathStem); return u.startsWith("/es/") ? (u === "/es/" ? "/" : u.slice(3)) : u; },
    esUrl: (d) => { const u = clean(d.page.filePathStem); return u.startsWith("/es/") ? u : "/es" + (u === "/" ? "/" : u); },
    altUrl: (d) => {
      const stem = d.page.filePathStem;
      if (stem === "/404") return "/es/";
      const url = clean(stem);
      return url.startsWith("/es/") ? url.slice(3) : "/es" + url;
    },
  },
};
