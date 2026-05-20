import type { ViralScore } from './types';

export type ViralScoreInput = {
  hook: number;
  retention: number;
  clarity: number;
  emotion: number;
  salesPressure: number;
  authority: number;
  commentPotential?: number;
  savePotential?: number;
  replayPotential?: number;
};

export function calculateViralScore(input: ViralScoreInput): ViralScore {
  const comment = input.commentPotential ?? input.emotion;
  const save = input.savePotential ?? input.clarity;
  const replay = input.replayPotential ?? input.hook;

  const overall = Number((
    input.hook * 0.2 +
    input.retention * 0.25 +
    input.clarity * 0.12 +
    input.emotion * 0.15 +
    input.salesPressure * 0.1 +
    input.authority * 0.1 +
    comment * 0.03 +
    save * 0.03 +
    replay * 0.02
  ).toFixed(1));

  return {
    hook: input.hook,
    retention: input.retention,
    clarity: input.clarity,
    emotion: input.emotion,
    salesPressure: input.salesPressure,
    authority: input.authority,
    overall: Math.max(0, Math.min(10, overall))
  };
}

export function getViralDiagnosis(score: ViralScore): string {
  if (score.overall >= 8.5) return 'Alto potencial. Priorize publicar, testar capa e criar variacoes A/B.';
  if (score.overall >= 7) return 'Bom potencial. Precisa refinar abertura, ritmo ou CTA antes de publicar.';
  if (score.overall >= 5) return 'Potencial mediano. Salve a ideia, mas reestruture o gancho e encurte o corpo.';
  return 'Baixo potencial. Regrave ou transforme em story bastidor. Nao gaste energia editando defunto digital.';
}
