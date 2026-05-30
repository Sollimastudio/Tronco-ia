"use client";

import { useMemo, useState } from "react";

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

type Section = { title: string; body: string; kind: "cover" | "module" | "chapter" | "content" };

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
  return String(value || "")
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

function titleCaseFallback(value: string) {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 96);
}

function repairOcr(value: string) {
  const replacements: Array<[RegExp, string]> = [
    [/MANUAL DEAUTOCIRURGIA/gi, "MANUAL DE AUTOCIRURGIA"],
    [/MANUAL DE AUTOCIRURGIAManual de Autocirurgia/gi, "MANUAL DE AUTOCIRURGIA\nManual de Autocirurgia"],
    [/Autocirurgi\b/gi, "Autocirurgia"],
    [/semnenhuma/gi, "sem nenhuma"],
    [/barulhopara/gi, "barulho para"],
    [/porfalta/gi, "por falta"],
    [/quefunciona/gi, "que funciona"],
    [/omundo/gi, "o mundo"],
    [/muitotempo/gi, "muito tempo"],
    [/antesde/gi, "antes de"],
    [/cadadecisão/gi, "cada decisão"],
    [/sensivel/gi, "sensível"],
    [/saida/gi, "saída"],
    [/cium[eé]/gi, "ciúme"],
    [/esuas/gi, "e suas"],
    [/Aintensidade/gi, "A intensidade"],
    [/umdefeito/gi, "um defeito"],
    [/sentevista/gi, "sente vista"],
    [/externamuda/gi, "externa muda"],
    [/manualvai/gi, "manual vai"],
    [/od[ií]agnóstico/gi, "o diagnóstico"],
    [/atrav[eé]s derepetição/gi, "através de repetição"],
    [/quandoest[aá]/gi, "quando está"],
    [/Acriança/gi, "A criança"],
    [/Amenina/gi, "A menina"],
    [/aprendeuengolir/gi, "aprendeu a engolir"],
    [/fraquezamulher/gi, "fraqueza. Mulher"],
    [/friaum/gi, "fria, um"],
    [/emboraentende/gi, "embora entende"],
    [/quepare/gi, "que pare"],
    [/trêspessoas/gi, "três pessoas"],
    [/desprendidaassim/gi, "desprendida assim"],
    [/banalem/gi, "banal em"],
    [/emalguns/gi, "em alguns"],
    [/Ooutro/gi, "O outro"],
    [/od[inheiro]/gi, "o dinheiro"],
    [/Aspessoas/gi, "As pessoas"],
    [/Vítiapítulo\s+inguagem de Vítima/gi, "Vítima"],
    [/Fofoca comoIdentidade/gi, "Fofoca como Identidade"],
    [/Instabilidade Emocionalcomo/gi, "Instabilidade Emocional como"],
    [/Necessidade deAprovação/gi, "Necessidade de Aprovação"],
    [/Mulher que Testa — ePerde/gi, "Mulher que Testa — e Perde"],
    [/O Móauto Il/gi, "O Módulo II"],
    [/MÓDULO!Como/gi, "MÓDULO I\nComo"],
    [/MÓDULO!Atitudes/gi, "MÓDULO II\nAtitudes"],
    [/A Ferida O Governo/gi, "A Ferida\n\nO Governo"],
    [/O GovernoO/gi, "O Governo\n\nO"],
    [/O Governosensibilidade/gi, "O Governo\n\nSensibilidade"],
    [/O Governomede/gi, "O Governo\n\nMede"],
    [/D Esselivo é pravocê/gi, "Este livro é para você"],
    [/realou/gi, "real ou"],
    [/acrença/gi, "a crença"],
    [/([a-záéíóúãõç])([A-ZÁÉÍÓÚÃÕÇ][a-záéíóúãõç]{2,})/g, "$1 $2"],
    [/([.!?])([A-ZÁÉÍÓÚÃÕÇ])/g, "$1\n\n$2"]
  ];

  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}

function cleanManuscriptText(value: string) {
  return repairOcr(String(value || ""))
    .replace(/\r/g, "")
    .replace(/Versão convertida para texto OCR para leitura pelo Manus/gi, "")
    .replace(/Observação:[^\n]+(?:\n|$)/gi, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/«[a-z0-9]+/gi, "")
    .replace(/\[(Ds|ss)\]/gi, "")
    .replace(/[|]/g, " — ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/ {2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isTrash(text: string) {
  const words = text.match(/[A-Za-zÀ-ÿ]{3,}/g)?.length || 0;
  const weird = text.match(/[=<>_#@~^§¢£¬ªº]|RRRN|ffRR|CRET|rdDER|LEO ERR/gi)?.length || 0;
  return text.length < 260 && (weird > 1 || words < 6);
}

function normalizeHeading(raw: string) {
  return raw
    .replace(/^Página\s+\d+\s*/i, "")
    .replace(/MÓDULO!$/i, "MÓDULO")
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoSections(source: string): Section[] {
  const cleaned = cleanManuscriptText(source);
  if (!cleaned) return [];

  const withoutTrashPages = cleaned
    .split(/\n\s*Página\s+\d+\s*\n/gi)
    .map((chunk) => cleanManuscriptText(chunk))
    .filter((chunk) => chunk.length > 35 && !isTrash(chunk))
    .join("\n\n");

  const text = withoutTrashPages || cleaned;
  const markerRegex = /(^|\n)(MÓDULO\s*(?:I{1,3}|IV|V|\d+|!)?.*|Capítulo\s+\d+\s*[—-].*)/gi;
  const matches = [...text.matchAll(markerRegex)];

  if (matches.length > 0) {
    const sections: Section[] = [];
    const firstStart = matches[0].index ?? 0;
    const intro = cleanManuscriptText(text.slice(0, firstStart));

    if (intro.length > 80) {
      sections.push({ title: extractBestTitle(intro, "Abertura"), body: intro, kind: "content" });
    }

    matches.forEach((match, index) => {
      const start = match.index ?? 0;
      const next = matches[index + 1]?.index ?? text.length;
      const chunk = cleanManuscriptText(text.slice(start, next));
      if (chunk.length < 60 || isTrash(chunk)) return;

      const firstLine = normalizeHeading(chunk.split("\n").find(Boolean) || `Seção ${index + 1}`);
      const kind = /^MÓDULO/i.test(firstLine) ? "module" : "chapter";
      sections.push({ title: extractBestTitle(chunk, firstLine), body: chunk, kind });
    });

    return sections;
  }

  const chunks = text.split(/\n{2,}/).filter((item) => item.trim().length > 30);
  const sections: Section[] = [];
  let current = "";

  chunks.forEach((paragraph) => {
    if ((current + "\n\n" + paragraph).length > 1900 && current) {
      sections.push({ title: extractBestTitle(current, `Seção ${sections.length + 1}`), body: current, kind: "content" });
      current = paragraph;
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph;
    }
  });

  if (current) sections.push({ title: extractBestTitle(current, `Seção ${sections.length + 1}`), body: current, kind: "content" });
  return sections;
}

function extractBestTitle(body: string, fallback: string) {
  const lines = body.split("\n").map((line) => line.trim()).filter(Boolean);
  const heading = lines.find((line) => /^(MÓDULO|Capítulo|Manual|Antídoto|A Ferida|O Governo)/i.test(line));
  const candidate = heading || lines[0] || fallback;
  return titleCaseFallback(candidate);
}

function paragraphsToHtml(value: string) {
  return cleanManuscriptText(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n");
}

function visualBlock(kind: string, title: string, index: number) {
  const safeTitle = escapeHtml(title);
  const visual = kind.toLowerCase();

  if (visual.includes("mapa")) {
    return `<div class="visual visual-map"><div class="core">${safeTitle}</div><div class="node n1">Ferida</div><div class="node n2">Padrão</div><div class="node n3">Escolha</div><div class="node n4">Governo</div></div>`;
  }

  if (visual.includes("infográfico")) {
    return `<div class="visual visual-flow"><div>1<br/><span>Perceber</span></div><div>2<br/><span>Nomear</span></div><div>3<br/><span>Interromper</span></div><div>4<br/><span>Reposicionar</span></div></div>`;
  }

  if (visual.includes("checklist")) {
    return `<div class="visual visual-check"><strong>Checklist de aplicação</strong><label>□ Qual padrão apareceu?</label><label>□ O que isso tenta proteger?</label><label>□ Que escolha adulta substitui isso?</label></div>`;
  }

  if (visual.includes("antes")) {
    return `<div class="visual visual-compare"><div><strong>Antes</strong><p>Reação automática, defesa e ruído.</p></div><div><strong>Depois</strong><p>Presença, escolha consciente e direção.</p></div></div>`;
  }

  return `<div class="visual visual-box"><strong>Conceito-chave ${index + 1}</strong><p>${safeTitle}</p></div>`;
}

function buildHtmlDocument(artifact: Artifact) {
  const sections = splitIntoSections(artifact.sourceSummary);
  const assets = artifact.didacticAssets.length ? artifact.didacticAssets : ["Mapa mental da jornada do leitor"];

  const nav = sections
    .map((section, index) => `<a href="#page-${index + 1}">${index + 1}. ${escapeHtml(section.title)}</a>`)
    .join("");

  const pages = sections
    .map((section, index) => {
      const asset = assets[index % assets.length];
      return `<section class="page ${section.kind}" id="page-${index + 1}">
        <p class="kicker">${section.kind === "module" ? "Módulo" : section.kind === "chapter" ? "Capítulo" : `Página ${index + 1}`}</p>
        <h2>${escapeHtml(section.title)}</h2>
        ${paragraphsToHtml(section.body)}
        ${visualBlock(asset, section.title, index)}
      </section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(artifact.productTitle)}</title>
  <style>
    :root{--black:#0A0A0A;--wine:#120609;--wine-soft:#1C1214;--cream:#F5F0E8;--gold:#C9A84C;--muted:rgba(245,240,232,.72)}
    *{box-sizing:border-box} html{scroll-behavior:smooth} body{margin:0;background:radial-gradient(circle at top,rgba(201,168,76,.14),transparent 34%),var(--black);color:var(--cream);font-family:Inter,Arial,sans-serif}.shell{max-width:1180px;margin:0 auto;padding:28px}.hero{min-height:72vh;display:grid;place-items:center;border:1px solid rgba(201,168,76,.28);border-radius:34px;padding:42px;background:linear-gradient(135deg,var(--wine),var(--wine-soft));box-shadow:0 30px 90px rgba(0,0,0,.35)}.kicker{color:var(--gold);text-transform:uppercase;letter-spacing:.28em;font-size:12px}h1,h2{font-family:Georgia,'Times New Roman',serif;line-height:1.05;margin:0}h1{font-size:clamp(42px,8vw,92px);max-width:920px}h2{font-size:clamp(30px,5vw,58px)}p{font-size:18px;line-height:1.75;color:var(--muted);white-space:pre-wrap}.meta{margin-top:24px;display:grid;gap:8px;color:var(--muted)}.notice{margin-top:28px;padding:16px;border-radius:18px;border:1px solid rgba(201,168,76,.24);color:var(--muted);background:rgba(0,0,0,.22)}.nav{position:sticky;top:0;z-index:10;display:flex;gap:10px;overflow-x:auto;padding:14px 0;background:var(--black)}.nav a{flex:0 0 auto;color:var(--cream);text-decoration:none;border:1px solid rgba(201,168,76,.25);padding:10px 12px;border-radius:999px;font-size:13px}.page{min-height:92vh;margin:28px 0;padding:36px;border-radius:30px;border:1px solid rgba(201,168,76,.22);background:linear-gradient(135deg,var(--wine),rgba(28,18,20,.88))}.module{border-color:rgba(201,168,76,.55)}.page p+p{margin-top:18px}.visual{margin-top:30px;border:1px solid rgba(201,168,76,.36);border-radius:26px;padding:24px;background:rgba(0,0,0,.26)}.visual-map{position:relative;min-height:260px;display:grid;place-items:center}.core{border:1px solid var(--gold);border-radius:999px;padding:24px;max-width:340px;text-align:center;color:var(--gold);background:rgba(201,168,76,.08)}.node{position:absolute;border:1px solid rgba(201,168,76,.38);border-radius:999px;padding:12px 18px;background:rgba(0,0,0,.32)}.n1{top:24px;left:8%}.n2{top:24px;right:8%}.n3{bottom:24px;left:10%}.n4{bottom:24px;right:10%}.visual-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;text-align:center}.visual-flow div{border:1px solid rgba(201,168,76,.32);border-radius:20px;padding:22px;color:var(--gold);font-size:30px}.visual-flow span{display:block;margin-top:8px;color:var(--cream);font-size:14px}.visual-check{display:grid;gap:12px}.visual-check strong,.visual-box strong{color:var(--gold);letter-spacing:.14em;text-transform:uppercase;font-size:12px}.visual-check label{border:1px solid rgba(201,168,76,.22);border-radius:14px;padding:12px;color:var(--cream)}.visual-compare{display:grid;grid-template-columns:1fr 1fr;gap:16px}.visual-compare div{border:1px solid rgba(201,168,76,.24);border-radius:18px;padding:18px}.visual-compare strong{color:var(--gold)}@media(max-width:700px){.shell{padding:14px}.hero,.page{padding:24px;border-radius:24px}p{font-size:16px}.visual-flow,.visual-compare{grid-template-columns:1fr}.node{position:static;margin:8px}.visual-map{display:block}.core{margin:0 auto 12px}}
  </style>
</head>
<body><main class="shell"><section class="hero"><div><p class="kicker">WebBook · ${escapeHtml(artifact.visualStyle)}</p><h1>${escapeHtml(artifact.productTitle)}</h1><p>${escapeHtml(artifact.promise)}</p><div class="meta"><span>Público: ${escapeHtml(artifact.audience || "não definido")}</span><span>Tom: ${escapeHtml(artifact.tone || "sofisticado, claro e útil")}</span><span>Formatos planejados: ${escapeHtml(artifact.finalFormats.join(", "))}</span><span>Seções renderizadas: ${sections.length}</span></div><div class="notice">Rascunho editorial automático com blocos visuais reais em HTML. Ainda revise OCR, acentos, quebras e títulos antes da publicação final.</div></div></section><nav class="nav">${nav}</nav>${pages}</main></body></html>`;
}

export function PublisherMvpEnhanced() {
  const [projectName, setProjectName] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("");
  const [visualStyle, setVisualStyle] = useState("Manual secreto — vintage, kraft, vinho, selo editorial");
  const [formats, setFormats] = useState<string[]>(["HTML", "PDF", "DOCX", "ZIP"]);
  const [sourceSummary, setSourceSummary] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");
  const [memory, setMemory] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [htmlStatus, setHtmlStatus] = useState("");
  const [docxStatus, setDocxStatus] = useState("");
  const [cleanStatus, setCleanStatus] = useState("");
  const sectionCount = useMemo(() => splitIntoSections(sourceSummary).length, [sourceSummary]);

  async function handleFile(file?: File) {
    if (!file) return;
    setAttachedFileName(file.name);
    setSourceSummary("Processando arquivo...");
    setCleanStatus("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/publisher/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) return setSourceSummary(data.error || "Falha ao processar arquivo.");
      setSourceSummary(data.text || `Arquivo anexado: ${file.name}. Não foi possível extrair conteúdo.`);
      if (data.truncated) setCleanStatus(`Atenção: texto grande; foram carregados ${data.returnedLength} de ${data.originalLength} caracteres.`);
    } catch (error) {
      setSourceSummary(error instanceof Error ? `Erro ao processar arquivo: ${error.message}` : "Erro ao processar arquivo.");
    }
  }

  function toggleFormat(format: string) {
    setFormats((current) => current.includes(format) ? current.filter((item) => item !== format) : [...current, format]);
  }

  function cleanManuscript() {
    const before = sourceSummary.length;
    const beforeSections = splitIntoSections(sourceSummary).length;
    const cleaned = cleanManuscriptText(sourceSummary);
    const afterSections = splitIntoSections(cleaned).length;
    setSourceSummary(cleaned);
    setMemory(null); setDiagnosis(null); setArtifact(null); setHtmlStatus(""); setDocxStatus("");
    setCleanStatus(`Manuscrito limpo: ${before.toLocaleString("pt-BR")} caracteres tratados; ${beforeSections} → ${afterSections} seções úteis.`);
  }

  function createMemory() {
    const created = { projectName, audience, goal, tone, visualStyle, finalFormats: formats, sourceSummary, attachedFileName, sections: sectionCount, currentStage: "project_memory", nextStep: "diagnosis" };
    setMemory(created); setDiagnosis(null); setArtifact(null); setHtmlStatus(""); setDocxStatus("");
  }

  function createDiagnosis() {
    const created = {
      promise: goal ? `Transformar "${projectName || "este projeto"}" em um produto editorial premium para ${audience || "o público definido"}, com foco em ${goal}.` : "A promessa central ainda precisa ser refinada antes da produção final.",
      recommendedFormat: formats.join(" + "),
      strengths: ["Upload e extração funcionando.", "Limpeza editorial aplicada ao manuscrito.", `${sectionCount} seções detectadas para renderização.`, "HTML e DOCX já podem ser exportados."],
      gaps: ["Ainda falta reescrita editorial profunda com IA.", "Ainda falta PDF premium renderizado.", "Ainda falta biblioteca de ilustrações próprias por tema."],
      visualNeeds: ["Mapa mental real em HTML.", "Infográfico real em HTML.", "Checklist visual.", "Quadro antes/depois.", "Boxes de conceito-chave."]
    };
    setDiagnosis(created); setArtifact(null); setHtmlStatus(""); setDocxStatus("");
  }

  function approveToArtifact() {
    if (!memory || !diagnosis) return;
    setArtifact({
      productTitle: projectName || "Produto Editorial Sem Título",
      promise: diagnosis.promise,
      audience,
      tone: tone || "sofisticado, claro e útil",
      visualStyle: visualStyle || "Manual secreto — vintage, kraft, vinho, selo editorial",
      finalFormats: formats,
      sourceSummary,
      editorialStructure: ["Capa", "Abertura", "Módulos", "Capítulos", "Exercícios", "Encerramento"],
      didacticAssets: ["Mapa mental da jornada do leitor", "Infográfico da transformação", "Boxes de conceito-chave", "Checklist prático", "Quadro antes/depois"],
      exportPlan: ["Gerar HTML/WebBook com blocos visuais reais", "Gerar DOCX editável", "Preparar PDF premium", "Empacotar ZIP final"]
    });
  }

  function downloadHtml() {
    if (!artifact) return;
    const html = buildHtmlDocument(artifact);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugify(artifact.productTitle)}-webbook.html`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
    setHtmlStatus("HTML gerado com seções mais completas e blocos visuais reais.");
  }

  async function downloadDocx() {
    if (!artifact) return;
    setDocxStatus("Gerando DOCX...");
    try {
      const response = await fetch("/api/publisher/docx", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ artifact }) });
      if (!response.ok) {
        const error = await response.json().catch(() => null);
        return setDocxStatus(error?.detail || error?.error || "Falha ao gerar DOCX.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${slugify(artifact.productTitle)}-editavel.docx`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
      setDocxStatus("DOCX gerado e baixado com sucesso.");
    } catch (error) {
      setDocxStatus(error instanceof Error ? `Erro ao gerar DOCX: ${error.message}` : "Erro ao gerar DOCX.");
    }
  }

  return <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]"><section className="space-y-6"><div className="rounded-3xl border border-[#C9A84C]/25 bg-[#120609] p-6"><p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Publisher IA MVP</p><h1 className="mt-3 text-3xl font-semibold">Crie a memória, o diagnóstico e o artefato editorial</h1><p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">Agora com limite maior de leitura, limpeza editorial, seções mais completas e blocos visuais reais em HTML.</p></div><div className="grid gap-4 md:grid-cols-2"><input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Nome do projeto" value={projectName} onChange={(e) => setProjectName(e.target.value)} /><input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Público alvo" value={audience} onChange={(e) => setAudience(e.target.value)} /><input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Objetivo" value={goal} onChange={(e) => setGoal(e.target.value)} /><input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Tom" value={tone} onChange={(e) => setTone(e.target.value)} /></div><div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5"><label className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Estilo visual</label><select className="mt-3 w-full rounded-2xl border border-[#C9A84C]/20 bg-black p-4 text-[#F5F0E8] outline-none" value={visualStyle} onChange={(e) => setVisualStyle(e.target.value)}>{visualStyles.map((style) => <option key={style} value={style}>{style}</option>)}</select></div><div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5"><p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Formatos finais</p><div className="mt-4 grid gap-3 sm:grid-cols-4">{availableFormats.map((format) => <label key={format} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#C9A84C]/20 bg-black/30 p-4"><input type="checkbox" checked={formats.includes(format)} onChange={() => toggleFormat(format)} /><span>{format}</span></label>)}</div></div><div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5"><p className="text-xs uppercase tracking-[0.3em] text-[#C9A84C]">Material bruto</p><input type="file" accept=".txt,.md,.pdf,.doc,.docx" className="mt-4 w-full rounded-2xl border border-dashed border-[#C9A84C]/30 bg-black/30 p-4" onChange={(e) => handleFile(e.target.files?.[0])} />{attachedFileName && <p className="mt-3 text-sm text-[#F5F0E8]/70">Arquivo anexado: {attachedFileName}</p>}{sectionCount > 0 && <p className="mt-2 text-sm text-[#C9A84C]">{sectionCount} seções detectadas no manuscrito.</p>}<div className="mt-4 flex flex-wrap gap-3"><button onClick={cleanManuscript} disabled={!sourceSummary || sourceSummary === "Processando arquivo..."} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8] disabled:opacity-40">Limpar Manuscrito</button>{cleanStatus && <span className="self-center text-sm text-[#C9A84C]">{cleanStatus}</span>}</div><textarea className="mt-4 min-h-40 w-full rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Resumo do material, ideia ou manuscrito" value={sourceSummary} onChange={(e) => setSourceSummary(e.target.value)} /></div><div className="flex flex-wrap gap-3"><button onClick={createMemory} className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Criar Memória</button><button onClick={createDiagnosis} disabled={!memory} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8] disabled:opacity-40">Gerar Diagnóstico</button><button onClick={approveToArtifact} disabled={!memory || !diagnosis} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8] disabled:opacity-40">Aprovar para Artefato</button></div>{memory && <Panel title="Memória do Projeto"><pre className="overflow-auto rounded-2xl bg-black/50 p-5 text-sm leading-7 text-[#F5F0E8]/80">{JSON.stringify(memory, null, 2)}</pre></Panel>}{diagnosis && <Panel title="Diagnóstico Editorial"><div className="space-y-4 text-sm leading-7 text-[#F5F0E8]/75"><p><strong>Promessa:</strong> {diagnosis.promise}</p><p><strong>Formato recomendado:</strong> {diagnosis.recommendedFormat}</p><List title="Pontos fortes" items={diagnosis.strengths} /><List title="Lacunas" items={diagnosis.gaps} /><List title="Necessidades visuais" items={diagnosis.visualNeeds} /></div></Panel>}{artifact && <Panel title="Artefato Editorial"><div className="grid gap-5 md:grid-cols-2"><Card title="Estrutura" items={artifact.editorialStructure} /><Card title="Didática visual" items={artifact.didacticAssets} /><Card title="Plano de exportação" items={artifact.exportPlan} wide /></div><div className="mt-5 flex flex-wrap gap-3"><button onClick={downloadHtml} className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Gerar HTML</button><button onClick={downloadDocx} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8]">Gerar DOCX</button></div>{htmlStatus && <p className="mt-4 text-sm text-[#C9A84C]">{htmlStatus}</p>}{docxStatus && <p className="mt-2 text-sm text-[#C9A84C]">{docxStatus}</p>}</Panel>}</section><aside className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6"><p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cofre Editorial</p><h2 className="mt-3 text-xl font-semibold">Itens definitivos</h2><div className="mt-5 space-y-3 rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-4 text-sm text-[#F5F0E8]/70"><p>Limpeza: {cleanStatus ? "aplicada" : "aguardando"}</p><p>Memória: {memory ? "criada" : "aguardando"}</p><p>Diagnóstico: {diagnosis ? "criado" : "aguardando"}</p><p>Artefato: {artifact ? "aprovado" : "aguardando"}</p><p>Seções: {sectionCount || "aguardando"}</p><p>HTML: {htmlStatus ? "gerado" : "aguardando"}</p><p>DOCX: {docxStatus ? "gerado" : "aguardando"}</p></div></aside></div></main>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6"><h2 className="text-2xl font-semibold text-[#C9A84C]">{title}</h2><div className="mt-5">{children}</div></div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <div><strong>{title}:</strong><ul className="mt-2 list-disc space-y-1 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function Card({ title, items, wide }: { title: string; items: string[]; wide?: boolean }) {
  return <div className={`rounded-2xl bg-black/35 p-5 ${wide ? "md:col-span-2" : ""}`}><h3 className="font-semibold">{title}</h3><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

export default PublisherMvpEnhanced;
