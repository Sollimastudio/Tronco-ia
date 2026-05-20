export type RetentionSegment = {
  start: string;
  end: string;
  text: string;
  score: number;
  diagnosis: string;
  action: 'keep' | 'cut' | 'tighten' | 'move_to_hook' | 'turn_into_cta';
};

const strongSignals = [
  'voce', 'nunca', 'sempre', 'por que', 'verdade', 'erro', 'segredo', 'pare', 'cuidado', 'ninguem', 'magnetismo', 'atracao', 'invisivel', 'atenção', 'atencao'
];

const weakSignals = [
  'entao', 'tipo', 'assim', 'ne', 'eh', 'hum', 'basicamente', 'deixa eu explicar', 'como eu estava dizendo'
];

export function scoreRetentionSegment(text: string): number {
  const normalized = text.toLowerCase();
  let score = 5;

  for (const signal of strongSignals) {
    if (normalized.includes(signal)) score += 0.6;
  }

  for (const signal of weakSignals) {
    if (normalized.includes(signal)) score -= 0.7;
  }

  if (text.length < 45) score += 0.8;
  if (text.length > 220) score -= 1.2;
  if (/[?!]/.test(text)) score += 0.5;
  if (normalized.includes('mas')) score += 0.4;

  return Math.max(0, Math.min(10, Number(score.toFixed(1))));
}

export function diagnoseRetentionSegment(start: string, end: string, text: string): RetentionSegment {
  const score = scoreRetentionSegment(text);
  let action: RetentionSegment['action'] = 'keep';
  let diagnosis = 'Trecho funcional. Pode permanecer se estiver alinhado ao objetivo.';

  if (score >= 8) {
    action = 'move_to_hook';
    diagnosis = 'Trecho forte. Pode virar abertura, corte principal ou frase de capa.';
  } else if (score >= 6.5) {
    action = 'keep';
    diagnosis = 'Trecho bom. Mantenha com ritmo, zoom leve ou texto na tela.';
  } else if (score >= 4.5) {
    action = 'tighten';
    diagnosis = 'Trecho mediano. Precisa encurtar, acelerar ou ganhar texto de apoio.';
  } else {
    action = 'cut';
    diagnosis = 'Trecho fraco. Corta sem dó, porque algoritmo não é terapeuta.';
  }

  return { start, end, text, score, diagnosis, action };
}
