'use client';

import { useState } from 'react';

export function ArtifactPlannerMvp() {
  const [form, setForm] = useState({
    title: '',
    themeId: 'luxury_editorial',
    estimatedWords: '12000',
    chapterCount: '5',
    hasExercises: true,
    hasDiagrams: true,
    hasBonuses: false
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function generateArtifact() {
    setLoading(true);
    const response = await fetch('/api/publisher/artifact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-[#C9A84C]/25 bg-[#120609] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Artefato Editorial</p>
          <h1 className="mt-3 text-3xl font-semibold">Planejador de paginas e tema</h1>
          <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
            Gere um plano paginado com tema, capitulos, exercicios, diagramas e paginas numeradas.
          </p>
        </section>

        <section className="grid gap-4 rounded-3xl border border-[#C9A84C]/20 bg-[#1C1214] p-6 md:grid-cols-2">
          <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Titulo do produto" value={form.title} onChange={(e) => update('title', e.target.value)} />
          <select className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" value={form.themeId} onChange={(e) => update('themeId', e.target.value)}>
            <option value="luxury_editorial">Luxury Editorial</option>
            <option value="clean_minimal">Clean Minimal</option>
            <option value="playful_kids">Ludico Infantil</option>
            <option value="premium_feminine">Feminino Premium</option>
            <option value="executive_masculine">Executivo Masculino</option>
            <option value="spiritual_soft">Espiritual Suave</option>
            <option value="clinical_modern">Clinico Moderno</option>
          </select>
          <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Palavras estimadas" value={form.estimatedWords} onChange={(e) => update('estimatedWords', e.target.value)} />
          <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Numero de capitulos" value={form.chapterCount} onChange={(e) => update('chapterCount', e.target.value)} />
          <label className="rounded-2xl border border-[#C9A84C]/20 bg-black/30 p-4"><input type="checkbox" checked={form.hasExercises} onChange={(e) => update('hasExercises', e.target.checked)} /> Exercicios</label>
          <label className="rounded-2xl border border-[#C9A84C]/20 bg-black/30 p-4"><input type="checkbox" checked={form.hasDiagrams} onChange={(e) => update('hasDiagrams', e.target.checked)} /> Diagramas e ideogramas</label>
          <label className="rounded-2xl border border-[#C9A84C]/20 bg-black/30 p-4"><input type="checkbox" checked={form.hasBonuses} onChange={(e) => update('hasBonuses', e.target.checked)} /> Bonus</label>
          <button onClick={generateArtifact} className="rounded-2xl bg-[#C9A84C] p-4 font-semibold text-black">Gerar Artefato Editorial</button>
        </section>

        {loading && <p className="text-[#C9A84C]">Gerando plano...</p>}

        {result && (
          <section className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
            <h2 className="text-2xl font-semibold text-[#C9A84C]">Plano gerado</h2>
            <p className="mt-3">Total de paginas: {result.summary.totalPages}</p>
            <p className="mt-1 text-sm text-[#F5F0E8]/70">Tema: {result.summary.themeId}</p>

            <div className="mt-6 grid gap-3">
              {result.artifact.pages.map((page: any) => (
                <div key={page.pageNumber} className="rounded-2xl border border-[#C9A84C]/15 bg-black/25 p-4">
                  <p className="text-sm text-[#C9A84C]">Pagina {page.pageNumber} · {page.kind}</p>
                  <h3 className="mt-1 font-semibold">{page.title}</h3>
                  <p className="mt-2 text-sm text-[#F5F0E8]/65">{page.purpose}</p>
                  {page.visualAsset && <p className="mt-2 text-xs text-[#F5F0E8]/50">Visual: {page.visualAsset}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
