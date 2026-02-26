
import { NextRequest } from 'next/server';
import { db } from '@/app/lib/db';
import { success } from '@/app/lib/api-response';

export async function GET(_request: NextRequest) {
  let dbHealthy = false;

  try {
    await db.$queryRaw`SELECT 1`;
    dbHealthy = true;
  } catch {
    dbHealthy = false;
  }

  const status = dbHealthy ? 200 : 503;

  return Response.json(
    {
      success: dbHealthy,
      data: {
        status: dbHealthy ? 'healthy' : 'degraded',
        database: dbHealthy ? 'connected' : 'unreachable',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    },
    { status }
  );
}