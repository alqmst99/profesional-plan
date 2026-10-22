/**
 * FSTail Solutions — EmailJS contact form handler
 * Requires: emailjs browser SDK loaded before this script
 * Form: #landingForm with #name, #email, #message, optional #projectService
 */
(function () {
  'use strict';

  // --- Config (EmailJS dashboard) ---
  const PUBLIC_KEY = 'rHtdc2oyNuBY7_v4t';
  const SERVICE_ID = 'service_iygdv6h';
  const TEMPLATE_ID = 'template_p3kpndh';

  const copy = {
    en: {
      required: 'Please fill in all fields.',
      invalidEmail: 'Enter a valid email address.',
      success: 'Inquiry sent successfully! We reply within 24 hours.',
      error: 'Could not send. Please try again or write us on WhatsApp.',
      serviceLabel: 'Selected service'
    },
    es: {
      required: 'Por favor completá todos los campos.',
      invalidEmail: 'Ingresá un email válido.',
      success: '¡Consulta enviada con éxito! Te respondemos en menos de 24 hs.',
      error: 'Error al enviar. Intentá de nuevo o escribinos por WhatsApp.',
      serviceLabel: 'Servicio elegido'
    }
  };

  function lang() {
    return (window.FSTailI18n && window.FSTailI18n.getLang && window.FSTailI18n.getLang())
      || localStorage.getItem('fstail_lang')
      || document.documentElement.lang
      || 'es';
  }

  function t(key) {
    const l = lang().startsWith('es') ? 'es' : 'en';
    return (copy[l] && copy[l][key]) || copy.en[key] || key;
  }

  function getSdk() {
    return window.emailjs || null;
  }

  function initSdk(sdk) {
    try {
      if (typeof sdk.init === 'function') {
        try {
          sdk.init({ publicKey: PUBLIC_KEY });
        } catch (_) {
          sdk.init(PUBLIC_KEY);
        }
      }
    } catch (err) {
      console.error('[EmailJS] init failed:', err);
    }
  }

  function setMsg(el, text, ok) {
    if (!el) return;
    el.textContent = text || '';
    el.style.color = ok === true ? 'var(--clr-accent, #c9a227)' : (ok === false ? '#e07070' : '');
  }

  function initForm() {
    const sdk = getSdk();
    if (!sdk) {
      let attempts = 0;
      const timer = setInterval(function () {
        attempts += 1;
        if (getSdk()) {
          clearInterval(timer);
          initForm();
        } else if (attempts > 25) {
          clearInterval(timer);
          console.error('[EmailJS] SDK not found. Check the script tag for email.min.js');
        }
      }, 200);
      return;
    }

    initSdk(sdk);

    const form = document.getElementById('landingForm');
    if (!form) return;

    const msgDiv = document.getElementById('formMsg');
    const sendBtn = document.getElementById('sendBtn');
    const loaderSpin = document.getElementById('loader-spin');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');
    const serviceSelect = document.getElementById('projectService');

    if (form.dataset.emailjsBound === '1') return;
    form.dataset.emailjsBound = '1';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = (nameEl && nameEl.value || '').trim();
      const email = (emailEl && emailEl.value || '').trim();
      let message = (messageEl && messageEl.value || '').trim();

      const serviceName = serviceSelect && serviceSelect.selectedOptions[0]
        ? serviceSelect.selectedOptions[0].textContent.trim()
        : '';

      if (serviceName && serviceSelect.value && !message.toLowerCase().includes(serviceName.toLowerCase())) {
        message = t('serviceLabel') + ': ' + serviceName + '\n\n' + message;
      }

      setMsg(msgDiv, '', null);

      if (!name || !email || !message) {
        setMsg(msgDiv, t('required'), false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setMsg(msgDiv, t('invalidEmail'), false);
        return;
      }

      if (sendBtn) sendBtn.disabled = true;
      if (loaderSpin) loaderSpin.style.display = 'inline';

      const params = {
        from_name: name,
        from_email: email,
        reply_to: email,
        message: message,
        user_name: name,
        user_email: email,
        to_name: 'FSTail Solutions'
      };

      Promise.resolve(sdk.send(SERVICE_ID, TEMPLATE_ID, params))
        .then(function () {
          setMsg(msgDiv, t('success'), true);
          form.reset();
          if (serviceSelect) serviceSelect.dispatchEvent(new Event('change'));
        })
        .catch(function (err) {
          console.error('[EmailJS] send error:', err);
          if (err && err.text) console.error('[EmailJS] text:', err.text);
          if (err && err.status) console.error('[EmailJS] status:', err.status);
          setMsg(msgDiv, t('error'), false);
        })
        .finally(function () {
          if (sendBtn) sendBtn.disabled = false;
          if (loaderSpin) loaderSpin.style.display = 'none';
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }
})();
