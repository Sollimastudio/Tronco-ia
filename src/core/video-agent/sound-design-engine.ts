export type SoundDesignCue = {
  moment: string;
  cue: string;
  reason: string;
};

export function suggestSoundDesign(objective: string): SoundDesignCue[] {
  const isSales = objective.toLowerCase().includes('venda') || objective.toLowerCase().includes('sales');

  return [
    {
      moment: '00:00-00:02',
      cue: 'silencio curto ou impacto grave muito sutil',
      reason: 'Cria parada cognitiva antes do gancho.'
    },
    {
      moment: 'frase de virada',
      cue: 'queda rapida da trilha por 0.4s',
      reason: 'A frase forte ganha peso e aumenta replay.'
    },
    {
      moment: 'meio do video',
      cue: 'trilha baixa com pulso constante',
      reason: 'Mantem ritmo sem competir com a voz.'
    },
    {
      moment: 'CTA',
      cue: isSales ? 'subida discreta e corte seco final' : 'pausa limpa antes do convite para comentar',
      reason: isSales ? 'Sinaliza proximo passo sem parecer anuncio pobre.' : 'Abre espaco mental para resposta.'
    }
  ];
}
