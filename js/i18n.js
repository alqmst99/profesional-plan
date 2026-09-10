/**
 * FSTail Solutions — shared i18n
 * Loads data/i18n.json, applies [data-i18n], [data-i18n-html], [data-i18n-placeholder],
 * [data-i18n-content], [data-i18n-aria], and manages EN/ES toggle + localStorage.
 */
(function () {
  const STORAGE_KEY = 'fstail_lang';
  let dict = null;
  let lang = localStorage.getItem(STORAGE_KEY) || 'en';

  function basePath() {
    // pages/* → ../  |  root → ./
    const path = window.location.pathname || '';
    if (path.includes('/pages/')) return '../';
    return './';
  }

  function resolve(key) {
    if (!dict || !key) return null;
    const parts = key.split('.');
    let cur = dict;
    for (const p of parts) {
      if (cur == null) return null;
      cur = cur[p];
    }
    return cur;
  }

  function t(keyOrObj) {
    if (keyOrObj == null) return '';
    if (typeof keyOrObj === 'object' && (keyOrObj.en != null || keyOrObj.es != null)) {
      return keyOrObj[lang] || keyOrObj.en || '';
    }
    const val = resolve(String(keyOrObj));
    if (val == null) return '';
    if (typeof val === 'object') return val[lang] || val.en || '';
    return String(val);
  }

  function apply() {
    if (!dict) return;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const text = t(el.getAttribute('data-i18n'));
      if (text) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const html = t(el.getAttribute('data-i18n-html'));
      if (html) el.innerHTML = html;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const text = t(el.getAttribute('data-i18n-placeholder'));
      if (text) el.setAttribute('placeholder', text);
    });

    document.querySelectorAll('[data-i18n-content]').forEach(el => {
      const text = t(el.getAttribute('data-i18n-content'));
      if (text) el.setAttribute('content', text);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const text = t(el.getAttribute('data-i18n-aria'));
      if (text) el.setAttribute('aria-label', text);
    });

    // document title
    const titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey) {
      const title = t(titleKey);
      if (title) document.title = title;
    }

    // toggle buttons
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('fstail:langchange', { detail: { lang } }));
  }

  function setLang(next) {
    if (!next || next === lang) return;
    lang = next;
    localStorage.setItem(STORAGE_KEY, lang);
    apply();
  }

  function bindToggles() {
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
    });
  }

  function init() {
    bindToggles();
    const url = basePath() + 'data/i18n.json';
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('i18n load failed: ' + r.status);
        return r.json();
      })
      .then(json => {
        dict = json;
        apply();
      })
      .catch(err => console.warn('[i18n]', err));
  }

  window.FSTailI18n = {
    t,
    getLang: () => lang,
    setLang,
    apply,
    onReady: (fn) => {
      if (dict) fn();
      else document.addEventListener('fstail:langchange', fn, { once: true });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
