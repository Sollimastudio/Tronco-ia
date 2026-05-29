export function buildPublisherDiagnosis(memory: Record<string, string>) {
  return {
    title: 'Diagnostico Editorial Inicial',
    theme: memory.goal || 'tema a definir',
    audience: memory.audience || 'publico a definir',
    promise: 'promessa sera refinada apos leitura do material',
    strengths: ['material com potencial editorial', 'possibilidade de estruturar em produto vendavel'],
    gaps: ['promessa precisa ser refinada', 'estrutura precisa ser definida', 'visual precisa ser escolhido'],
    recommendedFormat: 'ebook premium com possibilidade de workbook',
    nextStep: 'architecture'
  };
}
