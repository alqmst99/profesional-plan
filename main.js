document.addEventListener("DOMContentLoaded", () => {
  // ===== HERO CAROUSEL =====
  const carousel1 = document.querySelector('.hero-corousel');
  const cards1 = document.querySelectorAll('.hero-card');
  let currentIndex = 0;

  function moveCarousel() {
    if (window.innerWidth > 599) {
      currentIndex = (currentIndex + 1) % cards1.length;
      carousel1.style.transform = `translateX(-${currentIndex * 100}%)`;
    } else {
      carousel1.style.transform = 'none';
    }
  }

  setInterval(moveCarousel, 9000);
  moveCarousel();

  // ===== ABOUT CAROUSEL =====
  const carousel = document.querySelector(".nosotros-courrusel");
  const cards = document.querySelectorAll(".nosotros-card");
  const overs = document.querySelectorAll(".over");
  let current = 0;
  let aboutInterval;

  function startAboutCarousel() {
    clearInterval(aboutInterval);

    if (window.innerWidth > 767) {
      aboutInterval = setInterval(() => {
        current = (current + 1) % cards.length;
        carousel.style.transform = `translateY(-${400 * current}px)`;

        overs.forEach((overEl, i) => {
          overEl.classList.toggle("animate-slide", i === current);
        });
      }, 5000);
    } else {
      carousel.style.transform = "none";
      overs.forEach(overEl => overEl.classList.remove("animate-slide"));
    }
  }

  window.addEventListener("resize", debounce(startAboutCarousel, 5000));
  startAboutCarousel();

  // ===== PROYECTOS - VER MÁS =====
  const cardsP = document.querySelectorAll('#proyectos_card .proyectos_card');
  const btn = document.getElementById('ver-mas');
  let visible = 6;

  function showCards() {
    cardsP.forEach((card, i) => {
      card.classList.toggle('hidden', i >= visible);
    });
    if (visible >= cardsP.length) btn.style.display = 'none';
  }

  if (btn) {
    btn.addEventListener('click', () => {
      visible += 6;
      showCards();
    });
  }

  showCards();

  // ===== MODALES =====
  const serviceCards = document.querySelectorAll("button.btn-s");
  const modals = {
    plan: document.querySelector(".section-modal-plan"),
    mant: document.querySelector(".section-modal-mant"),
    full: document.querySelector(".section-modal-full")
  };
  const serviceModal = document.querySelector(".servicios-modal");

  serviceCards.forEach(card => {
    card.addEventListener("click", () => {
      const type = card.getAttribute("data-type");
      Object.values(modals).forEach(m => m.style.display = "none");
      if (modals[type]) {
        serviceModal.style.display = "block";
        modals[type].style.display = "block";
      }
    });
  });

  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", closeModal);
  });

  
// ✅ Cerrar al hacer clic fuera del modal (funcional)
serviceModal.addEventListener("click", e => {
  const isOutsideClick = !e.target.closest(".section-modal-content");
  if (isOutsideClick && serviceModal.style.display === "block") {
    closeModal();
  }
});

// ✅ Cerrar con tecla ESC
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && serviceModal.style.display === "block") {
    closeModal();
  }
});

function closeModal() {
  serviceModal.style.display = "none";
  Object.values(modals).forEach(m => m.style.display = "none");
}

  // ===== HERO SCROLL ANIMATIONS =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.8 });

  document.querySelectorAll('.hero-card').forEach(el => observer.observe(el));

  // ===== LOADER =====
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});

// ===== Helper: debounce =====
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}
