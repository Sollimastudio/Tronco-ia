import { NextResponse } from 'next/server';
import { buildPublisherMemory } from '../../../../core/publisher/memoryBuilder';

export async function POST(request: Request) {
  const body = await request.json();
  const memory = buildPublisherMemory(body || {});
  return NextResponse.json({ ok: true, memory });
}
