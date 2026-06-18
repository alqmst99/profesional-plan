/* ============================================================
   FSTail Solutions — Audit System
   audit-store.js  ·  Data persistence layer (localStorage)
   ============================================================ */

const AuditStore = (() => {
  const KEY = 'fstail_audits';

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch { return []; }
  }

  function save(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function getById(id) {
    return getAll().find(a => a.id === id) || null;
  }

  function create(audit) {
    const list = getAll();
    audit.id = 'audit_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    audit.createdAt = new Date().toISOString();
    audit.updatedAt = audit.createdAt;
    list.unshift(audit);
    save(list);
    return audit;
  }

  function update(id, data) {
    const list = getAll();
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
    save(list);
    return list[idx];
  }

  function remove(id) {
    const list = getAll().filter(a => a.id !== id);
    save(list);
  }

  function duplicate(id) {
    const original = getById(id);
    if (!original) return null;
    const copy = JSON.parse(JSON.stringify(original));
    delete copy.id;
    copy.generalInfo = { ...(copy.generalInfo || {}), company: (copy.generalInfo && copy.generalInfo.company ? copy.generalInfo.company : '') + ' (copia)' };
    copy.status = 'draft';
    return create(copy);
  }

  function search(query) {
    const q = query.toLowerCase();
    return getAll().filter(a => {
      const info = a.generalInfo || {};
      return (info.company || '').toLowerCase().includes(q)
          || (info.url || '').toLowerCase().includes(q)
          || (a.status || '').toLowerCase().includes(q);
    });
  }

  return { getAll, getById, create, update, remove, duplicate, search };
})();
