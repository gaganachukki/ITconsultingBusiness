/**
 * STACKIN IT CONSULTING - MAIN SCRIPT (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backToTopBtn = document.querySelector('.back-to-top');
  const navLinks = document.querySelectorAll('.nav-link');
  const statNumbers = document.querySelectorAll('[data-counter]');

  // 1. Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Back to top visibility
    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  // 2. Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const spans = mobileToggle.querySelectorAll('span');
      if (navMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when clicking on any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          const spans = mobileToggle.querySelectorAll('span');
          spans[0].style.transform = 'none';
          spans[1].style.opacity = '1';
          spans[2].style.transform = 'none';
        }
      });
    });
  }

  // 3. Back to Top Button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Counter Number Animation on Scroll
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-counter'), 10);
          const suffix = target.getAttribute('data-suffix') || '';
          const duration = 1800; // ms
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * endValue);

            target.textContent = current + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.textContent = endValue + suffix;
            }
          };

          requestAnimationFrame(updateCounter);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(stat => counterObserver.observe(stat));
  }

  // 5. Newsletter Submission Feedback
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim() !== '') {
        const btn = newsletterForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Subscribed!';
        btn.style.backgroundColor = '#10b981';
        input.value = '';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
        }, 3000);
      }
    });
  }

  // 6. Blog Carousel Dots Mock interaction
  const blogDots = document.querySelectorAll('.blog-carousel-dots .dot');
  if (blogDots.length > 0) {
    blogDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        blogDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      });
    });
  }

  // 7. Search Input Handler
  const searchInputs = document.querySelectorAll('.nav-search-input');
  searchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim() !== '') {
        const query = encodeURIComponent(input.value.trim());
        window.location.href = `services.html?search=${query}`;
      }
    });
  });

  // 8. Universal Unused Links & Buttons Router to 404
  document.addEventListener('click', (e) => {
    // Links with empty, '#', or javascript placeholder href
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
        e.preventDefault();
        window.location.href = '404.html';
        return;
      }
    }

    // Unhandled or placeholder buttons
    const btn = e.target.closest('button[data-action="404"], button.btn-unused');
    if (btn) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });

  // 9. Home Page Hero Background Cover Slideshow Auto-Loop
  const heroSlides = document.querySelectorAll('.hero-bg-slide');
  const heroDots = document.querySelectorAll('.hero-indicator-dot');

  if (heroSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = heroSlides.length;
    const intervalDuration = 5500; // 5.5s per slide for cinematic transition
    let slideTimer = null;

    function goToSlide(index) {
      heroSlides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      heroDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });

      currentSlide = index;
    }

    function nextSlide() {
      const nextIndex = (currentSlide + 1) % totalSlides;
      goToSlide(nextIndex);
    }

    function startSlideTimer() {
      stopSlideTimer();
      slideTimer = setInterval(nextSlide, intervalDuration);
    }

    function stopSlideTimer() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    // Interactive dot navigation
    heroDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startSlideTimer(); // reset auto-play timer on manual switch
      });
    });

    // Start auto loop
    startSlideTimer();

    // Pause when tab is inactive to preserve CPU / battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopSlideTimer();
      } else {
        startSlideTimer();
      }
    });
  }
});
