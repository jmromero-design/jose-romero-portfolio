/* ============================================================
   JOSE ROMERO DESIGN — MAIN SCRIPT v2.1
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     INLINE SVG ICONS (replaces Lucide dependency)
     ---------------------------------------------------------- */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const ICON_PATHS = {
    sun:           '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon:          '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'chevron-right':'<path d="m9 18 6-6-6-6"/>',
    'external-link':'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  };

  function icon(name, cls) {
    return `<svg xmlns="${SVG_NS}" class="${cls || 'icon'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
  }

  /* ----------------------------------------------------------
     1. THEME — dark/light toggle with localStorage persistence
     ---------------------------------------------------------- */
  const STORAGE_KEY = 'jr-theme';
  const html = document.documentElement;

  // Apply saved or system preference on load
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  }
  // (If no saved pref, CSS @media handles system preference natively)

  // Update toggle icon to match current state
  function updateToggleIcon() {
    const toggles = document.querySelectorAll('.theme-toggle');
    const isDark = html.getAttribute('data-theme') !== 'light' &&
      !(window.matchMedia('(prefers-color-scheme: light)').matches && !html.getAttribute('data-theme'));
    toggles.forEach(t => {
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      t.innerHTML = icon(isDark ? 'sun' : 'moon');
      t.title = label;
      t.setAttribute('aria-label', label);
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.theme-toggle')) {
      const current = html.getAttribute('data-theme');
      const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      // Determine effective current mode
      const effectiveDark = current === 'dark' || (!current && !systemLight);
      const next = effectiveDark ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
      updateToggleIcon();
    }
  });

  updateToggleIcon();

  /* ----------------------------------------------------------
     2. NAV — scroll state + mobile toggle
     ---------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (nav) {
    let lastScrollY = 0;
    const HIDE_AFTER = 80; // px from top before hide logic kicks in

    const onScroll = () => {
      const y = window.scrollY;

      // Scrolled glass-deepen effect
      nav.classList.toggle('scrolled', y > 20);

      // Hide on scroll-down, reveal on scroll-up
      // Never hide if mobile menu is open
      const menuOpen = navLinks && navLinks.classList.contains('open');
      if (!menuOpen) {
        if (y > HIDE_AFTER && y > lastScrollY) {
          nav.classList.add('nav--hidden');
        } else {
          nav.classList.remove('nav--hidden');
        }
      }

      lastScrollY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (!expanded && nav) {
        // Clear nav--hidden before opening: a translated nav becomes the
        // containing block for position:fixed children, collapsing the overlay.
        nav.classList.remove('nav--hidden');
      }
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('open');
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (nav && !nav.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     3. ACTIVE NAV LINK
     ---------------------------------------------------------- */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('active');
    }
  });

  /* ----------------------------------------------------------
     4. SCROLL REVEAL
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.06}s`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     5. STAT COUNTER ANIMATION
     ---------------------------------------------------------- */
  const statValues = document.querySelectorAll('.stat-value[data-count]');

  if (statValues.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statValues.forEach(el => countObserver.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const current = Math.min(Math.round((target / steps) * step), target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  }

  /* ----------------------------------------------------------
     6. SMOOTH ANCHOR SCROLL
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     7. WORK INDEX FILTER
     ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems  = document.querySelectorAll('[data-tags]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        workItems.forEach(item => {
          const tags = item.dataset.tags || '';
          const show = filter === 'all' || tags.includes(filter);
          item.style.opacity = show ? '1' : '0';
          item.style.pointerEvents = show ? '' : 'none';
          item.style.height = show ? '' : '0';
          item.style.overflow = show ? '' : 'hidden';
          item.style.marginBottom = show ? '' : '0';
          item.style.border = show ? '' : 'none';
        });
      });
    });
  }


  /* ----------------------------------------------------------
     8. LANGUAGE TOGGLE — set explicit preference before navigating
     ---------------------------------------------------------- */
  document.querySelectorAll('[data-lang-switch]').forEach(function (link) {
    link.addEventListener('click', function () {
      localStorage.setItem('jr-lang', this.getAttribute('data-lang-switch'));
      /* href navigation continues naturally */
    });
  });

  /* ----------------------------------------------------------
     9. INLINE ICONS — replace arrow/chevron/external patterns
     ---------------------------------------------------------- */
  (function applyIcons() {
    // Replace .arrow text spans with arrow-right icon
    document.querySelectorAll('.arrow').forEach(el => {
      el.innerHTML = icon('arrow-right');
    });

    // Replace card-footer inline arrow spans
    document.querySelectorAll('.card-footer span').forEach(el => {
      if (el.textContent.trim() === '→') {
        el.innerHTML = icon('arrow-right');
      }
    });

    // Replace breadcrumb → separators with chevron-right
    document.querySelectorAll('.breadcrumb span').forEach(el => {
      if (el.textContent.trim() === '→') {
        el.innerHTML = icon('chevron-right', 'icon icon--xs');
      }
    });

    // Add external-link icon to all external links
    document.querySelectorAll('a[target="_blank"]').forEach(el => {
      if (!el.querySelector('svg') && !el.querySelector('img')) {
        el.insertAdjacentHTML('beforeend', `<span style="margin-left:0.25em;opacity:0.7;">${icon('external-link', 'icon icon--xs')}</span>`);
      }
    });
  })();

})();
