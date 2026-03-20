/* ============================================================
   JOSE ROMERO DESIGN — main.js
   Scroll reveals · Nav scroll · Counter animation
   Testimonial carousel · Mobile menu · Contact form
   ============================================================ */

(function () {
  'use strict';

  /* ── NAV SCROLL STATE ──────────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── MOBILE MENU ───────────────────────────────────────── */
  const burgerBtn  = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  burgerBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = burgerBtn.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      burgerBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── INTERSECTION OBSERVER REVEALS ────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  /* ── COUNTER ANIMATION ─────────────────────────────────── */
  const statNums = document.querySelectorAll('.stats__num[data-target]');

  const countUp = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start    = performance.now();
    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObs.observe(el));

  /* ── TESTIMONIAL CAROUSEL ──────────────────────────────── */
  const slides   = Array.from(document.querySelectorAll('.testimonial-slide'));
  const dots     = Array.from(document.querySelectorAll('.dot'));
  const prevBtn  = document.getElementById('prevBtn');
  const nextBtn  = document.getElementById('nextBtn');
  let current    = 0;
  let autoTimer;

  const goTo = (idx) => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  };

  const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  };

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index, 10)); resetAuto(); });
  });
  resetAuto();

  /* ── CONTACT FORM ──────────────────────────────────────── */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled   = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      contactForm.reset();
      btn.disabled   = false;
      btn.innerHTML  = 'Send Message <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/></svg>';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1200);
  });

  /* ── STAGGERED REVEAL DELAYS FOR GRID CHILDREN ────────── */
  const grids = [
    '.cases',
    '.portfolio-grid',
    '.process-steps',
  ];
  grids.forEach(selector => {
    const grid = document.querySelector(selector);
    if (!grid) return;
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.10}s`;
    });
  });

})();
