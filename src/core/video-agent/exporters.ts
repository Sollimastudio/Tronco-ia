import type { VideoAnalysisResult } from './types';

export function exportAnalysisAsMarkdown(result: VideoAnalysisResult): string {
  return `# ${result.title}\n\n## Diagnostico\n${result.diagnosis}\n\n## Transcricao\n${result.transcript}\n\n## Melhores cortes\n${result.bestCuts.map((cut) => `### ${cut.id}\n- Tempo: ${cut.start} - ${cut.end}\n- Acao: ${cut.action}\n- Motivo: ${cut.reason}\n- Texto na tela: ${cut.onScreenText || ''}\n- B-roll: ${cut.broll || ''}\n- Som: ${cut.soundDesign || ''}`).join('\n\n')}\n\n## Ganchos\n${result.hooks.map((hook) => `- ${hook}`).join('\n')}\n\n## CTAs\n${result.ctas.map((cta) => `- ${cta}`).join('\n')}\n\n## Checklist\n${result.editorChecklist.map((item) => `- [ ] ${item}`).join('\n')}\n`;
}

export function exportAnalysisAsJson(result: VideoAnalysisResult): string {
  return JSON.stringify(result, null, 2);
}

export function exportCapCutChecklist(result: VideoAnalysisResult): string[] {
  return [
    'Importar video bruto.',
    'Aplicar formato 9:16 para Reels/TikTok/Shorts.',
    'Cortar trechos de acordo com o mapa de cortes.',
    'Remover pausas, respiracoes longas e repeticoes.',
    'Inserir textos de tela nos timestamps indicados.',
    'Aplicar legendas automaticas e revisar erros.',
    'Adicionar b-roll apenas onde reforcar emocao ou produto.',
    'Ajustar trilha para nao competir com a voz.',
    'Criar capa com frase curta e rosto/elemento forte.',
    'Exportar em alta qualidade e testar leitura no celular.'
  ];
}

export function exportPremiereChecklist(result: VideoAnalysisResult): string[] {
  return [
    'Criar sequencia vertical 1080x1920.',
    'Importar video e audio.',
    'Criar marcadores com base nos timestamps.',
    'Montar rough cut usando o mapa de cortes.',
    'Fazer limpeza de audio e reducao de ruido.',
    'Aplicar legendas e corrigir quebras de linha.',
    'Inserir b-roll em camada acima do video principal.',
    'Aplicar zooms leves nas frases de virada.',
    'Ajustar cor para contraste e leitura mobile.',
    'Exportar H.264 vertical para redes sociais.'
  ];
}
