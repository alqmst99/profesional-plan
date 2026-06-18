/* ================================================================
  FSTAIL SOLUTION — chatbot.js  (Production)
  Asistente integrado: base de conocimiento, motor de intenciones y UI
  Sin dependencias externas además de las ya presentes en la página.
  ================================================================ */

(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════════
     KNOWLEDGE BASE
     ══════════════════════════════════════════════════════════════ */
  const KB = {
    company: {
      name: "Fstail Solution",
      founded: 2020,
      email: "contact@fstailsolution.com",
      tagline: "Soluciones profesionales de auditoría y reportes",
      description: "Fstail Solution ofrece auditorías profesionales, generación de informes y soluciones digitales para equipos que necesitan resultados claros y accionables.",
      warranty: "Soporte y seguimiento según el plan contratado. Consultanos para detalles.",
      delivery: "Trabajamos con entregas digitales y soporte remoto; adaptamos entregables según tu flujo de trabajo.",
      contact: "Para contacto directo envía un correo a contact@fstailsolution.com o usa el formulario de contacto en la página principal.",
      quote: "Solicita un presupuesto gratuito indicando alcance y nº de proyectos — te respondemos en 1 día hábil.",
    },

    services: [],

    faq: [
      {
        q: ["where are you located","where is fstail","location","country","city","where do you operate"],
        a: "Fstail Solution designs and delivers worldwide — we work with architects, designers and homeowners across multiple continents. There's no need to be local; we manage every project remotely and coordinate delivery and installation through trusted partners in each region."
      },
      {
        q: ["how long does it take","lead time","delivery time","how long","timeline","when can i get","production time"],
        a: "Lead times depend on the system and project scope. Custom projects typically take 8–14 weeks from approved design to delivery. Contact us with your project details and we'll give you an accurate timeline."
      },
      {
        q: ["how much does it cost","price","pricing","cost","how expensive","quote","budget"],
        a: "Every Fstail Solution project is custom-engineered to your specifications, so pricing varies by system, size, glazing and finish. We provide detailed quotes with no obligation — just share your project details via the Contact page or email info@fstail.com."
      },
      {
        q: ["installation","do you install","installer","who installs","fitting","fitting service"],
        a: "We work with a network of certified installation partners worldwide. For each project we provide full technical documentation, drawings and on-site support to ensure a perfect installation — regardless of where you're building."
      },
      {
        q: ["warranty","guarantee","how long is the warranty","warranty period"],
        a: "All Fstail Solution products carry a 10-year product warranty plus a 5-year hardware and finish warranty — one of the strongest in the industry. Full warranty terms are provided with each project."
      },
      {
        q: ["energy","thermal","insulation","u-value","u value","passive house","energy efficient","heat","cold"],
        a: "Our systems range from U-Values of 0.68 W/m²K (Acoustic Performance Window, passive house level) to 0.9 W/m²K. All frames use thermally broken aluminum with Polyamide PA66 GF25 thermal break — meeting the strictest energy standards globally."
      },
      {
        q: ["security","burglar","rc2","locking","safe","break in","intruder"],
        a: "Multiple systems in our collection are RC2 burglar-resistance certified — including the Minimalist Casement, Tilt & Turn, and Lift & Slide. RC2 certification means the window withstands 3 minutes of attack with professional tools."
      },
      {
        q: ["colors","colour","colour options","ral","finish","powder coat","anodized","what colors","frame color"],
        a: "All aluminum frames are available in the full RAL palette (powder-coat), anodized finishes, and architectural woodgrain laminates. We can match virtually any project tone. Request a sample via the Contact page — color applies to aluminum profiles only."
      },
      {
        q: ["smart home","home automation","app control","knx","crestron","homekit","control4","alexa","google home","automated"],
        a: "Our Motorized Guillotine system integrates with Crestron, KNX, Control4, Apple HomeKit, Savant and Alexa/Google Assistant. The Lift & Slide also offers a motorized option with automation integration. Contact us to specify your preferred protocol."
      },
      {
        q: ["sample","samples","can i see","showroom","visit","touch","feel"],
        a: "We can send finish samples and technical documentation for any system directly to you. Contact us at info@fstail.com or via the Contact page — just specify which systems you're interested in."
      },
      {
        q: ["architect","designer","specification","spec","technical","drawings","cad","bim"],
        a: "We provide complete technical documentation for every system: detailed specification sheets, CAD drawings, BIM objects and product data sheets. Ideal for architect and designer specification. Email info@fstail.com to request documentation."
      },
      {
        q: ["maintenance","clean","cleaning","care","how to maintain"],
        a: "Fstail Solution frames require minimal maintenance — a periodic wipe with a mild detergent is all that's needed. Hardware should be lubricated annually. Glass cleaning follows standard window cleaning practices. Full care guides are provided with each project."
      },
      {
        q: ["custom","bespoke","custom size","custom shape","special shape","non standard"],
        a: "Every Fstail Solution project is custom-engineered to your exact dimensions. All our systems accept non-standard sizes within their structural limits. For truly bespoke shapes or configurations, contact us and we'll engineer a solution specifically for your project."
      },
      {
        q: ["hello","hi","hey","hola","good morning","good afternoon","good evening","howdy"],
        a: null // handled as greeting
      }
    ]
  };

  /* ══════════════════════════════════════════════════════════════
     INTENT ENGINE
     ══════════════════════════════════════════════════════════════ */
  const GREETINGS  = ["hola","buenos dias","buenas","buenas tardes","buenas noches","hi","hello","hey"];
  const THANKS     = ["gracias","thank","thanks","gracias!","muchas gracias","perfecto","genial","gracias por" ];
  const GOODBYES   = ["adios","hasta luego","chau","nos vemos","bye","goodbye"];

  function normalise(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function score(text, keywords) {
    return keywords.reduce((n, kw) => n + (text.includes(kw) ? 1 : 0), 0);
  }

  function findService(text) {
    let best = null, bestScore = 0;
    for (const s of KB.services) {
      const sc = score(text, s.keywords);
      if (sc > bestScore) { bestScore = sc; best = s; }
    }
    return bestScore > 0 ? best : null;
  }

  function findFaq(text) {
    let best = null, bestScore = 0;
    for (const f of KB.faq) {
      const s = score(text, f.q);
      if (s > bestScore) { bestScore = s; best = f; }
    }
    return bestScore > 0 ? best : null;
  }

  function buildResponse(raw) {
    const text = normalise(raw);

    // Saludo
    if (GREETINGS.some(g => text.includes(g))) {
      return {
        type: "greeting",
        text: "¡Hola! Soy el asistente de Fstail Solution. Puedo ayudarte a solicitar auditorías, generar informes y contactar soporte. ¿En qué quieres que te ayude?",
        suggestions: ["Solicitar auditoría","Generar informe","Solicitar presupuesto","Contactar soporte"]
      };
    }

    // Despedida
    if (GOODBYES.some(g => text.includes(g))) {
      return { type: "text", text: "Gracias por comunicarte con Fstail Solution. Si necesitas algo más, escríbenos a contact@fstailsolution.com. ¡Que tengas un buen día!" };
    }

    // Agradecimiento
    if (THANKS.some(t => text.includes(t))) {
      return {
        type: "text",
        text: "¡Con gusto! ¿Deseas solicitar una auditoría, generar un informe o te pongo en contacto con soporte?",
        suggestions: ["Solicitar auditoría","Generar informe","Contactar soporte"]
      };
    }

    // Mostrar todos los servicios
    if (text.match(/mostrar|lista|colecci[oó]n|que servicios|que ofrecen|servicios|productos|catalogo|listado/)) {
      return {
        type: "list",
        text: "Ofrecemos los siguientes servicios:",
        items: KB.services.map(s => `<strong>${s.name}</strong> <em class='chat-badge'>${s.badge}</em> — ${s.summary.split(".")[0]}.`),
        suggestions: ["Auditoría de Seguridad","Integración de Chatbot","Generar informe","Solicitar presupuesto"]
      };
    }

    // Informaci n de la empresa
    if (text.match(/sobre|quienes son|quien eres|quienes son fstail|quienes son fstail solution|empresa|historia|fundad/)) {
      return {
        type: "text",
        text: KB.company.description,
        suggestions: ["Mostrar servicios","Solicitar presupuesto","Contactar soporte"]
      };
    }

    // Contacto
    if (text.match(/email|contact|contacto|hablar|hablamos|telefono|llamar|escrib|contactar/)) {
      return {
        type: "text",
        text: KB.company.contact,
        link: { label: "Abrir formulario de contacto", href: isRoot() ? "pages/contact.html" : "contact.html" }
      };
    }

    // Presupuesto / precio
    if (text.match(/presupuesto|precio|costo|cuanto cuesta|cotiz|presupuest/)) {
      const faq = KB.faq.find(f => f.q.includes("precio") || f.q.includes("precio"));
      return {
        type: "text",
        text: faq ? faq.a : KB.company.quote,
        link: { label: "Solicitar presupuesto", href: isRoot() ? "pages/contact.html" : "contact.html" }
      };
    }

    // Coincidencia con un servicio
    const svc = findService(text);
    if (svc) {
      return {
        type: "service",
        name: svc.name,
        badge: svc.badge,
        summary: svc.summary,
        highlights: svc.highlights,
        link: { label: `Ver ${svc.name}`, href: isRoot() ? svc.link : svc.link.replace("pages/", "") }
      };
    }

    // FAQ match
    const faq = findFaq(text);
    if (faq && faq.a) {
      const res = { type: "text", text: faq.a };
      if (text.match(/color|colour|finish|ral/)) res.suggestions = ["Request a sample","Contact us"];
      if (text.match(/smart|homekit|knx|crestron|app|automat/)) res.suggestions = ["Motorized Guillotine","Lift & Slide","Contact us"];
      if (text.match(/energy|thermal|passive|u.val/)) res.suggestions = ["Acoustic Performance","Minimalist Casement","Get a quote"];
      return res;
    }

    // Respuesta por defecto
    return {
      type: "text",
      text: "No estoy seguro de haber entendido completamente. Puedo ayudarte a crear una auditoría, generar un informe, solicitar un presupuesto o ponerte en contacto con soporte. ¿Qué prefieres?",
      suggestions: ["Solicitar auditoría","Generar informe","Solicitar presupuesto","Contactar soporte"]
    };
  }

  function isRoot() {
    return !window.location.pathname.includes("/pages/");
  }

  /* ══════════════════════════════════════════════════════════════
     RENDER RESPONSE
     ══════════════════════════════════════════════════════════════ */
  function renderResponse(res, container) {
    const bubble = document.createElement("div");
    bubble.className = "bvc-bubble bvc-bubble--bot";

    let html = "";

    if (res.type === "greeting") {
      html = `<p>${res.text}</p>`;
    } else if (res.type === "list") {
      html = `<p>${res.text}</p><ul class="bvc-list">${res.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    } else if (res.type === "service") {
      html = `
        <div class="bvc-win-card">
          <div class="bvc-win-header">
            <strong>${res.name}</strong>
            <span class="bvc-badge">${res.badge}</span>
          </div>
          <p class="bvc-win-summary">${res.summary}</p>
          <ul class="bvc-highlights">${(res.highlights||[]).map(h => `<li>✓ ${h}</li>`).join("")}</ul>
        </div>`;
    } else {
      html = `<p>${res.text}</p>`;
    }

    // Link button
    if (res.link) {
      html += `<a href="${res.link.href}" class="bvc-link-btn">${res.link.label} →</a>`;
    }

    bubble.innerHTML = html;
    container.appendChild(bubble);

    // Suggestions
    if (res.suggestions?.length) {
      const row = document.createElement("div");
      row.className = "bvc-suggestions";
      res.suggestions.forEach(s => {
        const btn = document.createElement("button");
        btn.className = "bvc-suggestion";
        btn.textContent = s;
        btn.addEventListener("click", () => {
          row.remove();
          // acciones directas para sugerencias frecuentes
          if (s === "Solicitar auditoría") { window.location.href = isRoot() ? "pages/contact.html" : "contact.html"; return; }
          if (s === "Generar informe") { window.location.href = isRoot() ? "templates/client-report.html" : "templates/client-report.html"; return; }
          if (s === "Contactar soporte" || s === "Solicitar presupuesto") { window.location.href = isRoot() ? "pages/contact.html" : "contact.html"; return; }
          sendMessage(s);
        });
        row.appendChild(btn);
      });
      container.appendChild(row);
    }

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  /* ══════════════════════════════════════════════════════════════
     CHAT UI
     ══════════════════════════════════════════════════════════════ */
  let isOpen = false;
  let hasGreeted = false;
  let isTyping = false;

  function buildUI() {
    /* Toggle button */
    const toggle = document.createElement("button");
    toggle.id = "bvcToggle";
    toggle.setAttribute("aria-label", "Abrir asistente de Fstail");
    toggle.innerHTML = `
      <svg class="bvc-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
      </svg>
      <svg class="bvc-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <span class="bvc-badge-dot" id="bvcDot"></span>`;
    document.body.appendChild(toggle);

    /* Chat window */
    const win = document.createElement("div");
    win.id = "bvcWindow";
    win.setAttribute("aria-live", "polite");
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", "Asistente Fstail");
    win.innerHTML = `
      <div class="bvc-header">
          <div class="bvc-header-info">
            <div class="bvc-avatar"><span>FS</span></div>
            <div>
              <div class="bvc-header-name">Asistente Fstail</div>
              <div class="bvc-header-status"><span class="bvc-status-dot"></span>En línea</div>
            </div>
          </div>
        <button class="bvc-close-btn" id="bvcCloseBtn" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="bvc-messages" id="bvcMessages"></div>
      <div class="bvc-input-area">
        <input class="bvc-input" id="bvcInput" type="text" placeholder="Pregúntame lo que necesites…" autocomplete="off" maxlength="300">
        <button class="bvc-send-btn" id="bvcSend" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
        </button>
      </div>`;
    document.body.appendChild(win);

    /* Events */
    toggle.addEventListener("click", toggleChat);
    document.getElementById("bvcCloseBtn").addEventListener("click", closeChat);
    document.getElementById("bvcSend").addEventListener("click", handleSend);
    document.getElementById("bvcInput").addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });

    /* Close on outside click */
    document.addEventListener("click", e => {
      if (isOpen && !win.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) closeChat();
    });

    /* Auto-greet after 4 seconds */
    setTimeout(() => {
      if (!isOpen) {
        document.getElementById("bvcDot").style.display = "block";
      }
    }, 4000);
  }

  function toggleChat() {
    isOpen ? closeChat() : openChat();
  }

  function openChat() {
    isOpen = true;
    const win = document.getElementById("bvcWindow");
    const toggle = document.getElementById("bvcToggle");
    const dot = document.getElementById("bvcDot");
    win.classList.add("open");
    toggle.classList.add("open");
    dot.style.display = "none";
    document.getElementById("bvcInput").focus();

    if (!hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        showTyping(() => {
          const res = buildResponse("hello");
          renderResponse(res, document.getElementById("bvcMessages"));
        });
      }, 500);
    }
  }

  function closeChat() {
    isOpen = false;
    document.getElementById("bvcWindow").classList.remove("open");
    document.getElementById("bvcToggle").classList.remove("open");
  }

  function handleSend() {
    const input = document.getElementById("bvcInput");
    const text = input.value.trim();
    if (!text || isTyping) return;
    input.value = "";
    sendMessage(text);
  }

  function sendMessage(text) {
    const msgs = document.getElementById("bvcMessages");

    /* User bubble */
    const userBubble = document.createElement("div");
    userBubble.className = "bvc-bubble bvc-bubble--user";
    userBubble.textContent = text;
    msgs.appendChild(userBubble);
    msgs.scrollTop = msgs.scrollHeight;

    /* Typing indicator then response */
    showTyping(() => {
      const res = buildResponse(text);
      renderResponse(res, msgs);
    });
  }

  function showTyping(callback) {
    isTyping = true;
    const msgs = document.getElementById("bvcMessages");
    const indicator = document.createElement("div");
    indicator.className = "bvc-typing";
    indicator.innerHTML = `<span></span><span></span><span></span>`;
    msgs.appendChild(indicator);
    msgs.scrollTop = msgs.scrollHeight;

    const delay = 600 + Math.random() * 700;
    setTimeout(() => {
      indicator.remove();
      isTyping = false;
      callback();
    }, delay);
  }

  /* ══════════════════════════════════════════════════════════════
     INJECT STYLES
     ══════════════════════════════════════════════════════════════ */
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
/* ── Toggle button ─────────────────────────────────── */
#bvcToggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #3a2e24;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(58,46,36,0.38);
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.22s, transform 0.22s, box-shadow 0.22s;
  padding: 0;
}
#bvcToggle:hover {
  background: #c9a96e;
  transform: scale(1.07);
  box-shadow: 0 12px 40px rgba(201,169,110,0.38);
}
#bvcToggle svg {
  width: 26px;
  height: 26px;
  color: #fff;
  stroke: #fff;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.2s;
}
.bvc-icon-chat   { display: block; }
.bvc-icon-close  { display: none; }
#bvcToggle.open .bvc-icon-chat  { display: none; }
#bvcToggle.open .bvc-icon-close { display: block; }
.bvc-badge-dot {
  position: absolute;
  top: 6px; right: 6px;
  width: 10px; height: 10px;
  background: #c9a96e;
  border-radius: 50%;
  border: 2px solid #fff;
  display: none;
  animation: bvcPulse 2s infinite;
}
@keyframes bvcPulse {
  0%,100% { transform: scale(1); opacity:1; }
  50%      { transform: scale(1.3); opacity:0.7; }
}

/* ── Chat window ───────────────────────────────────── */
#bvcWindow {
  position: fixed;
  bottom: calc(2rem + 58px + 12px);
  right: 2rem;
  width: 370px;
  max-height: 560px;
  background: #faf8f4;
  border-radius: 0;
  box-shadow: 0 24px 64px rgba(58,46,36,0.22), 0 2px 8px rgba(58,46,36,0.08);
  display: flex;
  flex-direction: column;
  z-index: 9997;
  opacity: 0;
  pointer-events: none;
  transform: translateY(16px) scale(0.97);
  transition: opacity 0.28s ease, transform 0.28s ease;
  overflow: hidden;
  border: 1px solid #e8e2d8;
}
#bvcWindow.open {
  opacity: 1;
  pointer-events: all;
  transform: none;
}

/* ── Header ─────────────────────────────────────────── */
.bvc-header {
  background: #3a2e24;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.bvc-header-info { display: flex; align-items: center; gap: 0.7rem; }
.bvc-avatar {
  width: 38px; height: 38px;
  background: #c9a96e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bvc-avatar span {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.05em;
}
.bvc-header-name {
  font-family: "Jost", sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.04em;
}
.bvc-header-status {
  font-family: "Jost", sans-serif;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.55);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 2px;
}
.bvc-status-dot {
  width: 6px; height: 6px;
  background: #7bcf7b;
  border-radius: 50%;
  flex-shrink: 0;
}
.bvc-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  opacity: 0.5;
  transition: opacity 0.2s;
  display: flex;
}
.bvc-close-btn:hover { opacity: 1; }
.bvc-close-btn svg { width: 18px; height: 18px; stroke: #fff; }

/* ── Messages ───────────────────────────────────────── */
.bvc-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  scroll-behavior: smooth;
}
.bvc-messages::-webkit-scrollbar { width: 4px; }
.bvc-messages::-webkit-scrollbar-track { background: transparent; }
.bvc-messages::-webkit-scrollbar-thumb { background: #e8e2d8; border-radius: 2px; }

.bvc-bubble {
  max-width: 88%;
  padding: 0.75rem 1rem;
  font-family: "Jost", sans-serif;
  font-size: 0.82rem;
  line-height: 1.65;
  animation: bvcFadeUp 0.22s ease;
}
@keyframes bvcFadeUp {
  from { opacity:0; transform: translateY(6px); }
  to   { opacity:1; transform: none; }
}
.bvc-bubble p { margin: 0 0 0.4rem; }
.bvc-bubble p:last-child { margin-bottom: 0; }

.bvc-bubble--user {
  align-self: flex-end;
  background: #3a2e24;
  color: #faf8f4;
  border-radius: 12px 12px 2px 12px;
  font-weight: 300;
}
.bvc-bubble--bot {
  align-self: flex-start;
  background: #fff;
  color: #3a2e24;
  border-radius: 2px 12px 12px 12px;
  border: 1px solid #e8e2d8;
}

/* Lists */
.bvc-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
}
.bvc-list li {
  padding: 0.35rem 0;
  border-bottom: 1px solid #f0ede8;
  font-size: 0.78rem;
  color: #5a4e44;
}
.bvc-list li:last-child { border-bottom: none; }
.chat-badge {
  font-size: 0.62rem;
  font-style: normal;
  background: #c9a96e;
  color: #fff;
  padding: 1px 7px;
  letter-spacing: 0.08em;
  vertical-align: middle;
  margin-left: 4px;
}

/* Window card */
.bvc-win-card { font-size: 0.8rem; }
.bvc-win-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.3rem;
}
.bvc-win-header strong {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 1.05rem;
  font-weight: 400;
  color: #3a2e24;
}
.bvc-badge {
  background: #c9a96e;
  color: #fff;
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  padding: 2px 8px;
  text-transform: uppercase;
  font-family: "Jost", sans-serif;
  font-weight: 500;
  flex-shrink: 0;
}
.bvc-win-summary {
  color: #6b5e54;
  line-height: 1.6;
  margin-bottom: 0.7rem !important;
}
.bvc-specs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  margin-bottom: 0.7rem;
}
.bvc-specs-table td {
  padding: 0.3rem 0;
  border-bottom: 1px solid #f0ede8;
  vertical-align: top;
}
.bvc-specs-table td:first-child {
  color: #8a7d6e;
  padding-right: 0.6rem;
  white-space: nowrap;
  width: 45%;
}
.bvc-specs-table td strong { color: #3a2e24; font-weight: 500; }
.bvc-highlights {
  list-style: none;
  padding: 0;
  margin: 0;
}
.bvc-highlights li {
  font-size: 0.72rem;
  color: #6b5e54;
  padding: 2px 0;
}
.bvc-highlights li::before { content: "✓ "; color: #c9a96e; font-weight: 600; }

/* Link button */
.bvc-link-btn {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: #3a2e24;
  color: #fff !important;
  font-family: "Jost", sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.2s;
}
.bvc-link-btn:hover { background: #c9a96e; }

/* Suggestions */
.bvc-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0 1.2rem 0.8rem;
  align-self: flex-start;
  animation: bvcFadeUp 0.25s ease;
}
.bvc-suggestion {
  background: #fff;
  border: 1px solid #c9a96e;
  color: #a07840;
  font-family: "Jost", sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  padding: 0.4rem 0.75rem;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;
}
.bvc-suggestion:hover { background: #c9a96e; color: #fff; }

/* Typing indicator */
.bvc-typing {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 0.7rem 1rem;
  background: #fff;
  border: 1px solid #e8e2d8;
  border-radius: 2px 12px 12px 12px;
  align-self: flex-start;
  width: 54px;
}
.bvc-typing span {
  width: 6px; height: 6px;
  background: #c9a96e;
  border-radius: 50%;
  animation: bvcDot 1.2s infinite ease-in-out;
  flex-shrink: 0;
}
.bvc-typing span:nth-child(2) { animation-delay: 0.2s; }
.bvc-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bvcDot {
  0%,80%,100% { transform: scale(0.6); opacity:0.4; }
  40%          { transform: scale(1);   opacity:1; }
}

/* ── Input area ─────────────────────────────────────── */
.bvc-input-area {
  display: flex;
  align-items: center;
  gap: 0;
  border-top: 1px solid #e8e2d8;
  background: #fff;
  flex-shrink: 0;
}
.bvc-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.85rem 1rem;
  font-family: "Jost", sans-serif;
  font-size: 0.82rem;
  font-weight: 300;
  color: #3a2e24;
  background: transparent;
}
.bvc-input::placeholder { color: #b4a99e; }
.bvc-send-btn {
  width: 46px;
  height: 46px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.18s;
  border-radius: 0;
  margin: 3px;
}
.bvc-send-btn:hover { background: #c9a96e; }
.bvc-send-btn:hover svg { stroke: #fff; }
.bvc-send-btn svg { width: 20px; height: 20px; stroke: #a07840; transition: stroke 0.18s; }

/* ── Mobile ─────────────────────────────────────────── */
@media (max-width: 480px) {
  #bvcWindow {
    width: calc(100vw - 2rem);
    right: 1rem;
    bottom: calc(1rem + 58px + 12px);
    max-height: 70vh;
  }
  #bvcToggle { bottom: 1rem; right: 1rem; }
}
    `;
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════════════════ */
  function init() {
    injectStyles();
    buildUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
