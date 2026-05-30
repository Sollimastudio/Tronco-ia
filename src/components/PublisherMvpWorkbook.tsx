"use client";

import { useMemo, useState } from "react";

type Section = { title: string; body: string; kind: "module" | "chapter" | "content" };
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

function repairText(value: string) {
  const replacements: Array<[RegExp, string]> = [
    [/MANUAL DEAUTOCIRURGIA/gi, "MANUAL DE AUTOCIRURGIA"],
    [/MANUAL DE AUTOCIRURGIAManual/gi, "MANUAL DE AUTOCIRURGIA\n\nManual"],
    [/=Valor ZeroA Ferida/gi, "= Valor Zero\n\nA Ferida"],
    [/A FeridaO Governo/gi, "A Ferida\n\nO Governo"],
    [/O GovernoO/gi, "O Governo\n\nO"],
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
    [/sentevista/gi, "sente vista"],
    [/externamuda/gi, "externa muda"],
    [/manualvai/gi, "manual vai"],
    [/od[ií]agnóstico/gi, "o diagnóstico"],
    [/atrav[eé]s derepetição/gi, "através de repetição"],
    [/quandoest[aá]/gi, "quando está"],
    [/Acriança/gi, "A criança"],
    [/Amenina/gi, "A menina"],
    [/aprendeuengolir/gi, "aprendeu a engolir"],
    [/trêspessoas/gi, "três pessoas"],
    [/desprendidaassim/gi, "desprendida assim"],
    [/banalem/gi, "banal em"],
    [/emalguns/gi, "em alguns"],
    [/realou/gi, "real ou"],
    [/acrença/gi, "a crença"],
    [/serdecida/gi, "ser decidida"],
    [/pressãoelimina/gi, "pressão elimina"],
    [/resignaçãoitmo/gi, "resignação. O ritmo"],
    [/amadurecemdepois/gi, "amadurecem depois"],
    [/dinheiroecem/gi, "amadurecem"],
    [/Energiadepedinte/gi, "Energia de pedinte"],
    [/abandono desi/gi, "abandono de si"],
    [/\beuem\b/gi, "quem"],
    [/([.!?])([A-ZÁÉÍÓÚÃÕÇ])/g, "$1\n\n$2"],
    [/([a-záéíóúãõç])([A-ZÁÉÍÓÚÃÕÇ][a-záéíóúãõç]{2,})/g, "$1 $2"]
  ];

  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), value);
}

function cleanManuscript(value: string) {
  return repairText(String(value || ""))
    .replace(/\r/g, "")
    .replace(/Versão convertida para texto OCR para leitura pelo Manus/gi, "")
    .replace(/Observação:[\s\S]*?publicar\./gi, "")
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

function wordCount(value: string) {
  return value.match(/[A-Za-zÀ-ÿ]{3,}/g)?.length || 0;
}

function isWeakOrTrash(value: string) {
  const weird = value.match(/[=<>_#@~^§¢£¬ªº]|RRRN|ffRR|CRET|rdDER|LEO ERR/gi)?.length || 0;
  return wordCount(value) < 45 || (value.length < 500 && weird > 1);
}

function normalizeTitle(value: string, fallback: string) {
  const cleaned = cleanManuscript(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .find((line) => /^(MÓDULO|Capítulo|Manual|Antídoto|A Ferida|O Governo)/i.test(line)) || fallback;

  return cleaned
    .replace(/\s+/g, " ")
    .replace(/=Valor ZeroA Ferida/gi, "= Valor Zero")
    .slice(0, 92);
}

function splitSections(source: string): Section[] {
  const cleaned = cleanManuscript(source);
  if (!cleaned) return [];

  const noTrashPages = cleaned
    .split(/\n\s*Página\s+\d+\s*\n/gi)
    .map((chunk) => cleanManuscript(chunk))
    .filter((chunk) => chunk.length > 60)
    .join("\n\n");

  const text = noTrashPages || cleaned;
  const marker = /(^|\n)(MÓDULO\s*(?:I{1,4}|V|\d+|!)?.*|Capítulo\s*[-—]?\s*\d+\s*[-—].*)/gi;
  const matches = [...text.matchAll(marker)];
  const sections: Section[] = [];

  if (matches.length) {
    const intro = cleanManuscript(text.slice(0, matches[0].index || 0));
    if (wordCount(intro) > 80) sections.push({ title: normalizeTitle(intro, "Abertura"), body: intro, kind: "content" });

    matches.forEach((match, index) => {
      const start = match.index || 0;
      const end = matches[index + 1]?.index ?? text.length;
      const chunk = cleanManuscript(text.slice(start, end));
      if (!chunk || isWeakOrTrash(chunk)) return;
      const title = normalizeTitle(chunk, `Seção ${sections.length + 1}`);
      sections.push({
        title,
        body: chunk,
        kind: /^MÓDULO/i.test(title) ? "module" : "chapter"
      });
    });
  }

  if (!sections.length) {
    const parts = text.split(/\n{2,}/).filter((p) => wordCount(p) > 12);
    let current = "";
    parts.forEach((part) => {
      if ((current + "\n\n" + part).length > 2200 && current) {
        if (!isWeakOrTrash(current)) sections.push({ title: normalizeTitle(current, `Seção ${sections.length + 1}`), body: current, kind: "content" });
        current = part;
      } else {
        current = current ? `${current}\n\n${part}` : part;
      }
    });
    if (current && !isWeakOrTrash(current)) sections.push({ title: normalizeTitle(current, `Seção ${sections.length + 1}`), body: current, kind: "content" });
  }

  return mergeWeakSections(sections);
}

function mergeWeakSections(sections: Section[]) {
  const merged: Section[] = [];
  for (const section of sections) {
    if (wordCount(section.body) < 90 && merged.length) {
      const previous = merged[merged.length - 1];
      previous.body = `${previous.body}\n\n${section.body}`;
      continue;
    }
    merged.push({ ...section });
  }
  return merged.filter((section) => wordCount(section.body) >= 60);
}

function paragraphs(value: string) {
  return cleanManuscript(value)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => wordCount(p) > 2)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("\n");
}

function isWorkbook(style: string) {
  return /workbook|m[eé]todo|exerc/i.test(style);
}

function themeCss(style: string) {
  if (isWorkbook(style)) {
    return `--bg:#F3EADC;--page:#FFFDF8;--page2:#F8F1E8;--ink:#221A14;--muted:#66584D;--accent:#8A5A22;--line:rgba(138,90,34,.28);--soft:rgba(138,90,34,.09);`;
  }
  return `--bg:#0A0A0A;--page:#120609;--page2:#1C1214;--ink:#F5F0E8;--muted:rgba(245,240,232,.72);--accent:#C9A84C;--line:rgba(201,168,76,.25);--soft:rgba(201,168,76,.08);`;
}

function workbookBlock(section: Section, index: number) {
  const title = escapeHtml(section.title);
  return `<div class="workbook-grid">
    <div class="exercise"><strong>Observe</strong><p>Qual padrão este capítulo revela?</p><textarea placeholder="Escreva sua percepção aqui..."></textarea></div>
    <div class="exercise"><strong>Reescreva</strong><p>Que crença ou comportamento precisa ser reposicionado?</p><textarea placeholder="Reescreva com consciência..."></textarea></div>
    <div class="exercise wide"><strong>Aplique</strong><label><input type="checkbox" /> Identifiquei o padrão</label><label><input type="checkbox" /> Nomeei a ferida sem romantizar</label><label><input type="checkbox" /> Escolhi uma ação concreta</label></div>
    <div class="diagram wide"><div class="diagram-title">Mapa didático ${index + 1}</div><div class="map-core">${title}</div><div class="map-row"><span>Ferida</span><span>Padrão</span><span>Escolha</span><span>Governo</span></div></div>
  </div>`;
}

function premiumBlock(section: Section, index: number) {
  const title = escapeHtml(section.title);
  if (index % 3 === 0) return `<div class="diagram"><div class="diagram-title">Mapa mental</div><div class="map-core">${title}</div><div class="map-row"><span>Ferida</span><span>Padrão</span><span>Escolha</span><span>Governo</span></div></div>`;
  if (index % 3 === 1) return `<div class="flow"><div><b>1</b><span>Perceber</span></div><div><b>2</b><span>Nomear</span></div><div><b>3</b><span>Interromper</span></div><div><b>4</b><span>Reposicionar</span></div></div>`;
  return `<div class="compare"><div><strong>Antes</strong><p>Reação automática, defesa e ruído.</p></div><div><strong>Depois</strong><p>Presença, escolha consciente e direção.</p></div></div>`;
}

function buildHtml(artifact: Artifact) {
  const sections = splitSections(artifact.sourceSummary);
  const workbook = isWorkbook(artifact.visualStyle);
  const cssVars = themeCss(artifact.visualStyle);
  const nav = sections.map((s, i) => `<a href="#sec-${i + 1}">${i + 1}. ${escapeHtml(s.title)}</a>`).join("");
  const pages = sections.map((s, i) => `<section class="page ${s.kind}" id="sec-${i + 1}">
      <div class="page-top"><span>${s.kind === "module" ? "Módulo" : s.kind === "chapter" ? "Capítulo" : "Seção"} ${i + 1}</span><a href="#top">Sumário</a></div>
      <h2>${escapeHtml(s.title)}</h2>
      ${paragraphs(s.body)}
      ${workbook ? workbookBlock(s, i) : premiumBlock(s, i)}
      <div class="pager"><a href="#sec-${Math.max(1, i)}">Anterior</a><a href="#sec-${Math.min(sections.length, i + 2)}">Próximo</a></div>
    </section>`).join("\n");

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${escapeHtml(artifact.productTitle)}</title><style>
    :root{${cssVars}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,Arial,sans-serif}.shell{max-width:1120px;margin:0 auto;padding:28px}.hero{min-height:76vh;display:grid;align-items:center;border:1px solid var(--line);border-radius:34px;padding:42px;background:linear-gradient(135deg,var(--page),var(--page2));box-shadow:0 30px 90px rgba(0,0,0,.22)}.kicker,.page-top span,.diagram-title{color:var(--accent);text-transform:uppercase;letter-spacing:.24em;font-size:12px}h1,h2{font-family:Georgia,'Times New Roman',serif;line-height:1.05;margin:0}h1{font-size:clamp(42px,8vw,88px)}h2{font-size:clamp(30px,5vw,56px)}p{font-size:18px;line-height:1.75;color:var(--muted)}.meta{display:grid;gap:8px;margin-top:22px;color:var(--muted)}.nav{position:sticky;top:0;z-index:9;display:flex;gap:10px;overflow-x:auto;padding:14px 0;background:var(--bg)}.nav a,.pager a,.page-top a{color:var(--ink);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:10px 12px;background:var(--soft)}.page{min-height:92vh;margin:28px 0;padding:36px;border-radius:30px;border:1px solid var(--line);background:linear-gradient(135deg,var(--page),var(--page2))}.page-top{display:flex;justify-content:space-between;gap:16px;margin-bottom:18px}.workbook-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px}.exercise,.diagram,.flow,.compare{border:1px solid var(--line);border-radius:24px;background:var(--soft);padding:22px}.exercise strong{color:var(--accent);text-transform:uppercase;letter-spacing:.16em;font-size:12px}.exercise textarea{width:100%;min-height:120px;margin-top:10px;border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.48);padding:14px;color:var(--ink)}.exercise label{display:block;margin-top:12px;color:var(--muted)}.wide{grid-column:1/-1}.map-core{margin:18px auto;padding:20px;border:1px solid var(--accent);border-radius:999px;max-width:520px;text-align:center;color:var(--accent);font-weight:700}.map-row,.flow,.compare{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.map-row span,.flow div,.compare div{border:1px solid var(--line);border-radius:18px;padding:18px;text-align:center}.flow b{display:block;color:var(--accent);font-size:34px}.flow span{display:block;margin-top:6px}.compare{grid-template-columns:1fr 1fr;margin-top:28px}.pager{display:flex;justify-content:space-between;margin-top:28px}.notice{margin-top:24px;border:1px solid var(--line);border-radius:18px;background:var(--soft);padding:16px;color:var(--muted)}@media(max-width:720px){.shell{padding:14px}.hero,.page{padding:24px;border-radius:24px}p{font-size:16px}.workbook-grid,.map-row,.flow,.compare{grid-template-columns:1fr}.page-top{align-items:flex-start;flex-direction:column}}
  </style></head><body><main class="shell" id="top"><section class="hero"><div><p class="kicker">${workbook ? "Workbook interativo" : "WebBook editorial"} · ${escapeHtml(artifact.visualStyle)}</p><h1>${escapeHtml(artifact.productTitle)}</h1><p>${escapeHtml(artifact.promise)}</p><div class="meta"><span>Público: ${escapeHtml(artifact.audience || "não definido")}</span><span>Tom: ${escapeHtml(artifact.tone || "sofisticado, claro e útil")}</span><span>Seções renderizadas: ${sections.length}</span></div><div class="notice">HTML com sumário clicável, exercícios e blocos didáticos. Ainda revise o texto original se ele vier de OCR quebrado.</div></div></section><nav class="nav">${nav}</nav>${pages}</main></body></html>`;
}

export function PublisherMvpWorkbook() {
  const [projectName, setProjectName] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [tone, setTone] = useState("");
  const [visualStyle, setVisualStyle] = useState("Método/Workbook — didático, organizado, com exercícios");
  const [formats, setFormats] = useState<string[]>(["HTML", "PDF", "DOCX", "ZIP"]);
  const [sourceSummary, setSourceSummary] = useState("");
  const [attachedFileName, setAttachedFileName] = useState("");
  const [memory, setMemory] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [htmlStatus, setHtmlStatus] = useState("");
  const [docxStatus, setDocxStatus] = useState("");
  const [cleanStatus, setCleanStatus] = useState("");
  const sectionCount = useMemo(() => splitSections(sourceSummary).length, [sourceSummary]);

  async function handleFile(file?: File) {
    if (!file) return;
    setAttachedFileName(file.name);
    setSourceSummary("Processando arquivo...");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/publisher/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) return setSourceSummary(data.error || "Falha ao processar arquivo.");
      setSourceSummary(data.text || "Não foi possível extrair conteúdo.");
      setCleanStatus(data.truncated ? `Atenção: arquivo grande, carregados ${data.returnedLength} de ${data.originalLength} caracteres.` : "Arquivo carregado sem corte técnico.");
    } catch (error) {
      setSourceSummary(error instanceof Error ? error.message : "Erro ao processar arquivo.");
    }
  }

  function toggleFormat(format: string) {
    setFormats((current) => current.includes(format) ? current.filter((item) => item !== format) : [...current, format]);
  }

  function applyCleaning() {
    const before = sourceSummary.length;
    const cleaned = cleanManuscript(sourceSummary);
    setSourceSummary(cleaned);
    setMemory(null); setDiagnosis(null); setArtifact(null); setHtmlStatus(""); setDocxStatus("");
    setCleanStatus(`Limpeza aplicada: ${before.toLocaleString("pt-BR")} caracteres tratados; ${splitSections(cleaned).length} seções úteis detectadas.`);
  }

  function createMemory() {
    const created = { projectName, audience, goal, tone, visualStyle, finalFormats: formats, sourceSummary, attachedFileName, sections: sectionCount };
    setMemory(created); setDiagnosis(null); setArtifact(null); setHtmlStatus(""); setDocxStatus("");
  }

  function createDiagnosis() {
    const created = {
      promise: goal ? `Transformar "${projectName || "este projeto"}" em um produto editorial premium para ${audience || "o público definido"}, com foco em ${goal}.` : "A promessa central ainda precisa ser refinada.",
      recommendedFormat: formats.join(" + "),
      strengths: ["Arquivo lido.", "Limpeza aplicada.", `${sectionCount} seções úteis detectadas.`, isWorkbook(visualStyle) ? "Tema Workbook ativado." : "Tema editorial ativado."],
      gaps: ["Ainda falta reescrita autoral por IA.", "Ainda falta PDF premium.", "Ilustrações artísticas ainda não são geradas, apenas diagramas HTML."],
      visualNeeds: ["Sumário clicável", "Exercícios", "Checklists", "Mapa didático", "Blocos de reflexão"]
    };
    setDiagnosis(created); setArtifact(null); setHtmlStatus(""); setDocxStatus("");
  }

  function approveToArtifact() {
    if (!memory || !diagnosis) return;
    setArtifact({
      productTitle: projectName || "Produto Editorial Sem Título",
      promise: diagnosis.promise,
      audience,
      tone: tone || "didático, claro e aplicável",
      visualStyle,
      finalFormats: formats,
      sourceSummary,
      editorialStructure: ["Capa", "Sumário", "Módulos", "Exercícios", "Checklist", "Encerramento"],
      didacticAssets: diagnosis.visualNeeds,
      exportPlan: ["HTML workbook", "DOCX editável", "PDF premium", "ZIP final"]
    });
  }

  function downloadHtml() {
    if (!artifact) return;
    const html = buildHtml(artifact);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(artifact.productTitle)}-workbook.html`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    setHtmlStatus("HTML workbook gerado com sumário clicável, exercícios e blocos didáticos.");
  }

  async function downloadDocx() {
    if (!artifact) return;
    setDocxStatus("Gerando DOCX...");
    try {
      const response = await fetch("/api/publisher/docx", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ artifact }) });
      if (!response.ok) return setDocxStatus("Falha ao gerar DOCX.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(artifact.productTitle)}-editavel.docx`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setDocxStatus("DOCX gerado e baixado com sucesso.");
    } catch {
      setDocxStatus("Erro ao gerar DOCX.");
    }
  }

  return <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]"><section className="space-y-6"><div className="rounded-3xl border border-[#C9A84C]/25 bg-[#120609] p-6"><p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Publisher IA Workbook</p><h1 className="mt-3 text-3xl font-semibold">Crie um workbook editorial com exercícios</h1><p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">Agora o tema Método/Workbook muda o HTML de verdade: fundo claro, sumário clicável, exercícios e blocos didáticos.</p></div><div className="grid gap-4 md:grid-cols-2"><input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Nome do projeto" value={projectName} onChange={(e) => setProjectName(e.target.value)} /><input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Público alvo" value={audience} onChange={(e) => setAudience(e.target.value)} /><input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Objetivo" value={goal} onChange={(e) => setGoal(e.target.value)} /><input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Tom" value={tone} onChange={(e) => setTone(e.target.value)} /></div><Panel title="Estilo visual"><select className="w-full rounded-2xl border border-[#C9A84C]/20 bg-black p-4 text-[#F5F0E8] outline-none" value={visualStyle} onChange={(e) => setVisualStyle(e.target.value)}>{visualStyles.map((style) => <option key={style} value={style}>{style}</option>)}</select></Panel><Panel title="Formatos finais"><div className="grid gap-3 sm:grid-cols-4">{availableFormats.map((format) => <label key={format} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#C9A84C]/20 bg-black/30 p-4"><input type="checkbox" checked={formats.includes(format)} onChange={() => toggleFormat(format)} /><span>{format}</span></label>)}</div></Panel><Panel title="Material bruto"><input type="file" accept=".txt,.md,.pdf,.doc,.docx" className="w-full rounded-2xl border border-dashed border-[#C9A84C]/30 bg-black/30 p-4" onChange={(e) => handleFile(e.target.files?.[0])} />{attachedFileName && <p className="mt-3 text-sm text-[#F5F0E8]/70">Arquivo anexado: {attachedFileName}</p>}{sectionCount > 0 && <p className="mt-2 text-sm text-[#C9A84C]">{sectionCount} seções úteis detectadas.</p>}<div className="mt-4 flex flex-wrap gap-3"><button onClick={applyCleaning} disabled={!sourceSummary || sourceSummary === "Processando arquivo..."} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm disabled:opacity-40">Limpar Manuscrito</button>{cleanStatus && <span className="self-center text-sm text-[#C9A84C]">{cleanStatus}</span>}</div><textarea className="mt-4 min-h-40 w-full rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" value={sourceSummary} onChange={(e) => setSourceSummary(e.target.value)} placeholder="Texto extraído do manuscrito" /></Panel><div className="flex flex-wrap gap-3"><button onClick={createMemory} className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Criar Memória</button><button onClick={createDiagnosis} disabled={!memory} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm disabled:opacity-40">Gerar Diagnóstico</button><button onClick={approveToArtifact} disabled={!memory || !diagnosis} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm disabled:opacity-40">Aprovar para Artefato</button></div>{memory && <Panel title="Memória"><pre className="overflow-auto rounded-2xl bg-black/50 p-5 text-sm leading-7 text-[#F5F0E8]/80">{JSON.stringify(memory, null, 2)}</pre></Panel>}{diagnosis && <Panel title="Diagnóstico"><List title="Pontos fortes" items={diagnosis.strengths} /><List title="Lacunas" items={diagnosis.gaps} /><List title="Necessidades visuais" items={diagnosis.visualNeeds} /></Panel>}{artifact && <Panel title="Artefato Editorial"><div className="grid gap-5 md:grid-cols-2"><Card title="Estrutura" items={artifact.editorialStructure} /><Card title="Didática visual" items={artifact.didacticAssets} /><Card title="Plano" items={artifact.exportPlan} wide /></div><div className="mt-5 flex flex-wrap gap-3"><button onClick={downloadHtml} className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Gerar HTML</button><button onClick={downloadDocx} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm">Gerar DOCX</button></div>{htmlStatus && <p className="mt-4 text-sm text-[#C9A84C]">{htmlStatus}</p>}{docxStatus && <p className="mt-2 text-sm text-[#C9A84C]">{docxStatus}</p>}</Panel>}</section><aside className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6"><p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cofre Editorial</p><h2 className="mt-3 text-xl font-semibold">Status</h2><div className="mt-5 space-y-3 rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-4 text-sm text-[#F5F0E8]/70"><p>Limpeza: {cleanStatus ? "aplicada" : "aguardando"}</p><p>Memória: {memory ? "criada" : "aguardando"}</p><p>Diagnóstico: {diagnosis ? "criado" : "aguardando"}</p><p>Artefato: {artifact ? "aprovado" : "aguardando"}</p><p>Seções: {sectionCount || "aguardando"}</p><p>HTML: {htmlStatus ? "gerado" : "aguardando"}</p><p>DOCX: {docxStatus ? "gerado" : "aguardando"}</p></div></aside></div></main>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-5"><p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#C9A84C]">{title}</p>{children}</div>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <div className="mb-4"><strong>{title}:</strong><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/75">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

function Card({ title, items, wide }: { title: string; items: string[]; wide?: boolean }) {
  return <div className={`rounded-2xl bg-black/35 p-5 ${wide ? "md:col-span-2" : ""}`}><h3 className="font-semibold">{title}</h3><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}

export default PublisherMvpWorkbook;
