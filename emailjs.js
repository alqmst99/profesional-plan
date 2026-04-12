/* ============================================================
   FSTail Solutions — emailjs.js
   ============================================================ */

(function () {
  'use strict';

  // Wait for EmailJS SDK to load
  function initEmailJS() {
    if (typeof emailjs === 'undefined') {
      setTimeout(initEmailJS, 200);
      return;
    }

    emailjs.init('rHtdc2oyNuBY7_v4t');

    const form      = document.getElementById('landingForm');
    const msgDiv    = document.getElementById('formMsg');
    const sendBtn   = document.getElementById('sendBtn');
    const loaderSpin= document.getElementById('loader-spin');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      msgDiv.textContent = '';
      msgDiv.style.color = '';

      if (!name || !email || !message) {
        msgDiv.textContent = 'Por favor completá todos los campos.';
        msgDiv.style.color = '#e07070';
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msgDiv.textContent = 'Ingresá un email válido.';
        msgDiv.style.color = '#e07070';
        return;
      }

      sendBtn.disabled = true;
      if (loaderSpin) loaderSpin.style.display = 'inline';

      emailjs.send('service_iygdv6h', 'template_p3kpndh', {
        from_name:  name,
        from_email: email,
        message:    message,
      })
      .then(() => {
        msgDiv.textContent = '¡Consulta enviada con éxito! Te respondemos en menos de 24 hs.';
        msgDiv.style.color = 'var(--clr-accent)';
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        msgDiv.textContent = 'Error al enviar. Por favor intentá de nuevo o escribinos por WhatsApp.';
        msgDiv.style.color = '#e07070';
      })
      .finally(() => {
        sendBtn.disabled = false;
        if (loaderSpin) loaderSpin.style.display = 'none';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initEmailJS);
})();
