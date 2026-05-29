export function buildPublisherMemory(input: Record<string, string>) {
  return {
    projectName: input.projectName || 'Projeto sem nome',
    audience: input.audience || 'a definir',
    goal: input.goal || 'a definir',
    tone: input.tone || 'adaptavel',
    visualStyle: input.visualStyle || 'premium e legivel',
    finalFormats: input.finalFormats || 'HTML PDF DOCX ZIP',
    sourceSummary: input.sourceSummary || 'aguardando material',
    currentStage: 'project_memory',
    nextStep: 'diagnosis'
  };
}
