export type VideoObjective =
  | 'viral_short'
  | 'sales_video'
  | 'ugc_ad'
  | 'authority_clip'
  | 'story_sequence'
  | 'course_lesson';

export type TargetPlatform = 'tiktok' | 'instagram' | 'youtube_shorts' | 'kwai' | 'reels' | 'generic';

export type EditingInstruction = {
  id: string;
  start: string;
  end: string;
  action: string;
  reason: string;
  onScreenText?: string;
  caption?: string;
  soundDesign?: string;
  broll?: string;
  risk?: 'low' | 'medium' | 'high';
};

export type ViralScore = {
  hook: number;
  retention: number;
  clarity: number;
  emotion: number;
  salesPressure: number;
  authority: number;
  overall: number;
};

export type VideoAnalysisResult = {
  title: string;
  diagnosis: string;
  transcript: string;
  bestCuts: EditingInstruction[];
  retentionMap: EditingInstruction[];
  captions: string[];
  hooks: string[];
  ctas: string[];
  score: ViralScore;
  editorChecklist: string[];
};

export type VideoAgentInput = {
  projectName: string;
  objective: VideoObjective;
  platform: TargetPlatform;
  audience: string;
  offer?: string;
  transcript?: string;
  notes?: string;
};
