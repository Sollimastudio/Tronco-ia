import { NextResponse } from "next/server";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

function safeFileName(value: string) {
  return (value || "publisher-project")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "publisher-project";
}

function cleanText(value: string) {
  return String(value || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{4,}/g, "\n\n")
    .replace(/«[a-z0-9]+/gi, "")
    .replace(/\[(Ds|ss)\]/gi, "")
    .trim();
}

function extractTitleFromBody(body: string, fallback: string) {
  const lines = body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const candidate =
    lines.find((line) =>
      /^(m[oó]dulo|cap[ií]tulo|manual|ant[ií]doto|p[aá]gina|carta|sum[aá]rio|bloco)/i.test(line)
    ) || lines[0];

  return (candidate || fallback).slice(0, 92);
}

function splitManuscriptIntoPages(source: string) {
  const cleaned = cleanText(source);

  if (!cleaned) return [];

  const chunks = cleaned
    .split(/\n\s*Página\s+\d+\s*\n/gi)
    .map((chunk) => cleanText(chunk))
    .filter((chunk) => chunk.length > 40);

  if (chunks.length > 1) {
    return chunks.map((chunk, index) => ({
      title: extractTitleFromBody(chunk, `Página extraída ${index + 1}`),
      body: chunk
    }));
  }

  const paragraphs = cleaned.split(/\n{2,}/).filter((item) => item.trim().length > 30);
  const pages: Array<{ title: string; body: string }> = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if ((current + "\n\n" + paragraph).length > 1600 && current) {
      pages.push({ title: extractTitleFromBody(current, `Página ${pages.length + 1}`), body: current });
      current = paragraph;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  }

  if (current) {
    pages.push({ title: extractTitleFromBody(current, `Página ${pages.length + 1}`), body: current });
  }

  return pages;
}

function paragraphsFromText(text: string) {
  return cleanText(text)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => new Paragraph({ text: paragraph }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const artifact = body?.artifact;

    if (!artifact) {
      return NextResponse.json({ ok: false, error: "artifact_required" }, { status: 400 });
    }

    const title = artifact.productTitle || artifact.title || "Produto Editorial Sem Título";
    const visualStyle = artifact.visualStyle || artifact.themeId || "Tema editorial não definido";
    const promise = artifact.promise || "Promessa central ainda não definida.";
    const audience = artifact.audience || "Público não definido";
    const tone = artifact.tone || "sofisticado, claro e útil";
    const formats = Array.isArray(artifact.finalFormats) ? artifact.finalFormats.join(", ") : "DOCX";
    const sourceSummary = artifact.sourceSummary || "";
    const pages = splitManuscriptIntoPages(sourceSummary);
    const didacticAssets: string[] = Array.isArray(artifact.didacticAssets) ? artifact.didacticAssets : [];

    const children: Paragraph[] = [
      new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
      new Paragraph({ children: [new TextRun({ text: `Tema: ${visualStyle}`, italics: true })] }),
      new Paragraph({ children: [new TextRun({ text: `Público: ${audience}`, italics: true })] }),
      new Paragraph({ children: [new TextRun({ text: `Tom: ${tone}`, italics: true })] }),
      new Paragraph({ children: [new TextRun({ text: `Formatos planejados: ${formats}`, italics: true })] }),
      new Paragraph({ text: " " }),
      new Paragraph({ text: "Promessa Editorial", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: promise }),
      new Paragraph({ text: " " })
    ];

    if (pages.length) {
      pages.forEach((page, index) => {
        const didactic = didacticAssets[index % Math.max(didacticAssets.length, 1)] || "Box de conceito-chave";

        children.push(new Paragraph({ text: `Página ${index + 1}`, heading: HeadingLevel.HEADING_1 }));
        children.push(new Paragraph({ text: page.title, heading: HeadingLevel.HEADING_2 }));
        children.push(...paragraphsFromText(page.body));
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Recurso didático sugerido: ", bold: true }),
              new TextRun({ text: didactic })
            ]
          })
        );
        children.push(new Paragraph({ text: " " }));
      });
    } else {
      children.push(new Paragraph({ text: "Estrutura Editorial", heading: HeadingLevel.HEADING_1 }));
      const structure = Array.isArray(artifact.editorialStructure) ? artifact.editorialStructure : [];
      structure.forEach((item: string, index: number) => {
        children.push(new Paragraph({ text: `${index + 1}. ${item}` }));
      });
    }

    const doc = new Document({
      sections: [{ properties: {}, children }]
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = `${safeFileName(title)}-editavel.docx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=${fileName}`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        error: "docx_export_failed",
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
