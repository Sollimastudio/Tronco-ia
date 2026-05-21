import type { EditorCommandInput } from './editor-types';

export function generateEditorCommands(input: EditorCommandInput) {
  const strategy = `Adaptar ${input.editingStyle} para ${input.platform}, com foco em ${input.objective}.`;

  return {
    strategy,
    universal: [
      'Definir objetivo antes de cortar: alcance, venda, comentario, salvamento ou autoridade.',
      'Colocar o gancho nos 2 primeiros segundos.',
      'Remover pausa morta, repeticao e respiracao inutil.',
      'Usar uma ideia por tela e texto grande para celular.',
      'Alternar tensao e respiro para evitar fadiga visual.',
      'Sincronizar cortes importantes com texto, pausa ou som.',
      'Finalizar com CTA simples e coerente com o objetivo.'
    ],
    capcut: [
      'Criar projeto 9:16 e importar video bruto.',
      'Usar cortes secos nos trechos marcados no mapa de cortes.',
      'Aplicar auto captions e revisar erros manualmente.',
      'Inserir texto grande nos momentos de gancho, virada e CTA.',
      'Usar keyframes apenas para zoom leve em frases fortes.',
      'Baixar trilha para 8-15% quando houver voz principal.',
      'Adicionar efeitos sonoros curtos: impacto, riser, text pop e silence cut.',
      'Exportar em alta qualidade e testar leitura no celular.'
    ],
    canva: [
      'Usar Canva para capa, cenas visuais, mockups, stories e videos com forte texto na tela.',
      'Escolher template limpo e remover excesso de elementos.',
      'Criar hierarquia: headline grande, subtitulo curto, CTA discreto.',
      'Usar cenas curtas de 1 a 3 segundos para ritmo de Reels.',
      'Inserir produto como objeto de desejo, nao como panfleto.',
      'Usar animacoes discretas: rise, fade, typewriter ou wipe elegante.',
      'Manter contraste alto e texto legivel.',
      'Exportar MP4 vertical e revisar no celular.'
    ],
    premiere: [
      'Criar sequencia 1080x1920, 30fps ou conforme arquivo original.',
      'Organizar tracks: V1 principal, V2 b-roll, V3 textos; A1 voz, A2 trilha, A3 efeitos.',
      'Criar markers para gancho, virada, prova, oferta e CTA.',
      'Montar rough cut pelo mapa de cortes antes de refinar efeitos.',
      'Usar J-cuts/L-cuts quando a voz conduzir a proxima imagem.',
      'Aplicar ducking na trilha para proteger a fala.',
      'Gerar SRT e corrigir quebras de linha mobile.',
      'Exportar H.264 vertical para redes sociais.'
    ]
  };
}
