/* ============================================================
   LANGUAGE DETECTION — loaded synchronously in <head>
   Redirects Spanish-browser users to /es/ on first visit.
   Respects an explicit preference stored in localStorage.
   Key: 'jr-lang'  Values: 'en' | 'es'
   ============================================================ */
(function () {
  var LANG_KEY = 'jr-lang';
  var stored   = localStorage.getItem(LANG_KEY);
  var path     = location.pathname;

  /* Pages that have a Spanish equivalent. Extend when more are added. */
  var translated = ['/', '/work/', '/about/', '/thinking/'];

  function hasEs(p) { return translated.indexOf(p) !== -1; }

  /* Explicit EN preference — never redirect */
  if (stored === 'en') return;

  /* Explicit ES preference — redirect to /es/ equivalent if available */
  if (stored === 'es') {
    if (!path.startsWith('/es') && hasEs(path)) {
      location.replace('/es' + path);
    }
    return;
  }

  /* No stored preference — check browser language */
  var lang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
  if (lang === 'es' && !path.startsWith('/es') && hasEs(path)) {
    location.replace('/es' + path);
  }
}());
