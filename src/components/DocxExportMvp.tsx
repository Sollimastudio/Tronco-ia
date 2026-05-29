'use client';

import { useState } from 'react';

export function DocxExportMvp() {
  const [title, setTitle] = useState('Meu Ebook Premium');
  const [themeId, setThemeId] = useState('luxury_editorial');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  async function downloadDocx() {
    setLoading(true);
    setStatus('Criando artefato editorial...');

    const artifactResponse = await fetch('/api/publisher/artifact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        projectId: 'docx-preview',
        themeId,
        estimatedWords: 6000,
        chapterCount: 3,
        hasExercises: true,
        hasDiagrams: true,
        hasBonuses: false
      })
    });

    const artifactData = await artifactResponse.json();

    setStatus('Gerando DOCX editavel...');

    const docxResponse = await fetch('/api/publisher/docx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifact: artifactData.artifact })
    });

    if (!docxResponse.ok) {
      setStatus('Erro ao gerar DOCX. Verifique o servidor.');
      setLoading(false);
      return;
    }

    const blob = await docxResponse.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'publisher'}-editavel.docx`;
    link.click();
    URL.revokeObjectURL(url);

    setStatus('DOCX gerado com sucesso.');
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-[#C9A84C]/25 bg-[#120609] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">DOCX Editavel</p>
          <h1 className="mt-3 text-3xl font-semibold">Exportador DOCX do Publisher</h1>
          <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
            Gere um DOCX editavel a partir de um Artefato Editorial planejado.
          </p>
        </section>

        <section className="grid gap-4 rounded-3xl border border-[#C9A84C]/20 bg-[#1C1214] p-6 md:grid-cols-3">
          <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" value={title} onChange={(event) => setTitle(event.target.value)} />
          <select className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" value={themeId} onChange={(event) => setThemeId(event.target.value)}>
            <option value="luxury_editorial">Luxury Editorial</option>
            <option value="clean_minimal">Clean Minimal</option>
            <option value="playful_kids">Ludico Infantil</option>
            <option value="premium_feminine">Feminino Premium</option>
            <option value="executive_masculine">Executivo Masculino</option>
            <option value="spiritual_soft">Espiritual Suave</option>
            <option value="clinical_modern">Clinico Moderno</option>
          </select>
          <button onClick={downloadDocx} disabled={loading} className="rounded-2xl bg-[#C9A84C] p-4 font-semibold text-black disabled:opacity-50">
            {loading ? 'Gerando...' : 'Baixar DOCX'}
          </button>
        </section>

        {status && (
          <section className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6 text-sm text-[#F5F0E8]/75">
            {status}
          </section>
        )}
      </div>
    </main>
  );
}
