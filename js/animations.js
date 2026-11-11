/**
 * STACKLY IT CONSULTING - ADVANCED ANIMATIONS & INTERACTIONS (animations.js)
 * GSAP Orchestration, ScrollTrigger, 3D Perspective Tilt, Apple MacBook Signatures
 * Bulletproof Visibility & Fail-Safe Architecture
 */

(function () {
  'use strict';

  function init() {
    initScrollProgressBar();
    initAppleDynamicIsland();
    initRevealObserver(); // Guaranteed visibility controller
    init3DTiltCards();
    initSpotlightGrids();
    initMagneticButtons();
    initClickRipples();
    initGSAPOrchestration();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* --------------------------------------------------------------------------
     1. CRITICAL REVEAL OBSERVER - VISIBILITY GUARANTEED
     -------------------------------------------------------------------------- */
  function initRevealObserver() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    // Immediately activate elements in or near the viewport
    const viewportHeight = window.innerHeight || 800;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight + 100 || el.closest('.hero-section, .page-hero, .about-hero, .services-hero, .case-hero, .blog-hero, .contact-hero')) {
        el.classList.add('active');
      }
    });

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      });

      revealElements.forEach(el => {
        if (!el.classList.contains('active')) {
          revealObserver.observe(el);
        }
      });
    } else {
      revealElements.forEach(el => el.classList.add('active'));
    }
  }

  /* --------------------------------------------------------------------------
     2. APPLE-STYLE SCROLL PROGRESS BAR
     -------------------------------------------------------------------------- */
  function initScrollProgressBar() {
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = totalHeight > 0 ? Math.min(Math.max(window.scrollY / totalHeight, 0), 1) : 0;
          progressBar.style.transform = `scaleX(${progress})`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     3. APPLE-STYLE DYNAMIC ISLAND SCROLLED HEADER
     -------------------------------------------------------------------------- */
  function initAppleDynamicIsland() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 25) {
            header.classList.add('island-scrolled');
          } else {
            header.classList.remove('island-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     4. MACBOOK-STYLE 3D TILT WITH DYNAMIC SPECULAR LIGHT GLARE
     -------------------------------------------------------------------------- */
  function init3DTiltCards() {
    const cardSelectors = [
      '.tilt-card',
      '.service-card',
      '.why-card',
      '.impact-card',
      '.testimonial-card',
      '.blog-card',
      '.industry-card',
      '.team-card',
      '.study-card',
      '.study-featured-card',
      '.journey-card',
      '.core-value-card',
      '.contact-card',
      '.step-card',
      '.glass-card',
      '.dash-card',
      '.kpi-card',
      '.admin-kpi-card',
      '.admin-card',
      '.consultant-card'
    ];

    const cards = document.querySelectorAll(cardSelectors.join(', '));
    if (cards.length === 0) return;

    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine) return;

    cards.forEach(card => {
      let bounds;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      function handleMouseEnter() {
        updateBounds();
        card.style.transition = 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease';
      }

      function handleMouseMove(e) {
        if (!bounds) updateBounds();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const normX = (mouseX / bounds.width) - 0.5;
        const normY = (mouseY / bounds.height) - 0.5;

        const rotX = -normY * 12;
        const rotY = normX * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${mouseX.toFixed(1)}px`);
        card.style.setProperty('--mouse-y', `${mouseY.toFixed(1)}px`);
      }

      function handleMouseLeave() {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      }

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('resize', updateBounds, { passive: true });
    });
  }

  /* --------------------------------------------------------------------------
     5. APPLE-STYLE BENTO GRID SPOTLIGHT GLOW
     -------------------------------------------------------------------------- */
  function initSpotlightGrids() {
    const grids = document.querySelectorAll(
      '.services-grid, .why-grid, .industries-grid, .team-grid, .studies-grid, .values-grid, .process-steps'
    );
    if (grids.length === 0) return;

    grids.forEach(grid => {
      const cards = grid.querySelectorAll(
        '.service-card, .why-card, .industry-card, .team-card, .study-card, .core-value-card, .step-card'
      );

      grid.addEventListener('mousemove', (e) => {
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
      }, { passive: true });
    });
  }

  /* --------------------------------------------------------------------------
     6. APPLE-STYLE MAGNETIC BUTTONS
     -------------------------------------------------------------------------- */
  function initMagneticButtons() {
    const isPointerFine = window.matchMedia('(pointer: fine)').matches;
    if (!isPointerFine) return;

    const buttons = document.querySelectorAll(
      '.magnetic-btn, .btn-primary, .hero-cta-btn, .cta-banner .btn, .nav-btn-primary'
    );

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - btnCenterX) * 0.25;
        const deltaY = (e.clientY - btnCenterY) * 0.25;

        btn.style.transform = `translate(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px) scale(1.03)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. INTERACTIVE CLICK RIPPLES
     -------------------------------------------------------------------------- */
  function initClickRipples() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn, .btn-primary, .social-btn, .nav-btn, .role-option');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple-wave');

      const existingRipple = target.querySelector('.ripple-wave');
      if (existingRipple) {
        existingRipple.remove();
      }

      target.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 650);
    });
  }

  /* --------------------------------------------------------------------------
     8. GSAP & SCROLLTRIGGER ORCHESTRATION (FAIL-SAFE)
     -------------------------------------------------------------------------- */
  function initGSAPOrchestration() {
    if (typeof window.gsap === 'undefined') return;

    try {
      const gsap = window.gsap;

      if (typeof window.ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(window.ScrollTrigger);
      }

      // Hero Section Entrance
      const hero = document.querySelector('.hero-section, .page-hero, .about-hero, .services-hero, .case-hero, .blog-hero, .contact-hero');
      if (hero) {
        const heroBadge = hero.querySelector('.hero-badge, .section-badge, .breadcrumb');
        const heroTitle = hero.querySelector('.hero-title, h1');
        const heroDesc = hero.querySelector('.hero-description, .hero-lead, p');
        const heroActions = hero.querySelectorAll('.hero-btn-group a, .hero-actions a, .btn-primary');
        const heroVisual = hero.querySelector('.hero-visual, .hero-image-wrap');

        if (heroBadge) {
          gsap.fromTo(heroBadge, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' });
        }

        if (heroTitle) {
          gsap.fromTo(heroTitle, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: 'power2.out', clearProps: 'all' });
        }

        if (heroDesc) {
          gsap.fromTo(heroDesc, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: 'power2.out', clearProps: 'all' });
        }

        if (heroActions && heroActions.length > 0) {
          gsap.fromTo(heroActions, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, delay: 0.3, stagger: 0.1, ease: 'back.out(1.4)', clearProps: 'all' });
        }

        if (heroVisual) {
          gsap.fromTo(heroVisual, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power2.out', clearProps: 'all' });
        }
      }

      // Parallax Scrub on Hero Background Blobs
      if (typeof window.ScrollTrigger !== 'undefined') {
        const blobs = document.querySelectorAll('.hero-glow-blob, .mesh-gradient-orb');
        blobs.forEach(blob => {
          gsap.to(blob, {
            scrollTrigger: {
              trigger: hero || 'body',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.2
            },
            y: 80,
            ease: 'none'
          });
        });
      }
    } catch (err) {
      console.warn('GSAP animation skipped:', err);
    }
  }

})();
