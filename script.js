/**
 * ==========================================================================
 * JEEVANANTHAM'S PORTFOLIO - MAIN JAVASCRIPT (script.js)
 * Combines Particle Engine, Custom Cursor, Navigation, Scroll-Spy,
 * Project Modals, Form Validation, Toasts, and Animations into One File.
 * ==========================================================================
 * 
 * TABLE OF CONTENTS:
 * 1. Ambient Particle Canvas Engine
 * 2. Custom Animated Cursor
 * 3. Sticky Navbar & Mobile Hamburger Drawer
 * 4. Smooth Scrolling & Active Scroll-Spy
 * 5. Dynamic Hero Typewriter Effect
 * 6. IntersectionObserver Scroll Reveals & Skill Bars
 * 7. Skill Category Filter Tabs
 * 8. Project Case Studies Data, 3D Card Tilt & Modals
 * 9. Contact Form Real-time Validation & Simulated Submission
 * 10. Copy-to-Clipboard Action & Toast Notification System
 * 11. Resume Modal, Print Trigger & Back-to-Top Button
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. AMBIENT PARTICLE CANVAS ENGINE
  // =========================================================================
  (function initParticleEngine() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrameId;
    let mouse = { x: null, y: null, radius: 140 };

    function getParticleCount() {
      const screenArea = window.innerWidth * window.innerHeight;
      if (window.innerWidth < 768) return Math.floor(screenArea / 35000);
      return Math.min(65, Math.floor(screenArea / 22000));
    }

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.density = Math.random() * 20 + 1;
        
        const rand = Math.random();
        if (rand < 0.45) {
          this.color = 'rgba(0, 242, 254, ';
        } else if (rand < 0.8) {
          this.color = 'rgba(138, 43, 226, ';
        } else {
          this.color = 'rgba(79, 172, 254, ';
        }
        this.alpha = Math.random() * 0.4 + 0.2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * this.density * 0.6;
            this.y -= forceDirectionY * force * this.density * 0.6;
          }
        }

        this.draw();
      }
    }

    function connect() {
      const maxDist = 120;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      connect();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      clearTimeout(window._resizeTimer);
      window._resizeTimer = setTimeout(resize, 200);
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });

    resize();
    animate();
  })();


  // =========================================================================
  // 2. CUSTOM ANIMATED CURSOR
  // =========================================================================
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorOutline = document.querySelector('.custom-cursor-outline');

  if (cursorDot && cursorOutline && !window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function renderCursor() {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .glass-card, .project-card, .service-card, .skill-tab-btn, .soft-skill-pill, .copy-btn');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }


  // =========================================================================
  // 3. STICKY NAVBAR & MOBILE HAMBURGER DRAWER
  // =========================================================================
  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  function toggleMobileMenu() {
    const isOpen = hamburger?.classList.toggle('active');
    mobileDrawer?.classList.toggle('open');
    mobileBackdrop?.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMobileMenu() {
    hamburger?.classList.remove('active');
    mobileDrawer?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', toggleMobileMenu);
  mobileBackdrop?.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));


  // =========================================================================
  // 4. SMOOTH SCROLLING & ACTIVE SCROLL-SPY
  // =========================================================================
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // =========================================================================
  // 5. DYNAMIC HERO TYPEWRITER EFFECT
  // =========================================================================
  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const roles = [
      'Student Developer & AI Enthusiast',
      'Front-End Web Designer',
      'Digital Marketer & Growth Strategist',
      'Graphic & Branding Designer',
      'AI Prompt Engineer'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 90;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 40;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typeDelay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeDelay = 500;
      }

      setTimeout(type, typeDelay);
    }

    setTimeout(type, 1000);
  }


  // =========================================================================
  // 6. INTERSECTION OBSERVER SCROLL REVEALS & SKILL BARS
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-init');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
          const width = fill.getAttribute('data-width') || '75%';
          fill.style.width = width;
        });
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillObserver.observe(skillsSection);
  }


  // =========================================================================
  // 7. SKILL CATEGORY FILTER TABS
  // =========================================================================
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-skill-filter');

      skillCategoryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });


  // =========================================================================
  // 8. PROJECT CASE STUDIES DATA, 3D CARD TILT & MODALS
  // =========================================================================
  const projectsData = {
    'responsive-web': {
      id: 'responsive-web',
      category: 'Web Development',
      title: 'Responsive Website Projects',
      subtitle: 'Modern Multi-device Web Applications Built with HTML, CSS & JavaScript',
      image: 'assets/images/project-web.svg',
      summary: 'Developed 2 high-performance, fully responsive websites with modern layouts, clean UI, fluid navigation, and interactive JavaScript features.',
      stats: [
        { label: 'Websites Built', value: '2 Production Sites' },
        { label: 'Responsive Breakpoints', value: 'Mobile, Tablet, Desktop' },
        { label: 'Core Stack', value: 'HTML5, CSS3, ES6 JS' },
        { label: 'Performance Score', value: '95+ Lighthouse' }
      ],
      highlights: [
        'Designed modular, clean user interface (UI) components with accessible semantic HTML5.',
        'Implemented fluid responsive grid & flexbox layouts ensuring 100% adaptability on mobile, tablet, and desktop.',
        'Crafted smooth interactive navigation with mobile hamburger transitions and active link scroll-spy.',
        'Integrated zero-dependency client-side interactions, form validation, and optimized rendering.'
      ],
      deliverables: [
        'Semantic HTML5 Architecture with structured SEO meta tags.',
        'Custom CSS3 Design System with CSS variables and dark/light color tokens.',
        'Vanilla JavaScript event handling for modals, mobile drawers, and smooth scrolling.',
        'Cross-browser tested across Chrome, Firefox, Safari, and Edge.'
      ],
      techStack: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Flexbox / Grid', 'Responsive Design', 'Git']
    },
    'digital-marketing': {
      id: 'digital-marketing',
      category: 'Digital Marketing',
      title: 'Digital Marketing Campaigns',
      subtitle: 'Data-driven Audience Growth & Content Strategy Management',
      image: 'assets/images/project-marketing.svg',
      summary: 'Planned, executed, and monitored digital marketing campaigns focused on community building, content promotion, and quantifiable engagement metrics.',
      stats: [
        { label: 'Audience Reach', value: '48.5K+ Impressions' },
        { label: 'Engagement Rate', value: '8.7% Avg Engagement' },
        { label: 'Strategy Focus', value: 'Organic + Social Promotion' },
        { label: 'CTR Improvement', value: '+68% Click-through' }
      ],
      highlights: [
        'Strategized content scheduling and targeted campaigns tailored to specific demographic segments.',
        'Optimized promotional copy, hashtags, and visual hooks to maximize user retention and engagement.',
        'Tracked campaign performance data, monitored traffic funnels, and iterated on high-performing creative formats.',
        'Implemented cross-platform marketing initiatives boosting social visibility and community interactions.'
      ],
      deliverables: [
        'Comprehensive campaign strategy outlines and content calendars.',
        'Targeted social media promotion plans across Instagram, LinkedIn, and YouTube channels.',
        'Analytics reporting dashboards reviewing CTR, impressions, and engagement peaks.',
        'Audience feedback integration for iterative content adjustments.'
      ],
      techStack: ['Social Media Marketing', 'Campaign Management', 'Content Strategy', 'Analytics & Reporting', 'Audience Growth']
    },
    'graphic-design': {
      id: 'graphic-design',
      category: 'Design & Branding',
      title: 'Graphic Design & Branding',
      subtitle: 'Complete Visual Identity Systems & High-impact Promotional Creatives',
      image: 'assets/images/project-design.svg',
      summary: 'Created distinctive branding assets, vector logos, social media marketing creatives, and promotional materials for businesses and digital platforms.',
      stats: [
        { label: 'Creatives Designed', value: '35+ Visual Assets' },
        { label: 'Brand Kits Created', value: 'Visual Guidelines' },
        { label: 'Asset Types', value: 'Posters, Banners, Socials' },
        { label: 'Tools Utilized', value: 'Vector, Canvas, AI Tools' }
      ],
      highlights: [
        'Engineered memorable brand marks, harmonious color palettes, and balanced typography pairings.',
        'Produced high-converting promotional banners, Instagram carousels, event posters, and digital brochures.',
        'Maintained strict visual consistency across brand touchpoints, ensuring cohesive digital presence.',
        'Blended graphic design fundamentals with AI image generation workflows for rapid creative prototyping.'
      ],
      deliverables: [
        'Brand identity guidelines (Color swatches, typography hierarchy, logo variations).',
        'Social media creative pack (Story templates, carousel layouts, announcement flyers).',
        'Print-ready promotional brochures and event visual assets in high resolution.',
        'Digital marketing banners optimized for web ads and social feeds.'
      ],
      techStack: ['Graphic Design', 'Brand Identity', 'Promotional Creatives', 'Social Media Design', 'AI Image Generation']
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalContentArea = document.getElementById('modalContentArea');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal || !modalContentArea) return;

    modalContentArea.innerHTML = `
      <div class="modal-project-header">
        <span class="project-badge" style="margin-bottom: 0.75rem;">${data.category}</span>
        <h2 class="project-title" style="font-size: 1.85rem; margin-bottom: 0.4rem;">${data.title}</h2>
        <p class="timeline-subtitle" style="font-size: 1.05rem; margin-bottom: 1.5rem;">${data.subtitle}</p>
      </div>

      <div class="modal-project-banner" style="border-radius: 14px; overflow: hidden; margin-bottom: 1.75rem; border: 1px solid var(--border-card);">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: auto; display: block;">
      </div>

      <div class="modal-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
        ${data.stats.map(s => `
          <div style="background: rgba(18, 22, 42, 0.7); border: 1px solid var(--border-subtle); padding: 1rem; border-radius: 10px; text-align: center;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--clr-accent-cyan); font-family: var(--font-display);">${s.value}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-top: 0.2rem;">${s.label}</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 1.75rem;">
        <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">Project Overview</h4>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7;">${data.summary}</p>
      </div>

      <div style="margin-bottom: 1.75rem;">
        <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">Key Highlights &amp; Accomplishments</h4>
        <ul class="project-highlights-list">
          ${data.highlights.map(h => `<li class="project-highlight-item" style="margin-bottom: 0.5rem; line-height: 1.5;">${h}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">Technologies &amp; Competencies</h4>
        <div class="project-tags">
          ${data.techStack.map(t => `<span class="project-tag" style="background: rgba(0, 242, 254, 0.1); border-color: rgba(0, 242, 254, 0.3); color: var(--clr-accent-cyan);">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle);">
        <a href="#contact" class="btn btn-primary btn-sm modal-contact-trigger">
          <span>Discuss Similar Project</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/></svg>
        </a>
        <button class="btn btn-secondary btn-sm modal-close-action">Close Preview</button>
      </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const contactTrigger = modalContentArea.querySelector('.modal-contact-trigger');
    if (contactTrigger) contactTrigger.addEventListener('click', closeProjectModal);

    const closeAction = modalContentArea.querySelector('.modal-close-action');
    if (closeAction) closeAction.addEventListener('click', closeProjectModal);
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-project-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-project-target');
      openProjectModal(targetId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  // 3D Card Perspective Tilt Effect
  if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }


  // =========================================================================
  // 9. CONTACT FORM VALIDATION & SERVICE PRE-FILL
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const serviceSelect = document.getElementById('serviceType');
    const subjectInput = document.getElementById('messageSubject');
    const messageInput = document.getElementById('senderMessage');
    const submitBtn = document.getElementById('formSubmitBtn');

    function validateEmail(email) {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).trim().toLowerCase());
    }

    function setFieldError(field, errorMessage) {
      const group = field.closest('.form-group');
      if (!group) return;
      group.classList.add('has-error');
      let errorElement = group.querySelector('.form-error');
      if (errorElement) errorElement.textContent = errorMessage;
    }

    function clearFieldError(field) {
      const group = field.closest('.form-group');
      if (!group) return;
      group.classList.remove('has-error');
    }

    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) input.addEventListener('input', () => clearFieldError(input));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setFieldError(nameInput, 'Please enter your valid name (min 2 characters).');
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        setFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFieldError(emailInput);
      }

      if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
        setFieldError(subjectInput, 'Please provide a subject for your inquiry.');
        isValid = false;
      } else {
        clearFieldError(subjectInput);
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setFieldError(messageInput, 'Message should be at least 10 characters long.');
        isValid = false;
      } else {
        clearFieldError(messageInput);
      }

      if (!isValid) {
        showToast('Incomplete Form', 'Please review the highlighted fields above.', 'error');
        return;
      }

      const origBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin-slow" style="animation-duration: 1s;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
        </svg>
        <span>Sending Message...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;
        contactForm.reset();
        showToast('Message Sent Successfully!', 'Thank you for reaching out, Jeevanantham will get back to you shortly.', 'success');
      }, 1200);
    });
  }

  document.querySelectorAll('[data-service-inquiry]').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service-inquiry');
      const serviceSelect = document.getElementById('serviceType');
      const subjectInput = document.getElementById('messageSubject');
      if (serviceSelect && serviceName) serviceSelect.value = serviceName;
      if (subjectInput && serviceName) subjectInput.value = `Inquiry regarding ${serviceName}`;
    });
  });


  // =========================================================================
  // 10. COPY-TO-CLIPBOARD & TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(title, message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconSvg = type === 'success' 
      ? `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>`
      : `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px) scale(0.95)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || 'Information';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          textarea.remove();
        }

        btn.classList.add('copied');
        const origHtml = btn.innerHTML;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>`;
        showToast('Copied to Clipboard!', `${label} (${textToCopy}) copied.`, 'success');

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = origHtml;
        }, 2200);
      } catch (err) {
        showToast('Copy Failed', 'Please manually select and copy the text.', 'error');
      }
    });
  });


  // =========================================================================
  // 11. RESUME MODAL, PRINT TRIGGER & BACK-TO-TOP BUTTON
  // =========================================================================
  const resumeModal = document.getElementById('resumeModal');
  const resumeModalClose = document.getElementById('resumeModalClose');
  const resumeTriggers = document.querySelectorAll('[data-resume-open]');

  function openResumeModal(e) {
    if (e) e.preventDefault();
    if (resumeModal) {
      resumeModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  resumeTriggers.forEach(t => t.addEventListener('click', openResumeModal));
  if (resumeModalClose) resumeModalClose.addEventListener('click', closeResumeModal);
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  // Escape key closes open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
    }
  });

  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});
