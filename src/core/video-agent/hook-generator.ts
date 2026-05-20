export type HookVariant = {
  mode: 'ameaca' | 'identificacao' | 'autoridade' | 'storytelling' | 'venda_indireta' | 'comentario' | 'salvamento' | 'polêmica';
  text: string;
  editorNote: string;
};

export function generateHookVariants(coreIdea: string, offer?: string): HookVariant[] {
  const product = offer || 'seu metodo';
  return [
    {
      mode: 'ameaca',
      text: `Voce pode estar perdendo atencao por tentar chamar atencao do jeito errado: ${coreIdea}`,
      editorNote: 'Abrir com close no rosto, corte seco e texto grande nos 2 primeiros segundos.'
    },
    {
      mode: 'identificacao',
      text: `Tem gente que nao e invisivel. So esta insistindo no olhar errado: ${coreIdea}`,
      editorNote: 'Usar pausa de meio segundo depois da primeira frase.'
    },
    {
      mode: 'autoridade',
      text: `A maioria edita video para ficar bonito. Eu editaria esse para prender o cerebro: ${coreIdea}`,
      editorNote: 'Bom para conteudo de bastidor e autoridade.'
    },
    {
      mode: 'storytelling',
      text: `Eu so entendi isso quando percebi que beleza nao vence desinteresse: ${coreIdea}`,
      editorNote: 'Abrir com tom confessional e imagem mais fechada.'
    },
    {
      mode: 'venda_indireta',
      text: `E por isso que ${product} nao ensina voce a implorar por atencao. Ensina presenca.` ,
      editorNote: 'Usar no segundo bloco, nao necessariamente no primeiro segundo.'
    },
    {
      mode: 'comentario',
      text: `Comenta EU se voce ja tentou ser escolhida por quem nem estava olhando.` ,
      editorNote: 'CTA de comentario para final de video curto.'
    },
    {
      mode: 'salvamento',
      text: `Salva isso antes de confundir magnetismo com esforco desesperado.` ,
      editorNote: 'Ideal para legenda ou tela final.'
    },
    {
      mode: 'polêmica',
      text: `A frase mais dura sobre atracao: ninguem presta atencao em quem aprendeu a se diminuir.` ,
      editorNote: 'Usar se o objetivo for alcance e debate.'
    }
  ];
}
