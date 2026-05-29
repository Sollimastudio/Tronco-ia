import { NextResponse } from 'next/server';
import { assembleArtifactFromVault } from '../../../../core/publisher/artifactAssembler';

export async function POST(request: Request) {
  const body = await request.json();

  if (!body?.artifact) {
    return NextResponse.json({ ok: false, error: 'artifact_required' }, { status: 400 });
  }

  const approvedItems = Array.isArray(body?.approvedItems) ? body.approvedItems : [];
  const assembledArtifact = assembleArtifactFromVault(body.artifact, approvedItems);

  return NextResponse.json({
    ok: true,
    assembledArtifact,
    summary: {
      textBlocks: assembledArtifact.approvedTextBlocks.length,
      visualAssets: assembledArtifact.visualAssets.length,
      status: assembledArtifact.status
    }
  });
}
