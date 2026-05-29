'use client';

import { useState } from 'react';

type ManifestItem = {
  format: string;
  fileName: string;
  status: string;
  source: string;
  notes: string;
};

export function ExportManifestMvp() {
  const [title, setTitle] = useState('Meu Ebook Premium');
  const [themeId, setThemeId] = useState('luxury_editorial');
  const [manifest, setManifest] = useState<ManifestItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function generateManifest() {
    setLoading(true);

    const artifactResponse = await fetch('/api/publisher/artifact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        projectId: 'export-preview',
        themeId,
        estimatedWords: 12000,
        chapterCount: 5,
        hasExercises: true,
        hasDiagrams: true,
        hasBonuses: true
      })
    });

    const artifactData = await artifactResponse.json();

    const manifestResponse = await fetch('/api/publisher/export-manifest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artifact: artifactData.artifact })
    });

    const manifestData = await manifestResponse.json();
    setManifest(manifestData.manifest || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-[#C9A84C]/25 bg-[#120609] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Pacote Final</p>
          <h1 className="mt-3 text-3xl font-semibold">Manifesto de Exportacao</h1>
          <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
            Veja quais arquivos finais o Publisher vai preparar para o produto premium.
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
          <button onClick={generateManifest} className="rounded-2xl bg-[#C9A84C] p-4 font-semibold text-black">Gerar Manifesto</button>
        </section>

        {loading && <p className="text-[#C9A84C]">Montando manifesto...</p>}

        {manifest.length > 0 && (
          <section className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
            <h2 className="text-2xl font-semibold text-[#C9A84C]">Arquivos planejados</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {manifest.map((item) => (
                <article key={item.fileName} className="rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C]">{item.format}</p>
                  <h3 className="mt-2 font-semibold">{item.fileName}</h3>
                  <p className="mt-2 text-sm text-[#F5F0E8]/65">{item.notes}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-[#C9A84C]/25 px-3 py-1 text-[#C9A84C]">{item.status}</span>
                    <span className="rounded-full border border-[#C9A84C]/25 px-3 py-1 text-[#F5F0E8]/60">{item.source}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
