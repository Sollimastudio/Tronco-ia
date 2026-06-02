import { NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";

const MAX_CHARS = 90000;

function cleanText(input: string) {
  return input
    .replace(/\u0000/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

function buildDiagnostic(params: {
  fileName: string;
  text: string;
  projectName: string;
  audience: string;
  tone: string;
  visualStyle: string;
}) {
  const { fileName, text, projectName, audience, tone, visualStyle } = params;
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const paragraphs = text ? text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) : [];
  const headings = paragraphs.filter((p) => {
    const short = p.length <= 90;
    const looksLikeHeading = /^([0-9]+[.)]|cap[ií]tulo|parte|bloco|m[oó]dulo|aula|introdu[cç][aã]o|conclus[aã]o)/i.test(p);
    const uppercase = p.length > 4 && p === p.toUpperCase();
    return short && (looksLikeHeading || uppercase);
  });

  const repeatedSignals = [
    "posicione-se",
    "discernimento",
    "árvore",
    "relacione-se",
    "método",
    "travessia",
    "metacognição",
    "vínculos",
    "magnetismo"
  ].filter((term) => text.toLowerCase().includes(term));

  const risks: string[] = [];
  if (words.length < 1200) risks.push("O material ainda parece curto para produto editorial robusto; pode precisar de expansão didática.");
  if (paragraphs.some((p) => p.length > 1200)) risks.push("Há parágrafos longos demais; isso derruba leitura e sensação premium.");
  if (headings.length < 4) risks.push("Poucos títulos detectados; a estrutura pode precisar ser dividida em blocos/capítulos.");
  if (!/[?]/.test(text)) risks.push("Poucas perguntas reflexivas detectadas; inserir perguntas aumenta interação e retenção.");
  if (!/exerc[ií]cio|pr[aá]tica|checklist|tarefa|aplica/i.test(text)) risks.push("Poucos elementos práticos detectados; produto premium precisa de aplicação, não só explicação.");
  if (!risks.length) risks.push("A base parece promissora; o próximo gargalo é refino, hierarquia visual e acabamento editorial.");

  return `DIAGNÓSTICO EDITORIAL REAL\n\nProjeto: ${projectName || "Projeto editorial"}\nArquivo lido: ${fileName}\nPúblico: ${audience}\nTom desejado: ${tone}\nEstética desejada: ${visualStyle}\n\n1. Leitura real do material\n• Caracteres extraídos: ${text.length}\n• Palavras estimadas: ${words.length}\n• Blocos/parágrafos detectados: ${paragraphs.length}\n• Possíveis títulos detectados: ${headings.length}\n\n2. Sinais conceituais encontrados\n${repeatedSignals.length ? repeatedSignals.map((term) => `• ${term}`).join("\n") : "• Ainda não encontrei sinais conceituais fortes pelo texto extraído."}\n\n3. Diagnóstico editorial\nO material já pode entrar em uma esteira editorial: limpeza, separação por blocos, hierarquia de capítulos, inserção de recursos didáticos e transformação em produto premium. A prioridade agora é organizar a leitura para que a ideia central não fique soterrada no caos — porque até diamante, se jogar no entulho, vira só uma pedra metida.\n\n4. Riscos detectados\n${risks.map((risk) => `• ${risk}`).join("\n")}\n\n5. Estrutura premium recomendada\n• Abertura com promessa e pacto de leitura.\n• Mapa da travessia do material.\n• Capítulos curtos com ideia central, explicação, exemplo, prática e frase-mestra.\n• Quadros de discernimento, comandos de metacognição e checkpoints.\n• Fechamento com síntese, próximos passos e convite para continuidade.\n\n6. Próxima ação\nGerar o artefato editorial a partir deste diagnóstico real e do conteúdo extraído.\n\nTRECHO EXTRAÍDO PARA CONFERÊNCIA\n${text.slice(0, 3500)}`;
}

async function extractPdf(buffer: Buffer) {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = pdfParseModule.default ?? pdfParseModule;
  const result = await pdfParse(buffer);
  return result.text ?? "";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Nenhum arquivo recebido." }, { status: 400 });
    }

    const projectName = String(formData.get("projectName") ?? "Projeto editorial");
    const audience = String(formData.get("audience") ?? "Leitoras e leitores do ecossistema Relacione-se");
    const tone = String(formData.get("tone") ?? "Premium, claro, provocativo e didático");
    const visualStyle = String(formData.get("visualStyle") ?? "Preto profundo, bordô, creme nobre e dourado antigo");

    const extension = getExtension(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (["txt", "md", "html", "htm"].includes(extension)) {
      extractedText = buffer.toString("utf-8");
    } else if (extension === "docx") {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (extension === "pdf") {
      extractedText = await extractPdf(buffer);
    } else {
      return NextResponse.json(
        { error: "Formato ainda não suportado. Use TXT, MD, HTML, DOCX ou PDF." },
        { status: 415 }
      );
    }

    const cleaned = cleanText(extractedText).slice(0, MAX_CHARS);

    if (!cleaned) {
      return NextResponse.json(
        { error: "Não consegui extrair texto legível desse arquivo. Pode ser PDF escaneado/imagem." },
        { status: 422 }
      );
    }

    const diagnostic = buildDiagnostic({
      fileName: file.name,
      text: cleaned,
      projectName,
      audience,
      tone,
      visualStyle
    });

    return NextResponse.json({
      fileName: file.name,
      fileType: file.type || extension,
      size: file.size,
      chars: cleaned.length,
      words: cleaned.split(/\s+/).filter(Boolean).length,
      preview: cleaned.slice(0, 5000),
      extractedText: cleaned,
      diagnostic
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Falha ao ler o arquivo. O manuscrito entrou armado até os dentes." },
      { status: 500 }
    );
  }
}
