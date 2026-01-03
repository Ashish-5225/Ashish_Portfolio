// Smooth Scrolling
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      document.getElementById(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Dynamic Active Navigation
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul li a');
  
  window.addEventListener('scroll', () => {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute('id');
      }
    });
  
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  });
  
  // Contact Form Validation (if added)
  const contactForm = document.querySelector('#contactForm'); // Replace with your form ID
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const emailInput = document.querySelector('#email'); // Replace with your email input ID
      const messageInput = document.querySelector('#message'); // Replace with your message input ID
  
      if (!emailInput.value || !messageInput.value) {
        alert('Please fill out all fields.');
      } else if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
        alert('Please enter a valid email address.');
      } else {
        alert('Form submitted successfully!');
        contactForm.reset();
      }
    });
  }
  
