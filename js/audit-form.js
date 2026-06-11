/* ============================================================
   FSTail Solutions — Audit System
   audit-form.js  ·  Form logic, state, autosave, scores
   ============================================================ */

(function () {
  'use strict';

  const session = Auth.require();
  if (!session) return;

  const userBadgeEl = document.getElementById('userBadge');
  if (userBadgeEl) userBadgeEl.textContent = session.displayName;
  const logoutBtnEl = document.getElementById('logoutBtn');
  if (logoutBtnEl) logoutBtnEl.addEventListener('click', () => Auth.logout());

  /* ── Load existing audit (edit mode) ── */
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');
  let auditData = editId ? (AuditStore.getById(editId) || {}) : {};

  /* ── Section score definitions ── */
  const SCORED_SECTIONS = [
    'firstImpression','header','home','about','services','portfolio',
    'testimonials','faq','blog','contact','footer','responsive',
    'performance','seo','accessibility','security','ux','conversion','content'
  ];
  const SCORE_LABELS = {
    firstImpression: 'Puntaje primera impresión',
    header:    'Puntaje Header/Hero',
    home:      'Puntaje Home',
    about:     'Puntaje About',
    services:  'Puntaje Servicios',
    portfolio: 'Puntaje Portfolio',
    testimonials: 'Puntaje Testimonios',
    faq:       'Puntaje FAQ',
    blog:      'Puntaje Blog',
    contact:   'Puntaje Contacto',
    footer:    'Puntaje Footer',
    responsive:'Puntaje Responsive',
    performance:'Puntaje Performance',
    seo:       'Puntaje SEO',
    accessibility:'Puntaje Accesibilidad',
    security:  'Puntaje Seguridad',
    ux:        'Puntaje UX',
    conversion:'Puntaje Conversión',
    content:   'Puntaje Contenido',
  };

  /* ── Build score widgets ── */
  function buildScoreWidget(sectionKey) {
    const container = document.getElementById('scores-' + sectionKey);
    if (!container) return;
    const currentVal = getNestedVal(auditData, sectionKey + '.score');
    container.innerHTML = `
      <div class="score-row" style="margin-bottom:1.5rem;">
        <span class="score-label">${SCORE_LABELS[sectionKey] || 'Puntaje'}</span>
        <div class="score-options" id="score-opts-${sectionKey}">
          ${[1,2,3,4,5,6,7,8,9,10].map(n =>
            `<button class="score-btn${currentVal == n ? ' selected' : ''}"
               data-val="${n}"
               onclick="setScore('${sectionKey}',${n})">${n}</button>`
          ).join('')}
        </div>
        <span style="font-size:0.7rem;color:var(--clr-text-faint);margin-left:0.5rem;">/10</span>
      </div>`;
  }

  window.setScore = function(sectionKey, val) {
    document.querySelectorAll(`#score-opts-${sectionKey} .score-btn`).forEach(b => {
      b.classList.toggle('selected', parseInt(b.dataset.val) === val);
    });
    setNestedVal(auditData, sectionKey + '.score', val);
    updateProgress();
  };

  SCORED_SECTIONS.forEach(buildScoreWidget);

  /* ── Build evidence widgets ── */
  function buildEvidenceWidget(sectionKey) {
    const container = document.getElementById('evidence-' + sectionKey);
    if (!container) return;
    container.innerHTML = `
      <div class="evidence-area">
        <p class="small-label" style="margin-bottom:0.75rem;">Evidencias</p>
        <div class="evidence-drop" onclick="triggerEvidenceUpload('${sectionKey}')">
          📎 Clic para agregar capturas / notas visuales
        </div>
        <input type="file" id="ev-input-${sectionKey}" multiple accept="image/*" style="display:none;"
          onchange="handleEvidenceUpload('${sectionKey}',this)">
        <div class="evidence-thumbs" id="ev-thumbs-${sectionKey}"></div>
      </div>`;
    renderThumbs(sectionKey);
  }

  window.triggerEvidenceUpload = function(sk) {
    document.getElementById('ev-input-' + sk).click();
  };

  window.handleEvidenceUpload = function(sk, input) {
    const files = Array.from(input.files);
    if (!auditData[sk]) auditData[sk] = {};
    if (!auditData[sk].evidences) auditData[sk].evidences = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        auditData[sk].evidences.push({ name: file.name, data: e.target.result });
        renderThumbs(sk);
      };
      reader.readAsDataURL(file);
    });
  };

  function renderThumbs(sk) {
    const container = document.getElementById('ev-thumbs-' + sk);
    if (!container) return;
    const evs = (auditData[sk] && auditData[sk].evidences) || [];
    container.innerHTML = evs.map((ev, i) =>
      `<img class="evidence-thumb" src="${ev.data}" alt="${ev.name}"
         title="${ev.name} (clic para eliminar)"
         onclick="removeEvidence('${sk}',${i})">`
    ).join('');
  }

  window.removeEvidence = function(sk, idx) {
    if (auditData[sk] && auditData[sk].evidences) {
      auditData[sk].evidences.splice(idx, 1);
      renderThumbs(sk);
    }
  };

  SCORED_SECTIONS.forEach(buildEvidenceWidget);
  ['header','technologies','console','competitors','issues','recommendations','conclusions'].forEach(sk => {
    if (!SCORED_SECTIONS.includes(sk)) buildEvidenceWidget(sk);
  });

  /* ── Issues dynamic list ── */
  function buildIssueRow(issue, idx) {
    return `<div style="background:var(--clr-bg-3);border:1px solid var(--clr-border);padding:1rem;margin-bottom:0.75rem;display:grid;grid-template-columns:1fr 140px 32px;gap:0.75rem;align-items:start;" id="issue-${idx}">
      <textarea class="field-textarea" rows="2"
        placeholder="Describí el problema encontrado..."
        onchange="updateIssue(${idx},'desc',this.value)">${issue.desc || ''}</textarea>
      <select class="field-select" onchange="updateIssue(${idx},'priority',this.value)">
        <option value="high" ${issue.priority==='high'?'selected':''}>🔴 Alta</option>
        <option value="mid" ${issue.priority==='mid'?'selected':''}>🟡 Media</option>
        <option value="low" ${issue.priority==='low'?'selected':''}>🟢 Baja</option>
      </select>
      <button class="tbl-btn danger" onclick="removeIssue(${idx})">✕</button>
    </div>`;
  }

  function renderIssues() {
    const container = document.getElementById('issues-list');
    if (!container) return;
    const issues = (auditData.issues && auditData.issues.list) || [];
    container.innerHTML = issues.length
      ? issues.map(buildIssueRow).join('')
      : '<p class="text-muted" style="margin-bottom:1rem;">No hay problemas registrados aún.</p>';
  }

  window.addIssue = function() {
    if (!auditData.issues) auditData.issues = {};
    if (!auditData.issues.list) auditData.issues.list = [];
    auditData.issues.list.push({ desc: '', priority: 'high' });
    renderIssues();
  };

  window.updateIssue = function(idx, key, val) {
    if (auditData.issues && auditData.issues.list && auditData.issues.list[idx]) {
      auditData.issues.list[idx][key] = val;
    }
  };

  window.removeIssue = function(idx) {
    if (auditData.issues && auditData.issues.list) {
      auditData.issues.list.splice(idx, 1);
      renderIssues();
    }
  };

  renderIssues();

  /* ── Auto-calculate score ── */
  window.calcAutoScore = function() {
    const scores = SCORED_SECTIONS.map(sk => {
      return auditData[sk] && auditData[sk].score ? auditData[sk].score : null;
    }).filter(s => s !== null);
    if (!scores.length) { toast('No hay puntajes ingresados aún.'); return; }
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const final = Math.round(avg * 10);
    document.getElementById('finalScoreInput').value = final;
    auditData.finalScore = final;
    toast('Score calculado: ' + final + '/100', 'success');
  };

  /* ── Bind all data-field inputs ── */
  function bindFields() {
    document.querySelectorAll('[data-field]').forEach(el => {
      const path = el.getAttribute('data-field');
      const current = getNestedVal(auditData, path);
      if (current !== undefined && current !== null) {
        el.value = current;
      }
      el.addEventListener('input', () => {
        setNestedVal(auditData, path, el.value);
        updateProgress();
      });
      el.addEventListener('change', () => {
        setNestedVal(auditData, path, el.value);
        updateProgress();
      });
    });
  }

  /* ── Nested path helpers ── */
  function getNestedVal(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
  }

  function setNestedVal(obj, path, val) {
    const parts = path.split('.');
    let cursor = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cursor[parts[i]] || typeof cursor[parts[i]] !== 'object') cursor[parts[i]] = {};
      cursor = cursor[parts[i]];
    }
    cursor[parts[parts.length - 1]] = val;
  }

  /* ── Progress ── */
  function updateProgress() {
    const allFields = document.querySelectorAll('[data-field]');
    let filled = 0;
    allFields.forEach(el => { if (el.value && el.value.trim()) filled++; });
    const pct = allFields.length ? Math.round(filled / allFields.length * 100) : 0;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('progressLabel').textContent = pct + '% completado';
  }

  /* ── Wizard step nav ── */
  const steps = document.querySelectorAll('.wizard-step');
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const sec = step.dataset.section;
      const el = document.getElementById('sec-' + sec);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });

  // Intersection observer to update active step
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id.replace('sec-','');
        steps.forEach(s => s.classList.toggle('active', s.dataset.section === id));
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.audit-section-card').forEach(card => observer.observe(card));

  /* ── Toast ── */
  function toast(msg, type = '') {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  /* ── Save ── */
  function save(finalize = false) {
    if (finalize) auditData.status = 'done';
    else if (!auditData.status) auditData.status = 'draft';

    if (editId) {
      AuditStore.update(editId, auditData);
      toast('Auditoría actualizada.', 'success');
      if (finalize) {
        showReportLinks(editId);
      }
    } else {
      const saved = AuditStore.create(auditData);
      // update URL without reload so subsequent saves are updates
      history.replaceState(null, '', '?id=' + saved.id);
      toast('Auditoría guardada.', 'success');
      if (finalize) {
        showReportLinks(saved.id);
      }
    }
  }

  function showReportLinks(id) {
    const clientBtn = document.getElementById('viewClientReportBtn');
    const internalBtn = document.getElementById('viewInternalReportBtn');
    if (clientBtn) { clientBtn.href = '../templates/client-report.html?id=' + id; clientBtn.style.display = ''; }
    if (internalBtn) { internalBtn.href = '../templates/internal-report.html?id=' + id; internalBtn.style.display = ''; }
    toast('¡Informe generado! Podés verlo con los botones de arriba.', 'success');
  }

  const saveDraftBtn = document.getElementById('saveDraftBtn');
  if (saveDraftBtn) saveDraftBtn.addEventListener('click', () => save(false));
  const saveDraftBtn2 = document.getElementById('saveDraftBtn2');
  if (saveDraftBtn2) saveDraftBtn2.addEventListener('click', () => save(false));
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) generateBtn.addEventListener('click', () => save(true));
  const generateBtn2 = document.getElementById('generateBtn2');
  if (generateBtn2) generateBtn2.addEventListener('click', () => save(true));

  /* ── Autosave every 45s ── */
  setInterval(() => {
    if (auditData.generalInfo && auditData.generalInfo.company) save(false);
  }, 45000);

  /* ── Init ── */
  bindFields();
  updateProgress();

  // pre-fill date if new
  if (!editId) {
    const dateInput = document.querySelector('[data-field="generalInfo.date"]');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
      setNestedVal(auditData, 'generalInfo.date', dateInput.value);
    }
    const auditorInput = document.querySelector('[data-field="generalInfo.auditor"]');
    if (auditorInput && !auditorInput.value) {
      auditorInput.value = session.displayName;
      setNestedVal(auditData, 'generalInfo.auditor', session.displayName);
    }
  }

  // If existing audit, render issues
  if (editId) renderIssues();

})();
