/**
 * main.js — Gastón Palavecino portfolio
 * Three primitives: spotlight · reveal · nav-toggle
 * No external dependencies. Respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Cursor spotlight (HP3) ──────────────────────────────────────────── */
  (function initSpotlight() {
    if (prefersReducedMotion) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
      // Drift back to default position
      targetX = hero.offsetWidth * 0.3;
      targetY = hero.offsetHeight * 0.45;
    });

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function tick() {
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);

      hero.style.setProperty('--spotlight-x', currentX + 'px');
      hero.style.setProperty('--spotlight-y', currentY + 'px');

      rafId = requestAnimationFrame(tick);
    }

    // Initialise position and start loop
    currentX = hero.offsetWidth * 0.3;
    currentY = hero.offsetHeight * 0.45;
    targetX = currentX;
    targetY = currentY;

    rafId = requestAnimationFrame(tick);

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    });
  })();

  /* ── 2. Scroll reveal (IntersectionObserver) ────────────────────────────── */
  (function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: make all visible immediately
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  })();

  /* ── 3. Nav mobile toggle ───────────────────────────────────────────────── */
  (function initNavToggle() {
    const toggle = document.querySelector('.nav__toggle');
    const sheet = document.querySelector('.nav__sheet');
    if (!toggle || !sheet) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      sheet.classList.toggle('is-open', !isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !sheet.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        sheet.classList.remove('is-open');
      }
    });

    // Close when a sheet link is clicked
    sheet.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        sheet.classList.remove('is-open');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        sheet.classList.remove('is-open');
        toggle.focus();
      }
    });
  })();

  /* ── 4. Active nav link on scroll ──────────────────────────────────────── */
  (function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((section) => observer.observe(section));
  })();

})();
