(function () {
  const path = window.location.pathname.includes('/pages/') ? '../' : './';
  const form = document.getElementById('landingForm');
  const serviceSelect = document.getElementById('projectService');
  const messageField = document.getElementById('message');
  const whatsappLinks = document.querySelectorAll('[data-contact-whatsapp], [data-whatsapp-service]');
  const params = new URLSearchParams(window.location.search);
  let customMessage = false;
  let config;

  const copy = {
    en: {
      chooseService: 'Choose a service',
      other: 'Not sure yet / Other',
      message: name => `Hi FSTail, I would like to ask about ${name}.\n\nGoal:\nAudience:\nKey features or content:\nReference:\nPreferred timeframe or budget:`,
      general: 'Hi FSTail, I would like to talk about a digital project. Can you help me define scope, timing and budget?',
      prompt: 'Could you help me figure out the scope, timing and budget?'
    },
    es: {
      chooseService: 'Elegí un servicio',
      other: 'Todavía no lo sé / Otro',
      message: name => `Hola FSTail, quiero consultar por ${name}.\n\nObjetivo:\nPúblico:\nFunciones o contenido:\nReferencia:\nPlazo o presupuesto aproximado:`,
      general: 'Hola FSTail, quiero conversar sobre un proyecto digital. ¿Me ayudan a definir alcance, tiempos y presupuesto?',
      prompt: '¿Me ayudan a orientar el alcance, los tiempos y el presupuesto?'
    }
  };

  function locale() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  function serviceName(key) {
    if (!config || !key) return '';
    const service = config.services[key];
    return service ? (service[locale()] || service.en) : '';
  }

  function updateWhatsappLinks() {
    const lang = locale();
    const selected = serviceSelect?.value;
    const name = serviceName(selected);
    const text = name
      ? `${copy[lang].message(name)}\n${copy[lang].prompt}`
      : copy[lang].general;
    const href = `https://wa.me/5493425428918?text=${encodeURIComponent(text)}`;
    whatsappLinks.forEach(link => {
      const key = link.dataset.whatsappService;
      const targetName = serviceName(key || selected);
      const message = targetName
        ? `${copy[lang].message(targetName)}\n${copy[lang].prompt}`
        : copy[lang].general;
      link.href = `https://wa.me/5493425428918?text=${encodeURIComponent(message)}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-contact-whatsapp]').forEach(link => {
      link.href = href;
    });
  }

  function updateMessage() {
    if (serviceSelect && messageField && !customMessage) {
      const selected = serviceSelect.value;
      const name = serviceName(selected);
      messageField.value = name ? copy[locale()].message(name) : '';
    }
    updateWhatsappLinks();
  }

  function populateServices() {
    if (!config || !serviceSelect) return;
    const lang = locale();
    const selected = serviceSelect.value || params.get('service') || '';
    serviceSelect.replaceChildren();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = copy[lang].chooseService;
    placeholder.disabled = true;
    placeholder.selected = !selected;
    serviceSelect.append(placeholder);

    Object.entries(config.services).forEach(([key, service]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = service[lang] || service.en;
      serviceSelect.append(option);
    });

    const other = document.createElement('option');
    other.value = 'other';
    other.textContent = copy[lang].other;
    serviceSelect.append(other);
    if (selected && serviceSelect.querySelector(`option[value="${CSS.escape(selected)}"]`)) {
      serviceSelect.value = selected;
    }
    updateMessage();
  }

  function init() {
    if (messageField) {
      messageField.addEventListener('input', () => {
        customMessage = true;
      });
    }
    serviceSelect?.addEventListener('change', () => {
      customMessage = false;
      updateMessage();
    });

    document.addEventListener('fstail:langchange', () => {
      if (config) populateServices();
      else updateWhatsappLinks();
    });

    if (form && params.get('service')) {
      form.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }

    fetch(`${path}data/offers.json?v=${Date.now()}`)
      .then(response => {
        if (!response.ok) throw new Error(`Service list load failed: ${response.status}`);
        return response.json();
      })
      .then(data => {
        config = data;
        populateServices();
        updateWhatsappLinks();
      })
      .catch(error => console.warn('[contact]', error));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
