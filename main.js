/**
 * MGROUP CI — main.js
 * Version : 1.0 Production | Hostinger Ready
 * ─────────────────────────────────────────────
 * Modules :
 *  1. Custom Cursor
 *  2. Header scroll & mobile menu
 *  3. Scroll Reveal (IntersectionObserver)
 *  4. Counter animation (chiffres clés)
 *  5. Portfolio filter
 *  6. Partners scroll pause on hover
 *  7. Contact form (EmailJS / Google Workspace)
 *  8. Language switcher (FR/EN)
 *  9. Smooth anchor scrolling
 * ─────────────────────────────────────────────
 */

'use strict';

/* ══════════════════════════════════════
   1. CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('js-cursor');
  const ring   = document.getElementById('js-cursor-ring');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Ring follows with smooth lag
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state on interactive elements
  const interactives = 'a, button, .pole-card, .real-card, .filter-btn, .partner-chip, input, select, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      document.body.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      document.body.classList.remove('hovering');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity   = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    ring.style.opacity   = '1';
  });
})();


/* ══════════════════════════════════════
   2. HEADER — Scroll shrink + Mobile menu
══════════════════════════════════════ */
(function initHeader() {
  const header    = document.getElementById('js-header');
  const inner     = header ? header.querySelector('.header-inner') : null;
  const burger    = document.getElementById('js-burger');
  const mobileMenu = document.getElementById('js-mobile-menu');
  if (!header) return;

  // Scroll shrink
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      inner && inner.classList.add('scrolled');
    } else {
      inner && inner.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link, .btn-primary').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', true);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }
})();


/* ══════════════════════════════════════
   3. SCROLL REVEAL
══════════════════════════════════════ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionnel : ne plus observer après révélation
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════
   4. COUNTER ANIMATION
══════════════════════════════════════ */
(function initCounters() {
  const chiffresSection = document.getElementById('chiffres');
  if (!chiffresSection) return;

  const counters = chiffresSection.querySelectorAll('.chiffre-num[data-target]');
  let animated   = false;

  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 1800; // ms
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      counters.forEach(animateCounter);
    }
  }, { threshold: 0.4 });

  observer.observe(chiffresSection);
})();


/* ══════════════════════════════════════
   5. PORTFOLIO FILTER
══════════════════════════════════════ */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.real-card[data-cat]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Active state
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;

      cards.forEach(card => {
        const cats = card.dataset.cat || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
          // Small animation reset
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .4s ease, transform .4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ══════════════════════════════════════
   6. SMOOTH ANCHOR SCROLLING
══════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      const headerH = document.getElementById('js-header')?.offsetHeight || 80;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 10;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ══════════════════════════════════════
   7. LANGUAGE SWITCHER
══════════════════════════════════════ */
(function initLang() {
  const langBtns = document.querySelectorAll('.lang-btn');
  if (!langBtns.length) return;

  langBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      langBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');

      const lang = this.dataset.lang;
      document.documentElement.setAttribute('lang', lang);
      // Ici : brancher la logique i18n si implémentée
      // Pour le moment : notification console
      if (lang === 'en') {
        console.info('🌐 EN version — À implémenter via fichier translations.js');
      }
    });
  });
})();


/* ══════════════════════════════════════
   8. CONTACT FORM — EmailJS integration
   ─────────────────────────────────────
   INSTRUCTIONS HOSTINGER :
   1. Créer un compte sur https://www.emailjs.com (gratuit)
   2. Créer un Service lié à votre Gmail / Google Workspace
   3. Créer un Template EmailJS
   4. Renseigner les 3 variables ci-dessous
   ──────────────────────────────────────
══════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = 'VOTRE_PUBLIC_KEY';   // ← EmailJS dashboard
const EMAILJS_SERVICE_ID  = 'VOTRE_SERVICE_ID';   // ← Ex: service_abc123
const EMAILJS_TEMPLATE_ID = 'VOTRE_TEMPLATE_ID';  // ← Ex: template_xyz789

(function initContactForm() {
  const form    = document.getElementById('js-form');
  const submit  = document.getElementById('js-submit');
  const success = document.getElementById('js-success');
  if (!form) return;

  // Charger EmailJS dynamiquement (évite d'alourdir le HTML)
  function loadEmailJS(callback) {
    if (window.emailjs) { callback(); return; }
    const script  = document.createElement('script');
    script.src    = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      callback();
    };
    document.head.appendChild(script);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validation basique
    const nom    = form.querySelector('[name="nom"]').value.trim();
    const email  = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!nom || !email || !message) {
      alert('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }

    // Désactiver le bouton
    submit.textContent = 'Envoi en cours...';
    submit.disabled    = true;

    // Données du template EmailJS
    const templateParams = {
      from_name:    nom,
      from_email:   email,
      company:      form.querySelector('[name="entreprise"]').value.trim(),
      phone:        form.querySelector('[name="telephone"]').value.trim(),
      need_type:    form.querySelector('[name="besoin"]').value,
      budget:       form.querySelector('[name="budget"]').value,
      message:      message,
      to_email:     'contact@mgroupci.net',
    };

    loadEmailJS(() => {
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          // Succès
          success.classList.add('show');
          form.reset();
          submit.textContent = 'Envoyer ma demande →';
          submit.disabled    = false;
          // Cache le message de succès après 8s
          setTimeout(() => success.classList.remove('show'), 8000);
        })
        .catch((error) => {
          console.error('EmailJS error:', error);
          alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
          submit.textContent = 'Envoyer ma demande →';
          submit.disabled    = false;
        });
    });
  });
})();


/* ══════════════════════════════════════
   9. MICRO-INTERACTIONS DIVERSES
══════════════════════════════════════ */
(function initMisc() {
  // Highlight active nav link sur scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('nav-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(s => observer.observe(s));
  }

  // Pole cards : ripple effect on click
  document.querySelectorAll('.pole-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute; border-radius:50%;
        width:4px; height:4px;
        background:rgba(255,255,255,.2);
        left:${e.clientX - rect.left}px;
        top:${e.clientY - rect.top}px;
        transform:scale(0); pointer-events:none;
        animation:rippleEffect .6s ease forwards;
      `;
      if (!document.getElementById('ripple-style')) {
        const st = document.createElement('style');
        st.id = 'ripple-style';
        st.textContent = '@keyframes rippleEffect{to{transform:scale(80);opacity:0}}';
        document.head.appendChild(st);
      }
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
})();
