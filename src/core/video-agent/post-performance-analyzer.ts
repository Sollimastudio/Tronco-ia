export type PostMetrics = {
  views: number;
  averageWatchTime?: number;
  retentionRate?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  sales?: number;
};

export type PerformanceInsight = {
  diagnosis: string;
  repeat: string[];
  fix: string[];
  nextTest: string[];
};

export function analyzePostPerformance(metrics: PostMetrics): PerformanceInsight {
  const engagement = metrics.views > 0
    ? (((metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0) + (metrics.saves || 0)) / metrics.views) * 100
    : 0;

  const repeat: string[] = [];
  const fix: string[] = [];
  const nextTest: string[] = [];

  if ((metrics.retentionRate || 0) >= 60) repeat.push('Repetir estrutura de gancho e ritmo.');
  else fix.push('Regravar abertura ou antecipar a frase mais forte para os 2 primeiros segundos.');

  if (engagement >= 5) repeat.push('Tema tem resposta emocional. Criar variacoes A/B.');
  else fix.push('Adicionar pergunta mais desconfortavel ou CTA de comentario menos generico.');

  if ((metrics.clicks || 0) > 0 || (metrics.sales || 0) > 0) repeat.push('Manter ponte de oferta e criar remarketing.');
  else fix.push('Melhorar transicao entre dor e produto. CTA provavelmente esta frio ou tarde demais.');

  nextTest.push('Testar gancho polemico contra gancho emocional.');
  nextTest.push('Testar capa com rosto versus capa apenas tipografica.');
  nextTest.push('Testar CTA para comentario antes do CTA para link da bio.');

  return {
    diagnosis: `Engajamento estimado: ${engagement.toFixed(2)}%. Use como sinal, nao como sentenca divina do algoritmo.`,
    repeat,
    fix,
    nextTest
  };
}
