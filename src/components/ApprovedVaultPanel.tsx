type ApprovedVaultPanelProps = {
  title?: string;
  status?: string;
  nextAction?: string;
  items?: string[];
};

export function ApprovedVaultPanel({
  title = "Cofre Editorial",
  status = "Aguardando aprovações",
  nextAction = "Conduzir entrevista editorial",
  items = []
}: ApprovedVaultPanelProps) {
  return (
    <aside className="rounded-3xl border border-[#C9A84C]/20 bg-[#120609] p-6">
      <p className="text-xs uppercase tracking-[0.35em] text-[#C9A84C]">
        {title}
      </p>

      <h2 className="mt-3 text-xl font-semibold text-[#F5F0E8]">
        Produto Final
      </h2>

      <p className="mt-3 text-sm leading-6 text-[#F5F0E8]/65">
        Tudo que for aprovado entra aqui: título, promessa, índice, blocos,
        direção visual, HTML, PDF, DOCX, imagens, diagramas e pacote final.
      </p>

      <div className="mt-5 space-y-3 text-sm text-[#F5F0E8]/70">
        <p>Estado atual: {status}</p>
        <p>Itens aprovados: {items.length}</p>
        <p>Próxima ação: {nextAction}</p>
      </div>

      {items.length > 0 && (
        <ul className="mt-5 space-y-2 text-sm text-[#F5F0E8]/75">
          {items.map((item) => (
            <li key={item} className="rounded-xl border border-[#C9A84C]/20 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export default ApprovedVaultPanel;
