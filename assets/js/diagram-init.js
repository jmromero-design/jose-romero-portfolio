/* ============================================================
   DIAGRAM INIT — Mermaid theme-aware rendering
   Reads data-theme from <html>, re-renders on toggle.
   ============================================================ */
(function () {
  'use strict';

  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function getThemeVars() {
    if (isDark()) {
      return {
        darkMode: true,
        background: '#111110',
        mainBkg: '#181816',
        nodeBorder: '#2A2A27',
        clusterBkg: '#151513',
        clusterBorder: '#2A2A27',
        titleColor: '#D4CFC6',
        edgeLabelBackground: '#181816',
        lineColor: '#3A3A36',
        textColor: '#D4CFC6',
        primaryColor: '#181816',
        primaryTextColor: '#D4CFC6',
        primaryBorderColor: '#3A3A36',
        secondaryColor: '#111110',
        secondaryTextColor: '#D4CFC6',
        secondaryBorderColor: '#2A2A27',
        tertiaryColor: '#0D0D0C',
        tertiaryTextColor: '#5C5955',
        tertiaryBorderColor: '#1E1E1B',
        fontFamily: "'Outfit', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '13px'
      };
    } else {
      return {
        darkMode: false,
        background: '#EDEAE4',
        mainBkg: '#E4E0D9',
        nodeBorder: '#C8C4BD',
        clusterBkg: '#EBE8E2',
        clusterBorder: '#C8C4BD',
        titleColor: '#2A2825',
        edgeLabelBackground: '#EDEAE4',
        lineColor: '#B0ACA5',
        textColor: '#3A3733',
        primaryColor: '#E4E0D9',
        primaryTextColor: '#2A2825',
        primaryBorderColor: '#C8C4BD',
        secondaryColor: '#EDEAE4',
        secondaryTextColor: '#3A3733',
        secondaryBorderColor: '#C8C4BD',
        tertiaryColor: '#F2EFE9',
        tertiaryTextColor: '#8A8680',
        tertiaryBorderColor: '#D8D4CD',
        fontFamily: "'Outfit', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '13px'
      };
    }
  }

  function renderDiagrams() {
    if (typeof mermaid === 'undefined') {
      setTimeout(renderDiagrams, 100);
      return;
    }

    /* Save source on first pass; restore on subsequent passes */
    document.querySelectorAll('.diagram-wrap').forEach(function (wrap) {
      var src = wrap.getAttribute('data-src');
      if (!src) {
        var pre = wrap.querySelector('pre.mermaid');
        if (pre) {
          src = pre.innerHTML;
          wrap.setAttribute('data-src', src);
        }
      } else {
        wrap.innerHTML = '<pre class="mermaid"></pre>';
        wrap.querySelector('pre').innerHTML = src;
      }
    });

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      flowchart: { curve: 'basis', padding: 16, useMaxWidth: true },
      themeVariables: getThemeVars()
    });

    mermaid.run({ querySelector: '.diagram-wrap .mermaid' });
  }

  /* Re-render after theme attribute has been updated */
  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle')) {
      setTimeout(renderDiagrams, 80);
    }
  });

  /* Initial render */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderDiagrams);
  } else {
    renderDiagrams();
  }

}());
