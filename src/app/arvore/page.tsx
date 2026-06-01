const questions = [
  'Estou reagindo pelo impulso ou decidindo com discernimento?',
  'O que estou chamando de amor pode ser apego, medo ou prova de valor?',
  'Qual evidencia eu estou ignorando porque ela desmonta minha versao preferida?',
  'Esse padrao e raiz, tronco, galho ou fruto?',
  'Que fruto essa escolha vai gerar daqui a 30 dias?',
  'O que preciso deixar na arvore antes de responder?'
];

const results = [
  {
    title: 'Modo Sobrevivencia',
    text: 'Voce esta tentando decidir com o corpo em alerta. Primeiro regule a respiracao, depois investigue a evidencia.'
  },
  {
    title: 'Modo Agradadora',
    text: 'Voce pode estar confundindo paz com autoabandono. Limite tambem e forma de amor.'
  },
  {
    title: 'Modo Discernimento',
    text: 'Voce ja consegue subir na arvore, observar os frutos e escolher com mais consciencia.'
  }
];

export default function ArvorePage() {
  return (
    <main className="min-h-screen bg-[#080403] px-6 py-10 text-[#F7EFE3] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm text-[#C9A04A]">← Voltar para o Relacione-se</a>

        <section className="pt-14">
          <p className="text-xs uppercase tracking-[0.45em] text-[#C9A04A]">Teste autoral</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight text-[#FFF8EA] sm:text-6xl">
            Teste da Arvore do Discernimento
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#F7EFE3]/75">
            Um diagnostico rapido para identificar se voce esta agindo no impulso, no medo, na carencia, na defesa ou no discernimento. Antes de responder, deixa na arvore.
          </p>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[#C9A04A]/20 bg-[#13080A] p-6 lg:p-8">
            <h2 className="text-2xl font-black text-[#F1DCA7]">Perguntas de autoanalise</h2>
            <div className="mt-6 space-y-4">
              {questions.map((question, index) => (
                <div key={question} className="rounded-2xl border border-[#C9A04A]/15 bg-black/25 p-5">
                  <p className="text-sm text-[#C9A04A]">Pergunta {index + 1}</p>
                  <p className="mt-2 text-lg font-semibold">{question}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-[#C9A04A] p-5 text-black">
              <p className="font-black">Versao interativa em breve</p>
              <p className="mt-2 text-sm leading-6">Esta pagina ja esta pronta como base publica. O proximo passo e transformar as perguntas em quiz clicavel com resultado automatico e captura de lead.</p>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-[#C9A04A]/20 bg-[#F7EFE3] p-6 text-[#150609]">
              <h2 className="text-2xl font-black text-[#7B1024]">Como usar</h2>
              <p className="mt-4 leading-7 text-black/70">
                Leia cada pergunta sem tentar se defender. Anote a primeira evidencia que aparecer. Depois suba na arvore: olhe de cima, observe raiz, tronco, galhos e frutos. So depois decida.
              </p>
            </div>
            {results.map((result) => (
              <div key={result.title} className="rounded-[2rem] border border-[#C9A04A]/20 bg-[#13080A] p-6">
                <h3 className="text-xl font-black text-[#F1DCA7]">{result.title}</h3>
                <p className="mt-3 leading-7 text-[#F7EFE3]/70">{result.text}</p>
              </div>
            ))}
          </aside>
        </section>
      </div>
    </main>
  );
}
