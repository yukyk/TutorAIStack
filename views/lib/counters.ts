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

export function incrementPageVisit(): void { counters.pageVisits++; }

export function incrementAI(mode: string): void {
  counters.aiRequests++;
  if (Object.prototype.hasOwnProperty.call(counters.modeCounts, mode)) {
    counters.modeCounts[mode]++;
  }
}

export function incrementExecute(): void { counters.codeExecutions++; }
