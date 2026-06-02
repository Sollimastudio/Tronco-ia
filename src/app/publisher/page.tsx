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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "") || "publisher";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function countWords(text: string) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export default function PublisherPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<HTMLTextAreaElement | null>(null);
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
  const [editorContent, setEditorContent] = useState("");

  const canDiagnose = Boolean(rawFile || projectName.trim());
  const exportSource = editorContent || artifact || diagnostic;
  const canExport = Boolean(exportSource.trim());
  const isBusy = stage === "reading";
  const editorStats = useMemo(() => ({ chars: editorContent.length, words: countWords(editorContent) }), [editorContent]);

  const memory = useMemo(
    () => ({
      projectName,
      audience,
      tone,
      visualStyle,
      attachedFile: fileInfo?.name ?? "nenhum arquivo anexado",
      extractedChars: fileInfo?.chars ?? 0,
      estimatedWords: fileInfo?.words ?? 0,
      editorChars: editorStats.chars,
      editorWords: editorStats.words,
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
                : "revisar e exportar"
    }),
    [projectName, audience, tone, visualStyle, fileInfo, editorStats, stage]
  );

  function openUpload() {
    fileInputRef.current?.click();
  }

  function focusEditor() {
    editorRef.current?.focus();
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
    setEditorContent("");
  }

  async function generateDiagnostic() {
    if (!canDiagnose) {
      setStatus("Preencha o projeto ou anexe um manuscrito primeiro. Diagnóstico sem material é fofoca com crachá.");
      return;
    }

    if (!rawFile) {
      const text = `DIAGNÓSTICO EDITORIAL MANUAL\n\nProjeto: ${projectName}\nPúblico: ${audience}\nTom: ${tone}\nEstilo visual: ${visualStyle}\n\nSem arquivo anexado, o diagnóstico foi criado a partir dos campos preenchidos. Para análise real, anexe TXT, MD, HTML, DOCX ou PDF.`;
      setDiagnostic(text);
      setEditorContent(text);
      setStage("diagnosed");
      setStatus("Diagnóstico manual criado e colocado no editor revisável.");
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

      const response = await fetch("/api/publisher/read", { method: "POST", body: formData });
      const data = (await response.json()) as ReaderResponse;

      if (!response.ok) throw new Error(data.error || "Falha ao processar o arquivo.");

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
      setEditorContent(data.diagnostic);
      setStage("diagnosed");
      setStatus(`Diagnóstico real gerado e colocado no editor. Texto extraído: ${data.words} palavras / ${data.chars} caracteres.`);
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
    const text = `ARTEFATO EDITORIAL MVP\n\n${title}\n\nPROMESSA\nUm material editorial premium para ${audience}, com linguagem ${tone.toLowerCase()} e direção visual ${visualStyle.toLowerCase()}.\n\nESTRUTURA PROPOSTA\n\n1. Capa conceitual\nTítulo forte, subtítulo claro, selo editorial e assinatura Sol.IA Publisher.\n\n2. Carta de entrada\nUma abertura humana, direta e emocional para preparar o leitor.\n\n3. Mapa de travessia\nInfográfico textual com início, tensão, virada, prática e consolidação.\n\n4. Capítulos principais\nCada capítulo deve ter: ideia central, explicação, exemplo, exercício, síntese e frase-mestra.\n\n5. Recursos didáticos\n• Checklist de aplicação.\n• Mapa mental.\n• Quadro de discernimento.\n• Página de reflexão.\n\n6. Fechamento\nSíntese, convite de continuidade e orientação de uso do material.\n\nBASE REAL EXTRAÍDA PARA A PRÓXIMA CAMADA\n${source.slice(0, 12000)}\n\nSTATUS\nEste artefato já usa o conteúdo extraído como base. Revise este texto abaixo antes de exportar. O editor existe exatamente para você não ser refém de texto meia-boca com terno bonito.`;

    setArtifact(text);
    setEditorContent(text);
    setStage("artifact");
    setStatus("Artefato editorial criado e enviado para o Editor Revisável.");
    setTimeout(focusEditor, 100);
  }

  function loadDiagnosticIntoEditor() {
    if (!diagnostic) {
      setStatus("Ainda não existe diagnóstico para carregar no editor.");
      return;
    }
    setEditorContent(diagnostic);
    setStatus("Diagnóstico carregado no editor revisável.");
  }

  function loadArtifactIntoEditor() {
    if (!artifact) {
      setStatus("Ainda não existe artefato para carregar no editor.");
      return;
    }
    setEditorContent(artifact);
    setStatus("Artefato carregado no editor revisável.");
  }

  function exportTxt() {
    if (!canExport) {
      setStatus("Nada para exportar ainda. Primeiro gere algo, minha filha. Exportar vento ainda não virou startup.");
      return;
    }

    const content = ["SOL.IA PUBLISHER", "MEMÓRIA DO PROJETO", JSON.stringify(memory, null, 2), "", exportSource].join("\n\n");
    downloadBlob(new Blob([content], { type: "text/plain;charset=utf-8" }), `${slugify(projectName)}-publisher.txt`);
    setStatus("TXT exportado com o conteúdo do editor revisável.");
  }

  function buildPremiumHtml() {
    const safeTitle = escapeHtml(projectName || "Sol.IA Publisher");
    const safeAudience = escapeHtml(audience);
    const result = escapeHtml(exportSource);
    const safeMemory = escapeHtml(JSON.stringify(memory, null, 2));

    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${safeTitle}</title><style>@page{size:A4;margin:18mm}*{box-sizing:border-box}body{margin:0;background:#050505;color:#f5f0e8;font-family:Inter,Arial,sans-serif;line-height:1.75}main{max-width:980px;margin:40px auto;padding:48px;background:#13070a;border:1px solid rgba(201,168,76,.35);border-radius:28px}h1{font-size:48px;line-height:1.05;margin:0 0 18px}.kicker{color:#c9a84c;text-transform:uppercase;letter-spacing:.35em;font-size:12px}.card{background:#050505;border:1px solid rgba(201,168,76,.25);border-radius:20px;padding:24px;margin:24px 0;break-inside:avoid}pre{white-space:pre-wrap;font-family:inherit;font-size:16px}.gold{color:#c9a84c}.print-note{font-size:13px;color:#c9a84c}@media print{body{background:white;color:#111}main{border:0;margin:0;padding:0;background:white;color:#111}.kicker,.gold,.print-note{color:#8f6b2e}.card{border:1px solid #ddd;background:white;page-break-inside:avoid}}@media(max-width:700px){main{margin:0;border-radius:0;padding:28px}h1{font-size:34px}}</style></head><body><main><p class="kicker">Sol.IA Publisher</p><h1>${safeTitle}</h1><p class="gold">${safeAudience}</p><p class="print-note">Para PDF: use Imprimir → Salvar como PDF.</p><section class="card"><h2>Memória editorial</h2><pre>${safeMemory}</pre></section><section class="card"><h2>Resultado editorial revisado</h2><pre>${result}</pre></section></main></body></html>`;
  }

  function exportHtml() {
    if (!canExport) {
      setStatus("Gere, aprove ou escreva algo no editor antes de exportar HTML.");
      return;
    }

    downloadBlob(new Blob([buildPremiumHtml()], { type: "text/html;charset=utf-8" }), `${slugify(projectName)}-publisher.html`);
    setStatus("HTML exportado com o conteúdo do editor revisável.");
  }

  function exportPdf() {
    if (!canExport) {
      setStatus("Gere, aprove ou escreva algo no editor antes de exportar PDF.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setStatus("O navegador bloqueou a janela de PDF. Libere pop-ups para este site. Tecnologia fazendo charme, como sempre.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPremiumHtml());
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 400);
    setStatus("Prévia de PDF aberta com o conteúdo revisado. Na janela de impressão, escolha Salvar como PDF.");
  }

  async function exportDocx() {
    if (!canExport) {
      setStatus("Gere, aprove ou escreva algo no editor antes de exportar DOCX.");
      return;
    }

    setStatus("Gerando DOCX editável com o texto revisado. Agora sim, menos botão enfeite e mais trabalho honesto.");

    try {
      const payload = {
        artifact: {
          productTitle: projectName || "Sol.IA Publisher",
          visualStyle,
          promise: "Transformar manuscrito bruto em produto editorial premium, claro e aplicável.",
          audience,
          tone,
          finalFormats: ["DOCX", "HTML", "TXT", "PDF"],
          sourceSummary: exportSource,
          didacticAssets: ["Checklist de aplicação", "Mapa mental", "Quadro de discernimento", "Página de reflexão"]
        }
      };

      const response = await fetch("/api/publisher/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || data?.error || "Falha ao gerar DOCX.");
      }

      const blob = await response.blob();
      downloadBlob(blob, `${slugify(projectName)}-editavel.docx`);
      setStatus("DOCX exportado com o conteúdo revisado.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido.";
      setStatus(`Não consegui exportar DOCX: ${message}`);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-[#F5F0E8]">
      <section className="mx-auto max-w-7xl rounded-[2rem] border border-[#C9A84C]/30 bg-[#13070A] p-6 shadow-2xl md:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C9A84C]">Sol.IA Publisher</p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Transforme seu manuscrito em um produto editorial premium.</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#F5F0E8]/70">MVP funcional com leitura real de TXT, Markdown, HTML, DOCX e PDF pesquisável, diagnóstico editorial, editor revisável e exportação TXT/HTML/DOCX/PDF.</p>
          </div>

          <aside className="rounded-3xl border border-[#C9A84C]/20 bg-black/35 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cofre Editorial</p>
            <div className="mt-4 space-y-2 text-sm text-[#F5F0E8]/70">
              <p>Memória: {stage !== "idle" ? "criada" : "aguardando"}</p>
              <p>Diagnóstico: {diagnostic ? "criado" : "aguardando"}</p>
              <p>Artefato: {artifact ? "criado" : "aguardando"}</p>
              <p>Arquivo: {fileInfo?.name ?? "nenhum"}</p>
              <p>Texto extraído: {fileInfo?.words ? `${fileInfo.words} palavras` : "aguardando"}</p>
              <p>Editor: {editorContent ? `${editorStats.words} palavras` : "vazio"}</p>
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
          <button onClick={loadDiagnosticIntoEditor} disabled={isBusy || !diagnostic} className="rounded-full border border-[#C9A84C]/40 px-6 py-3 font-bold text-[#F5F0E8]/85 transition hover:border-[#C9A84C] disabled:opacity-40">Editar diagnóstico</button>
          <button onClick={loadArtifactIntoEditor} disabled={isBusy || !artifact} className="rounded-full border border-[#C9A84C]/40 px-6 py-3 font-bold text-[#F5F0E8]/85 transition hover:border-[#C9A84C] disabled:opacity-40">Editar artefato</button>
        </div>

        <div className="mt-8 rounded-3xl border border-[#C9A84C]/25 bg-black/50 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Editor Revisável</p>
              <h2 className="mt-2 text-2xl font-black">Revise antes de exportar</h2>
              <p className="mt-2 text-sm text-[#F5F0E8]/60">Tudo que você exportar agora sai daqui. Editou aqui, HTML/DOCX/PDF/TXT obedecem. Um milagre: botão obediente.</p>
            </div>
            <p className="rounded-full border border-[#C9A84C]/25 px-4 py-2 text-xs text-[#F5F0E8]/70">{editorStats.words} palavras • {editorStats.chars} caracteres</p>
          </div>
          <textarea
            ref={editorRef}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="O texto editável aparecerá aqui depois do diagnóstico ou da aprovação do artefato. Você também pode escrever manualmente."
            className="mt-5 min-h-[360px] w-full rounded-2xl border border-[#C9A84C]/20 bg-[#050505] p-5 text-sm leading-7 text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={exportTxt} disabled={isBusy} className="rounded-full bg-[#F5F0E8] px-6 py-3 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50">Exportar TXT</button>
          <button onClick={exportHtml} disabled={isBusy} className="rounded-full bg-[#C9A84C] px-6 py-3 font-bold text-black transition hover:scale-[1.02] disabled:opacity-50">Exportar HTML</button>
          <button onClick={exportDocx} disabled={isBusy} className="rounded-full bg-[#8F6B2E] px-6 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50">Exportar DOCX</button>
          <button onClick={exportPdf} disabled={isBusy} className="rounded-full border border-[#C9A84C]/70 px-6 py-3 font-bold text-[#F5F0E8] transition hover:bg-[#C9A84C] hover:text-black disabled:opacity-50">Exportar PDF</button>
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
            <h3 className="font-bold text-[#C9A84C]">Resultado Original</h3>
            <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black p-4 text-xs leading-6 text-[#F5F0E8]/75">{artifact || diagnostic || fileInfo?.preview || "Aguardando diagnóstico."}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
