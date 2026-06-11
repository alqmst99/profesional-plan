/* ============================================================
   FSTail Solutions — Audit System
   auth-config.js  ·  CREDENTIALS — edit only this file
   ============================================================ */

const AUDIT_AUTH = {
  users: {
    ADMIN_1: {
      username: 'ADMIN_1',
      // SHA-256 hash of password. Default: "fstail2025"
      // To change: use a SHA-256 tool and replace the hash below.
      passwordHash: '82da8fe947ae533ea0b48a55be2b1f88c54534c4b5f039307e1df4b62b71fd0a',
      displayName: 'Nahuel Pierini',
      role: 'Admin'
    },
    ADMIN_2: {
      username: 'ADMIN_2',
      // Default password: "fstail2025"
      passwordHash: '82da8fe947ae533ea0b48a55be2b1f88c54534c4b5f039307e1df4b62b71fd0a',
      displayName: 'Anaclara Ferrando',
      role: 'Admin'
    }
  },
  sessionKey: 'fstail_audit_session',
  sessionDuration: 8 * 60 * 60 * 1000, // 8 hours in ms
};

/* ── Simple SHA-256 via Web Crypto API ── */
async function hashPassword(plain) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(plain));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

/* ── Auth helpers ── */
const Auth = {
  async login(username, password) {
    const attemptsKey = AUDIT_AUTH.sessionKey + '_attempts';
    const lockoutKey = AUDIT_AUTH.sessionKey + '_lock';
    // check lockout
    try {
      const lock = JSON.parse(localStorage.getItem(lockoutKey) || 'null');
      if (lock && lock.until && Date.now() < lock.until) {
        return { ok: false, error: `Cuenta bloqueada hasta ${new Date(lock.until).toLocaleString()}` };
      }
    } catch (e) { /* ignore parse errors */ }

    const user = AUDIT_AUTH.users[username];
    if (!user) return { ok: false, error: 'Usuario no encontrado.' };
    const hash = await hashPassword(password);
    if (hash !== user.passwordHash) {
      // increment failed attempts and apply lockout after 5 tries
      try {
        const cur = JSON.parse(localStorage.getItem(attemptsKey) || 'null') || { count: 0 };
        cur.count = (cur.count || 0) + 1;
        localStorage.setItem(attemptsKey, JSON.stringify(cur));
        if (cur.count >= 5) {
          const until = Date.now() + 15 * 60 * 1000; // 15 minutes
          localStorage.setItem(lockoutKey, JSON.stringify({ until }));
          localStorage.removeItem(attemptsKey);
          return { ok: false, error: 'Demasiados intentos. Cuenta bloqueada 15 minutos.' };
        }
      } catch (e) {}
      return { ok: false, error: 'Contraseña incorrecta.' };
    }
    // successful login: clear attempts/locks
    try { localStorage.removeItem(attemptsKey); localStorage.removeItem(lockoutKey); } catch (e) {}
    const session = {
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      expires: Date.now() + AUDIT_AUTH.sessionDuration
    };
    localStorage.setItem(AUDIT_AUTH.sessionKey, JSON.stringify(session));
    return { ok: true, session };
  },

  logout() {
    localStorage.removeItem(AUDIT_AUTH.sessionKey);
    window.location.href = '../admin/login.html';
  },

  getSession() {
    try {
      const raw = localStorage.getItem(AUDIT_AUTH.sessionKey);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (Date.now() > s.expires) {
        localStorage.removeItem(AUDIT_AUTH.sessionKey);
        return null;
      }
      return s;
    } catch { return null; }
  },

  require() {
    const s = this.getSession();
    if (!s) {
      window.location.href = '../admin/login.html';
      return null;
    }
    return s;
  }
};
