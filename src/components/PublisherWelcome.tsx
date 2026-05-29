export function PublisherWelcome() {
  const options = [
    'Tenho um manuscrito',
    'Tenho uma ideia',
    'Tenho posts soltos',
    'Tenho aula ou video',
    'Quero revisar um ebook'
  ];

  return (
    <section className="rounded-3xl border border-[#C9A84C]/30 bg-[#120609] p-6 shadow-2xl">
      <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">Publisher IA</p>
      <h2 className="mt-3 text-3xl font-semibold text-[#F5F0E8]">Transforme seu conteudo em produto editorial premium</h2>
      <p className="mt-4 text-sm leading-7 text-[#F5F0E8]/75">
        Eu transformo ideias, manuscritos, aulas, posts e arquivos soltos em ebooks, livros,
        workbooks e WebBooks profissionais. Voce nao precisa saber prompts. Eu conduzo o processo.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button key={option} className="rounded-2xl border border-[#C9A84C]/25 bg-[#1C1214] px-4 py-3 text-left text-sm text-[#F5F0E8] hover:border-[#C9A84C] hover:bg-[#4A0404]">
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-[#C9A84C]/25 bg-[#0A0A0A] p-4">
        <p className="text-sm font-semibold text-[#C9A84C]">Publisher Premium</p>
        <p className="mt-2 text-sm leading-6 text-[#F5F0E8]/70">
          Ative o modo premium para receber diagnostico, arquitetura, escrita, revisao,
          design, diagramas, HTML, PDF, DOCX e pacote final organizado.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-xl bg-[#C9A84C] px-4 py-2 text-sm font-semibold text-black">Ativar Premium</button>
          <button className="rounded-xl border border-[#C9A84C]/30 px-4 py-2 text-sm text-[#F5F0E8]">Usar modo simples</button>
        </div>
      </div>
    </section>
  );
}
