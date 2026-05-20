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
    content: 'Quero transformar um manuscrito em ebook premium.'
  },
  {
    role: 'assistant',
    content: 'Acionei o Publisher. Primeiro vou criar a memoria do projeto e depois fazer o diagnostico.'
  }
];

export function ChatShell() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr_360px]">
        <aside className="border-r border-[#C9A84C]/20 bg-[#120609] p-5">
          <h1 className="text-2xl font-semibold text-[#C9A84C]">Tronco IA</h1>
          <p className="mt-2 text-sm text-[#F5F0E8]/70">Jarvis modular da Sol Lima</p>
          <nav className="mt-8 space-y-2 text-sm">
            {['Tronco Central', 'Publisher', 'Advogado', 'Video', 'Visual', 'Marketing'].map((item) => (
              <button key={item} className="w-full rounded-xl border border-[#C9A84C]/20 px-4 py-3 text-left hover:bg-[#4A0404]">
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex flex-col">
          <div className="border-b border-[#C9A84C]/20 p-5">
            <h2 className="text-xl font-semibold">Chat de Projeto</h2>
            <p className="text-sm text-[#F5F0E8]/60">Converse, anexe arquivos e aprove etapas.</p>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {sampleMessages.map((message, index) => (
              <div key={index} className={message.role === 'user' ? 'ml-auto max-w-2xl rounded-2xl bg-[#4A0404] p-4' : 'mr-auto max-w-2xl rounded-2xl border border-[#C9A84C]/20 bg-[#1C1214] p-4'}>
                {message.content}
              </div>
            ))}
          </div>
          <div className="border-t border-[#C9A84C]/20 p-5">
            <div className="rounded-2xl border border-[#C9A84C]/30 bg-[#120609] p-3">
              <textarea className="min-h-24 w-full resize-none bg-transparent outline-none" placeholder="Digite sua mensagem ou descreva o projeto..." />
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
            <p><strong>Modulo:</strong> Publisher</p>
            <p><strong>Etapa:</strong> Entrevista guiada</p>
            <p><strong>Arquivos:</strong> aguardando upload</p>
            <p><strong>Proxima acao:</strong> criar memoria do projeto</p>
          </div>
          <div className="mt-8 rounded-2xl border border-[#C9A84C]/20 p-4">
            <h4 className="font-semibold">Entregas</h4>
            <p className="mt-2 text-sm text-[#F5F0E8]/60">HTML, PDF, DOCX e ZIP aparecerao aqui.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
