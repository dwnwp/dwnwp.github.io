/**
 * main.js — Portfolio Site Scripts
 * Handles: Language Toggle, Mobile Menu, Active Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
});

/* ========================================
   Mobile Menu Toggle
   ======================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  let isOpen = false;

  menuBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    mobileMenu.classList.toggle('hidden', !isOpen);
    menuIcon.classList.toggle('hidden', isOpen);
    closeIcon.classList.toggle('hidden', !isOpen);
  });

  // Close menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false;
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });
}

/* ========================================
   Active Navigation Highlight
   ======================================== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateNav() {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Offset for navbar
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    // Fallback for reaching the very bottom of the page
    if (window.innerHeight + scrollY >= document.body.offsetHeight - 50) {
      current = sections[sections.length - 1].getAttribute('id');
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateNav);
  // Initial check
  updateNav();
}

/* ========================================
   Image Lightbox (Zoom & Pan)
   ======================================== */
let currentScale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;
const minScale = 0.5, maxScale = 4;

function openLightbox(src) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  
  if (modal && img) {
    img.src = src;
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateLightboxTransform();
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function zoomLightbox(delta) {
  currentScale += delta;
  currentScale = Math.max(minScale, Math.min(maxScale, currentScale));
  updateLightboxTransform();
}

function updateLightboxTransform() {
  const img = document.getElementById('lightbox-img');
  if (img) {
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('lightbox-container');
  if (container) {
    // Wheel zooming
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      zoomLightbox(delta);
    }, { passive: false });
    
    // Mouse dragging
    container.addEventListener('mousedown', (e) => {
      if (e.target.tagName !== 'IMG') return;
      e.preventDefault(); // Prevent native browser image drag
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      container.classList.add('cursor-grabbing');
      e.target.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateLightboxTransform();
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        container.classList.remove('cursor-grabbing');
        const img = document.getElementById('lightbox-img');
        if (img) img.style.transition = '';
      }
    });
    
    // Close on background click
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        closeLightbox();
      }
    });
  }
});

/* ========================================
   Copy Email Function
   ======================================== */
function copyEmail() {
  const emailText = document.getElementById('copy-email-text').innerText;
  navigator.clipboard.writeText(emailText).then(() => {
    const copyIcon = document.getElementById('copy-icon');
    const checkIcon = document.getElementById('check-icon');
    const copyLabel = document.getElementById('copy-label');
    
    copyIcon.classList.add('hidden');
    checkIcon.classList.remove('hidden');
    copyLabel.innerText = 'Copied!';
    
    setTimeout(() => {
      copyIcon.classList.remove('hidden');
      checkIcon.classList.add('hidden');
      copyLabel.innerText = 'Click to copy';
    }, 2000);
  });
}
