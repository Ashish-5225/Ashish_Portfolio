/* ==========================================================================
   ASHISH DWIVEDI - NEON INTERACTIVE PORTFOLIO ENGINE
   Canvas Particles, Web Audio Sound Synthesizer, Typing Animation & Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. WEB AUDIO SYNTHESIZED SOUND ENGINE (Cyberpunk UI Sounds)
     -------------------------------------------------------------------------- */
  let audioCtx = null;
  let isSoundMuted = true; // Muted by default for polite UX

  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = soundToggleBtn ? soundToggleBtn.querySelector('.sound-text') : null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playUiSound(freq = 440, type = 'sine', duration = 0.08) {
    if (isSoundMuted || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudioContext();
      isSoundMuted = !isSoundMuted;

      if (isSoundMuted) {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundText.textContent = 'Sound: OFF';
      } else {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundText.textContent = 'Sound: ON';
        playUiSound(600, 'triangle', 0.15);
      }
    });
  }

  // Attach hover & click sounds to buttons & links
  document.querySelectorAll('.neon-btn, .neon-btn-sm, .nav-link, .filter-btn, .social-icon-link').forEach(btn => {
    btn.addEventListener('mouseenter', () => playUiSound(800, 'sine', 0.04));
    btn.addEventListener('click', () => playUiSound(1200, 'triangle', 0.08));
  });

  /* --------------------------------------------------------------------------
     2. NEON PARTICLE CANVAS SYSTEM
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.baseColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-primary').trim() || '#00f0ff';
      }

      update() {
        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Bounce borders
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction attraction
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 2;
            this.y -= (dy / dist) * force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.baseColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      let count = Math.min(Math.floor((width * height) / 12000), 85);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      let maxDist = 130;
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-primary').trim() || '#00f0ff';

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            let opacity = 1 - (dist / maxDist);
            ctx.beginPath();
            ctx.strokeStyle = primaryColor;
            ctx.globalAlpha = opacity * 0.25;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animateParticles();
  }

  /* --------------------------------------------------------------------------
     3. CUSTOM CURSOR SPOTLIGHT
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorGlow = document.getElementById('cursor-glow');

  if (cursorDot && cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;

      cursorGlow.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 400, fill: 'forwards' });
    });
  }

  /* --------------------------------------------------------------------------
     4. TYPING BANNER ANIMATION
     -------------------------------------------------------------------------- */
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const roles = [
      'Full-Stack Developer',
      'AI Applications Specialist',
      'Java & Spring Boot Architect',
      'Open-Source Contributor (GSoC)'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = 2200; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeEffect, speed);
    }

    typeEffect();
  }

  /* --------------------------------------------------------------------------
     5. SCROLL REVEAL & STATS COUNTER ANIMATION
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('[data-reveal]');
  let statsAnimated = false;

  function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.88;

    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('revealed');
      }
    });

    // Check stats trigger
    const statsSection = document.querySelector('.stats-section');
    if (statsSection && !statsAnimated) {
      const statsTop = statsSection.getBoundingClientRect().top;
      if (statsTop < triggerBottom) {
        animateStatNumbers();
        statsAnimated = true;
      }
    }

    // Navbar Scrolled Glass State
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active Link Highlight
    const sections = document.querySelectorAll('section[id]');
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }

  function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-target'), 10);
      let count = 0;
      const increment = Math.ceil(target / 45);
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          num.textContent = target;
          clearInterval(timer);
        } else {
          num.textContent = count;
        }
      }, 35);
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial invocation

  /* --------------------------------------------------------------------------
     6. PROJECT FILTER TABS
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     7. MODALS MANAGER
     -------------------------------------------------------------------------- */
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const closeBtns = document.querySelectorAll('[data-close]');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach(modal => closeModal(modal));
    }
  });

  /* --------------------------------------------------------------------------
     8. NEON THEME PALETTE SWITCHER
     -------------------------------------------------------------------------- */
  const themeDots = document.querySelectorAll('.theme-dot');
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const selectedTheme = dot.getAttribute('data-color');
      document.documentElement.setAttribute('data-theme', selectedTheme);
    });
  });

  /* --------------------------------------------------------------------------
     9. MOBILE NAVIGATION MENU
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  /* --------------------------------------------------------------------------
     10. CONTACT FORM VALIDATION & INTERACTIVE TOAST
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate sending
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending Message...';
      playUiSound(700, 'sine', 0.2);

      setTimeout(() => {
        showToast(`Thank you ${name}! Your message has been received. I'll get back to you shortly.`, 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
        playUiSound(1000, 'triangle', 0.25);
      }, 1200);
    });
  }

  function showToast(msg, type) {
    if (!formToast) return;
    formToast.textContent = msg;
    formToast.className = `form-toast ${type}`;
    formToast.classList.remove('hidden');

    setTimeout(() => {
      formToast.classList.add('hidden');
    }, 5000);
  }

  /* --------------------------------------------------------------------------
     11. AVATAR 3D PERSPECTIVE TILT
     -------------------------------------------------------------------------- */
  const avatarCard = document.getElementById('avatar-card');
  if (avatarCard) {
    avatarCard.addEventListener('mousemove', (e) => {
      const rect = avatarCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      avatarCard.querySelector('.avatar-card-inner').style.transform = 
        `rotateY(${x / 15}deg) rotateX(${-y / 15}deg)`;
    });

    avatarCard.addEventListener('mouseleave', () => {
      avatarCard.querySelector('.avatar-card-inner').style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

});
