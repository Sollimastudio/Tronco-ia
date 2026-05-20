export interface ProjectMemory {
  id: string;
  name: string;
  productType?: string;
  audience?: string;
  promise?: string;
  voice?: string;
  visualStyle?: string;
  currentStep?: string;
  approvedDecisions: string[];
  attachedFiles: Array<{ name: string; type: string; status: string }>;
  generatedOutputs: Array<{ name: string; type: string; path?: string }>;
  nextSteps: string[];
}

export const emptyProjectMemory: ProjectMemory = {
  id: 'draft',
  name: 'Novo projeto',
  approvedDecisions: [],
  attachedFiles: [],
  generatedOutputs: [],
  nextSteps: ['entrevista_guiada']
};
