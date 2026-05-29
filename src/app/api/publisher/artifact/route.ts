import { NextResponse } from 'next/server';
import { createEditorialArtifact } from '../../../../core/publisher/editorialArtifact';
import { planPagination } from '../../../../core/publisher/paginationPlanner';

export async function POST(request: Request) {
  const body = await request.json();

  const title = body?.title || body?.projectName || 'Projeto Editorial';
  const projectId = body?.projectId || 'draft';
  const themeId = body?.themeId || 'luxury_editorial';
  const estimatedWords = Number(body?.estimatedWords || 8000);
  const chapterCount = Number(body?.chapterCount || 4);

  const pages = planPagination({
    productTitle: title,
    estimatedWords,
    chapterCount,
    hasExercises: Boolean(body?.hasExercises ?? true),
    hasDiagrams: Boolean(body?.hasDiagrams ?? true),
    hasBonuses: Boolean(body?.hasBonuses ?? false)
  });

  const artifact = createEditorialArtifact(projectId, title, themeId, pages);

  return NextResponse.json({
    ok: true,
    summary: {
      title,
      themeId,
      totalPages: pages.length,
      estimatedWords,
      chapterCount,
      firstPage: pages[0],
      lastPage: pages[pages.length - 1]
    },
    artifact
  });
}
