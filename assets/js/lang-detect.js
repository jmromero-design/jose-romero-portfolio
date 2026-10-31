/* ============================================================
   LANGUAGE DETECTION — loaded synchronously in <head>
   Redirects Spanish-browser users to /es/ on first visit.
   Respects an explicit preference stored in localStorage.
   Key: 'jr-lang'  Values: 'en' | 'es'

   No list of translated pages to keep: base.njk already emits the
   alternate links in <head>, above this script, so the Spanish twin's
   URL comes from the page itself. A page without that link stays where
   it is, and a new page is covered the day it is added. The build fails
   when an alternate points at a page that was not built.
   ============================================================ */
(function () {
  var LANG_KEY = 'jr-lang';
  var stored   = localStorage.getItem(LANG_KEY);
  var path     = location.pathname;

  /* Already in Spanish */
  if (path === '/es' || path.indexOf('/es/') === 0) return;

  /* The page's own Spanish twin, from <link rel="alternate" hreflang="es"> */
  var alt = document.querySelector('link[rel="alternate"][hreflang="es"]');
  if (!alt) return;
  var esPath = new URL(alt.getAttribute('href'), location.origin).pathname;

  /* Explicit EN preference — never redirect */
  if (stored === 'en') return;

  /* Explicit ES preference — redirect if the twin exists */
  if (stored === 'es') {
    location.replace(esPath);
    return;
  }

  /* No stored preference — check browser language */
  var lang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
  if (lang === 'es') location.replace(esPath);
}());
