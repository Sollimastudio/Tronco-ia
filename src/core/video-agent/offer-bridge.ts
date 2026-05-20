export type OfferBridge = {
  placement: 'opening' | 'middle' | 'ending' | 'caption' | 'stories_followup';
  line: string;
  reason: string;
};

export function createOfferBridge(offer: string, pain: string): OfferBridge[] {
  return [
    {
      placement: 'middle',
      line: `E aqui entra ${offer}: nao para voce correr atras de atencao, mas para reposicionar a sua presenca.`,
      reason: 'Ponte de venda indireta depois da dor reconhecida.'
    },
    {
      placement: 'ending',
      line: `Se isso tocou em voce, o proximo passo e conhecer ${offer}. Esta no link da bio.`,
      reason: 'CTA simples, sem mendigar clique.'
    },
    {
      placement: 'caption',
      line: `${pain} nao se resolve com mais esforco. Se resolve com metodo, presenca e direcao.`,
      reason: 'Legenda amplia consciencia e prepara venda.'
    },
    {
      placement: 'stories_followup',
      line: `Voce quer que eu te mostre onde exatamente ${pain} aparece nos seus comportamentos? Responde EU.`,
      reason: 'Ativa direct/comentario depois do video.'
    }
  ];
}
