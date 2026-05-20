import type { EditingInstruction } from './types';

export type TranscriptSegment = {
  start: string;
  end: string;
  text: string;
};

export function generateCutMap(segments: TranscriptSegment[]): EditingInstruction[] {
  return segments.map((segment, index) => {
    const cleanText = segment.text.trim();
    const shortText = cleanText.length > 70 ? `${cleanText.slice(0, 67)}...` : cleanText;

    return {
      id: `cut-${index + 1}`,
      start: segment.start,
      end: segment.end,
      action: index === 0 ? 'Abrir com corte seco e remover qualquer respiracao antes da fala.' : 'Manter apenas a frase essencial e cortar pausas antes/depois.',
      reason: index === 0 ? 'Primeiros segundos decidem retencao.' : 'Manter ritmo e evitar queda de atencao.',
      onScreenText: shortText,
      caption: cleanText,
      soundDesign: index === 0 ? 'Silencio curto antes da primeira frase ou impacto grave sutil.' : 'Trilha baixa, sem competir com a voz.',
      broll: 'Usar b-roll apenas se reforcar a emocao do trecho, nunca para enfeitar vazio.',
      risk: cleanText.length > 180 ? 'medium' : 'low'
    };
  });
}

export function summarizeCutMap(cuts: EditingInstruction[]): string {
  const strongCuts = cuts.filter((cut) => cut.risk === 'low').length;
  return `Mapa com ${cuts.length} cortes. ${strongCuts} trechos estao prontos para manter. Revise cortes medios para encurtar e aumentar ritmo.`;
}
