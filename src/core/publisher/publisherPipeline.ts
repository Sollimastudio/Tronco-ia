export const publisherPipeline = [
  'entrevista_guiada',
  'memoria_do_projeto',
  'diagnostico_editorial',
  'arquitetura_editorial',
  'plano_por_blocos',
  'escrita_por_blocos',
  'revisao_tecnica',
  'direcao_visual',
  'html_webbook',
  'pdf_premium',
  'docx_editavel',
  'pacote_visual',
  'zip_final'
];

export function getNextStep(currentStep: string) {
  const index = publisherPipeline.indexOf(currentStep);
  if (index < 0) return publisherPipeline[0];
  return publisherPipeline[index + 1] ?? 'concluido';
}
