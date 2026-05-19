// NOTE (known limitation): These counters are in-memory and scoped to a single
// serverless function instance. On Vercel, /api/chat and /api/admin/stats run in
// separate Lambda functions with separate memory — counters from chat/execute are
// never visible to admin/stats. The admin dashboard will show 0 for all counters
// in production. Replace with DB-backed atomic increments when needed.

export const counters = {
  pageVisits: 0,
  aiRequests: 0,
  codeExecutions: 0,
  modeCounts: { hint: 0, logic: 0, humanize: 0, debug: 0, optimize: 0 } as Record<string, number>,
};

// Sessions active within the last 5 minutes, keyed by IP/session identifier.
const activeSessions = new Map<string, { lastSeen: number }>();
const SESSION_TTL_MS = 5 * 60 * 1000;

export function trackSession(sessionId: string): void {
  activeSessions.set(sessionId, { lastSeen: Date.now() });
}

export function getOnlineCount(): number {
  const cutoff = Date.now() - SESSION_TTL_MS;
  let count = 0;
  for (const session of activeSessions.values()) {
    if (session.lastSeen >= cutoff) count++;
  }
  return count;
}

export function incrementPageVisit(): void { counters.pageVisits++; }

export function incrementAI(mode: string): void {
  counters.aiRequests++;
  if (Object.prototype.hasOwnProperty.call(counters.modeCounts, mode)) {
    counters.modeCounts[mode]++;
  }
}

export function incrementExecute(): void { counters.codeExecutions++; }

// ─── Account lockout ─────────────────────────────────────────────────────
// Same in-memory caveat as the counters above: per-Lambda, lost on cold start.
// Acceptable for single-process node server.js; replace with Redis/DB if needed.

interface LockoutRecord {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

const loginAttempts = new Map<string, LockoutRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export function checkLoginAttempts(email: string): { allowed: boolean; remainingMs?: number } {
  const record = loginAttempts.get(email);
  const now = Date.now();

  if (!record) return { allowed: true };

  if (record.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, remainingMs: record.lockedUntil - now };
  }

  if (record.lockedUntil && now >= record.lockedUntil) {
    loginAttempts.delete(email);
  }

  return { allowed: true };
}

export function recordFailedLogin(email: string): void {
  const now = Date.now();
  const record = loginAttempts.get(email) || { attempts: 0, lockedUntil: null, lastAttempt: now };

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
  }

  loginAttempts.set(email, record);
}

export function recordSuccessfulLogin(email: string): void {
  loginAttempts.delete(email);
}

export function getFailedLoginStats(): {
  totalLocked: number;
  recentAttempts: Array<{ email: string; attempts: number; locked: boolean }>;
} {
  const now = Date.now();
  const entries = Array.from(loginAttempts.entries());
  return {
    totalLocked: entries.filter(([, r]) => r.lockedUntil && now < r.lockedUntil).length,
    recentAttempts: entries.slice(-10).map(([email, r]) => ({
      email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      attempts: r.attempts,
      locked: !!(r.lockedUntil && now < r.lockedUntil),
    })),
  };
}
