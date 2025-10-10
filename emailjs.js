// EmailJS config
  (function () {
    emailjs.init('service_iygdv6h'); // Reemplaza con tu User ID de EmailJS
  })();

  document.getElementById('landingForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Validación simple
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const msgDiv = document.getElementById('formMsg');
    msgDiv.textContent = '';

    if (!name || !email || !message) {
      msgDiv.textContent = 'Por favor, completá todos los campos.';
      msgDiv.style.color = 'red';
      return;
    }

    // Opcional: validación de email simple
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msgDiv.textContent = 'Ingresá un email válido.';
      msgDiv.style.color = 'red';
      return;
    }

    // Envía con EmailJS
    emailjs.send('service_iygdv6h', 'template_p3kpndh', {
      from_name: name,
      from_email: email,
      message: message
    })
      .then(function () {
        msgDiv.textContent = '¡Consulta enviada con éxito!';
        msgDiv.style.color = 'green';
        document.getElementById('landingForm').reset();
      }, function (error) {
        msgDiv.textContent = 'Error al enviar. Probá de nuevo.';
        msgDiv.style.color = 'red';
      });
  });

