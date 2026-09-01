/**
 * main.js — Gastón Palavecino portfolio
 * Spotlight · reveal · nav-toggle · wordmark-home · active-nav ·
 * word-reveal · card-spotlight · magnetic-cta · command-palette
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

  /* ── 2. Scroll reveal (IntersectionObserver, with a native CSS upgrade) ── */
  (function initReveal() {
    // Modern browsers get the zero-JS CSS version (see @supports in
    // styles.css) — skip the observer entirely so nothing double-fires.
    if (window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()')) {
      return;
    }

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

  /* ── 4. Wordmark — scroll to top without leaving #hero in the URL ──────── */
  (function initWordmarkHome() {
    const wordmark = document.querySelector('.nav__wordmark');
    if (!wordmark) return;

    wordmark.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
      history.replaceState(null, '', window.location.pathname + window.location.search);
    });
  })();

  /* ── 5. Active nav link on scroll ──────────────────────────────────────── */
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

  /* ── 6. Hero statement — word-by-word reveal ────────────────────────────── */
  (function initWordReveal() {
    if (prefersReducedMotion) return;

    const statement = document.querySelector('.hero__statement');
    if (!statement) return;

    const words = statement.textContent.trim().split(/\s+/);
    statement.textContent = '';

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'hero__word';
      span.textContent = word;
      span.style.animationDelay = 160 + i * 22 + 'ms';
      statement.appendChild(span);
      if (i < words.length - 1) {
        statement.appendChild(document.createTextNode(' '));
      }
    });
  })();

  /* ── 7. Work-card spotlight — reuses the hero's cursor-follow motif ────── */
  (function initCardSpotlight() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const grid = document.querySelector('.work__grid');
    if (!grid) return;

    grid.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.work-card');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', e.clientX - rect.left + 'px');
      card.style.setProperty('--spot-y', e.clientY - rect.top + 'px');
    });
  })();

  /* ── 8. Magnetic pull — the ONE primary CTA in the hero, nothing else ──── */
  (function initMagneticCTA() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const wrap = document.querySelector('.btn-magnet');
    if (!wrap) return;

    const STRENGTH = 0.35;
    const MAX_PULL = 14;
    const RADIUS = 90;

    function clamp(v, min, max) {
      return Math.max(min, Math.min(max, v));
    }

    let ticking = false;
    let lastEvent = null;

    function update(e) {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < RADIUS + rect.width / 2) {
        wrap.style.transition = 'none';
        wrap.style.transform =
          'translate(' +
          clamp(dx * STRENGTH, -MAX_PULL, MAX_PULL) +
          'px, ' +
          clamp(dy * STRENGTH, -MAX_PULL, MAX_PULL) +
          'px)';
      } else {
        wrap.style.transition = '';
        wrap.style.transform = '';
      }
    }

    document.addEventListener('mousemove', (e) => {
      lastEvent = e;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update(lastEvent);
        ticking = false;
      });
    });

    wrap.addEventListener('mouseleave', () => {
      wrap.style.transition = '';
      wrap.style.transform = '';
    });
  })();

  /* ── 9. Command palette (Ctrl/Cmd+K) ────────────────────────────────────── */
  (function initCommandPalette() {
    const root = document.getElementById('cmdk');
    const input = document.getElementById('cmdk-input');
    const list = document.getElementById('cmdk-list');
    const footerTrigger = document.getElementById('cmdk-trigger');
    if (!root || !input || !list) return;

    const commands = [
      { label: 'About', hint: 'Section', href: '#about' },
      { label: 'Work', hint: 'Section', href: '#work' },
      { label: 'Experience', hint: 'Section', href: '#experience' },
      { label: 'Skills', hint: 'Section', href: '#skills' },
      { label: 'Education', hint: 'Section', href: '#education' },
      { label: 'Contact', hint: 'Section', href: '#contact' },
      { label: 'MDB Pilates', hint: 'Project', href: '#project-mdb' },
      { label: 'VeterinarIA', hint: 'Project', href: '#project-vet' },
      { label: 'Macro-IA', hint: 'Project', href: '#project-macro' },
      { label: 'AI Service', hint: 'Project', href: '#project-ai' },
      { label: 'YOLOv8 Livestock Detection', hint: 'Project', href: '#project-yolo' },
      { label: 'Download CV', hint: 'PDF', href: 'assets/cv-gaston-palavecino-2026.pdf', external: true },
      { label: 'Email', hint: 'gastonpalav@gmail.com', href: 'mailto:gastonpalav@gmail.com', external: true },
      { label: 'LinkedIn', hint: 'External', href: 'https://linkedin.com/in/gaston-palavecino-4071003b4', external: true },
      { label: 'WhatsApp', hint: 'External', href: 'https://wa.me/5493436445541', external: true },
    ];

    let activeIndex = 0;
    let filtered = commands;
    let lastFocused = null;

    function scrollToId(id) {
      const el = document.querySelector(id);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }

    function runCommand(cmd) {
      if (!cmd) return;
      if (cmd.external) {
        window.open(cmd.href, cmd.href.indexOf('mailto:') === 0 ? '_self' : '_blank', 'noopener');
      } else {
        scrollToId(cmd.href);
      }
      // Don't restore focus here — focusing the pre-open element would
      // fight the scroll-into-view animation we just started.
      close({ restoreFocus: false });
    }

    // Rebuilds the DOM — call only when the FILTERED SET changes.
    function render() {
      list.innerHTML = '';
      if (!filtered.length) {
        const empty = document.createElement('li');
        empty.className = 'cmdk__empty';
        empty.textContent = 'No matches.';
        list.appendChild(empty);
        return;
      }
      filtered.forEach((cmd, i) => {
        const item = document.createElement('li');
        item.className = 'cmdk__item';
        item.setAttribute('role', 'option');

        const label = document.createElement('span');
        label.className = 'cmdk__item-label';
        label.textContent = cmd.label;

        const hint = document.createElement('span');
        hint.className = 'cmdk__item-hint';
        hint.textContent = cmd.hint;

        item.append(label, hint);
        // Only re-highlight on hover — never rebuild the list here. A full
        // rebuild mid-hover replaces the node the pointer is over, which
        // can drop the very click/mouseenter event in flight.
        item.addEventListener('mouseenter', () => {
          activeIndex = i;
          updateActive();
        });
        item.addEventListener('click', () => runCommand(cmd));

        list.appendChild(item);
      });
      updateActive();
    }

    // Re-highlights the active row in place — no DOM rebuild.
    function updateActive() {
      const items = list.querySelectorAll('.cmdk__item');
      items.forEach((item, i) => {
        const isActive = i === activeIndex;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });
    }

    function filterCommands(query) {
      const q = query.trim().toLowerCase();
      filtered = q
        ? commands.filter((c) => c.label.toLowerCase().indexOf(q) !== -1 || c.hint.toLowerCase().indexOf(q) !== -1)
        : commands;
      activeIndex = 0;
      render();
    }

    function onKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
        updateActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        updateActive();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        runCommand(filtered[activeIndex]);
      } else if (e.key === 'Tab') {
        // Single-focusable-element dialog: keep focus locked on the input.
        e.preventDefault();
        input.focus();
      }
    }

    function open() {
      lastFocused = document.activeElement;
      root.hidden = false;
      input.value = '';
      filterCommands('');
      input.focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close(options) {
      const restoreFocus = !options || options.restoreFocus !== false;
      root.hidden = true;
      document.removeEventListener('keydown', onKeydown);
      if (restoreFocus && lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    document.addEventListener('keydown', (e) => {
      const isK = e.key === 'k' || e.key === 'K';
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (root.hidden) {
          open();
        } else {
          close();
        }
      }
    });

    root.querySelectorAll('[data-cmdk-dismiss]').forEach((el) => {
      el.addEventListener('click', close);
    });

    if (footerTrigger) {
      footerTrigger.addEventListener('click', open);
    }

    input.addEventListener('input', () => filterCommands(input.value));
  })();

})();
