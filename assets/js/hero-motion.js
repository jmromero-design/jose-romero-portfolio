/* Homepage hero: one control pauses every motion that loops on the page, as
   WCAG 2.2.2 asks for anything that moves for more than five seconds:
   the map's sway and its sparks, the scroll cue, and the client logo cycle
   (main.js listens for the 'jr:motion' event).

   State lives on <html>: data-motion="paused" freezes every motion where it
   is. A pause chosen on an earlier visit (localStorage jr-motion) is applied
   by base.njk before the page draws, together with data-motion-skip, which
   skips the map's entry for that visit: the map opens finished, and resuming
   plays only the loop. The map's loop also pauses while the hero is off
   screen. */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('[data-motion-toggle]');
  var illo = document.querySelector('.v4-hero-illo');
  var svg = illo && illo.querySelector('svg.hm');
  if (!btn || !svg) return;

  var KEY = 'jr-motion';
  var userPaused = root.getAttribute('data-motion') === 'paused';
  var onScreen = true;

  function store(paused) {
    try { if (paused) localStorage.setItem(KEY, 'paused'); else localStorage.removeItem(KEY); } catch (e) { /* private mode: the pause lasts for this visit */ }
  }
  // the sparks are SMIL, outside the CSS play state
  function smil() {
    if (userPaused || !onScreen) svg.pauseAnimations(); else svg.unpauseAnimations();
  }
  function render() {
    var text = btn.querySelector('.v4-motion-text');
    text.textContent = btn.getAttribute(userPaused ? 'data-label-play' : 'data-label-pause');
    if (userPaused) btn.setAttribute('data-paused', ''); else btn.removeAttribute('data-paused');
  }

  btn.addEventListener('click', function () {
    userPaused = !userPaused;
    if (userPaused) root.setAttribute('data-motion', 'paused');
    else root.removeAttribute('data-motion');
    store(userPaused);
    smil();
    render();
    document.dispatchEvent(new CustomEvent('jr:motion', { detail: { paused: userPaused } }));
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      onScreen = en[0].isIntersecting;
      illo.classList.toggle('is-off', !onScreen);
      smil();
    }).observe(illo);
  }
  smil();
  render();
})();
