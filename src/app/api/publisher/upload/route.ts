import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado." },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const extension = fileName.split(".").pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (extension === "txt" || extension === "md") {
      const text = buffer.toString("utf-8");

      return NextResponse.json({
        fileName,
        type: extension,
        text: text.slice(0, 12000),
        status: "extracted"
      });
    }

    if (extension === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value || "";

      return NextResponse.json({
        fileName,
        type: "docx",
        text: text.slice(0, 12000),
        status: "extracted",
        warnings: result.messages || []
      });
    }

    if (extension === "pdf") {
      return NextResponse.json({
        fileName,
        type: "pdf",
        text: `Arquivo PDF anexado: ${fileName}. A extração de PDF será adicionada na próxima etapa.`,
        status: "pdf_pending"
      });
    }

    return NextResponse.json(
      { error: "Formato ainda não suportado. Use TXT, MD, DOCX ou PDF." },
      { status: 415 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Falha ao processar arquivo.",
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
