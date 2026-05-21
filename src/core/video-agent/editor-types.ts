export type SupportedEditor =
  | 'capcut'
  | 'canva'
  | 'premiere'
  | 'davinci'
  | 'finalCut'
  | 'descript'
  | 'captions'
  | 'adobeExpress'
  | 'humanEditor';

export type EditorCommandInput = {
  objective: string;
  platform: string;
  durationSeconds?: number;
  editingStyle: string;
  hasVoiceOver?: boolean;
  hasOffer?: boolean;
  cutMap?: Array<{
    start: string;
    end: string;
    purpose: string;
    onScreenText?: string;
    soundCue?: string;
  }>;
};

export type MultiEditorCommandPack = Record<SupportedEditor | 'universal' | 'strategy', string[] | string>;
