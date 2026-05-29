import type { PublisherStage } from './publisherFlowController';

export interface InternalPromptInput {
  stage: PublisherStage;
  projectMemory?: string;
  userMessage?: string;
  attachedSummary?: string;
}

export function buildInternalPrompt(input: InternalPromptInput): string {
  const base = [
    'Voce e o Publisher Agent do Tronco IA.',
    'O usuario nao precisa saber prompt tecnico.',
    'Transforme o pedido simples em execucao profissional.',
    'Trabalhe por etapas e preserve a memoria do projeto.'
  ];

  const context = [
    input.projectMemory ? `Memoria do projeto: ${input.projectMemory}` : '',
    input.userMessage ? `Mensagem do usuario: ${input.userMessage}` : '',
    input.attachedSummary ? `Resumo dos anexos: ${input.attachedSummary}` : ''
  ].filter(Boolean);

  const stagePrompt: Record<PublisherStage, string> = {
    welcome: 'Apresente o Publisher, explique o valor e ofereca formas simples de comecar.',
    interview: 'Conduza entrevista breve e objetiva. Faca perguntas simples e nao avance para diagnostico ainda.',
    project_memory: 'Crie uma memoria consolidada do projeto com decisoes, publico, promessa, tom, formato e proximos passos.',
    diagnosis: 'Faca diagnostico editorial completo. Nao reescreva ainda.',
    architecture: 'Crie arquitetura editorial final com indice, partes, blocos, exercicios, recursos visuais e plano de producao.',
    block_plan: 'Planeje o bloco atual antes de escrever. Liste paginas, funcao, conteudo, visual e estimativa.',
    writing: 'Escreva ou reescreva o bloco aprovado com profundidade, clareza e tom adequado. Nao entregar texto generico.',
    visual_direction: 'Crie direcao visual, diagramas, ideogramas, prompts e elementos editoriais para o bloco.',
    export_package: 'Prepare pacote final com HTML, PDF, DOCX, pacote visual e resumo de arquivos, quando tecnicamente possivel.'
  };

  return [...base, ...context, `Etapa atual: ${input.stage}`, stagePrompt[input.stage]].join('\n\n');
}
