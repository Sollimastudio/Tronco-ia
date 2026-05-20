export type CaptionPack = {
  faithful: string;
  retention: string;
  minimal: string;
  aggressive: string;
  premium: string;
  srt?: string;
};

export function buildCaptionPack(transcript: string, cta: string): CaptionPack {
  const firstLine = transcript.split(/[.!?]/).find(Boolean)?.trim() || transcript.slice(0, 90);

  return {
    faithful: `${transcript}\n\n${cta}`,
    retention: `${firstLine}.\n\nO problema nao e falta de beleza. E falta de posicionamento emocional.\n\n${cta}`,
    minimal: `${firstLine}.\n\n${cta}`,
    aggressive: `${firstLine}.\n\nPara de chamar de azar o que ja virou padrao.\n\n${cta}`,
    premium: `${firstLine}.\n\nPresenca nao se implora. Se constrói.\n\n${cta}`
  };
}

export function createSimpleSrt(lines: string[]): string {
  return lines
    .map((line, index) => {
      const start = `00:00:${String(index * 3).padStart(2, '0')},000`;
      const end = `00:00:${String(index * 3 + 2).padStart(2, '0')},800`;
      return `${index + 1}\n${start} --> ${end}\n${line}`;
    })
    .join('\n\n');
}
