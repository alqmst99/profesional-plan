(function () {
  const path = window.location.pathname.includes('/pages/') ? '../' : './';
  const translations = {
    en: {
      eyebrow: 'Two projects. One clear next step.',
      title: 'Your next shop could look like this.',
      description: 'Explore a pet shop catalog, then choose the right starting point for your own online store or digital product.',
      offer: 'OFF',
      from: 'From',
      month: '/mo',
      seeOffers: 'Quote my catalog',
      close: 'Close promotion',
      dismiss: 'Keep exploring',
      plans: 'View plans',
      includes: 'Introductory price',
      dialogLabel: 'Current FSTail Solutions offers'
    },
    es: {
      eyebrow: 'Dos proyectos. Un próximo paso.',
      title: 'Tu tienda online puede verse así.',
      description: 'Mirá un catálogo para una tienda de mascotas y elegí el punto de partida para tu tienda o producto digital.',
      offer: 'OFF',
      from: 'Desde',
      month: '/mes',
      seeOffers: 'Cotizar mi catálogo',
      close: 'Cerrar promoción',
      dismiss: 'Seguir explorando',
      plans: 'Ver planes',
      includes: 'Precio inicial',
      dialogLabel: 'Ofertas vigentes de FSTail Solutions'
    }
  };

  function language() {
    return document.documentElement.lang === 'es' ? 'es' : 'en';
  }

  function selectedCurrency(config) {
    const settings = config.currency || {};
    const international = settings.international || 'USD';
    const argentina = settings.argentina || 'ARS';
    const requested = new URLSearchParams(window.location.search).get('currency')?.toUpperCase();
    if (requested === international || requested === argentina) return requested;

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const locales = navigator.languages || [navigator.language];
    const isArgentina = timeZone === 'America/Buenos_Aires' ||
      timeZone.startsWith('America/Argentina/') ||
      locales.some(locale => /^es-AR$/i.test(locale));
    return isArgentina ? argentina : international;
  }

  function activePlan(plan) {
    const now = Date.now();
    return plan.discountActive === true &&
      (!plan.startsAt || now >= Date.parse(plan.startsAt)) &&
      (!plan.endsAt || now <= Date.parse(plan.endsAt)) &&
      Number(plan.discountPercent) > 0 && Number(plan.discountPercent) < 100;
  }

  function servicePlans(serviceKey, service, config) {
    const discountPercent = Number(service.discount?.percent) || 0;
    const allowed = config.discountOptions || [80, 70, 50, 40, 20, 15, 10];
    const discountActive = service.discount?.active === true && allowed.includes(discountPercent);
    return service.plans.map(plan => ({
      ...plan,
      serviceKey,
      service,
      discountActive,
      discountPercent: discountActive ? discountPercent : 0
    }));
  }

  function allPlans(config) {
    return Object.entries(config.services).flatMap(([key, service]) =>
      servicePlans(key, service, config)
    );
  }

  function activeOffers(config) {
    return allPlans(config).filter(activePlan);
  }

  function priceLabel(amount, locale, currency) {
    return new Intl.NumberFormat(locale === 'es' ? 'es-AR' : 'en-US', {
      style: 'currency',
      currency,
      ...(currency === 'ARS' ? { currencyDisplay: 'code' } : {}),
      maximumFractionDigits: 0
    }).format(amount);
  }

  function roundAmount(amount, currency, config) {
    const settings = config.currency || {};
    const increment = currency === settings.argentina ? Math.max(1, Number(settings.arsRounding) || 1) : 1;
    return Math.round(amount / increment) * increment;
  }

  function basePrice(plan, config, currency) {
    const settings = config.currency || {};
    const selected = currency || selectedCurrency(config);
    if (selected === settings.argentina) {
      return roundAmount(Number(plan.price) * Number(settings.arsPerUsd), selected, config);
    }
    return Number(plan.price);
  }

  function currentPrice(plan, config, currency) {
    const selected = currency || selectedCurrency(config);
    const amount = basePrice(plan, config, selected);
    return roundAmount(amount * (1 - Number(plan.discountPercent) / 100), selected, config);
  }

  function priceSuffix(plan, currency, locale) {
    if (plan.period) return `${currency}/${locale === 'es' ? 'mes' : 'mo'}`;
    return currency === 'ARS' ? '' : currency;
  }

  function renderPrice(element, plan, config) {
    const locale = language();
    const currency = selectedCurrency(config);
    const copy = translations[locale];
    const discounted = activePlan(plan);
    const amount = discounted ? currentPrice(plan, config, currency) : basePrice(plan, config, currency);
    const price = priceLabel(amount, locale, currency);
    const suffix = priceSuffix(plan, currency, locale);
    element.replaceChildren();
    if (discounted) {
      const oldPrice = document.createElement('del');
      oldPrice.className = 'offer-price-old';
      oldPrice.textContent = priceLabel(basePrice(plan, config, currency), locale, currency);
      const current = document.createElement('span');
      current.className = 'offer-price-current';
      current.textContent = price;
      const badge = document.createElement('span');
      badge.className = 'offer-discount-badge';
      badge.textContent = `-${plan.discountPercent}%`;
      element.append(oldPrice, current, badge);
    } else {
      const current = document.createElement('span');
      current.className = 'offer-price-current';
      current.textContent = price;
      element.append(current);
    }
    if (suffix) {
      const suffix = document.createElement('sub');
      suffix.textContent = priceSuffix(plan, currency, locale);
      element.append(suffix);
    }
    element.setAttribute('aria-label', `${copy.includes}: ${price} ${suffix}`.trim());
  }

  function renderPrices(config) {
    const plans = new Map(allPlans(config).map(plan => [plan.id, plan]));
    document.querySelectorAll('[data-price-id]').forEach(element => {
      const plan = plans.get(element.dataset.priceId);
      if (plan) renderPrice(element, plan, config);
    });

    document.querySelectorAll('[data-price-from]').forEach(element => {
      const service = config.services[element.dataset.priceFrom];
      if (!service) return;
      const plan = servicePlans(element.dataset.priceFrom, service, config)[0];
      const currency = selectedCurrency(config);
      const discounted = activePlan(plan);
      const amount = discounted ? currentPrice(plan, config, currency) : basePrice(plan, config, currency);
      const locale = language();
      const prefix = translations[locale].from;
      const period = plan.period ? (locale === 'es' ? '/mes' : '/mo') : '';
      element.textContent = `${prefix} ${priceLabel(amount, locale, currency)}${period}`;
      if (discounted) element.dataset.discount = `-${plan.discountPercent}%`;
      else delete element.dataset.discount;
    });
  }

  function offerCard(serviceKey, service, plans, locale, config) {
    const currency = selectedCurrency(config);
    const copy = translations[locale];
    const active = plans.filter(activePlan);
    const plan = active[0] || plans[0];
    const discounted = activePlan(plan);
    const amount = discounted ? currentPrice(plan, config, currency) : basePrice(plan, config, currency);
    const card = document.createElement('article');
    card.className = 'offer-card';

    const badge = document.createElement('span');
    badge.className = 'offer-card-badge';
    badge.textContent = discounted ? `-${plan.discountPercent}%` : copy.includes;
    const title = document.createElement('h3');
    title.textContent = service[locale] || service.en;
    const price = document.createElement('p');
    price.className = 'offer-card-price';
    if (discounted) {
      const oldPrice = document.createElement('del');
      const oldPeriod = plan.period ? (locale === 'es' ? '/mes' : '/mo') : '';
      oldPrice.textContent = `${priceLabel(basePrice(plan, config, currency), locale, currency)}${oldPeriod}`;
      price.append(oldPrice, document.createTextNode(' '));
    }
    const label = document.createElement('span');
    label.textContent = `${copy.from} ${priceLabel(amount, locale, currency)}${plan.period ? copy.month : ''}`;
    price.append(label);

    const link = document.createElement('a');
    link.className = 'offer-card-link';
    const anchors = {
      landing: 'servicios',
      maintenance: 'mantenimiento',
      'full-website': 'sitio-completo'
    };
    link.href = anchors[serviceKey]
      ? `${path}pages/service.html#${anchors[serviceKey]}`
      : `${path}pages/contact.html?service=${encodeURIComponent(serviceKey)}#consulta`;
    link.textContent = copy.plans;
    card.append(badge, title, price, link);
    return card;
  }

  function renderOfferSections(config) {
    const offers = activeOffers(config);
    document.querySelectorAll('[data-offers-list]').forEach(container => {
      container.replaceChildren();
      if (!offers.length) {
        container.closest('[data-offers-section]')?.remove();
        return;
      }
      const locale = language();
        Object.entries(config.services).forEach(([key, service]) => {
          const plans = servicePlans(key, service, config);
          if (plans.some(activePlan)) container.append(offerCard(key, service, plans, locale, config));
      });
      container.closest('[data-offers-section]')?.removeAttribute('hidden');
    });
  }

  function buildDialog(config) {
    const offers = activeOffers(config);
    const popup = config.popup || {};
    const pathname = window.location.pathname;
    const isHomepage = pathname.endsWith('/') || pathname.endsWith('/index.html');
    const forceShow = new URLSearchParams(window.location.search).get('promo') === 'show';
    if (popup.homeOnly === true && !isHomepage && !forceShow) return;
    if (!offers.length || popup.enabled !== true) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'offer-dialog';
    dialog.setAttribute('aria-labelledby', 'offer-dialog-title');
    let originalBodyOverflow = '';
    const restoreBodyOverflow = () => {
      document.body.style.overflow = originalBodyOverflow;
    };
    const closeDialog = () => {
      if (dialog.open) dialog.close();
      restoreBodyOverflow();
    };
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'offer-dialog-close';
    close.setAttribute('aria-label', translations[language()].close);
    close.textContent = '\u00d7';
    close.addEventListener('click', closeDialog);

    const eyebrow = document.createElement('p');
    eyebrow.className = 'offer-dialog-eyebrow';
    const title = document.createElement('h2');
    title.id = 'offer-dialog-title';
    const description = document.createElement('p');
    description.className = 'offer-dialog-description';
    const content = document.createElement('div');
    content.className = 'offer-dialog-content';
    const list = document.createElement('ul');
    list.className = 'offer-dialog-list';
    const actions = document.createElement('div');
    actions.className = 'offer-dialog-actions';
    const cta = document.createElement('a');
    cta.className = 'btn-primary';
    cta.href = `${path}pages/contact.html?service=catalog-store#consulta`;
    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'offer-dialog-dismiss';
    dismiss.addEventListener('click', closeDialog);
    actions.append(cta, dismiss);

    const showcase = document.createElement('aside');
    showcase.className = 'offer-dialog-showcase';
    const gallery = document.createElement('div');
    gallery.className = 'offer-dialog-gallery';
    const examples = [
      {
        name: 'Pet shop · product catalog',
        esName: 'Pet shop · catálogo de productos',
        image: 'https://images.pexels.com/photos/38587869/pexels-photo-38587869.jpeg?auto=compress&cs=tinysrgb&w=960',
        alt: 'A dog and a cat outside a neighborhood shop',
        esAlt: 'Un perro y un gato frente a una tienda de barrio',
        href: 'https://alqmst99.github.io/Pet_Shop/pages/catalogo.html',
        photo: 'https://www.pexels.com/photo/friendly-dog-and-curious-cat-with-storefront-background-38587869/'
      }
    ];
    examples.forEach(example => {
      const figure = document.createElement('figure');
      figure.className = 'offer-example';
      const image = document.createElement('img');
      image.src = example.image;
      image.alt = language() === 'es' ? example.esAlt : example.alt;
      image.loading = 'eager';
      const caption = document.createElement('figcaption');
      const projectLink = document.createElement('a');
      projectLink.className = 'offer-example-link';
      projectLink.href = example.href;
      projectLink.target = '_blank';
      projectLink.rel = 'noopener noreferrer';
      projectLink.textContent = language() === 'es' ? example.esName : example.name;
      const photoCredit = document.createElement('a');
      photoCredit.className = 'offer-example-credit';
      photoCredit.href = example.photo;
      photoCredit.target = '_blank';
      photoCredit.rel = 'noopener noreferrer';
      photoCredit.textContent = 'Photo: Pexels';
      caption.append(projectLink, photoCredit);
      figure.append(image, caption);
      gallery.append(figure);
    });
    showcase.append(gallery);
    content.append(eyebrow, title, description, list, actions);
    const layout = document.createElement('div');
    layout.className = 'offer-dialog-layout';
    layout.append(showcase, content);
    dialog.append(close, layout);
    document.body.append(dialog);
    const onEscape = event => {
      if (event.key !== 'Escape' || !dialog.open) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeDialog();
    };
    document.addEventListener('keydown', onEscape, true);
    dialog.addEventListener('close', () => {
      restoreBodyOverflow();
      document.removeEventListener('keydown', onEscape, true);
    });
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      closeDialog();
    });

    function updateCopy() {
      const copy = translations[language()];
      dialog.setAttribute('aria-label', copy.dialogLabel);
      close.setAttribute('aria-label', copy.close);
      eyebrow.textContent = copy.eyebrow;
      title.textContent = copy.title;
      description.textContent = copy.description;
      cta.textContent = copy.seeOffers;
      dismiss.textContent = copy.dismiss;
      examples.forEach((example, index) => {
        const link = gallery.children[index]?.querySelector('.offer-example-link');
        const image = gallery.children[index]?.querySelector('img');
        if (link) link.textContent = language() === 'es' ? example.esName : example.name;
        if (image) image.alt = language() === 'es' ? example.esAlt : example.alt;
      });
      list.replaceChildren();
      const preferredOrder = ['catalog-store', 'dashboard-crm', 'desktop-app', 'landing', 'full-website', 'maintenance'];
      Object.entries(config.services)
        .sort(([first], [second]) => preferredOrder.indexOf(first) - preferredOrder.indexOf(second))
        .forEach(([key, service]) => {
        const plan = servicePlans(key, service, config).find(activePlan);
        if (!plan) return;
        const item = document.createElement('li');
        const name = document.createElement('span');
        name.textContent = service[language()] || service.en;
        const value = document.createElement('strong');
        const currency = selectedCurrency(config);
        const monthly = plan.period ? (language() === 'es' ? '/mes' : '/mo') : '';
        const amount = currentPrice(plan, config, currency);
        value.textContent = `${priceLabel(amount, language(), currency)}${currency === 'ARS' ? '' : ` ${currency}`}${monthly} (-${plan.discountPercent}%)`;
        item.append(name, value);
          list.append(item);
        });
    }

    updateCopy();
    dialog.addEventListener('click', event => {
      if (event.target === dialog) closeDialog();
    });
    document.addEventListener('fstail:langchange', updateCopy);

    const storageKey = 'fstail_offer_popup_last_shown_v3';
    let lastShown = 0;
    try {
      lastShown = Number(localStorage.getItem(storageKey)) || 0;
    } catch (_) {}
    const cooldown = Math.max(0, Number(popup.cooldownDays) || 0) * 86400000;
    if (!forceShow && Date.now() - lastShown < cooldown) return;

    const showAfterLoader = () => {
      window.setTimeout(() => {
        if (!dialog.isConnected || dialog.open) return;
        originalBodyOverflow = document.body.style.overflow;
        if (!forceShow) {
          try {
            localStorage.setItem(storageKey, String(Date.now()));
          } catch (_) {}
        }
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        close.focus();
      }, Math.max(0, Number(popup.delayMs) || 0));
    };
    const loader = document.getElementById('loader');
    if (!loader || !loader.isConnected) {
      showAfterLoader();
    } else {
      const observer = new MutationObserver(() => {
        if (!loader.isConnected) {
          observer.disconnect();
          showAfterLoader();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  function addStructuredData(config) {
    const currency = selectedCurrency(config);
    const startingPlans = Object.entries(config.services).map(([serviceKey, service]) =>
      servicePlans(serviceKey, service, config)[0]
    );
    const offers = startingPlans.map(plan => {
      const discounted = activePlan(plan);
      const offer = {
        '@type': 'Offer',
        name: `${plan.name} - ${plan.service[language()] || plan.service.en}`,
        priceCurrency: currency,
        price: discounted ? currentPrice(plan, config, currency) : basePrice(plan, config, currency),
        availability: 'https://schema.org/InStock',
        url: `${window.location.origin}${path}pages/service.html#ofertas`
      };
      if (discounted) offer.priceValidUntil = plan.endsAt ? plan.endsAt.slice(0, 10) : undefined;
      return offer;
    });
    const structuredData = document.createElement('script');
    structuredData.type = 'application/ld+json';
    structuredData.dataset.offersStructuredData = 'true';
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: language() === 'es' ? 'Servicios web y ofertas de FSTail Solutions' : 'FSTail Solutions web services and offers',
      url: `${window.location.origin}${path}pages/service.html#ofertas`,
      itemListElement: offers
    });
    document.querySelector('[data-offers-structured-data]')?.remove();
    structuredData.setAttribute('data-offers-structured-data', 'true');
    document.head.append(structuredData);
  }

  fetch(`${path}data/offers.json?v=${Date.now()}`)
    .then(response => {
      if (!response.ok) throw new Error(`Offer configuration load failed: ${response.status}`);
      return response.json();
    })
    .then(config => {
      renderPrices(config);
      renderOfferSections(config);
      buildDialog(config);
      addStructuredData(config);
      document.addEventListener('fstail:langchange', () => {
        renderPrices(config);
        renderOfferSections(config);
        addStructuredData(config);
      });
    })
    .catch(error => console.warn('[offers]', error));
})();
