/**
 * Project detail page — loads one project from projects.json via ?id=
 * Gallery: image pasarela with prev/next + thumbs
 */
(function () {
  'use strict';

  const DATA_URL = '../data/projects.json?v=' + Date.now();
  let data = null;
  let lang = localStorage.getItem('fstail_lang') || 'en';
  let project = null;
  let galleryIndex = 0;
  let galleryImages = [];

  function t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || '';
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function getId() {
    return (new URLSearchParams(window.location.search).get('id') || '').trim();
  }

  function listFrom(field) {
    if (!project || !project[field]) return [];
    const v = project[field];
    if (Array.isArray(v)) return v;
    return v[lang] || v.en || [];
  }

  function buildGallery(thumbs, title) {
    galleryImages = (thumbs || []).filter(Boolean);
    galleryIndex = 0;
    if (!galleryImages.length) {
      return '<p class="project-gallery-empty">' +
        (lang === 'es' ? 'Sin capturas disponibles.' : 'No screenshots available.') +
        '</p>';
    }

    const main = galleryImages[0];
    const dots = galleryImages.map((_, i) =>
      '<button type="button" class="project-gallery-dot' + (i === 0 ? ' active' : '') +
      '" data-gallery-index="' + i + '" aria-label="Image ' + (i + 1) + '"></button>'
    ).join('');

    const thumbsHtml = galleryImages.map((src, i) =>
      '<button type="button" class="project-gallery-thumb' + (i === 0 ? ' active' : '') +
      '" data-gallery-index="' + i + '">' +
      '<img src="' + esc(src) + '" alt="' + esc(title) + ' ' + (i + 1) + '" loading="lazy">' +
      '</button>'
    ).join('');

    return (
      '<div class="project-gallery" data-gallery>' +
        '<div class="project-gallery-stage">' +
          '<button type="button" class="project-gallery-nav prev" data-gallery-prev aria-label="Previous">‹</button>' +
          '<div class="project-gallery-frame">' +
            '<img class="project-gallery-main" data-gallery-main src="' + esc(main) + '" alt="' + esc(title) + '">' +
          '</div>' +
          '<button type="button" class="project-gallery-nav next" data-gallery-next aria-label="Next">›</button>' +
        '</div>' +
        '<div class="project-gallery-dots">' + dots + '</div>' +
        '<div class="project-gallery-thumbs">' + thumbsHtml + '</div>' +
        '<p class="project-gallery-counter"><span data-gallery-current>1</span> / ' + galleryImages.length + '</p>' +
      '</div>'
    );
  }

  function showGalleryIndex(i) {
    if (!galleryImages.length) return;
    galleryIndex = (i + galleryImages.length) % galleryImages.length;
    const root = document.querySelector('[data-gallery]');
    if (!root) return;
    const main = root.querySelector('[data-gallery-main]');
    if (main) {
      main.src = galleryImages[galleryIndex];
    }
    root.querySelectorAll('[data-gallery-index]').forEach(function (el) {
      const active = Number(el.getAttribute('data-gallery-index')) === galleryIndex;
      el.classList.toggle('active', active);
    });
    const cur = root.querySelector('[data-gallery-current]');
    if (cur) cur.textContent = String(galleryIndex + 1);
  }

  function bindGallery() {
    const root = document.querySelector('[data-gallery]');
    if (!root) return;
    const prev = root.querySelector('[data-gallery-prev]');
    const next = root.querySelector('[data-gallery-next]');
    if (prev) prev.addEventListener('click', function () { showGalleryIndex(galleryIndex - 1); });
    if (next) next.addEventListener('click', function () { showGalleryIndex(galleryIndex + 1); });
    root.querySelectorAll('[data-gallery-index]').forEach(function (el) {
      el.addEventListener('click', function () {
        showGalleryIndex(Number(el.getAttribute('data-gallery-index')));
      });
    });
  }

  function render() {
    const root = document.getElementById('detailRoot');
    if (!root) return;

    if (!project) {
      root.innerHTML =
        '<div class="project-detail-hero"><div class="container">' +
        '<a class="project-detail-back" href="./projects.html#proyectos">' +
        (lang === 'es' ? '← Volver a proyectos' : '← Back to projects') +
        '</a>' +
        '<h1 class="project-detail-title">' +
        (lang === 'es' ? 'Proyecto no encontrado' : 'Project not found') +
        '</h1></div></div>';
      return;
    }

    const ui = data.ui || {};
    const title = t(project.title) || t(project.cardTitle);
    const summary = t(project.summary) || t(project.desc);
    const desc = t(project.desc);
    const type = t(project.type);
    const cat = t(project.cat);
    const delivery = t(project.delivery);
    const stack = project.stack || '';
    const year = project.year || '';
    const url = project.url || '#';
    const tags = project.tags || [];
    const thumbs = project.thumbs || (project.image ? [project.image] : []);
    const work = listFrom('work');
    const features = listFrom('features');
    const extra = t(project.longDesc) || '';

    document.title = title + ' — FSTail Solutions';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', summary.slice(0, 160));

    const liveBtn = (url && url !== '#')
      ? '<a href="' + esc(url) + '" class="btn-primary" target="_blank" rel="noopener noreferrer">' +
        (t(ui.viewLive) || (lang === 'es' ? 'Ver demo en vivo →' : 'View live demo →')) +
        '</a>'
      : '';

    const workHtml = work.length
      ? '<section class="project-detail-section"><div class="container">' +
        '<h2>' + (t(ui.workDone) || (lang === 'es' ? 'Trabajo realizado' : 'Work performed')) + '</h2>' +
        '<ul>' + work.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
        '</div></section>'
      : '';

    const featHtml = features.length
      ? '<section class="project-detail-section"><div class="container">' +
        '<h2>' + (t(ui.keyFeatures) || (lang === 'es' ? 'Funcionalidades clave' : 'Key features')) + '</h2>' +
        '<ul>' + features.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
        '</div></section>'
      : '';

    const longHtml = extra
      ? '<p class="project-detail-long">' + esc(extra) + '</p>'
      : '';

    const bannerSrc = project.banner || project.image || '';
    const bannerHtml = bannerSrc
      ? '<div class="project-detail-banner"><img src="' + esc(bannerSrc) + '" alt="' + esc(title) + '"></div>'
      : '';

    root.innerHTML =
      bannerHtml +
      '<div class="project-detail-hero"><div class="container">' +
        '<a class="project-detail-back" href="./projects.html#proyectos">' +
          (t(ui.backToProjects) || (lang === 'es' ? '← Volver a proyectos' : '← Back to projects')) +
        '</a>' +
        '<p class="project-detail-label">' + esc(cat) + '</p>' +
        '<h1 class="project-detail-title">' + esc(title) + '</h1>' +
        '<p class="project-detail-summary">' + esc(summary) + '</p>' +
        '<div class="project-detail-meta">' +
          '<div class="project-detail-meta-item"><p>' + (t(ui.type) || 'Type') + '</p><p>' + esc(type) + '</p></div>' +
          '<div class="project-detail-meta-item"><p>' + (t(ui.stack) || 'Stack') + '</p><p>' + esc(stack) + '</p></div>' +
          '<div class="project-detail-meta-item"><p>' + (t(ui.year) || 'Year') + '</p><p>' + esc(year) + '</p></div>' +
          '<div class="project-detail-meta-item"><p>' + (t(ui.delivery) || 'Delivery') + '</p><p>' + esc(delivery) + '</p></div>' +
        '</div>' +
        '<div class="project-detail-actions">' + liveBtn +
          '<a href="./contact.html" class="btn-outline">' +
          (lang === 'es' ? 'Empezar un proyecto similar' : 'Start a similar project') +
          '</a></div>' +
      '</div></div>' +
      '<section class="project-detail-section"><div class="container">' +
        '<h2>' + (lang === 'es' ? 'Resumen' : 'Overview') + '</h2>' +
        '<p class="project-detail-body">' + esc(desc) + '</p>' +
        longHtml +
      '</div></section>' +
      workHtml + featHtml +
      '<section class="project-detail-section"><div class="container">' +
        '<h2>' + (t(ui.screenshots) || (lang === 'es' ? 'Capturas' : 'Screenshots')) + '</h2>' +
        buildGallery(thumbs, title) +
      '</div></section>' +
      '<section class="project-detail-section"><div class="container">' +
        '<h2>' + (lang === 'es' ? 'Tecnologías y etiquetas' : 'Technologies & tags') + '</h2>' +
        '<div class="project-tags">' + tags.map(function (tag) {
          return '<span>' + esc(tag) + '</span>';
        }).join('') + '</div>' +
        '<p class="project-detail-stack-note">' + esc(stack) + '</p>' +
      '</div></section>' +
      '<section class="cta-strip"><div class="cta-strip-inner">' +
        '<h2 class="cta-headline">' +
          (t(ui.ctaTitle) || (lang === 'es'
            ? '¿Querés un proyecto así<br>para tu <em>negocio?</em>'
            : 'Want a project like this<br>for your <em>business?</em>')) +
        '</h2>' +
        '<a href="./contact.html" class="btn-primary">' +
          (t(ui.ctaBtn) || (lang === 'es' ? 'Empezar ahora' : 'Start now')) +
        '</a></div></section>';

    bindGallery();
  }

  function setLang(next) {
    lang = next;
    localStorage.setItem('fstail_lang', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    render();
  }

  function init() {
    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(btn.getAttribute('data-lang'));
      });
    });

    const id = getId();
    fetch(DATA_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load projects.json');
        return r.json();
      })
      .then(function (json) {
        data = json;
        project = (data.projects || []).find(function (p) { return p.id === id; }) || null;
        setLang(lang);
      })
      .catch(function (err) {
        console.error(err);
        var root = document.getElementById('detailRoot');
        if (root) {
          root.innerHTML = '<p class="project-detail-loading">Could not load project data.</p>';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
