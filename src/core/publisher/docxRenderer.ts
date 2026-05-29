import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun
} from 'docx';
import type { EditorialArtifact } from './editorialArtifact';
import { getPublisherTheme } from './themePresets';

function findBlockForPage(artifact: EditorialArtifact, pageNumber: number) {
  return artifact.approvedTextBlocks.find((block) => block.pageRange === String(pageNumber));
}

function findVisualForPage(artifact: EditorialArtifact, pageNumber: number) {
  return artifact.visualAssets.find((visual) => visual.assignedPage === pageNumber);
}

export async function renderArtifactDocxBuffer(artifact: EditorialArtifact) {
  const theme = getPublisherTheme(artifact.themeId);

  const children = [
    new Paragraph({
      text: artifact.title,
      heading: HeadingLevel.TITLE
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Tema: ${theme.name}`, italics: true })
      ]
    }),
    new Paragraph({ text: ' ' })
  ];

  for (const page of artifact.pages) {
    const block = findBlockForPage(artifact, page.pageNumber);
    const visual = findVisualForPage(artifact, page.pageNumber);

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: `Pagina ${page.pageNumber} · ${page.kind}`, bold: true, color: 'C9A84C' })
        ]
      })
    );

    children.push(
      new Paragraph({
        text: page.title,
        heading: HeadingLevel.HEADING_1
      })
    );

    children.push(
      new Paragraph({
        text: block?.content || page.purpose
      })
    );

    if (visual) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Visual ${visual.kind}: `, bold: true }),
            new TextRun({ text: visual.title })
          ]
        })
      );
      if (visual.prompt) {
        children.push(new Paragraph({ text: `Prompt visual: ${visual.prompt}` }));
      }
    } else if (page.visualAsset) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Visual sugerido: ', bold: true }),
            new TextRun({ text: page.visualAsset })
          ]
        })
      );
    }

    children.push(new Paragraph({ text: ' ' }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  return Packer.toBuffer(doc);
}
