/**
 * js/chatbot.js — CANONICAL SOURCE (Phase 1, W-11 fix)
 *
 * PREVIOUS STATE (MEDIUM — W-11):
 *   chatbot.js existed in TWO locations:
 *     /js/chatbot.js
 *     /assets/js/chatbot.js
 *   Both were being loaded on the same pages, causing double initialisation.
 *   index.html referenced /assets/js/chatbot.js
 *   Sub-pages referenced /js/chatbot.js
 *
 * FIX:
 *   1. This file at /js/chatbot.js is the single canonical source.
 *   2. DELETE /assets/js/chatbot.js entirely.
 *   3. Update ALL script tags across all HTML files to reference /js/chatbot.js
 *
 * ─── FIND the duplicate references ───────────────────────────────────
 *
 *   grep -rn "chatbot" *.html pages/*.html admin/*.html templates/*.html
 *
 * ─── REPLACE all script tags with ────────────────────────────────────
 *
 *   <script src="/js/chatbot.js" defer></script>
 *
 *   Key changes:
 *   - Absolute path (/js/chatbot.js) — not relative, not /assets/js/
 *   - `defer` attribute — chatbot should never block page render
 *
 * ─── DELETE the duplicate ────────────────────────────────────────────
 *
 *   git rm assets/js/chatbot.js
 *   git commit -m "fix(W-11): remove duplicate chatbot.js from assets/js"
 *
 * ─── VERIFY no more references to the old path ───────────────────────
 *
 *   grep -rn "assets/js/chatbot" . --include="*.html"
 *   # Should return 0 results.
 *
 * ─────────────────────────────────────────────────────────────────────
 * PASTE YOUR EXISTING chatbot.js CONTENT BELOW THIS COMMENT BLOCK.
 * Do not change chatbot logic in this phase — just deduplicate.
 * ─────────────────────────────────────────────────────────────────────
 */

// [Your existing chatbot.js content goes here — no changes needed to logic]
