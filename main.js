//Corousel About
const carousel = document.querySelector(".nosotros-courrusel");
const cards = document.querySelectorAll(".nosotros-card");
const over = document.querySelectorAll(".over");
let current = 0;
let aboutInterval = null;

function startAboutCarousel() {
  if (aboutInterval) clearInterval(aboutInterval);

  let resizeTimeout = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(startAboutCarousel, 5000);
});
  if (window.innerWidth > 767) {
    aboutInterval = setInterval(() => {
      current = (current + 1) % cards.length;
      carousel.style.transform = `translateY(-${400 * current}px)`; // altura fija por tarjeta

      // Reiniciar animaciones
      over.forEach((overEl, index) => {
        overEl.classList.remove("animate-slide");
        void overEl.offsetWidth;
        if (index === current) {
          overEl.classList.add("animate-slide");
        }
      });
    }, 5000);
  } else {
    carousel.style.transform = "none";
    over.forEach(overEl => overEl.classList.remove("animate-slide"));
  }
}

// Ejecutar al cargar y al cambiar tamaño de pantalla
window.addEventListener("DOMContentLoaded", startAboutCarousel);
window.addEventListener("resize", startAboutCarousel);



//HERO Moving
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.8// Se activa cuando el 50% del elemento es visible
});

document.querySelectorAll('.hero-card').forEach(el => observer.observe(el));


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
moveCarousel();
setInterval(moveCarousel, 9000);

//Ver mas cards projects

document.addEventListener('DOMContentLoaded', function () {
  const cards = document.querySelectorAll('#proyectos_card .proyectos_card');
  const btn = document.getElementById('ver-mas');
  let visible = 6;

  function showCards() {
    cards.forEach((card, i) => {
      if (i < visible) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    if (visible >= cards.length) {
      btn.style.display = 'none';
    }
  }

  btn.addEventListener('click', function () {
    visible += 6;
    showCards();
  });

  showCards();
});


//Modals functions

document.addEventListener("DOMContentLoaded", () => {
  const serviceCards = document.querySelectorAll("button.btn-s"); // Solo botones
  const modals = {
    plan: document.querySelector(".section-modal-plan"),
    mant: document.querySelector(".section-modal-mant"),
    full: document.querySelector(".section-modal-full")
  };

  const serviceModal = document.querySelector(".servicios-modal");

 serviceCards.forEach(card => {
  card.addEventListener("click", () => {
    const type = card.getAttribute("data-type");
    // Oculta todos los modals internos antes de mostrar el correcto
    Object.values(modals).forEach(modal => modal.style.display = "none");
    if (modals[type]) {
      serviceModal.style.display = "block";
      modals[type].style.display = "block";
    }
  });
});

  // Cerrar modal al hacer click en la cruz
  const closeButtons = document.querySelectorAll(".modal-close");
  closeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      serviceModal.style.display = "none";
      Object.values(modals).forEach(modal => modal.style.display = "none");
    });
  });

  // Cerrar modal al hacer click fuera del contenido
  serviceModal.addEventListener("click", (e) => {
    if (e.target === serviceModal) {
      serviceModal.style.display = "none";
      Object.values(modals).forEach(modal => modal.style.display = "none");
    }
  });
});

//Login banner
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});

