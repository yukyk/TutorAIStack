import { NextRequest, NextResponse } from 'next/server';
import { counters, getOnlineCount } from '@/lib/counters';

// NOTE: counters will always be 0 on Vercel (serverless isolation).
// See views/lib/counters.ts for full explanation.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = request.headers.get('authorization');
  if (!auth || auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const modeEntries = Object.entries(counters.modeCounts);
  const mostUsedMode = modeEntries.reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    modeEntries[0]
  )[0];

  return NextResponse.json({
    pageVisits: counters.pageVisits,
    aiRequests: counters.aiRequests,
    codeExecutions: counters.codeExecutions,
    modeCounts: counters.modeCounts,
    mostUsedMode,
    onlineNow: getOnlineCount(),
    uptime: Math.floor(process.uptime()),
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'development',
  });
}
