export type BrollSuggestion = {
  moment: string;
  visual: string;
  purpose: string;
  prompt?: string;
};

export function suggestBroll(niche: string, emotion: string): BrollSuggestion[] {
  const base = niche.toLowerCase().includes('relacion') || niche.toLowerCase().includes('magnet')
    ? [
        'mulher olhando o celular sem responder imediatamente',
        'close em espelho com luz baixa e expressao firme',
        'ebook sobre seda bordo com detalhe dourado',
        'mao fechando uma porta devagar',
        'perfume, batom e caderno em mesa escura'
      ]
    : [
        'close no rosto durante frase forte',
        'maos organizando material de trabalho',
        'tela com palavra-chave em fundo escuro',
        'corte para ambiente silencioso',
        'produto ou oferta em composicao premium'
      ];

  return base.map((visual, index) => ({
    moment: index === 0 ? 'abertura' : `apoio-${index}`,
    visual,
    purpose: `Reforcar ${emotion} sem distrair da fala principal.`,
    prompt: `Cena cinematografica realista: ${visual}. Estetica premium, contraste alto, fundo escuro, luz suave, leitura mobile-first.`
  }));
}
