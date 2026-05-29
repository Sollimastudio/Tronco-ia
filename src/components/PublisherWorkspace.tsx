'use client';

import { useMemo, useState } from 'react';
import { publisherStartOptions, type PublisherStartOptionId } from '../core/publisher/publisherStartOptions';
import { getInterview } from '../core/publisher/publisherInterview';
import { PublisherWelcome } from './PublisherWelcome';
import { ApprovedVaultPanel } from './ApprovedVaultPanel';

export function PublisherWorkspace() {
  const [selectedOption, setSelectedOption] = useState<PublisherStartOptionId | null>(null);
  const questions = useMemo(() => (selectedOption ? getInterview(selectedOption) : []), [selectedOption]);
  const selected = publisherStartOptions.find((option) => option.id === selectedOption);

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <PublisherWelcome />

          <section className="rounded-3xl border border-[#C9A84C]/20 bg-[#1C1214] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Comece aqui</p>
            <h1 className="mt-3 text-2xl font-semibold">Escolha o ponto de partida</h1>
            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
              O Publisher transforma sua escolha em uma entrevista profissional. Voce responde simples, ele cria o processo por baixo.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {publisherStartOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={selectedOption === option.id
                    ? 'rounded-2xl border border-[#C9A84C] bg-[#4A0404] p-4 text-left'
                    : 'rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-4 text-left hover:border-[#C9A84C]/70'}
                >
                  <p className="font-semibold text-[#F5F0E8]">{option.label}</p>
                  <p className="mt-2 text-xs leading-5 text-[#F5F0E8]/55">{option.description}</p>
                </button>
              ))}
            </div>
          </section>

          {selected && (
            <section className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Entrevista guiada</p>
              <h2 className="mt-3 text-2xl font-semibold">{selected.label}</h2>
              <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">{selected.firstQuestion}</p>

              <div className="mt-6 space-y-4">
                {questions.map((question) => (
                  <label key={question.id} className="block rounded-2xl border border-[#C9A84C]/15 bg-black/25 p-4">
                    <span className="text-sm font-semibold text-[#F5F0E8]">{question.label}</span>
                    {question.helper && <span className="mt-1 block text-xs text-[#F5F0E8]/55">{question.helper}</span>}
                    <textarea className="mt-3 min-h-20 w-full resize-none rounded-xl border border-[#C9A84C]/15 bg-black/40 p-3 text-sm outline-none" placeholder="Responda aqui..." />
                  </label>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-xl bg-[#C9A84C] px-5 py-3 text-sm font-semibold text-black">Criar Memoria do Projeto</button>
                <button className="rounded-xl border border-[#C9A84C]/30 px-5 py-3 text-sm text-[#F5F0E8]">Salvar rascunho</button>
              </div>
            </section>
          )}
        </section>

        <ApprovedVaultPanel />
      </div>
    </main>
  );
}
