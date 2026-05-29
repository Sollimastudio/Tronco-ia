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
  promise: string;
  structure: string[];
  visualNeeds: string[];
  risks: string[];
  nextActions: string[];
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

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "txt" || extension === "md") {
      const text = await file.text();
      setSourceSummary(text.slice(0, 6000));
      return;
    }

    setSourceSummary((current) =>
      current ||
      `Arquivo anexado: ${file.name}. Leitura completa de PDF/DOCX será processada na próxima fase do backend.`
    );
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
  }

  function createDiagnosis() {
    const created: Diagnosis = {
      promise: goal
        ? `Transformar o material em um produto editorial premium para ${audience || "o público definido"}.`
        : "Definir promessa central antes da escrita final.",
      structure: [
        "Entrada editorial: promessa, público, transformação e tom.",
        "Arquitetura do conteúdo: módulos, capítulos e ordem de leitura.",
        "Didática visual: boxes, mapas mentais, infográficos e exercícios.",
        "Entrega final: HTML, DOCX, PDF e pacote organizado."
      ],
      visualNeeds: [
        `Tema visual sugerido: ${visualStyle || "escolher tema visual antes da diagramação"}.`,
        "Criar capa, página de abertura e separadores de módulos.",
        "Inserir blocos de destaque para conceitos importantes.",
        "Prever pelo menos um mapa mental e um infográfico para facilitar retenção."
      ],
      risks: [
        "Material pode ficar genérico se a promessa não for específica.",
        "PDF pode ficar pesado se não houver respiro visual.",
        "DOCX precisa ser editável e organizado em estilos."
      ],
      nextActions: [
        "Aprovar memória do projeto.",
        "Aprovar diagnóstico editorial.",
        "Gerar Artefato Editorial.",
        "Montar HTML/WebBook.",
        "Exportar DOCX/PDF."
      ]
    };

    setDiagnosis(created);
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
              Crie a memória e o diagnóstico inicial
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
              Esta tela testa o fluxo mínimo: entrada do projeto, anexo inicial,
              memória editorial, diagnóstico e preparação do Cofre Editorial.
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

                <div>
                  <strong>Estrutura sugerida:</strong>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {diagnosis.structure.map((item) => (
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

                <div>
                  <strong>Riscos editoriais:</strong>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {diagnosis.risks.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
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
            Quando a memória e o diagnóstico forem aprovados, eles entram aqui
            para compor o produto final.
          </p>

          <div className="mt-5 rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-4 text-sm text-[#F5F0E8]/70">
            Memória: {memory ? "criada" : "aguardando"}
            <br />
            Diagnóstico: {diagnosis ? "criado" : "aguardando"}
            <br />
            Formatos: {formats.join(", ")}
            <br />
            Tema: {visualStyle || "aguardando escolha"}
          </div>

          {diagnosis && (
            <button className="mt-5 w-full rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">
              Aprovar para Artefato Editorial
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}

export default PublisherMvp;
