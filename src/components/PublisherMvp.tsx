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
              anexo inicial, diagnóstico e preparação do produto final.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none"
              placeholder="Nome do projeto"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
            />

            <input
              className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none"
              placeholder="Público alvo"
              value={audience}
              onChange={(event) => setAudience(event.target.value)}
            />

            <input
              className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none"
              placeholder="Objetivo"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
            />

            <input
              className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none"
              placeholder="Tom"
              value={tone}
              onChange={(event) => setTone(event.target.value)}
            />
          </div>

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5">
            <label className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">
              Estilo visual
            </label>

            <select
              className="mt-3 w-full rounded-2xl border border-[#C9A84C]/20 bg-black p-4 text-[#F5F0E8] outline-none"
              value={visualStyle}
              onChange={(event) => setVisualStyle(event.target.value)}
            >
              <option value="">Escolha um tema editorial</option>
              {visualStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">
              Formatos finais
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {availableFormats.map((format) => (
                <label
                  key={format}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#C9A84C]/20 bg-black/30 p-4"
                >
                  <input
                    type="checkbox"
                    checked={formats.includes(format)}
                    onChange={() => toggleFormat(format)}
                  />
                  <span>{format}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">
              Material bruto
            </p>

            <input
              type="file"
              accept=".txt,.md,.pdf,.doc,.docx"
              className="mt-4 w-full rounded-2xl border border-dashed border-[#C9A84C]/30 bg-black/30 p-4"
              onChange={(event) => handleFile(event.target.files?.[0])}
            />

            {attachedFileName && (
              <p className="mt-3 text-sm text-[#F5F0E8]/70">
                Arquivo anexado: {attachedFileName}
              </p>
            )}

            <textarea
              className="mt-4 min-h-40 w-full rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none"
              placeholder="Resumo do material, ideia ou manuscrito"
              value={sourceSummary}
              onChange={(event) => setSourceSummary(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={createMemory}
              className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black"
            >
              Criar Memória
            </button>

            <button
              onClick={createDiagnosis}
              disabled={!memory}
              className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8] disabled:opacity-40"
            >
              Gerar Diagnóstico
            </button>

            <button
              onClick={approveToArtifact}
              disabled={!memory || !diagnosis}
              className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8] disabled:opacity-40"
            >
              Aprovar para Artefato
            </button>
          </div>

          {memory && (
            <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
              <h2 className="text-2xl font-semibold text-[#C9A84C]">
                Memória do Projeto
              </h2>
              <pre className="mt-5 overflow-auto rounded-2xl bg-black/50 p-5 text-sm leading-7 text-[#F5F0E8]/80">
                {JSON.stringify(memory, null, 2)}
              </pre>
            </div>
          )}

          {diagnosis && (
            <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
              <h2 className="text-2xl font-semibold text-[#C9A84C]">
                Diagnóstico Editorial
              </h2>

              <div className="mt-5 space-y-5 text-sm leading-7 text-[#F5F0E8]/75">
                <p>
                  <strong>Promessa:</strong> {diagnosis.promise}
                </p>

                <p>
                  <strong>Formato recomendado:</strong>{" "}
                  {diagnosis.recommendedFormat}
                </p>

                <div>
                  <strong>Pontos fortes:</strong>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {diagnosis.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Lacunas:</strong>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {diagnosis.gaps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Necessidades visuais:</strong>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {diagnosis.visualNeeds.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {artifact && (
            <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
              <h2 className="text-2xl font-semibold text-[#C9A84C]">
                Artefato Editorial
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="font-semibold">Estrutura do produto</h3>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">
                    {artifact.editorialStructure.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-black/35 p-5">
                  <h3 className="font-semibold">Didática visual</h3>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">
                    {artifact.didacticAssets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-black/35 p-5 md:col-span-2">
                  <h3 className="font-semibold">Plano de exportação</h3>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">
                    {artifact.exportPlan.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">
                  Próximo: Gerar HTML
                </button>
                <button className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8]">
                  Próximo: Gerar DOCX
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">
            Cofre Editorial
          </p>

          <h2 className="mt-3 text-xl font-semibold">Itens definitivos</h2>

          <p className="mt-3 text-sm leading-6 text-[#F5F0E8]/65">
            Aqui entram os itens aprovados para compor o produto final.
          </p>

          <div className="mt-5 space-y-3 rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-4 text-sm text-[#F5F0E8]/70">
            <p>Memória: {memory ? "criada" : "aguardando"}</p>
            <p>Diagnóstico: {diagnosis ? "criado" : "aguardando"}</p>
            <p>Artefato: {artifact ? "aprovado" : "aguardando"}</p>
            <p>Formatos: {formats.join(", ")}</p>
            <p>Tema: {visualStyle || "aguardando escolha"}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default PublisherMvp;
