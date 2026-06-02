"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";

type Stage = "idle" | "uploaded" | "reading" | "diagnosed" | "artifact";

type FileInfo = {
  name: string;
  size: number;
  type: string;
  preview: string;
  text?: string;
  chars?: number;
  words?: number;
};

type ReaderResponse = {
  fileName: string;
  fileType: string;
  size: number;
  chars: number;
  words: number;
  preview: string;
  extractedText: string;
  diagnostic: string;
  error?: string;
};

const formatBytes = (size: number) => {
  if (!size) return "0 KB";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "publisher";

export default function PublisherPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [projectName, setProjectName] = useState("Projeto editorial");
  const [audience, setAudience] = useState("Leitoras e leitores do ecossistema Relacione-se");
  const [tone, setTone] = useState("Premium, claro, provocativo e didático");
  const [visualStyle, setVisualStyle] = useState("Preto profundo, bordô, creme nobre e dourado antigo");
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [status, setStatus] = useState("Aguardando manuscrito ou descrição inicial.");
  const [diagnostic, setDiagnostic] = useState("");
  const [artifact, setArtifact] = useState("");

  const canDiagnose = Boolean(rawFile || fileInfo || projectName.trim());
  const canExport = Boolean(diagnostic || artifact);
  const isBusy = stage === "reading";

  const memory = useMemo(() => {
    return {
      projectName,
      audience,
      tone,
      visualStyle,
      attachedFile: fileInfo?.name ?? "nenhum arquivo anexado",
      extractedChars: fileInfo?.chars ?? 0,
      estimatedWords: fileInfo?.words ?? 0,
      stage,
      nextStep:
        stage === "idle"
          ? "enviar manuscrito"
          : stage === "uploaded"
            ? "gerar diagnóstico real"
            : stage === "reading"
              ? "aguardar leitura"
              : stage === "diagnosed"
                ? "aprovar artefato editorial"
                : "exportar pacote"
    };
  }, [projectName, audience, tone, visualStyle, fileInfo, stage]);

  function openUpload() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setRawFile(file);
    setFileInfo({
      name: file.name,
      size: file.size,
      type: file.type || file.name.split(".").pop()?.toLowerCase() || "arquivo",
      preview: "Arquivo anexado. Clique em Gerar diagnóstico real para ler o conteúdo."
    });
    setStatus("Arquivo anexado. Agora clique em Gerar diagnóstico real para extrair o texto e analisar.");
    setStage("uploaded");
    setDiagnostic("");
    setArtifact("");
  }

  async function generateDiagnostic() {
    if (!canDiagnose) {
      setStatus("Preencha o projeto ou anexe um manuscrito primeiro. Diagnóstico sem material é fofoca com crachá.");
      return;
    }

    if (!rawFile) {
      const text = `DIAGNÓSTICO EDITORIAL MANUAL\n\nProjeto: ${projectName}\nPúblico: ${audience}\nTom: ${tone}\nEstilo visual: ${visualStyle}\n\nSem arquivo anexado, o diagnóstico foi criado a partir dos campos preenchidos. Para análise real, anexe TXT, MD, HTML, DOCX ou PDF.`;
      setDiagnostic(text);
      setStage("diagnosed");
      setStatus("Diagnóstico manual criado. Para diagnóstico profundo, anexe um arquivo.");
      return;
    }

    setStage("reading");
    setStatus("Lendo o manuscrito de verdade. Agora o bicho começou a ficar adulto.");

    try {
      const formData = new FormData();
      formData.append("file", rawFile);
      formData.append("projectName", projectName);
      formData.append("audience", audience);
      formData.append("tone", tone);
      formData.append("visualStyle", visualStyle);

      const response = await fetch("/api/publisher/read", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as ReaderResponse;

      if (!response.ok) {
        throw new Error(data.error || "Falha ao processar o arquivo.");
      }

      setFileInfo({
        name: data.fileName,
        size: data.size,
        type: data.fileType,
        preview: data.preview,
        text: data.extractedText,
        chars: data.chars,
        words: data.words
      });
      setDiagnostic(data.diagnostic);
      setArtifact("");
      setStage("diagnosed");
      setStatus(`Diagnóstico real gerado. Texto extraído: ${data.words} palavras / ${data.chars} caracteres.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido ao ler arquivo.";
      setStage("uploaded");
      setStatus(`Não consegui gerar o diagnóstico real: ${message}`);
    }
  }

  function approveArtifact() {
    if (!diagnostic) {
      setStatus("Gere o diagnóstico antes. Sim, ordem existe. A anarquia fica para os grupos de WhatsApp.");
      return;
    }

    const source = fileInfo?.text || fileInfo?.preview || "Sem conteúdo extraído.";
    const title = projectName || fileInfo?.name || "Projeto editorial";
    const text = `ARTEFATO EDITORIAL MVP\n\n${title}\n\nPROMESSA\nUm material editorial premium para ${audience}, com linguagem ${tone.toLowerCase()} e direção visual ${visualStyle.toLowerCase()}.\n\nESTRUTURA PROPOSTA\n\n1. Capa conceitual\nTítulo forte, subtítulo claro, selo editorial e assinatura Sol.IA Publisher.\n\n2. Carta de entrada\nUma abertura humana, direta e emocional para preparar o leitor.\n\n3. Mapa de travessia\nInfográfico textual com início, tensão, virada, prática e consolidação.\n\n4. Capítulos principais\nCada capítulo deve ter: ideia central, explicação, exemplo, exercício, síntese e frase-mestra.\n\n5. Recursos didáticos\n• Checklist de aplicação.\n• Mapa mental.\n• Quadro de erros comuns.\n• Página de reflexão.\n\n6. Fechamento\nSíntese, convite de continuidade e orientação de uso do material.\n\nBASE REAL EXTRAÍDA PARA A PRÓXIMA CAMADA\n${source.slice(0, 12000)}\n\nSTATUS\nEste artefato já usa o conteúdo extraído como base. A próxima evolução é transformar essa base em HTML/DOCX premium com capítulos completos, sem palavras grudadas e sem buracos de conteúdo.`;

    setArtifact(text);
    setStage("artifact");
    setStatus("Artefato editorial criado com base no diagnóstico e no texto extraído.");
  }

  function exportTxt() {
    if (!canExport) {
      setStatus("Nada para exportar ainda. Primeiro gere algo, minha filha. Exportar vento ainda não virou startup.");
      return;
    }

    const content = [
      "SOL.IA PUBLISHER",
      "MEMÓRIA DO PROJETO",
      JSON.stringify(memory, null, 2),
      "",
      diagnostic,
      "",
      artifact
    ].join("\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(projectName)}-publisher.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("TXT exportado com sucesso.");
  }

  function exportHtml() {
    if (!canExport) {
      setStatus("Gere o diagnóstico ou artefato antes de exportar HTML.");
      return;
    }

    const safeTitle = projectName || "Sol.IA Publisher";
    const result = artifact || diagnostic;
    const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${safeTitle}</title>
<style>
body{margin:0;background:#050505;color:#f5f0e8;font-family:Inter,Arial,sans-serif;line-height:1.75}main{max-width:980px;margin:40px auto;padding:48px;background:#13070a;border:1px solid rgba(201,168,76,.35);border-radius:28px}h1{font-size:48px;line-height:1.05;margin:0 0 18px}.kicker{color:#c9a84c;text-transform:uppercase;letter-spacing:.35em;font-size:12px}.card{background:#050505;border:1px solid rgba(201,168,76,.25);border-radius:20px;padding:24px;margin:24px 0}pre{white-space:pre-wrap;font-family:inherit;font-size:16px}.gold{color:#c9a84c}@media(max-width:700px){main{margin:0;border-radius:0;padding:28px}h1{font-size:34px}}
</style>
</head>
<body>
<main>
<p class="kicker">Sol.IA Publisher</p>
<h1>${safeTitle}</h1>
<p class="gold">${audience}</p>
<section class="card"><h2>Memória editorial</h2><pre>${JSON.stringify(memory, null, 2)}</pre></section>
<section class="card"><h2>Resultado editorial</h2><pre>${result}</pre></section>
</main>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(projectName)}-publisher.html`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("HTML exportado com sucesso.");
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-[#F5F0E8]">
      <section className="mx-auto max-w-7xl rounded-[2rem] border border-[#C9A84C]/30 bg-[#13070A] p-6 shadow-2xl md:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C9A84C]">Sol.IA Publisher</p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Transforme seu manuscrito em um produto editorial premium.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#F5F0E8]/70">
              MVP funcional com leitura real de TXT, Markdown, HTML, DOCX e PDF pesquisável, diagnóstico editorial, cofre e exportação.
            </p>
          </div>

          <aside className="rounded-3xl border border-[#C9A84C]/20 bg-black/35 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cofre Editorial</p>
            <div className="mt-4 space-y-2 text-sm text-[#F5F0E8]/70">
              <p>Memória: {stage !== "idle" ? "criada" : "aguardando"}</p>
              <p>Diagnóstico: {diagnostic ? "criado" : "aguardando"}</p>
              <p>Artefato: {artifact ? "criado" : "aguardando"}</p>
              <p>Arquivo: {fileInfo?.name ?? "nenhum"}</p>
              <p>Texto extraído: {fileInfo?.words ? `${fileInfo.words} palavras` : "aguardando"}</p>
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#C9A84C]/20 bg-black/40 p-6">
            <h2 className="text-xl font-bold text-[#C9A84C]">1. Dados do projeto</h2>
            <div className="mt-5 grid gap-3">
              <input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="rounded-2xl border border-[#C9A84C]/20 bg-black px-4 py-3 outline-none" placeholder="Nome do projeto" />
              <input value={audience} onChange={(e) => setAudience(e.target.value)} className="rounded-2xl border border-[#C9A84C]/20 bg-black px-4 py-3 outline-none" placeholder="Público-alvo" />
              <input value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-2xl border border-[#C9A84C]/20 bg-black px-4 py-3 outline-none" placeholder="Tom de voz" />
              <input value={visualStyle} onChange={(e) => setVisualStyle(e.target.value)} className="rounded-2xl border border-[#C9A84C]/20 bg-black px-4 py-3 outline-none" placeholder="Estilo visual" />
            </div>
          </div>

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-black/40 p-6">
            <h2 className="text-xl font-bold text-[#C9A84C]">2. Entrada do material</h2>
            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/65">Anexe TXT, Markdown, HTML, DOCX ou PDF com texto pesquisável. PDF escaneado/imagem ainda precisa de OCR em etapa futura.</p>
            <input ref={fileInputRef} type="file" accept=".txt,.md,.html,.htm,.docx,.pdf" onChange={handleFileChange} className="hidden" />
            <button onClick={openUpload} disabled={isBusy} className="mt-5 rounded-full bg-[#C9A84C] px-6 py-3 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50">Anexar manuscrito</button>
            {fileInfo && <p className="mt-4 text-sm text-[#F5F0E8]/70">{fileInfo.name} • {formatBytes(fileInfo.size)}</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={generateDiagnostic} disabled={isBusy} className="rounded-full border border-[#C9A84C] px-6 py-3 font-bold text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-black disabled:opacity-50">{isBusy ? "Lendo arquivo..." : "Gerar diagnóstico real"}</button>
          <button onClick={approveArtifact} disabled={isBusy} className="rounded-full border border-[#F5F0E8]/35 px-6 py-3 font-bold text-[#F5F0E8] transition hover:bg-[#F5F0E8] hover:text-black disabled:opacity-50">Aprovar artefato</button>
          <button onClick={exportTxt} disabled={isBusy} className="rounded-full bg-[#F5F0E8] px-6 py-3 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50">Exportar TXT</button>
          <button onClick={exportHtml} disabled={isBusy} className="rounded-full bg-[#C9A84C] px-6 py-3 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50">Exportar HTML</button>
        </div>

        <div className="mt-8 rounded-3xl border border-[#C9A84C]/20 bg-black/50 p-6">
          <h3 className="font-bold text-[#C9A84C]">Status</h3>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#F5F0E8]/75">{status}</p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#C9A84C]/20 bg-black/45 p-6">
            <h3 className="font-bold text-[#C9A84C]">Memória do Projeto</h3>
            <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black p-4 text-xs leading-6 text-[#F5F0E8]/75">{JSON.stringify(memory, null, 2)}</pre>
          </div>

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-black/45 p-6">
            <h3 className="font-bold text-[#C9A84C]">Resultado Editorial</h3>
            <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black p-4 text-xs leading-6 text-[#F5F0E8]/75">{artifact || diagnostic || fileInfo?.preview || "Aguardando diagnóstico."}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
