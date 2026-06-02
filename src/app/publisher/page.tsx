"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";

type Stage = "idle" | "uploaded" | "diagnosed" | "artifact";

type FileInfo = {
  name: string;
  size: number;
  type: string;
  preview: string;
};

const formatBytes = (size: number) => {
  if (!size) return "0 KB";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

export default function PublisherPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [projectName, setProjectName] = useState("Projeto editorial");
  const [audience, setAudience] = useState("Leitoras e leitores do ecossistema Relacione-se");
  const [tone, setTone] = useState("Premium, claro, provocativo e didatico");
  const [visualStyle, setVisualStyle] = useState("Preto profundo, bordô, creme nobre e dourado antigo");
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [status, setStatus] = useState("Aguardando manuscrito ou descrição inicial.");
  const [diagnostic, setDiagnostic] = useState("");
  const [artifact, setArtifact] = useState("");

  const canDiagnose = Boolean(fileInfo || projectName.trim());
  const canExport = Boolean(diagnostic || artifact);

  const memory = useMemo(() => {
    return {
      projectName,
      audience,
      tone,
      visualStyle,
      attachedFile: fileInfo?.name ?? "nenhum arquivo anexado",
      stage,
      nextStep:
        stage === "idle"
          ? "enviar manuscrito"
          : stage === "uploaded"
            ? "gerar diagnóstico"
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

    let preview = "";
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (["txt", "md", "html"].includes(extension ?? "")) {
      preview = await file.text();
      preview = preview.slice(0, 3500);
    } else {
      preview = `Arquivo anexado: ${file.name}. Nesta fase, DOCX/PDF entram como anexo e serão lidos pela camada backend/editorial na próxima etapa.`;
    }

    setFileInfo({ name: file.name, size: file.size, type: file.type || extension || "arquivo", preview });
    setStatus("Arquivo anexado. Agora gere o diagnóstico editorial.");
    setStage("uploaded");
    setDiagnostic("");
    setArtifact("");
  }

  function generateDiagnostic() {
    if (!canDiagnose) {
      setStatus("Preencha o projeto ou anexe um manuscrito primeiro. Diagnóstico sem material é fofoca com crachá.");
      return;
    }

    const source = fileInfo?.preview || "Projeto descrito manualmente, sem arquivo anexado.";
    const text = `DIAGNÓSTICO EDITORIAL INICIAL\n\nProjeto: ${projectName}\nPúblico: ${audience}\nTom: ${tone}\nEstilo visual: ${visualStyle}\nArquivo: ${fileInfo?.name ?? "sem anexo"}\n\n1. Promessa editorial\nTransformar o material bruto em um produto claro, premium e aplicável, com estrutura de leitura fluida e acabamento visual forte.\n\n2. Organização recomendada\n• Página de abertura com promessa forte.\n• Introdução curta e emocional.\n• Blocos/capítulos com progressão lógica.\n• Recursos didáticos: mapa mental, quadro-resumo, checklist e exercícios.\n• Encerramento com síntese e chamada para próximo passo.\n\n3. Riscos detectados\n• Capítulos curtos demais podem parecer rasos.\n• Texto sem respiro visual pode cansar.\n• Falta de infográficos reduz percepção premium.\n• DOCX/PDF precisam de leitura backend real para evitar cortes e palavras grudadas.\n\n4. Próxima ação\nAprovar para artefato editorial e gerar uma primeira estrutura em HTML.\n\nTrecho/base recebida:\n${source}`;

    setDiagnostic(text);
    setStage("diagnosed");
    setStatus("Diagnóstico editorial criado. Agora aprove para gerar o artefato.");
  }

  function approveArtifact() {
    if (!diagnostic) {
      setStatus("Gere o diagnóstico antes. Sim, ordem existe. A anarquia fica para os grupos de WhatsApp.");
      return;
    }

    const text = `ARTEFATO EDITORIAL MVP\n\n${projectName}\n\nPROMESSA\nUm material editorial premium para ${audience}, com linguagem ${tone.toLowerCase()} e direção visual ${visualStyle.toLowerCase()}.\n\nESTRUTURA PROPOSTA\n\n1. Capa conceitual\nTítulo forte, subtítulo claro, selo editorial e assinatura Sol.IA Publisher.\n\n2. Carta de entrada\nUma abertura humana, direta e emocional para preparar o leitor.\n\n3. Mapa de travessia\nInfográfico textual com início, tensão, virada, prática e consolidação.\n\n4. Capítulos principais\nCada capítulo deve ter: ideia central, explicação, exemplo, exercício, síntese e frase-mestra.\n\n5. Recursos didáticos\n• Checklist de aplicação.\n• Mapa mental.\n• Quadro de erros comuns.\n• Página de reflexão.\n\n6. Fechamento\nSíntese, convite de continuidade e orientação de uso do material.\n\nSTATUS\nEste artefato é a primeira camada funcional. A próxima evolução será gerar HTML/DOCX/PDF automaticamente a partir dele.`;

    setArtifact(text);
    setStage("artifact");
    setStatus("Artefato editorial aprovado e criado no Cofre Editorial.");
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
    link.download = `${projectName.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "publisher"}-mvp.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("TXT exportado com sucesso.");
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
              MVP funcional: entrada de material, memória, diagnóstico, aprovação de artefato e exportação TXT.
            </p>
          </div>

          <aside className="rounded-3xl border border-[#C9A84C]/20 bg-black/35 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cofre Editorial</p>
            <div className="mt-4 space-y-2 text-sm text-[#F5F0E8]/70">
              <p>Memória: {stage !== "idle" ? "criada" : "aguardando"}</p>
              <p>Diagnóstico: {diagnostic ? "criado" : "aguardando"}</p>
              <p>Artefato: {artifact ? "criado" : "aguardando"}</p>
              <p>Arquivo: {fileInfo?.name ?? "nenhum"}</p>
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
            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/65">Anexe TXT, Markdown, HTML, DOCX ou PDF. TXT/MD/HTML já mostram prévia. DOCX/PDF entram como anexo nesta fase.</p>
            <input ref={fileInputRef} type="file" accept=".txt,.md,.html,.doc,.docx,.pdf" onChange={handleFileChange} className="hidden" />
            <button onClick={openUpload} className="mt-5 rounded-full bg-[#C9A84C] px-6 py-3 font-bold text-black transition hover:scale-[1.02]">Anexar manuscrito</button>
            {fileInfo && <p className="mt-4 text-sm text-[#F5F0E8]/70">{fileInfo.name} • {formatBytes(fileInfo.size)}</p>}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={generateDiagnostic} className="rounded-full border border-[#C9A84C] px-6 py-3 font-bold text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-black">Gerar diagnóstico</button>
          <button onClick={approveArtifact} className="rounded-full border border-[#F5F0E8]/35 px-6 py-3 font-bold text-[#F5F0E8] transition hover:bg-[#F5F0E8] hover:text-black">Aprovar artefato</button>
          <button onClick={exportTxt} className="rounded-full bg-[#F5F0E8] px-6 py-3 font-bold text-black transition hover:scale-[1.02]">Exportar TXT</button>
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
            <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black p-4 text-xs leading-6 text-[#F5F0E8]/75">{artifact || diagnostic || "Aguardando diagnóstico."}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
