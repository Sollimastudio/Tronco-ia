import type { EditorialArtifact } from './editorialArtifact';

export type ExportFormat = 'html' | 'pdf' | 'docx' | 'visual-pack' | 'zip';

export interface PublisherExportItem {
  format: ExportFormat;
  fileName: string;
  status: 'planned' | 'ready' | 'failed';
  source: string;
  notes: string;
}

export function buildExportManifest(artifact: EditorialArtifact): PublisherExportItem[] {
  const slug = artifact.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'publisher-project';

  return [
    {
      format: 'html',
      fileName: `${slug}-webbook.html`,
      status: 'planned',
      source: 'artifact-html-renderer',
      notes: 'WebBook responsivo gerado a partir do Artefato Editorial.'
    },
    {
      format: 'pdf',
      fileName: `${slug}-premium.pdf`,
      status: 'planned',
      source: 'html-to-pdf-renderer',
      notes: 'PDF premium paginado a partir do HTML aprovado.'
    },
    {
      format: 'docx',
      fileName: `${slug}-editavel.docx`,
      status: 'planned',
      source: 'artifact-to-docx-renderer',
      notes: 'DOCX editavel gerado a partir do Artefato Editorial.'
    },
    {
      format: 'visual-pack',
      fileName: `${slug}-pacote-visual.zip`,
      status: 'planned',
      source: 'visual-assets',
      notes: 'Imagens, diagramas, ideogramas, placeholders e prompts visuais.'
    },
    {
      format: 'zip',
      fileName: `${slug}-pacote-final.zip`,
      status: 'planned',
      source: 'final-packager',
      notes: 'Pacote final com HTML, PDF, DOCX e pacote visual.'
    }
  ];
}
