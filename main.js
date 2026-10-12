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

  // Improve navigation: hide .html from URLs and mark active link
  // document.querySelectorAll('a[href]').forEach(a => {
  //   try {
  //     const href = a.getAttribute('href');
  //     if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) return;
  //     // normalize display URL without .html
  //     const clean = href.replace(/\.html(#.*)?$/, '$1');
  //     a.dataset.cleanHref = clean;
  //     // When clicked, navigate to the real href but update history to show clean URL
  //     a.addEventListener('click', (e) => {
  //       if (href.startsWith('http') || href.startsWith('#')) return;
  //       e.preventDefault();
  //       const target = href;
  //       history.pushState(null, '', clean);
  //       window.location.href = target;
  //     });
  //   } catch (e) {}
  // });

  // mark active nav link
  const path = window.location.pathname.split('/').pop().replace('.html','') || 'index';
  document.querySelectorAll('.nav-links a, .admin-nav a').forEach(a => {
    const href = (a.getAttribute('href')||'').replace('.html','').split('/').pop();
    if (href === path) a.classList.add('active');
  });

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
