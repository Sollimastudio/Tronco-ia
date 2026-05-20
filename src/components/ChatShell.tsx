type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const sampleMessages: Message[] = [
  {
    role: 'assistant',
    content: 'Bem-vinda ao Tronco IA. Escolha um modulo ou envie seu material para eu analisar.'
  },
  {
    role: 'user',
    content: 'Quero transformar um video bruto em cortes virais.'
  },
  {
    role: 'assistant',
    content: 'Acionei o Jarvis Video Editor. Envie o video, cole a transcricao ou descreva a cena. Eu vou gerar mapa de cortes, textos de tela, CTA e checklist de edicao.'
  }
];

const modules = ['Tronco Central', 'Publisher', 'Advogado', 'Video', 'Visual', 'Marketing'];

export function ChatShell() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr_380px]">
        <aside className="border-r border-[#C9A84C]/20 bg-[#120609] p-5">
          <h1 className="text-2xl font-semibold text-[#C9A84C]">Tronco IA</h1>
          <p className="mt-2 text-sm text-[#F5F0E8]/70">Jarvis modular da Sol Lima</p>
          <nav className="mt-8 space-y-2 text-sm">
            {modules.map((item) => (
              <button key={item} className={item === 'Video' ? 'w-full rounded-xl bg-[#C9A84C] px-4 py-3 text-left font-semibold text-black' : 'w-full rounded-xl border border-[#C9A84C]/20 px-4 py-3 text-left hover:bg-[#4A0404]'}>
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex flex-col">
          <div className="border-b border-[#C9A84C]/20 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Modulo ativo</p>
            <h2 className="mt-2 text-2xl font-semibold">Jarvis Video Editor</h2>
            <p className="text-sm text-[#F5F0E8]/60">Transcreve, diagnostica, roteiriza cortes e entrega mapa de edicao para Reels, TikTok, Shorts, Kwai, CapCut e Premiere.</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <div className="rounded-3xl border border-[#C9A84C]/25 bg-[#1C1214] p-5">
              <h3 className="text-lg font-semibold text-[#C9A84C]">Entrada do video</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="rounded-2xl border border-dashed border-[#C9A84C]/35 bg-black/30 p-5">
                  <span className="block text-sm font-semibold">Anexar video ou audio</span>
                  <span className="mt-1 block text-xs text-[#F5F0E8]/55">MP4, MOV, MP3, M4A. No MVP, o arquivo fica preparado para pipeline de transcricao.</span>
                  <input className="mt-4 w-full text-sm" type="file" accept="video/*,audio/*" />
                </label>

                <div className="rounded-2xl border border-[#C9A84C]/20 bg-black/25 p-5 text-sm text-[#F5F0E8]/70">
                  <strong className="text-[#C9A84C]">Motor do agente</strong>
                  <p className="mt-2">1. Extrair audio do video.</p>
                  <p>2. Transcrever com timestamps.</p>
                  <p>3. Detectar gancho, queda e pico emocional.</p>
                  <p>4. Gerar roteiro de edicao aplicavel.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Nome do projeto" />
                <select className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none">
                  <option>Corte viral</option>
                  <option>Video de venda</option>
                  <option>UGC / anuncio</option>
                  <option>Autoridade</option>
                  <option>Sequencia de stories</option>
                </select>
              </div>

              <textarea className="mt-4 min-h-40 w-full rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Cole a transcricao completa ou descreva o que acontece no video." />

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Publico: mulheres, homens, leads frios..." />
                <input className="rounded-2xl border border-[#C9A84C]/20 bg-black/40 p-4 outline-none" placeholder="Oferta: Magnetus, ebook, mentoria..." />
              </div>

              <button className="mt-5 w-full rounded-2xl bg-[#C9A84C] px-5 py-4 font-semibold text-black hover:opacity-90">
                Gerar mapa de edicao cirurgico
              </button>
            </div>

            {sampleMessages.map((message, index) => (
              <div key={index} className={message.role === 'user' ? 'ml-auto max-w-2xl rounded-2xl bg-[#4A0404] p-4' : 'mr-auto max-w-2xl rounded-2xl border border-[#C9A84C]/20 bg-[#1C1214] p-4'}>
                {message.content}
              </div>
            ))}
          </div>

          <div className="border-t border-[#C9A84C]/20 p-5">
            <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#120609] p-3">
              <textarea className="min-h-24 w-full resize-none bg-transparent outline-none" placeholder="Digite o pedido para o agente de video... Ex: transforme isso em 5 cortes para vender Magnetus." />
              <div className="mt-3 flex justify-between gap-3">
                <button className="rounded-xl border border-[#C9A84C]/30 px-4 py-2 text-sm">Anexar arquivo</button>
                <button className="rounded-xl bg-[#C9A84C] px-5 py-2 text-sm font-semibold text-black">Enviar</button>
              </div>
            </div>
          </div>
        </section>

        <aside className="border-l border-[#C9A84C]/20 bg-[#120609] p-5">
          <h3 className="text-lg font-semibold text-[#C9A84C]">Memoria do Projeto</h3>
          <div className="mt-4 space-y-3 text-sm text-[#F5F0E8]/75">
            <p><strong>Modulo:</strong> Video</p>
            <p><strong>Agente:</strong> Jarvis Video Editor</p>
            <p><strong>Etapa:</strong> Upload + transcricao + diagnostico</p>
            <p><strong>Arquivos:</strong> aguardando video/audio</p>
            <p><strong>Proxima acao:</strong> gerar mapa de cortes</p>
          </div>
          <div className="mt-8 rounded-2xl border border-[#C9A84C]/20 p-4">
            <h4 className="font-semibold">Entregas do modulo</h4>
            <ul className="mt-2 space-y-2 text-sm text-[#F5F0E8]/65">
              <li>Transcricao com timestamps.</li>
              <li>Mapa de cortes.</li>
              <li>Textos de tela.</li>
              <li>Legenda e CTA.</li>
              <li>Prompts para Veo, Sora, CapCut e Canva.</li>
              <li>Checklist para editor humano.</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
