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
    'arrow-left':  '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
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
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    // Stagger delay resets per parent instead of counting across the
    // whole page — a .reveal deep in a long page (e.g. the 40th one)
    // used to inherit ~2.4s of dead delay from unrelated sections above
    // it, so it sat invisible well after scrolling into view. Siblings
    // that reveal together (a card grid, a row list) still cascade
    // against each other; capped so a long list doesn't stack minutes.
    const siblingIndex = new Map();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      const idx = siblingIndex.get(parent) || 0;
      el.style.transitionDelay = `${Math.min(idx, 6) * 0.06}s`;
      siblingIndex.set(parent, idx + 1);
      observer.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ----------------------------------------------------------
     5. CTA ORB ENTRY ANIMATION
     ---------------------------------------------------------- */
  document.querySelectorAll('.cs-cta-orb').forEach(orb => {
    if (!('IntersectionObserver' in window)) {
      orb.classList.add('visible');
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.disconnect();
        }
      });
    }, { threshold: 0.15 });
    obs.observe(orb);
  });

  /* ----------------------------------------------------------
     6. STAT COUNTER ANIMATION
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
    // Replace .arrow text spans with arrow-right icon (or arrow-left,
    // for the rare case a control genuinely points back/previous).
    document.querySelectorAll('.arrow').forEach(el => {
      el.innerHTML = icon(el.classList.contains('arrow--left') ? 'arrow-left' : 'arrow-right');
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

  /* ----------------------------------------------------------
     10. MAGNETIC CTA BUTTONS — subtle pointer-follow, reserved for
     the closing CTA's primary actions (.v4-magnet wrapper)
     ---------------------------------------------------------- */
  const magnetEls = document.querySelectorAll('.v4-magnet');
  const canMagnet = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (magnetEls.length && canMagnet) {
    magnetEls.forEach(m => {
      m.addEventListener('pointermove', e => {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
      });
      m.addEventListener('pointerleave', () => { m.style.transform = ''; });
    });
  }

  /* ----------------------------------------------------------
     11. CASE STUDY SECTION NAV — active-section highlight + reading
     progress, shared by every case study page. Drives three things
     from one continuous scroll fraction through the .cs-section run:
     the sticky nav's fill line, its active list item, and the mobile
     fallback's fixed progress line.
     ---------------------------------------------------------- */
  (function caseStudyNav() {
    const sections = Array.from(document.querySelectorAll('.cs-section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.cs-nav-link'));
    const navFill = document.querySelector('.cs-nav-fill');
    const progressFill = document.querySelector('.cs-progress-fill');
    if (!sections.length || (!navFill && !progressFill)) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        const target = document.getElementById(link.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - (72 + 24);
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      });
    });

    let ticking = false;
    function update() {
      ticking = false;
      const first = sections[0];
      const last = sections[sections.length - 1];
      const start = first.offsetTop;
      const end = last.offsetTop + last.offsetHeight;
      const readingLine = window.scrollY + window.innerHeight * 0.4;
      const fraction = Math.min(1, Math.max(0, (readingLine - start) / (end - start)));

      if (navFill) navFill.style.height = `${fraction * 100}%`;
      if (progressFill) progressFill.style.transform = `scaleX(${fraction})`;

      let activeIndex = 0;
      sections.forEach((sec, i) => { if (readingLine >= sec.offsetTop) activeIndex = i; });
      navLinks.forEach((link, i) => {
        link.parentElement.classList.toggle('is-active', i === activeIndex);
      });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ----------------------------------------------------------
     12. WORK INDEX HOVER PREVIEW — cursor-following glass-frame
     composition, shared by the homepage's work teaser and the full
     work index. Gated behind pointer + reduced-motion checks.
     ---------------------------------------------------------- */
  (function workIndexPreview() {
    const preview = document.querySelector('.v4-preview');
    const rows = document.querySelectorAll('.v4-row[data-project]');
    if (!preview || !rows.length) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover) return;

    const groups = Array.from(preview.querySelectorAll('.v4-preview-group'));
    let px = 0, py = 0, ptx = 0, pty = 0, pOn = false;

    rows.forEach(row => {
      row.addEventListener('pointerenter', () => {
        const key = row.getAttribute('data-project');
        let activeGroup = null;
        groups.forEach(g => {
          const isMatch = g.getAttribute('data-project') === key;
          g.classList.toggle('is-active', isMatch);
          if (isMatch) activeGroup = g;
        });
        preview.classList.add('is-on');
        if (!pOn) { px = ptx; py = pty; pOn = true; }
        // Replay the settle-in animation every time, even re-hovering
        // the same row — restart by clearing then re-arming the style.
        if (activeGroup) {
          activeGroup.querySelectorAll('.v4-frame').forEach(f => {
            f.style.animation = 'none';
            void f.offsetWidth;
            f.style.animation = '';
          });
        }
      });
      row.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
    });

    window.addEventListener('pointermove', e => {
      ptx = e.clientX + 32; pty = e.clientY - 60;
    }, { passive: true });

    function tick() {
      px += (ptx - px) * 0.14; py += (pty - py) * 0.14;
      // Clamp to the viewport — the wide (landscape) preview box can reach
      // ~720px, easily wider than the cursor-following offset leaves room
      // for on common laptop widths, or when hovering rows near the edge.
      const margin = 16;
      const rect = preview.getBoundingClientRect();
      const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
      const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
      preview.style.left = Math.min(Math.max(px, margin), maxX) + 'px';
      preview.style.top = Math.min(Math.max(py, margin), maxY) + 'px';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  /* ----------------------------------------------------------
     13. EXPERIENCE SPINE PROGRESS — turns the About page's role
     timeline connector into a real reading-progress fill, not a
     static line. Same reading-line math as the case-study nav
     (section 11), simplified since there's no per-item nav to drive.
     ---------------------------------------------------------- */
  (function experienceSpine() {
    const track = document.querySelector('.experience-timeline');
    const fill = document.querySelector('.experience-fill');
    if (!track || !fill) return;

    let ticking = false;
    function update() {
      ticking = false;
      const rect = track.getBoundingClientRect();
      const readingLine = window.innerHeight * 0.4;
      const fraction = Math.min(1, Math.max(0, (readingLine - rect.top) / rect.height));
      fill.style.height = `${fraction * 100}%`;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ----------------------------------------------------------
     14. CURSOR GLOW — ambient pointer-follow wash, shared by every
     v4-editorial page via .v4-glow. Dark theme + pointer devices +
     motion allowed only. Where a page also has backdrop-filter glass
     elements (e.g. About's role-facet tiles), the glow sits behind
     them in paint order, so its colour shows through the blur —
     making the glass material obvious rather than just decorative.
     ---------------------------------------------------------- */
  (function cursorGlow() {
    const glow = document.querySelector('.v4-glow');
    if (!glow) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let gx = 0, gy = 0, tx = 0, ty = 0, glowOn = false;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!glowOn) { glowOn = true; glow.classList.add('is-on'); gx = tx; gy = ty; }
    }, { passive: true });

    function tick() {
      gx += (tx - gx) * 0.08; gy += (ty - gy) * 0.08;
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  /* ----------------------------------------------------------
     15. FRAMEWORK ARTICLE NAV — active-chapter highlight + reading
     progress for the long-form "thinking" essay template (.fwa-*).
     Same reading-line math as the case-study nav (section 11): one
     continuous scroll fraction drives the sidebar TOC's fill rail,
     its active list item, and the mobile fallback's fixed progress
     line (.cs-progress-fill, shared with case studies). Click-to-scroll
     compensates for the fixed nav so a chapter title never lands
     hidden behind it.
     ---------------------------------------------------------- */
  (function articleNav() {
    const chapters = Array.from(document.querySelectorAll('.fwa-chapter[id]'));
    const preface = document.querySelector('.fwa-preface');
    const tocLinks = Array.from(document.querySelectorAll('.fwa-toc-list a'));
    const tocFill = document.querySelector('.fwa-toc-fill');
    const progressFill = document.querySelector('.cs-progress-fill');
    if (!chapters.length || (!tocFill && !progressFill)) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    tocLinks.forEach(link => {
      link.addEventListener('click', e => {
        const target = document.getElementById(link.getAttribute('href').slice(1));
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - (72 + 24);
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      });
    });

    let ticking = false;
    function update() {
      ticking = false;
      const start = (preface || chapters[0]).offsetTop;
      const last = chapters[chapters.length - 1];
      const end = last.offsetTop + last.offsetHeight;
      const readingLine = window.scrollY + window.innerHeight * 0.4;
      const fraction = Math.min(1, Math.max(0, (readingLine - start) / (end - start)));

      if (tocFill) tocFill.style.height = `${fraction * 100}%`;
      if (progressFill) progressFill.style.transform = `scaleX(${fraction})`;

      let activeIndex = -1;
      chapters.forEach((ch, i) => { if (readingLine >= ch.offsetTop) activeIndex = i; });
      tocLinks.forEach((link, i) => {
        link.parentElement.classList.toggle('is-active', i === activeIndex + 1);
      });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

})();
