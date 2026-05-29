import { NextResponse } from 'next/server';
import { renderArtifactHtml } from '../../../../core/publisher/htmlRenderer';

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.artifact) {
    return NextResponse.json({ ok: false, error: 'artifact_required' }, { status: 400 });
  }

  const html = renderArtifactHtml(body.artifact);

  return NextResponse.json({
    ok: true,
    fileName: `${body.artifact.id || 'publisher'}-webbook.html`,
    html
  });
}
