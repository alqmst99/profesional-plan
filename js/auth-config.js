/**
 * auth-config.js — PATCHED (Phase 1 Security Hotfix)
 *
 * PREVIOUS STATE (CRITICAL — W-01, W-02):
 *   - Hardcoded username + SHA-256 password hash exposed in this public file
 *   - Session stored as plain JSON in localStorage, trivially forgeable
 *
 * CURRENT STATE:
 *   - All credentials removed from this file entirely
 *   - This file is now a stub that blocks client-side auth and instructs
 *     the admin shell to redirect to the server-side login endpoint
 *   - Real authentication is handled by NestJS (Phase 3)
 *
 * IMMEDIATE ACTION REQUIRED:
 *   1. Delete this file from git history:
 *      git filter-repo --path js/auth-config.js --invert-paths
 *   2. Treat all previously hashed passwords as COMPROMISED — reset them
 *   3. Add the .htaccess / Nginx rule from phase1/admin/.htaccess
 *      to block /admin/ at the server level
 *
 * This stub exists only so existing script tags don't 404.
 * Remove it entirely once the NestJS auth module is deployed.
 */

(function () {
  "use strict";

  // No credentials. No session checks. No client-side auth logic.
  // If any legacy code calls window.checkAuth() or window.validateSession(),
  // we return false and redirect — never grant access client-side.

  window.checkAuth = function () {
    console.warn(
      "[auth-config] Client-side auth has been disabled. " +
        "Redirecting to server login."
    );
    window.location.href = "/admin/login.html";
    return false;
  };

  window.validateSession = function () {
    return false;
  };

  // Clear any legacy localStorage auth data that may have been set by the
  // old system. This runs on every page load to invalidate stale sessions.
  const legacyKeys = ["adminSession", "authToken", "user", "session", "auth"];
  legacyKeys.forEach((key) => {
    if (localStorage.getItem(key) !== null) {
      console.warn(
        `[auth-config] Removing legacy auth key from localStorage: ${key}`
      );
      localStorage.removeItem(key);
    }
  });
})();
