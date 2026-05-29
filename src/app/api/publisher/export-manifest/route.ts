import { NextResponse } from 'next/server';
import { buildExportManifest } from '../../../../core/publisher/exportManifest';

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.artifact) {
    return NextResponse.json({ ok: false, error: 'artifact_required' }, { status: 400 });
  }

  const manifest = buildExportManifest(body.artifact);

  return NextResponse.json({
    ok: true,
    manifest,
    summary: {
      totalFiles: manifest.length,
      formats: manifest.map((item) => item.format)
    }
  });
}
