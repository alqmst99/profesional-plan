/* ================================================================
   BELL VITA — chatbot.js  (Production v1)
   Self-contained: knowledge base + intent engine + UI
   No external dependencies except what's already on the page.
   ================================================================ */

(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════════
     KNOWLEDGE BASE
     ══════════════════════════════════════════════════════════════ */
  const KB = {
    company: {
      name: "Bell Vita",
      founded: 2004,
      email: "info@bell-vita.com",
      tagline: "Precision-crafted architectural windows.",
      description: "Bell Vita designs and crafts precision architectural windows for the world's finest homes. With over 20 years of experience, we deliver exceptional quality to architects, designers and homeowners worldwide.",
      warranty: "All Bell Vita windows come with a 10-year product warranty and a 5-year hardware or finish warranty — one of the strongest in the industry.",
      delivery: "We design and deliver worldwide. Every project is custom-engineered to your exact specifications.",
      contact: "The best way to reach us is by email at info@bell-vita.com, or by filling out the contact form on our Contact page. We respond within one business day.",
      quote: "We offer free consultations with no obligation. Simply visit our Contact page or email info@bell-vita.com with your project details.",
      colors: "All aluminum frames are available in a full palette of RAL powder-coat colors, anodized finishes and woodgrain laminates. Color customization applies to aluminum profiles only — we can match virtually any architectural tone. Request samples via our Contact page.",
      materials: "Our frames are crafted from 6063-T5 thermally broken aluminum alloy — the benchmark for architectural window systems. Every profile includes a Polyamide PA66 GF25 thermal break for energy efficiency.",
      glazing: "We offer double and triple IGU (insulated glass units) with Low-E coating, solar control, acoustic laminate and anti-reflective options. Glass specification is tailored to each project.",
    },

    windows: [
      {
        slug: "panoramic-fixed",
        name: "Panoramic Fixed Glass",
        badge: "Signature",
        keywords: ["panoramic","fixed","fixed glass","floor to ceiling","large","big window","view","glass wall"],
        summary: "Our flagship system — floor-to-ceiling fixed glass panels with just 38 mm of visible aluminum. Maximum light, pure view, no compromises.",
        specs: {
          "Visible face": "38 mm",
          "Frame material": "6063-T5 thermally broken aluminum",
          "Max panel size": "4000 × 3200 mm",
          "Glass options": "Double or triple IGU, Low-E, anti-reflective",
          "U-Value": "From 0.8 W/m²K (triple glazed)",
          "Warranty": "10-year product · 5-year finish"
        },
        highlights: ["Floor-to-ceiling format","Maximum natural light","Structural silicone glazing","Compatible with solar shading systems"],
        link: "pages/windows.html"
      },
      {
        slug: "lift-and-slide",
        name: "Lift & Slide System",
        badge: "Most Popular",
        keywords: ["lift","slide","sliding","lift and slide","heavy","600kg","600 kg","terrace","outdoor","opening wall","indoor outdoor"],
        summary: "Our most popular system. Panels up to 600 kg moved with a single handle turn. Hermetic seal, flat threshold, motorized option available.",
        specs: {
          "Max sash weight": "600 kg per leaf",
          "Max width": "6000 mm single panel",
          "Visible face": "55 mm",
          "Track": "316 stainless dual-track, flush threshold",
          "U-Value": "From 0.7 W/m²K triple glazed",
          "Warranty": "10-year product · 5-year hardware"
        },
        highlights: ["600 kg panels moved with one finger","5-point RC2 locking","Barrier-free flush threshold","Motorized option with smart home integration"],
        link: "pages/windows.html"
      },
      {
        slug: "minimalist-casement",
        name: "Minimalist Casement",
        badge: "Architectural",
        keywords: ["casement","minimalist","slim","20mm","20 mm","thin frame","concealed hinge","invisible hinge","small frame"],
        summary: "20 mm visible face — the slimmest casement in our collection. Concealed hinges, multi-point lock, RC2 certified. The frame disappears.",
        specs: {
          "Visible face": "20 mm",
          "Frame depth": "95 mm",
          "Opening": "90° full open · 100 mm restricted mode",
          "Security": "RC2 burglar resistance certified",
          "U-Value": "From 0.75 W/m²K triple glazed",
          "Warranty": "10-year product · 5-year hardware"
        },
        highlights: ["20 mm sightline — industry leading","Concealed 3D-adjustable hinges","Tilt-and-turn config available","Acoustic glazing to Rw 42 dB"],
        link: "pages/windows.html"
      },
      {
        slug: "tilt-turn",
        name: "Tilt & Turn Window",
        badge: "Best Seller",
        keywords: ["tilt","turn","tilt and turn","tilt turn","ventilation","two modes","european","versatile"],
        summary: "Best seller. One handle — two positions: tilt for secure background ventilation, full turn for inward opening and easy cleaning.",
        specs: {
          "Opening modes": "Tilt (top-in) + Turn (90° inward swing)",
          "Visible face": "60 mm",
          "Max size": "2600 × 3000 mm",
          "Max weight": "170 kg per sash",
          "U-Value": "From 0.78 W/m²K",
          "Warranty": "10-year product · 5-year hardware"
        },
        highlights: ["Tilt open while fully locked","Easy cleaning from inside","Child-safety handle lock","RC2 multi-point compression"],
        link: "pages/windows.html"
      },
      {
        slug: "pivot",
        name: "Architectural Pivot Window",
        badge: "Statement",
        keywords: ["pivot","rotating","rotate","statement","bold","dramatic","360","central axis","design feature"],
        summary: "A design statement. Rotates on a central axis — creating two simultaneous ventilation openings. Hydraulic damper prevents slamming. Up to 300 kg.",
        specs: {
          "Max size": "2400 × 3200 mm",
          "Capacity": "300 kg",
          "Opening angle": "90° or 180° with stops",
          "Axis options": "Vertical or horizontal, center or offset",
          "Damper": "Hydraulic slow-close, adjustable",
          "Warranty": "10-year product · 5-year finish"
        },
        highlights: ["Dual ventilation zones","Hydraulic slow-close damper","Zero visible frame when closed","Custom pivot offset available"],
        link: "pages/windows.html"
      },
      {
        slug: "corner-glass",
        name: "Frameless Corner Glass",
        badge: "Architectural",
        keywords: ["corner","corner glass","frameless corner","no post","no column","corner window","360 view","structural silicone"],
        summary: "No post, no column, no interruption. Two glass planes meet at the corner with structural silicone — light enters from two directions. Code compliant globally.",
        specs: {
          "Corner joint": "Structural silicone or spider fittings",
          "Glass min thickness": "2 × 8 mm laminated tempered",
          "Max size per side": "3000 × 3500 mm",
          "Engineering": "Per EN 1990 / ASTM E330",
          "Warranty": "10-year structural silicone"
        },
        highlights: ["Zero vertical post","Structural silicone bonded joint","Engineer's stamp per project","Fixed, opening or mixed panels"],
        link: "pages/windows.html"
      },
      {
        slug: "motorized-guillotine",
        name: "Motorized Guillotine",
        badge: "Innovation",
        keywords: ["guillotine","motorized","motor","disappearing","automated","smart","app","voice","descend","pocket","invisible open"],
        summary: "The glass disappears. Descends into a concealed floor pocket — the wall becomes a pure open void. App, voice and automation control.",
        specs: {
          "Motor": "24V brushless DC, 200 kg, IP54",
          "Travel speed": "10–45 sec full travel",
          "Control": "App, voice (Alexa/Google), wall switch, KNX",
          "Safety": "Anti-pinch infrared edge, auto-reverse",
          "Max size": "3000 × 2500 mm",
          "Warranty": "5-year motor · 10-year frame"
        },
        highlights: ["Fully disappears into floor pocket","Crestron, KNX, Control4, HomeKit","Wind & rain auto-close sensors","Zero visible frame when open"],
        link: "pages/windows.html"
      },
      {
        slug: "awning",
        name: "Top-Hung Awning Window",
        badge: "Contemporary",
        keywords: ["awning","top hung","top-hung","rain","ventilate in rain","coastal","weather","all weather","top opening"],
        summary: "Open in the rain. The glass tilts outward from the top hinge — shedding water while fresh air flows freely beneath. Class E900 water resistance.",
        specs: {
          "Opening": "Outward from top hinge, 30° max",
          "Visible face": "69 mm",
          "Max size": "2000 × 1400 mm",
          "Water resistance": "Class E900 EN 12208 — rain-open rated",
          "U-Value": "From 0.82 W/m²K",
          "Warranty": "10-year product · 5-year hardware"
        },
        highlights: ["Ventilate during light rain","4-edge compression seal","Friction-stay arm locks at any angle","Compatible with insect screen systems"],
        link: "pages/windows.html"
      },
      {
        slug: "invisible",
        name: "Invisible Integrated Window",
        badge: "Exclusive",
        keywords: ["invisible","integrated","flush","hidden","no reveal","wall flush","no frame","concealed","touch latch","interior flush"],
        summary: "The window that isn't there. Sits perfectly flush with the interior wall — no reveals, no shadow lines. Touch-latch opening, no visible hardware.",
        specs: {
          "Interior reveal": "Zero — flush with wall",
          "Frame depth": "Adapts up to 300 mm wall thickness",
          "Max size": "2600 × 3200 mm",
          "Opening modes": "Tilt, full inward swing, or fixed",
          "U-Value": "From 0.80 W/m²K",
          "Warranty": "10-year product · 5-year hardware"
        },
        highlights: ["Zero reveal — flush with wall finish","Touch-latch — no visible handle","Frame hidden in wall thickness","Plaster/tile/timber finish over frame"],
        link: "pages/windows.html"
      },
      {
        slug: "acoustic",
        name: "Acoustic Performance Window",
        badge: "Specialist",
        keywords: ["acoustic","sound","noise","quiet","silence","rw","decibel","db","city","traffic","urban","soundproof","sound reduction"],
        summary: "Up to Rw 52 dB noise reduction. Asymmetric triple glazing, 7-point compression, foam-injected frame chambers. The city becomes a painting.",
        specs: {
          "Acoustic rating": "Up to Rw 52 dB",
          "Glazing": "Asymmetric triple: 6/16/8.8 mm laminated",
          "Visible face": "72 mm",
          "Frame depth": "160 mm foam-injected",
          "Compression": "7-point, contact every 300 mm",
          "U-Value": "From 0.68 W/m²K (passive house level)"
        },
        highlights: ["Rw 52 dB — halves perceived noise twice over","Asymmetric triple breaks coincidence freq.","7-point compression espagnolette","Passive house performance level"],
        link: "pages/windows.html"
      }
    ],

    faq: [
      {
        q: ["where are you located","where is bell vita","location","country","city","where do you operate"],
        a: "Bell Vita designs and delivers worldwide — we work with architects, designers and homeowners across multiple continents. There's no need to be local; we manage every project remotely and coordinate delivery and installation through trusted partners in each region."
      },
      {
        q: ["how long does it take","lead time","delivery time","how long","timeline","when can i get","production time"],
        a: "Lead times depend on the system and project scope. Custom projects typically take 8–14 weeks from approved design to delivery. Contact us with your project details and we'll give you an accurate timeline."
      },
      {
        q: ["how much does it cost","price","pricing","cost","how expensive","quote","budget"],
        a: "Every Bell Vita project is custom-engineered to your specifications, so pricing varies by system, size, glazing and finish. We provide detailed quotes with no obligation — just share your project details via the Contact page or email info@bell-vita.com."
      },
      {
        q: ["installation","do you install","installer","who installs","fitting","fitting service"],
        a: "We work with a network of certified installation partners worldwide. For each project we provide full technical documentation, drawings and on-site support to ensure a perfect installation — regardless of where you're building."
      },
      {
        q: ["warranty","guarantee","how long is the warranty","warranty period"],
        a: "All Bell Vita windows carry a 10-year product warranty plus a 5-year hardware and finish warranty — one of the strongest in the industry. Full warranty terms are provided with each project."
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
        a: "We can send finish samples and technical documentation for any system directly to you. Contact us at info@bell-vita.com or via the Contact page — just specify which systems you're interested in."
      },
      {
        q: ["architect","designer","specification","spec","technical","drawings","cad","bim"],
        a: "We provide complete technical documentation for every system: detailed specification sheets, CAD drawings, BIM objects and product data sheets. Ideal for architect and designer specification. Email info@bell-vita.com to request documentation."
      },
      {
        q: ["maintenance","clean","cleaning","care","how to maintain"],
        a: "Bell Vita aluminum frames require minimal maintenance — a periodic wipe with a mild detergent is all that's needed. Hardware should be lubricated annually. Glass cleaning follows standard window cleaning practices. Full care guides are provided with each project."
      },
      {
        q: ["custom","bespoke","custom size","custom shape","special shape","non standard"],
        a: "Every Bell Vita project is custom-engineered to your exact dimensions. All our systems accept non-standard sizes within their structural limits. For truly bespoke shapes or configurations, contact us and we'll engineer a solution specifically for your project."
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
  const GREETINGS  = ["hello","hi","hey","hola","good morning","good afternoon","good evening","howdy","sup","what's up"];
  const THANKS     = ["thank","thanks","thank you","gracias","cheers","appreciate","perfect","great"];
  const GOODBYES   = ["bye","goodbye","ciao","see you","later","take care"];

  function normalise(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function score(text, keywords) {
    return keywords.reduce((n, kw) => n + (text.includes(kw) ? 1 : 0), 0);
  }

  function findWindow(text) {
    let best = null, bestScore = 0;
    for (const w of KB.windows) {
      const s = score(text, w.keywords);
      if (s > bestScore) { bestScore = s; best = w; }
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

    // Greetings
    if (GREETINGS.some(g => text.includes(g))) {
      return {
        type: "greeting",
        text: "Hello! I'm the Bell Vita assistant. I can help you explore our window collection, answer technical questions, or connect you with our team. What are you looking for?",
        suggestions: ["Show all window types","Lift & Slide System","Acoustic windows","Get a quote"]
      };
    }

    // Goodbyes
    if (GOODBYES.some(g => text.includes(g))) {
      return { type: "text", text: "Thank you for visiting Bell Vita. If you have any questions in the future, don't hesitate to reach out — or email us at info@bell-vita.com. Have a wonderful day." };
    }

    // Thanks
    if (THANKS.some(t => text.includes(t))) {
      return {
        type: "text",
        text: "You're very welcome! Is there anything else I can help you with?",
        suggestions: ["Show all windows","Get a quote","Contact us"]
      };
    }

    // Show all windows
    if (text.match(/all window|list|collection|what window|what do you|what systems|types of window|what type|catalog|catalogue|what products/)) {
      return {
        type: "list",
        text: "We design and craft 10 precision window systems:",
        items: KB.windows.map(w => `<strong>${w.name}</strong> <em class='chat-badge'>${w.badge}</em> — ${w.summary.split(".")[0]}.`),
        suggestions: ["Panoramic Fixed Glass","Lift & Slide","Acoustic windows","Get a quote"]
      };
    }

    // Company info
    if (text.match(/about bell vita|who are you|who is bell vita|what is bell vita|company|history|founded|how old|story/)) {
      return {
        type: "text",
        text: KB.company.description + " Founded in 2004, we remain privately owned and focused entirely on the quality of what we make.",
        suggestions: ["View window collection","Get a quote","Contact us"]
      };
    }

    // Email / contact
    if (text.match(/email|contact|reach|get in touch|speak|talk|call/)) {
      return {
        type: "text",
        text: KB.company.contact,
        link: { label: "Open Contact Page", href: isRoot() ? "pages/contact.html" : "contact.html" }
      };
    }

    // Quote
    if (text.match(/quote|price|cost|how much|budget|pricing|how expensive/)) {
      const faq = KB.faq.find(f => f.q.includes("how much does it cost"));
      return {
        type: "text",
        text: faq.a,
        link: { label: "Request a Free Quote", href: isRoot() ? "pages/contact.html" : "contact.html" }
      };
    }

    // Specific window match
    const win = findWindow(text);
    if (win) {
      const specRows = Object.entries(win.specs)
        .map(([k, v]) => `<tr><td>${k}</td><td><strong>${v}</strong></td></tr>`)
        .join("");
      return {
        type: "window",
        name: win.name,
        badge: win.badge,
        summary: win.summary,
        specs: specRows,
        highlights: win.highlights,
        link: { label: `View ${win.name}`, href: isRoot() ? win.link : win.link.replace("pages/", "") }
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

    // Fallback
    return {
      type: "text",
      text: "I'm not sure I understood that fully. I can help you with our window collection, technical specs, colors, lead times, pricing, or connecting you with our team — what would you like to know?",
      suggestions: ["Show all windows","Get a quote","Contact us","Acoustic windows"]
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
    } else if (res.type === "window") {
      html = `
        <div class="bvc-win-card">
          <div class="bvc-win-header">
            <strong>${res.name}</strong>
            <span class="bvc-badge">${res.badge}</span>
          </div>
          <p class="bvc-win-summary">${res.summary}</p>
          <table class="bvc-specs-table">${res.specs}</table>
          <ul class="bvc-highlights">${res.highlights.map(h => `<li>✓ ${h}</li>`).join("")}</ul>
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
    toggle.setAttribute("aria-label", "Open Bell Vita assistant");
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
    win.setAttribute("aria-label", "Bell Vita chat assistant");
    win.innerHTML = `
      <div class="bvc-header">
        <div class="bvc-header-info">
          <div class="bvc-avatar"><span>BV</span></div>
          <div>
            <div class="bvc-header-name">Bell Vita Assistant</div>
            <div class="bvc-header-status"><span class="bvc-status-dot"></span>Online</div>
          </div>
        </div>
        <button class="bvc-close-btn" id="bvcCloseBtn" aria-label="Close chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="bvc-messages" id="bvcMessages"></div>
      <div class="bvc-input-area">
        <input class="bvc-input" id="bvcInput" type="text" placeholder="Ask me anything…" autocomplete="off" maxlength="300">
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
