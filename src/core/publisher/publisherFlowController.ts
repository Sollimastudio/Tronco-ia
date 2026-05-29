import { getInterview } from './publisherInterview';
import type { PublisherStartOptionId } from './publisherStartOptions';

export type PublisherStage =
  | 'welcome'
  | 'interview'
  | 'project_memory'
  | 'diagnosis'
  | 'architecture'
  | 'block_plan'
  | 'writing'
  | 'visual_direction'
  | 'export_package';

export interface PublisherFlowState {
  projectId: string;
  selectedStartOption?: PublisherStartOptionId;
  stage: PublisherStage;
  approvedItems: string[];
  pendingQuestions: string[];
}

export function startPublisherFlow(option: PublisherStartOptionId): PublisherFlowState {
  const questions = getInterview(option).map((question) => question.label);

  return {
    projectId: 'draft',
    selectedStartOption: option,
    stage: 'interview',
    approvedItems: [],
    pendingQuestions: questions
  };
}

export function getNextPublisherStage(stage: PublisherStage): PublisherStage {
  const order: PublisherStage[] = [
    'welcome',
    'interview',
    'project_memory',
    'diagnosis',
    'architecture',
    'block_plan',
    'writing',
    'visual_direction',
    'export_package'
  ];

  const index = order.indexOf(stage);
  return order[index + 1] ?? 'export_package';
}

export function getStageInstruction(stage: PublisherStage): string {
  const instructions: Record<PublisherStage, string> = {
    welcome: 'Apresentar o Publisher e pedir uma forma de comecar.',
    interview: 'Fazer entrevista guiada conforme o tipo de entrada.',
    project_memory: 'Criar memoria consolidada do projeto.',
    diagnosis: 'Analisar material e entregar diagnostico editorial.',
    architecture: 'Criar arquitetura editorial final.',
    block_plan: 'Criar plano por blocos.',
    writing: 'Escrever ou reescrever o bloco atual.',
    visual_direction: 'Criar direcao visual, diagramas e ideogramas.',
    export_package: 'Gerar HTML, PDF, DOCX, pacote visual e ZIP quando possivel.'
  };

  return instructions[stage];
}
