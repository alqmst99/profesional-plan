//Corousel 
  const carousel = document.querySelector(".about-courrusel");
  const cards = document.querySelectorAll(".about-card");
  const over = document.querySelectorAll(".over");
  let current = 0;

  function verificarResolucion() {
  if (window.innerWidth <= 767) { 
    console.log("Resolución menor o igual a 767px, desactivando JavaScript para ciertos elementos/scripts");
  
  } else {
    // Reactiva o modifica los elementos/scripts si es necesario
    console.log("Resolución mayor a 767px, habilitando JavaScript para ciertos elementos/scripts");
     setInterval(() => {
    current++;
    if (current >= cards.length) {
      current = 0;
    }
    carousel.style.transform = `translateY(-${400 * current}px)`; // altura fija por tarjeta
  
     // Reiniciar animaciones
  over.forEach((over, index) => {
    over.classList.remove("animate-slide");
    // Forzar reflow para reiniciar
    void over.offsetWidth;
    if (index === current) {
      over.classList.add("animate-slide");
    }
  });

}, 5000); // cambia cada 4 segundos
  }
}



//HERO Moving
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.5 // Se activa cuando el 50% del elemento es visible
});

document.querySelectorAll('.hero-card').forEach(el => observer.observe(el));


const carousel1 = document.querySelector('.hero-corousel');
const cards1 = document.querySelectorAll('.hero-card');
let currentIndex = 0;

function moveCarousel() {
  currentIndex = (currentIndex + 1) % cards1.length;
  carousel1.style.transform = `translateX(-${currentIndex * 100}%)`;
}
setInterval(moveCarousel, 5000);

//Modals functions

document.addEventListener("DOMContentLoaded", () => {
  const serviceCards = document.querySelectorAll(".btn-s");
  const modals = {
    plan: document.querySelector(".section-modal-plan"),
    mant: document.querySelector(".section-modal-mant"),
    full: document.querySelector(".section-modal-full")
  };

  const serviceModal = document.querySelector(".service-modal");

  // Mostrar modal
  serviceCards.forEach(card => {
    card.addEventListener("click", () => {
      const type = card.getAttribute("data-type");

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