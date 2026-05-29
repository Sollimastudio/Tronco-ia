'use client';

import { useState } from 'react';

type Memory = Record<string, string> | null;
type Diagnosis = {
  title: string;
  theme: string;
  audience: string;
  promise: string;
  strengths: string[];
  gaps: string[];
  recommendedFormat: string;
  nextStep: string;
} | null;

export function PublisherMvp() {
  const [form, setForm] = useState({
    projectName: '',
    audience: '',
    goal: '',
    tone: '',
    visualStyle: '',
    finalFormats: 'HTML PDF DOCX ZIP',
    sourceSummary: ''
  });
  const [memory, setMemory] = useState<Memory>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis>(null);
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function createMemory() {
    setLoading(true);
    const response = await fetch('/api/publisher/memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setMemory(data.memory);
    setLoading(false);
  }

  async function createDiagnosis() {
    setLoading(true);
    const response = await fetch('/api/publisher/diagnosis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memory })
    });
    const data = await response.json();
    setDiagnosis(data.diagnosis);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-[#C9A84C]/25 bg-[#120609] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Publisher IA MVP</p>
            <h1 className="mt-3 text-3xl font-semibold">Crie a memoria e o diagnostico inicial</h1>
            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
              Esta tela testa o fluxo minimo: entrevista, memoria do projeto e diagnostico inicial.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Nome do projeto" value={form.projectName} onChange={(e) => updateField('projectName', e.target.value)} />
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Publico alvo" value={form.audience} onChange={(e) => updateField('audience', e.target.value)} />
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Objetivo" value={form.goal} onChange={(e) => updateField('goal', e.target.value)} />
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Tom" value={form.tone} onChange={(e) => updateField('tone', e.target.value)} />
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Estilo visual" value={form.visualStyle} onChange={(e) => updateField('visualStyle', e.target.value)} />
            <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Formatos finais" value={form.finalFormats} onChange={(e) => updateField('finalFormats', e.target.value)} />
          </div>

          <textarea className="min-h-32 w-full rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Resumo do material, ideia ou manuscrito" value={form.sourceSummary} onChange={(e) => updateField('sourceSummary', e.target.value)} />

          <div className="flex flex-wrap gap-3">
            <button onClick={createMemory} className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Criar Memoria</button>
            <button onClick={createDiagnosis} disabled={!memory} className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8] disabled:opacity-40">Gerar Diagnostico</button>
          </div>

          {loading && <p className="text-sm text-[#C9A84C]">Processando...</p>}

          {memory && (
            <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#1C1214] p-6">
              <h2 className="text-xl font-semibold text-[#C9A84C]">Memoria do Projeto</h2>
              <pre className="mt-4 overflow-auto rounded-2xl bg-black/40 p-4 text-xs text-[#F5F0E8]/75">{JSON.stringify(memory, null, 2)}</pre>
            </div>
          )}

          {diagnosis && (
            <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#1C1214] p-6">
              <h2 className="text-xl font-semibold text-[#C9A84C]">{diagnosis.title}</h2>
              <p className="mt-3">Formato recomendado: {diagnosis.recommendedFormat}</p>
              <p className="mt-2 text-sm text-[#F5F0E8]/70">Proxima etapa: {diagnosis.nextStep}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-black/30 p-4">
                  <h3 className="font-semibold">Pontos fortes</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">
                    {diagnosis.strengths.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl bg-black/30 p-4">
                  <h3 className="font-semibold">Lacunas</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#F5F0E8]/70">
                    {diagnosis.gaps.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cofre Editorial</p>
          <h2 className="mt-3 text-xl font-semibold">Itens definitivos</h2>
          <p className="mt-3 text-sm leading-6 text-[#F5F0E8]/65">Quando a memoria e o diagnostico forem aprovados, eles entram aqui para compor o produto final.</p>
          <div className="mt-5 rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-4 text-sm text-[#F5F0E8]/70">
            Memoria: {memory ? 'criada' : 'aguardando'}
            <br />Diagnostico: {diagnosis ? 'criado' : 'aguardando'}
          </div>
        </aside>
      </div>
    </main>
  );
}
