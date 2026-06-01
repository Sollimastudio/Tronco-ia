const values = [
  'Verdade',
  'Discernimento',
  'Autorresponsabilidade',
  'Empatia',
  'Limite',
  'Fe',
  'Liberdade interna',
  'Legado'
];

const pillars = [
  {
    title: 'Metodo Posicione-se',
    text: 'Discernimento pratico para sair do impulso, investigar padroes e decidir com mais clareza.'
  },
  {
    title: 'CSI da mente',
    text: 'Evidencia nao mente. Pode ate ser mal interpretada, mas nao mente. Aqui, padrao vira pista.'
  },
  {
    title: 'Magnetus',
    text: 'Presenca, comportamento magnetico e inteligencia emocional para homens e mulheres.'
  },
  {
    title: 'MINDSETmagro',
    text: 'Desobesidade emocional: mente, corpo, comida, respiracao e reconstrucao de identidade.'
  }
];

const products = [
  {
    name: 'Magnetus',
    description: 'Diagnostico de presenca, comportamento magnetico e reposicionamento relacional.',
    href: 'https://magnetus.relacione-se.com'
  },
  {
    name: 'MINDSETmagro',
    description: 'Protocolo para transformar a relacao com corpo, comida e identidade.',
    href: 'https://mindsetmagro.relacione-se.com'
  },
  {
    name: 'Morte em Vida',
    description: 'A anatomia do feminicidio emocional, apagamento, autoanulacao e reconstrução.',
    href: '#em-breve'
  },
  {
    name: 'Posicione-se',
    description: 'Livro e metodo para sair da repeticao e viver com discernimento.',
    href: '#em-breve'
  }
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080403] text-[#F7EFE3]">
      <section className="relative isolate min-h-screen px-6 py-10 sm:px-10 lg:px-16">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(185,131,55,0.28),_transparent_34%),radial-gradient(circle_at_85%_20%,_rgba(110,13,28,0.40),_transparent_35%),linear-gradient(135deg,#080403_0%,#18070A_45%,#030303_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#7B1024]/20 blur-3xl" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#C9A04A]">Relacione-se</p>
            <p className="mt-1 text-sm text-[#F7EFE3]/65">Acesse seus recursos internos</p>
          </div>
          <a
            href="https://instagram.com/_relacione_se"
            className="rounded-full border border-[#C9A04A]/35 px-5 py-2 text-sm text-[#F7EFE3] transition hover:border-[#C9A04A] hover:bg-[#C9A04A]/10"
          >
            Instagram
          </a>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-[#C9A04A]/30 bg-black/25 px-4 py-2 text-sm text-[#F1DCA7] shadow-2xl shadow-black/30">
              Antes de relacionar-se, relacione-se.
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-[#FFF8EA] sm:text-6xl lg:text-7xl">
              Saia da ignorancia emocional e volte para si.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#F7EFE3]/78 sm:text-xl">
              O Relacione-se nasceu da travessia de Sol Lima depois de viver o que chama de morte em vida: apagamento, autoanulacao, tensao e hipervigilancia inconsciente. A virada veio pelo lado mae. Quando a historia poderia alcancar os filhos, a reconstrucao virou missao.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="#ecossistema"
                className="rounded-full bg-[#C9A04A] px-7 py-4 text-center font-bold text-black shadow-xl shadow-[#000]/35 transition hover:scale-[1.02]"
              >
                Conhecer o ecossistema
              </a>
              <a
                href="#sol-lima"
                className="rounded-full border border-[#C9A04A]/45 px-7 py-4 text-center font-bold text-[#F7EFE3] transition hover:bg-[#C9A04A]/10"
              >
                Quem e Sol Lima
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[3rem] bg-[#C9A04A]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-[#C9A04A]/25 bg-[#13080A]/85 p-6 shadow-2xl shadow-black/60">
              <div className="rounded-[2rem] border border-[#F7EFE3]/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-[#C9A04A]">CSI da mente</p>
                <h2 className="mt-5 text-3xl font-black text-[#FFF8EA]">Evidencia nao mente.</h2>
                <p className="mt-4 leading-7 text-[#F7EFE3]/75">
                  Pode ate equivocar-se na interpretacao, mas nao mente. O metodo observa frutos, raizes, padroes, modos operantes e escolhas repetidas ate encontrar o ponto de reposicionamento.
                </p>
                <div className="mt-8 grid gap-3 text-sm">
                  {['Arvore do Discernimento', 'Matematica do Perdao', 'Reset da Respiracao', 'Manequim Mental Ideal'].map((item) => (
                    <div key={item} className="rounded-2xl border border-[#C9A04A]/18 bg-black/25 px-4 py-3 text-[#F7EFE3]/82">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sol-lima" className="border-y border-[#C9A04A]/15 bg-[#120608] px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#C9A04A]">Sol Lima</p>
            <h2 className="mt-4 text-4xl font-black text-[#FFF8EA] sm:text-5xl">Escritora, investigadora de padroes e criadora do Metodo Posicione-se.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[#F7EFE3]/78">
            <p>
              Sol Lima e escritora, analista comportamental DISC, Coach Life Professional, formada em Master Love e Mulher Magnetica, criadora do Metodo Posicione-se e do Ecossistema Relacione-se.
            </p>
            <p>
              Sua linguagem nasceu de uma investigacao real: sair do apagamento, entender a propria historia, liberar perdao sem confundir perdao com permissao, regular o corpo e transformar dor em discernimento.
            </p>
            <p className="rounded-3xl border border-[#C9A04A]/20 bg-black/25 p-6 text-[#F1DCA7]">
              Relacione-se significa: entenda-se, acesse seus recursos internos e pare de buscar fora a validacao que precisa reconstruir dentro.
            </p>
          </div>
        </div>
      </section>

      <section id="ecossistema" className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.45em] text-[#C9A04A]">Ecossistema</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black text-[#FFF8EA] sm:text-5xl">Uma estrutura para discernimento, presenca, vinculos conscientes e liberdade interna.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="rounded-[2rem] border border-[#C9A04A]/18 bg-[#13080A] p-6 shadow-xl shadow-black/20">
                <h3 className="text-xl font-black text-[#F1DCA7]">{pillar.title}</h3>
                <p className="mt-4 leading-7 text-[#F7EFE3]/70">{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7EFE3] px-6 py-20 text-[#150609] sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.45em] text-[#7B1024]">Produtos e livros</p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black sm:text-5xl">Caminhos praticos para se relacionar consigo antes de se perder no outro.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <a key={product.name} href={product.href} className="rounded-[2rem] border border-[#7B1024]/15 bg-white p-6 shadow-xl shadow-[#7B1024]/10 transition hover:-translate-y-1 hover:shadow-2xl">
                <h3 className="text-2xl font-black text-[#7B1024]">{product.name}</h3>
                <p className="mt-4 leading-7 text-black/68">{product.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-[#C9A04A]/20 bg-[#13080A] p-8 lg:p-12">
          <p className="text-xs uppercase tracking-[0.45em] text-[#C9A04A]">Valores</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {values.map((value) => (
              <span key={value} className="rounded-full border border-[#C9A04A]/25 bg-black/25 px-5 py-3 text-[#F7EFE3]/82">
                {value}
              </span>
            ))}
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <h2 className="text-4xl font-black text-[#FFF8EA] sm:text-5xl">Missao</h2>
            <p className="text-lg leading-8 text-[#F7EFE3]/78">
              Ajudar pessoas a sairem da ignorancia emocional, reconhecerem seus padroes, acessarem seus recursos internos e viverem com mais discernimento, vinculos conscientes, limite, fe, proposito e liberdade interna.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#C9A04A]/15 px-6 py-10 text-center text-sm text-[#F7EFE3]/58">
        <p>Relacione-se — antes de relacionar-se, relacione-se.</p>
      </footer>
    </main>
  );
}
