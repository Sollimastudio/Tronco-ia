const steps = [
  'Deixa na arvore: suspenda o julgamento no calor do gatilho.',
  'Sobe na arvore: observe de cima, sem se confundir com o impulso.',
  'Investigue raiz, tronco, galhos e frutos.',
  'Desca da arvore com uma decisao mais consciente.'
];

export default function MetodoPage() {
  return (
    <main className="min-h-screen bg-[#080403] px-6 py-10 text-[#F7EFE3] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm text-[#C9A04A]">← Voltar para o Relacione-se</a>
        <section className="pt-14">
          <p className="text-xs uppercase tracking-[0.45em] text-[#C9A04A]">Metodo Posicione-se</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight text-[#FFF8EA] sm:text-6xl">Discernimento antes da decisao.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#F7EFE3]/75">
            O Metodo Posicione-se organiza a mente em momentos de confusao emocional. Ele ajuda a separar impulso de direcao, medo de evidencia e dor de destino.
          </p>
        </section>
        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {steps.map((step, index) => (
            <article key={step} className="rounded-[2rem] border border-[#C9A04A]/20 bg-[#13080A] p-6">
              <p className="text-sm text-[#C9A04A]">Passo {index + 1}</p>
              <h2 className="mt-3 text-2xl font-black text-[#F1DCA7]">{step}</h2>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
