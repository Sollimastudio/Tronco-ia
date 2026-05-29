import { NextResponse } from 'next/server';
import { renderArtifactDocxBuffer } from '../../../../core/publisher/docxRenderer';

function safeFileName(value: string) {
  return (value || 'publisher-project')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'publisher-project';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const artifact = body?.artifact;

    if (!artifact) {
      return NextResponse.json({ ok: false, error: 'artifact_required' }, { status: 400 });
    }

    const buffer = await renderArtifactDocxBuffer(artifact);
    const fileName = `${safeFileName(artifact.title)}-editavel.docx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename=${fileName}`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'docx_export_failed' }, { status: 500 });
  }
}
