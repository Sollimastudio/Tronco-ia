"use client";

import { useState } from "react";

type Memory = {
  projectName: string;
  audience: string;
  goal: string;
  tone: string;
  visualStyle: string;
  finalFormats: string[];
  sourceSummary: string;
  attachedFileName?: string;
  currentStage: string;
  nextStep: string;
};

type Diagnosis = {
  title: string;
  promise: string;
  recommendedFormat: string;
  strengths: string[];
  gaps: string[];
  visualNeeds: string[];
  nextStep: string;
};

type Artifact = {
  productTitle: string;
  promise: string;
  audience: string;
  tone: string;
  visualStyle: string;
  finalFormats: string[];
  sourceSummary: string;
  editorialStructure: string[];
  didacticAssets: string[];
  exportPlan: string[];
};

const visualStyles = [
  "Luxo editorial — bordô, creme, dourado",
  "Clean sofisticado — branco, preto, cinza elegante",
  "Feminino premium — rosé, nude, dourado suave",
  "Masculino executivo — preto, grafite, dourado",
  "Lúdico infantil — cores suaves, ilustrações didáticas",
  "Espiritual sensível — tons claros, simbologia e respiro",
  "Manual secreto — vintage, kraft, vinho, selo editorial",
  "Método/Workbook — didático, organizado, com exercícios"
];

const availableFormats = ["HTML", "PDF", "DOCX", "ZIP"];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(value: string) {
  return (value || "publisher")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "publisher";
}

function buildHtmlDocument(artifact: Artifact) {
  const sections = artifact.editorialStructure
    .map((section, index) => {
      const didactic = artifact.didacticAssets[index % artifact.didacticAssets.length];
      return `
        <section class="page" id="page-${index + 1}">
          <p class="kicker">Página ${index + 1}</p>
          <h2>${escapeHtml(section)}</h2>
          <p>${escapeHtml(
            index === 0
              ? artifact.promise
              : index === 1
                ? artifact.sourceSummary.slice(0, 1200) || "Conteúdo do manuscrito será organizado aqui."
                : `Esta seção será expandida a partir do material bruto, mantendo o tom ${artifact.tone} e o tema visual ${artifact.visualStyle}.`
          )}</p>
          <div class="visual-box">
            <strong>Recurso didático sugerido</strong>
            <span>${escapeHtml(didactic)}</span>
          </div>
        </section>
      `;
    })
    .join("\n");

  const nav = artifact.editorialStructure
    .map((section, index) => `<a href="#page-${index + 1}">${index + 1}. ${escapeHtml(section)}</a>`)
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(artifact.productTitle)}</title>
  <style>
    :root {
      --black: #0A0A0A;
      --wine: #120609;
      --wine-soft: #1C1214;
      --cream: #F5F0E8;
      --gold: #C9A84C;
      --muted: rgba(245, 240, 232, .72);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: radial-gradient(circle at top, rgba(201,168,76,.14), transparent 34%), var(--black);
      color: var(--cream);
      font-family: Inter, Arial, sans-serif;
    }
    .shell { max-width: 1180px; margin: 0 auto; padding: 28px; }
    .hero {
      min-height: 72vh;
      display: grid;
      place-items: center;
      border: 1px solid rgba(201,168,76,.28);
      border-radius: 34px;
      padding: 42px;
      background: linear-gradient(135deg, var(--wine), var(--wine-soft));
      box-shadow: 0 30px 90px rgba(0,0,0,.35);
    }
    .kicker { color: var(--gold); text-transform: uppercase; letter-spacing: .28em; font-size: 12px; }
    h1, h2 { font-family: Georgia, 'Times New Roman', serif; line-height: 1.05; margin: 0; }
    h1 { font-size: clamp(42px, 8vw, 92px); max-width: 920px; }
    h2 { font-size: clamp(30px, 5vw, 58px); }
    p { font-size: 18px; line-height: 1.75; color: var(--muted); }
    .meta { margin-top: 24px; display: grid; gap: 8px; color: var(--muted); }
    .nav { position: sticky; top: 0; z-index: 10; display: flex; gap: 10px; overflow-x: auto; padding: 14px 0; background: var(--black); }
    .nav a { flex: 0 0 auto; color: var(--cream); text-decoration: none; border: 1px solid rgba(201,168,76,.25); padding: 10px 12px; border-radius: 999px; font-size: 13px; }
    .page { min-height: 92vh; margin: 28px 0; padding: 36px; border-radius: 30px; border: 1px solid rgba(201,168,76,.22); background: linear-gradient(135deg, var(--wine), rgba(28,18,20,.88)); }
    .visual-box { margin-top: 28px; padding: 22px; border: 1px dashed rgba(201,168,76,.55); border-radius: 24px; background: rgba(0,0,0,.22); display: grid; gap: 8px; }
    .visual-box strong { color: var(--gold); text-transform: uppercase; letter-spacing: .18em; font-size: 12px; }
    .visual-box span { color: var(--cream); }
    @media (max-width: 700px) { .shell { padding: 14px; } .hero, .page { padding: 24px; border-radius: 24px; } p { font-size: 16px; } }
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <div>
        <p class="kicker">WebBook · ${escapeHtml(artifact.visualStyle)}</p>
        <h1>${escapeHtml(artifact.productTitle)}</h1>
        <p>${escapeHtml(artifact.promise)}</p>
        <div class="meta">
          <span>Público: ${escapeHtml(artifact.audience || "não definido")}</span>
          <span>Tom: ${escapeHtml(artifact.tone || "sofisticado, claro e útil")}</span>
          <span>Formatos planejados: ${escapeHtml(artifact.finalFormats.join(", "))}</span>
        </div>
      </div>
    </section>
    <nav class="nav">${nav}</nav>
    ${sections}
  </main>
</body>
</html>`;
}

export function PublisherMvp() {
  const [projectName, setProjectName] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [formats, setFormats] = useState<string[]>(["HTML", "PDF", "DOCX", "ZIP"]);
  const [sourceSummary, setSourceSummary] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");
  const [memory, setMemory] = useState<Memory | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [htmlStatus, setHtmlStatus] = useState("");

  function toggleFormat(format: string) {
    setFormats((current) =>
      current.includes(format)
        ? current.filter((item) => item !== format)
        : [...current, format]
    );
  }

  async function handleFile(file?: File) {
    if (!file) return;

    setAttachedFileName(file.name);
    setSourceSummary("Processando arquivo...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/publisher/upload", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setSourceSummary(data.error || "Falha ao processar arquivo.");
        return;
      }

      setSourceSummary(
        data.text ||
          `Arquivo anexado: ${file.name}. Não foi possível extrair conteúdo.`
      );
    } catch (error) {
      setSourceSummary(
        error instanceof Error
          ? `Erro ao processar arquivo: ${error.message}`
          : "Erro ao processar arquivo."
      );
    }
  }

  function createMemory() {
    const created: Memory = {
      projectName,
      audience,
      goal,
      tone,
      visualStyle,
      finalFormats: formats,
      sourceSummary,
      attachedFileName,
      currentStage: "project_memory",
      nextStep: "diagnosis"
    };

    setMemory(created);
    setDiagnosis(null);
    setArtifact(null);
    setHtmlStatus("");
  }

  function createDiagnosis() {
    const created: Diagnosis = {
      title: "Diagnóstico Editorial Inicial",
      promise: goal
        ? `Transformar "${projectName || "este projeto"}" em um produto editorial premium para ${audience || "o público definido"}, com foco em ${goal}.`
        : "A promessa central ainda precisa ser refinada antes da produção final.",
      recommendedFormat: formats.join(" + "),
      strengths: [
        "Existe uma intenção clara de transformação.",
        "O público já foi definido.",
        "O formato final já começou a ser escolhido.",
        "O tema visual dá direção para a diagramação."
      ],
      gaps: [
        "Ainda falta definir a arquitetura completa de capítulos/módulos.",
        "Ainda falta mapear onde entrarão infográficos, mapas mentais e exercícios.",
        "Ainda falta transformar o material bruto em sequência editorial paginada.",
        "PDF e DOCX finais exigem motor de exportação na próxima etapa."
      ],
      visualNeeds: [
        "Capa editorial premium.",
        "Página de abertura com promessa central.",
        "Separadores de módulos.",
        "Boxes de conceito-chave.",
        "Mapa mental para visão geral do método.",
        "Infográfico para explicar a transformação prometida.",
        "Páginas práticas para exercícios/checklists."
      ],
      nextStep: "approve_to_artifact"
    };

    setDiagnosis(created);
    setArtifact(null);
    setHtmlStatus("");
  }

  function approveToArtifact() {
    if (!memory || !diagnosis) return;

    const created: Artifact = {
      productTitle: memory.projectName || "Produto Editorial Sem Título",
      promise: diagnosis.promise,
      audience: memory.audience,
      tone: memory.tone || "sofisticado, claro e útil",
      visualStyle: memory.visualStyle || "Luxo editorial — bordô, creme, dourado",
      finalFormats: memory.finalFormats,
      sourceSummary: memory.sourceSummary,
      editorialStructure: [
        "Capa",
        "Página de promessa",
        "Carta de abertura",
        "Sumário",
        "Módulo 1 — Fundamento e consciência do problema",
        "Módulo 2 — Método e transformação principal",
        "Módulo 3 — Aplicação prática",
        "Módulo 4 — Consolidação e plano de ação",
        "Checklist final",
        "Página de encerramento e CTA"
      ],
      didacticAssets: [
        "Mapa mental da jornada do leitor",
        "Infográfico da transformação",
        "Boxes de conceito-chave",
        "Checklist prático",
        "Página de exercícios",
        "Quadro antes/depois"
      ],
      exportPlan: [
        "Gerar HTML/WebBook responsivo",
        "Gerar DOCX editável",
        "Preparar PDF premium",
        "Empacotar ZIP final com arquivos do projeto"
      ]
    };

    setArtifact(created);
    setHtmlStatus("");
  }

  function downloadHtml() {
    if (!artifact) return;

    const html = buildHtmlDocument(artifact);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugify(artifact.productTitle)}-webbook.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setHtmlStatus("HTML gerado e baixado com sucesso.");
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-[#C9A84C]/25 bg-[#120609] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">
              Publisher IA MVP
            </p>
            <h1 className="mt-3 text-3xl font-semibold">
              Crie a memória, o diagnóstico e o artefato editorial
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
              Fluxo mínimo validado: entrada do projeto, escolha visual, formatos,
              anexo inicial, diagnóstico, artefato e exportação HTML.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Nome do projeto" value={projectName} onChange={(event) => setProjectName(event.target.value)} />
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Público alvo" value={audience} onChange={(event) => setAudience(event.target.value)} />
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Objetivo" value={goal} onChange={(event) => setGoal(event.target.value)} />
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Tom" value={tone} onChange={(event) => setTone(event.target.value)} />
          </div>

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5">
            <label className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Estilo visual</label>
            <select className="mt-3 w-full rounded-2xl border border-[#C9A84C]/20 bg-black p-4 text-[#F5F0E8] outline-none" value={visualStyle} onChange={(event) => setVisualStyle(event.target.value)}>
              <option value="">Escolha um tema editorial</option>
              {visualStyles.map((style) => <option key={style} value={style}>{style}</option>)}
            </select>
          </div>

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Formatos finais</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {availableFormats.map((format) => (
                <label key={format} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#C9A84C]/20 bg-black/30 p-4">
                  <input type="checkbox" checked={formats.includes(format)} onChange={() => toggleFormat(format)} />
                  <span>{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Material bruto</p>
            <input type="file" accept=".txt,.md,.pdf,.doc,.docx" className="mt-4 w-full rounded-2xl border border-dashed border-[#C9A84C]/30 bg-black/30 p-4" onChange={(event) => handleFile(event.target.files?.[0])} />
            {attachedFileName && <p className="mt-3 text-sm text-[#F5F0E8]/70">Arquivo anexado: {attachedFileName}</p>}
            <textarea className="mt-4 min-h-40 w-full rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Resumo do material, ideia ou manuscrito" value={sourceSummary} onChange={(event) => setSourceSummary(event.target.value)} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={createMemory} className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Criar Memória</button>
            <button onClick={createDiagnosis} disabled={!memory} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8] disabled:opacity-40">Gerar Diagnóstico</button>
            <button onClick={approveToArtifact} disabled={!memory || !diagnosis} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8] disabled:opacity-40">Aprovar para Artefato</button>
          </div>

          {memory && (
            <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
              <h2 className="text-2xl font-semibold text-[#C9A84C]">Memória do Projeto</h2>
              <pre className="mt-5 overflow-auto rounded-2xl bg-black/50 p-5 text-sm leading-7 text-[#F5F0E8]/80">{JSON.stringify(memory, null, 2)}</pre>
            </div>
          )}

          {diagnosis && (
            <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
              <h2 className="text-2xl font-semibold text-[#C9A84C]">Diagnóstico Editorial</h2>
              <div className="mt-5 space-y-5 text-sm leading-7 text-[#F5F0E8]/75">
                <p><strong>Promessa:</strong> {diagnosis.promise}</p>
                <p><strong>Formato recomendado:</strong> {diagnosis.recommendedFormat}</p>
                <div><strong>Pontos fortes:</strong><ul className="mt-2 list-disc space-y-1 pl-5">{diagnosis.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><strong>Lacunas:</strong><ul className="mt-2 list-disc space-y-1 pl-5">{diagnosis.gaps.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div><strong>Necessidades visuais:</strong><ul className="mt-2 list-disc space-y-1 pl-5">{diagnosis.visualNeeds.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
            </div>
          )}

          {artifact && (
            <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
              <h2 className="text-2xl font-semibold text-[#C9A84C]">Artefato Editorial</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-black/35 p-5"><h3 className="font-semibold">Estrutura do produto</h3><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">{artifact.editorialStructure.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div className="rounded-2xl bg-black/35 p-5"><h3 className="font-semibold">Didática visual</h3><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">{artifact.didacticAssets.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div className="rounded-2xl bg-black/35 p-5 md:col-span-2"><h3 className="font-semibold">Plano de exportação</h3><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">{artifact.exportPlan.map((item) => <li key={item}>{item}</li>)}</ul></div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={downloadHtml} className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Gerar HTML</button>
                <button className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8]">Próximo: Gerar DOCX</button>
              </div>
              {htmlStatus && <p className="mt-4 text-sm text-[#C9A84C]">{htmlStatus}</p>}
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cofre Editorial</p>
          <h2 className="mt-3 text-xl font-semibold">Itens definitivos</h2>
          <p className="mt-3 text-sm leading-6 text-[#F5F0E8]/65">Aqui entram os itens aprovados para compor o produto final.</p>
          <div className="mt-5 space-y-3 rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-4 text-sm text-[#F5F0E8]/70">
            <p>Memória: {memory ? "criada" : "aguardando"}</p>
            <p>Diagnóstico: {diagnosis ? "criado" : "aguardando"}</p>
            <p>Artefato: {artifact ? "aprovado" : "aguardando"}</p>
            <p>Formatos: {formats.join(", ")}</p>
            <p>Tema: {visualStyle || "aguardando escolha"}</p>
            <p>HTML: {htmlStatus ? "gerado" : "aguardando"}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default PublisherMvp;
