/* ============================================================
   FSTail Solutions — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ── */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 700);
      }, 600);
    });
  }

  /* ── HEADER SCROLL EFFECT ── */
  const header = document.getElementById('main-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── HAMBURGER / MOBILE NAV ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* ── CLOSE MOBILE NAV (exported for onclick in HTML) ── */
  window.closeMobileNav = () => {
    if (mobileNav) mobileNav.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    document.body.style.overflow = '';
  };

  /* ── REVEAL ON SCROLL ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── SERVICE MODALS ── */
  const serviceModal = document.getElementById('servicios-modal');
  const modals = {
    plan: document.getElementById('modal-plan'),
    mant: document.getElementById('modal-mant'),
    full: document.getElementById('modal-full'),
  };

  const openModal = (type) => {
    if (!serviceModal || !modals[type]) return;
    // hide all sub-modals first
    Object.values(modals).forEach(m => { if (m) m.style.display = 'none'; });
    modals[type].style.display = 'block';
    serviceModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!serviceModal) return;
    serviceModal.classList.remove('open');
    Object.values(modals).forEach(m => { if (m) m.style.display = 'none'; });
    document.body.style.overflow = '';
  };

  // Buttons that open modals (.btn-s with data-type)
  document.querySelectorAll('.btn-s[data-type]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-type')));
  });

  // Close buttons inside modal
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Click outside content
  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (!e.target.closest('.section-modal-content')) closeModal();
    });
  }

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ── PROJECTS "VER MÁS" (projects.html) ── */
  const cardsP   = document.querySelectorAll('#proyectos_card .proyectos_card');
  const verMaBtn = document.getElementById('ver-mas');
  let visible = 6;

  function showCards() {
    cardsP.forEach((card, i) => card.classList.toggle('hidden', i >= visible));
    if (verMaBtn) verMaBtn.style.display = visible >= cardsP.length ? 'none' : '';
  }

  if (cardsP.length) {
    showCards();
    if (verMaBtn) {
      verMaBtn.addEventListener('click', () => { visible += 6; showCards(); });
    }
  }

});

/* ── DEBOUNCE HELPER ── */
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
