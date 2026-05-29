import type { PagePlanItem } from './paginationPlanner';
import type { PublisherThemeId } from './themePresets';

export type ArtifactStatus = 'draft' | 'review' | 'approved' | 'final';

export interface EditorialArtifact {
  id: string;
  projectId: string;
  title: string;
  themeId: PublisherThemeId;
  status: ArtifactStatus;
  pages: PagePlanItem[];
  approvedTextBlocks: Array<{
    id: string;
    title: string;
    content: string;
    pageRange?: string;
  }>;
  visualAssets: Array<{
    id: string;
    title: string;
    kind: 'image' | 'diagram' | 'ideogram' | 'infographic' | 'placeholder';
    prompt?: string;
    filePath?: string;
    assignedPage?: number;
  }>;
  exports: Array<{
    format: 'html' | 'pdf' | 'docx' | 'zip';
    filePath: string;
    status: ArtifactStatus;
  }>;
}

export function createEditorialArtifact(projectId: string, title: string, themeId: PublisherThemeId, pages: PagePlanItem[]): EditorialArtifact {
  return {
    id: `${projectId}-artifact`,
    projectId,
    title,
    themeId,
    status: 'draft',
    pages,
    approvedTextBlocks: [],
    visualAssets: [],
    exports: []
  };
}
