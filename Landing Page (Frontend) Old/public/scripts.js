// ========================================
// ChainTorque Landing Page - Enhanced Scripts
// ========================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {

  // ========================================
  // Intersection Observer for Scroll Animations
  // ========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add staggered delay based on element index within its container
        const siblings = entry.target.parentElement.children;
        const siblingIndex = Array.from(siblings).indexOf(entry.target);
        const delay = siblingIndex * 100;

        setTimeout(() => {
          entry.target.classList.add('active');
        }, delay);

        revealOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealOnScroll.observe(el);
  });

  // Auto-add reveal class to common elements
  const autoRevealSelectors = [
    'section h2',
    'section h3',
    '.grid > div',
    '.testimonial-card',
    '.pricing-card-modern',
    '.card-modern',
    '.glass-card',
    '[data-aos]'
  ];

  autoRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${index * 50}ms`;
        revealOnScroll.observe(el);
      }
    });
  });

  // ========================================
  // 3D Tilt Effect on Cards
  // ========================================
  document.querySelectorAll('.card-custom, .glass-card, .card-modern, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -(y - centerY) / 20;
      const rotateY = (x - centerX) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ========================================
  // Mouse Follow Gradient Effect on Hero
  // ========================================
  const heroSection = document.querySelector('section:first-of-type');
  if (heroSection && heroSection.classList.contains('hero-gradient')) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      heroSection.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
        linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-mid), var(--bg-gradient-end))
      `;
    });

    heroSection.addEventListener('mouseleave', () => {
      heroSection.style.background = '';
    });
  }

  // ========================================
  // Navbar Glass Effect on Scroll
  // ========================================
  const navbar = document.querySelector('nav');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
        // Clear inline styles so class takes effect
        navbar.style.backdropFilter = '';
        navbar.style.webkitBackdropFilter = '';
        navbar.style.boxShadow = '';
      } else {
        navbar.classList.remove('navbar-scrolled');
        // Clear inline styles
        navbar.style.backdropFilter = '';
        navbar.style.webkitBackdropFilter = '';
        navbar.style.boxShadow = '';
      }
    });
  }

  // ========================================
  // Smooth Parallax Effect
  // ========================================
  const parallaxElements = document.querySelectorAll('.orb, .geo-shape, .floating-orbs > *');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    parallaxElements.forEach((el, index) => {
      const speed = 0.1 + (index * 0.05);
      const yPos = scrollY * speed;
      el.style.transform = `translateY(${yPos}px)`;
    });
  });

  // ========================================
  // Typing Animation for Hero Title
  // ========================================
  const heroTitle = document.querySelector('.hero-title, h1.text-5xl');
  if (heroTitle && heroTitle.dataset.typing !== 'done') {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';
    heroTitle.dataset.typing = 'done';

    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < originalText.length) {
        heroTitle.textContent += originalText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
  }

  // ========================================
  // Counter Animation
  // ========================================
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Observe counters and animate when visible
  document.querySelectorAll('[data-counter]').forEach(el => {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(el.dataset.counter);
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(el);
  });

  // ========================================
  // Button Ripple Effect
  // ========================================
  document.querySelectorAll('.glass-button, .btn-primary-modern, button').forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        width: 100px;
        height: 100px;
        left: ${x - 50}px;
        top: ${y - 50}px;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframes
  if (!document.getElementById('ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Orbs and hero gradient logic removed per user request

  // ========================================
  // Staggered Animation for Grid Items
  // ========================================
  document.querySelectorAll('.grid').forEach(grid => {
    const items = grid.children;
    Array.from(items).forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
    });
  });

  // ========================================
  // Theme Transition Enhancement
  // ========================================
  const themeToggle = document.getElementById('themeToggleBtn');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';

      // Add a subtle animation to all cards during theme switch
      document.querySelectorAll('.glass-card, .card-modern, .testimonial-card').forEach(card => {
        card.style.transition = 'all 0.5s ease';
      });
    });
  }

  console.log('ChainTorque animations initialized ✨');
});

// ========================================
// Preloader (optional - only if element exists)
// ========================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});
