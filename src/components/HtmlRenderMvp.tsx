'use client';

import { useState } from 'react';

export function HtmlRenderMvp() {
  const [title, setTitle] = useState('Meu Ebook Premium');
  const [themeId, setThemeId] = useState('luxury_editorial');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateHtml() {
    setLoading(true);

    const artifactResponse = await fetch('/api/publisher/artifact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        projectId: 'preview',
        themeId,
        estimatedWords: 6000,
        chapterCount: 3,
        hasExercises: true,
        hasDiagrams: true,
        hasBonuses: false
      })
    });

    const artifactData = await artifactResponse.json();

    const renderResponse = await fetch('/api/publisher/render-html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifact: artifactData.artifact })
    });

    const renderData = await renderResponse.json();
    setHtml(renderData.html || '');
    setLoading(false);
  }

  function downloadHtml() {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'publisher-webbook-preview.html';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-[#C9A84C]/25 bg-[#120609] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">HTML/WebBook</p>
          <h1 className="mt-3 text-3xl font-semibold">Renderizador do Artefato Editorial</h1>
          <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
            Gere um WebBook HTML a partir de um artefato editorial planejado.
          </p>
        </section>

        <section className="grid gap-4 rounded-3xl border border-[#C9A84C]/20 bg-[#1C1214] p-6 md:grid-cols-3">
          <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" value={themeId} onChange={(e) => setThemeId(e.target.value)}>
            <option value="luxury_editorial">Luxury Editorial</option>
            <option value="clean_minimal">Clean Minimal</option>
            <option value="playful_kids">Ludico Infantil</option>
            <option value="premium_feminine">Feminino Premium</option>
            <option value="executive_masculine">Executivo Masculino</option>
            <option value="spiritual_soft">Espiritual Suave</option>
            <option value="clinical_modern">Clinico Moderno</option>
          </select>
          <button onClick={generateHtml} className="rounded-2xl bg-[#C9A84C] p-4 font-semibold text-black">Gerar HTML</button>
        </section>

        {loading && <p className="text-[#C9A84C]">Renderizando...</p>}

        {html && (
          <section className="space-y-4 rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-[#C9A84C]">WebBook gerado</h2>
              <button onClick={downloadHtml} className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Baixar HTML</button>
            </div>
            <iframe className="h-[720px] w-full rounded-2xl border border-[#C9A84C]/20 bg-white" srcDoc={html} />
          </section>
        )}
      </div>
    </main>
  );
}
