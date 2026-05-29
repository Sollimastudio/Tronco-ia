import type { EditorialArtifact } from './editorialArtifact';
import type { PagePlanItem } from './paginationPlanner';

type ApprovedItem = {
  id: string;
  type: string;
  title: string;
  content?: string;
  filePath?: string;
  status: 'draft' | 'review' | 'approved' | 'final' | 'rejected';
};

function findPageForItem(pages: PagePlanItem[], item: ApprovedItem) {
  const type = item.type.toLowerCase();

  if (type.includes('title')) return pages.find((page) => page.kind === 'cover')?.pageNumber;
  if (type.includes('outline')) return pages.find((page) => page.kind === 'index')?.pageNumber;
  if (type.includes('diagram')) return pages.find((page) => page.kind === 'diagram')?.pageNumber;
  if (type.includes('image')) return pages.find((page) => page.visualAsset)?.pageNumber;
  if (type.includes('exercise')) return pages.find((page) => page.kind === 'exercise')?.pageNumber;

  return pages.find((page) => page.kind === 'text')?.pageNumber;
}

export function assembleArtifactFromVault(artifact: EditorialArtifact, approvedItems: ApprovedItem[]): EditorialArtifact {
  const validItems = approvedItems.filter((item) => item.status === 'approved' || item.status === 'final');

  const approvedTextBlocks = validItems
    .filter((item) => item.content && !['image', 'diagram', 'ideogram', 'infographic'].includes(item.type))
    .map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content || '',
      pageRange: String(findPageForItem(artifact.pages, item) || '')
    }));

  const visualAssets = validItems
    .filter((item) => ['image', 'diagram', 'ideogram', 'infographic'].includes(item.type))
    .map((item) => ({
      id: item.id,
      title: item.title,
      kind: item.type as 'image' | 'diagram' | 'ideogram' | 'infographic',
      prompt: item.content,
      filePath: item.filePath,
      assignedPage: findPageForItem(artifact.pages, item)
    }));

  return {
    ...artifact,
    approvedTextBlocks: [...artifact.approvedTextBlocks, ...approvedTextBlocks],
    visualAssets: [...artifact.visualAssets, ...visualAssets],
    status: validItems.length > 0 ? 'review' : artifact.status
  };
}
