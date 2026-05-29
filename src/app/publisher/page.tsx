import { PublisherWelcome } from '../../components/PublisherWelcome';

export default function PublisherPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <PublisherWelcome />

          <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#1C1214] p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Chat guiado</p>
            <h1 className="mt-3 text-2xl font-semibold">Comece sem prompt tecnico</h1>
            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/70">
              Descreva seu projeto em linguagem simples. O Publisher cria o briefing, faz a entrevista,
              monta a memoria do projeto e conduz a esteira editorial.
            </p>
            <div className="mt-5 rounded-2xl border border-[#C9A84C]/30 bg-[#120609] p-3">
              <textarea className="min-h-32 w-full resize-none bg-transparent outline-none" placeholder="Ex: Tenho um manuscrito e quero transformar em ebook premium." />
              <div className="mt-3 flex flex-wrap justify-between gap-3">
                <button className="rounded-xl border border-[#C9A84C]/30 px-4 py-2 text-sm">Anexar manuscrito</button>
                <button className="rounded-xl bg-[#C9A84C] px-5 py-2 text-sm font-semibold text-black">Iniciar Publisher</button>
              </div>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Cofre Editorial</p>
          <h2 className="mt-3 text-xl font-semibold">Produto Final</h2>
          <p className="mt-3 text-sm leading-6 text-[#F5F0E8]/65">
            Tudo que for aprovado entra aqui: titulo, promessa, indice, blocos, direcao visual,
            HTML, PDF, DOCX, imagens, diagramas e pacote final.
          </p>
          <div className="mt-5 space-y-3 text-sm text-[#F5F0E8]/70">
            <p>Estado atual: aguardando projeto</p>
            <p>Itens aprovados: 0</p>
            <p>Proxima acao: entrevista guiada</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
