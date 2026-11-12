/**
 * STACKIN IT CONSULTING - MAIN SCRIPT (script.js)
 */

// Global Authentication & Dashboard Profile State Controller
window.StacklyAuth = {
  parseProfile(email, fallbackName) {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return {
        email: email || '',
        name: fallbackName || 'User',
        initials: (fallbackName || 'US').substring(0, 2).toUpperCase()
      };
    }

    const cleanEmail = email.trim();
    const lower = cleanEmail.toLowerCase();

    // Known specific defaults
    if (lower === 'a.hayes@apexlogistics.com' || lower.startsWith('a.hayes@')) {
      return { email: cleanEmail, name: 'Alexander Hayes', initials: 'AH' };
    }
    if (lower === 'arun.kumar@stackly.com' || lower.startsWith('arun.kumar@')) {
      return { email: cleanEmail, name: 'Arun Kumar', initials: 'AK' };
    }

    // Check if registered with custom name
    try {
      const registered = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (registered[lower] && registered[lower].name) {
        const regName = registered[lower].name;
        const parts = regName.trim().split(/\s+/).filter(Boolean);
        const inits = parts.length >= 2 
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : regName.substring(0, 2).toUpperCase();
        return { email: cleanEmail, name: regName, initials: inits };
      }
    } catch(e) {}

    // Derive name from email prefix
    const localPart = cleanEmail.split('@')[0];
    const parts = localPart.split(/[._\-+]+/).filter(Boolean);

    if (parts.length === 0) {
      return { email: cleanEmail, name: fallbackName || 'User', initials: (fallbackName || 'US').substring(0, 2).toUpperCase() };
    }

    const cleanParts = parts.map(p => {
      const withoutDigits = p.replace(/\d+$/, '');
      const word = withoutDigits.length > 0 ? withoutDigits : p;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    const name = cleanParts.join(' ');
    let initials = 'US';
    if (cleanParts.length >= 2) {
      initials = (cleanParts[0][0] + cleanParts[cleanParts.length - 1][0]).toUpperCase();
    } else if (cleanParts.length === 1 && cleanParts[0].length >= 2) {
      initials = cleanParts[0].substring(0, 2).toUpperCase();
    } else if (cleanParts.length === 1) {
      initials = cleanParts[0].substring(0, 1).toUpperCase();
    }

    return { email: cleanEmail, name, initials };
  },

  login(email, role, customName) {
    const profile = this.parseProfile(email, role === 'admin' ? 'Arun Kumar' : 'Alexander Hayes');
    if (customName && customName.trim()) {
      profile.name = customName.trim();
      const parts = profile.name.split(/\s+/).filter(Boolean);
      profile.initials = parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : profile.name.substring(0, 2).toUpperCase();
    }
    profile.role = role || 'client';

    localStorage.setItem('userEmail', profile.email);
    localStorage.setItem('userName', profile.name);
    localStorage.setItem('userInitials', profile.initials);
    localStorage.setItem('userRole', profile.role);
    localStorage.setItem('currentUser', JSON.stringify(profile));
    return profile;
  },

  getUser() {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) return JSON.parse(stored);
    } catch(e) {}

    const email = localStorage.getItem('userEmail');
    if (email) {
      return {
        email: email,
        name: localStorage.getItem('userName') || 'User',
        initials: localStorage.getItem('userInitials') || 'US',
        role: localStorage.getItem('userRole') || 'client'
      };
    }
    return null;
  },

  syncDashboardUI() {
    const user = this.getUser();
    if (!user || !user.email) return;

    // User Dashboard Profile Elements
    const userAvatar = document.getElementById('userProfileAvatar') || document.querySelector('.user-profile-avatar');
    const userName = document.getElementById('userProfileName') || document.querySelector('.user-profile-name');
    const dropdownUserName = document.getElementById('dropdownUserName') || document.querySelector('#profileDropdown .dropdown-header p:first-child');
    const dropdownUserEmail = document.getElementById('dropdownUserEmail') || document.querySelector('#profileDropdown .dropdown-header p:last-child');

    if (userAvatar && user.initials) userAvatar.textContent = user.initials;
    if (userName && user.name) userName.textContent = user.name;
    if (dropdownUserName && user.name) dropdownUserName.textContent = user.name;
    if (dropdownUserEmail && user.email) dropdownUserEmail.textContent = user.email;

    // Admin Dashboard Profile Elements
    const adminAvatar = document.getElementById('adminProfileAvatar') || document.querySelector('.admin-avatar');
    const adminName = document.getElementById('adminProfileName') || document.querySelector('.admin-profile-name');
    const adminDropdownUserName = document.getElementById('adminDropdownUserName') || document.querySelector('#adminProfileDropdown .admin-dropdown-header p:first-child');
    const adminDropdownUserEmail = document.getElementById('adminDropdownUserEmail') || document.querySelector('#adminProfileDropdown .admin-dropdown-header p:last-child');

    if (adminAvatar && user.initials) adminAvatar.textContent = user.initials;
    if (adminName && user.name) adminName.textContent = user.name;
    if (adminDropdownUserName && user.name) adminDropdownUserName.textContent = user.name;
    if (adminDropdownUserEmail && user.email) adminDropdownUserEmail.textContent = user.email;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Sync Profile info across dashboards
  window.StacklyAuth.syncDashboardUI();

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
    // Links with empty, '#', or unhandled anchor/javascript href
    const link = e.target.closest('a');
    if (link) {
      const href = (link.getAttribute('href') || '').trim();
      if (!href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:;' || href.toLowerCase().startsWith('javascript:')) {
        e.preventDefault();
        window.location.href = '404.html';
        return;
      }

      // Check if hash target exists on the current page
      if (href.startsWith('#') && href.length > 1) {
        if (!link.hasAttribute('data-open-modal') && !link.hasAttribute('data-tab')) {
          try {
            const target = document.querySelector(href);
            if (!target) {
              e.preventDefault();
              window.location.href = '404.html';
              return;
            }
          } catch (err) {
            e.preventDefault();
            window.location.href = '404.html';
            return;
          }
        }
      }
    }

    // Unhandled or placeholder buttons
    const btn = e.target.closest('button');
    if (btn) {
      if (btn.getAttribute('data-action') === '404' || btn.classList.contains('btn-unused') || btn.classList.contains('social-btn')) {
        e.preventDefault();
        window.location.href = '404.html';
      }
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
