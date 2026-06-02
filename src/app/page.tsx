export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] px-6 py-16 text-[#F5F0E8]">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-[#C9A84C]/30 bg-[#13070A] p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.45em] text-[#C9A84C]">Sol.IA Publisher</p>
        <h1 className="mt-6 text-5xl font-black leading-tight">Publisher Workspace</h1>
        <p className="mt-5 text-lg leading-8 text-[#F5F0E8]/70">
          A página inicial agora aponta para a área correta do Publisher. Use o botão abaixo para abrir o fluxo com leitura real, editor revisável e exportação.
        </p>
        <a href="/publisher" className="mt-8 inline-flex rounded-full bg-[#C9A84C] px-7 py-4 font-bold text-black transition hover:scale-[1.02]">
          Abrir Publisher
        </a>
      </section>
    </main>
  );
}
