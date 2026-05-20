export type PublisherMode = 'private_sol' | 'public_generic';

export interface PublisherModeConfig {
  mode: PublisherMode;
  name: string;
  description: string;
  defaultTone: string;
  visualBias: string;
  requiresUserVoiceDiscovery: boolean;
}

export const privateSolPublisher: PublisherModeConfig = {
  mode: 'private_sol',
  name: 'Sol.IA Publisher Privado',
  description: 'Agente editorial privado da Sol Lima para produtos autorais da marca.',
  defaultTone: 'profundo, provocativo, sofisticado, emocional e direto',
  visualBias: 'bordo, vinho, creme, preto profundo, dourado antigo, luxo editorial',
  requiresUserVoiceDiscovery: false
};

export const publicPublisher: PublisherModeConfig = {
  mode: 'public_generic',
  name: 'Publisher IA Publico',
  description: 'Agente editorial guiado para usuarios leigos de qualquer nicho.',
  defaultTone: 'adaptavel ao nicho, publico e objetivo do usuario',
  visualBias: 'adaptavel ao projeto',
  requiresUserVoiceDiscovery: true
};
