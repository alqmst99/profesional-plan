// Inicialización EmailJS
emailjs.init('rHtdc2oyNuBY7_v4t'); // tu Public Key

document.getElementById('landingForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const msgDiv = document.getElementById('formMsg');
  const sendBtn = document.getElementById('sendBtn');
  const loader = document.getElementById('loader');
  
  msgDiv.textContent = '';

  // Validaciones básicas
  if (!name || !email || !message) {
    msgDiv.textContent = 'Por favor completá todos los campos.';
    msgDiv.style.color = 'red';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msgDiv.textContent = 'Ingresá un email válido.';
    msgDiv.style.color = 'red';
    return;
  }

  // Deshabilitar botón y mostrar loader
  sendBtn.disabled = true;
  loader.style.display = 'inline';

  // Envía EmailJS
  emailjs.send('service_iygdv6h', 'template_p3kpndh', {
    from_name: name,       // reemplazá con los campos exactos de tu template
    from_email: email,
    message: message,
   // reply_to: email        // solo si tu template lo tiene
  })
  .then(() => {
    msgDiv.textContent = '¡Consulta enviada con éxito!';
    msgDiv.style.color = 'green';
    document.getElementById('landingForm').reset();
  })
  .catch((err) => {
    console.error('EmailJS error:', err);
    msgDiv.textContent = 'Error al enviar. Probá de nuevo.';
    msgDiv.style.color = 'red';
  })
  .finally(() => {
    sendBtn.disabled = false;
    loader.style.display = 'none';
  });
});
