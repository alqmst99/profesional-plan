/**
 * main.js — PATCHED scroll handler (Phase 1, W-13 fix)
 *
 * PREVIOUS STATE (LOW — W-13):
 *   The header scroll class toggle used a raw scroll event listener
 *   with no throttling. On low-end devices this fires hundreds of
 *   times per second causing layout jank.
 *
 * PATCH:
 *   Replace the existing scroll listener in main.js with this version.
 *   Uses requestAnimationFrame to cap execution to once per frame (~60fps).
 *
 * FIND in main.js:
 *   window.addEventListener('scroll', function() { ... header class toggle ... })
 *   (or document.addEventListener('scroll', ...))
 *
 * REPLACE WITH the block below.
 * ─────────────────────────────────────────────────────────────────────
 */

// ─── Throttled scroll handler (rAF-based) ────────────────────────────
(function () {
  "use strict";

  const header = document.querySelector("header"); // adjust selector if needed
  if (!header) return;

  let ticking = false;
  const SCROLL_THRESHOLD = 50; // px — adjust to match original behaviour

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (window.scrollY > SCROLL_THRESHOLD) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // Run once on load in case the page is loaded mid-scroll
  onScroll();
})();
