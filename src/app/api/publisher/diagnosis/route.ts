import { NextResponse } from 'next/server';
import { buildPublisherDiagnosis } from '../../../../core/publisher/diagnosisBuilder';

export async function POST(request: Request) {
  const body = await request.json();
  const diagnosis = buildPublisherDiagnosis(body?.memory || body || {});
  return NextResponse.json({ ok: true, diagnosis });
}
