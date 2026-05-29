export type PublisherThemeId =
  | 'luxury_editorial'
  | 'clean_minimal'
  | 'playful_kids'
  | 'premium_feminine'
  | 'executive_masculine'
  | 'spiritual_soft'
  | 'clinical_modern';

export interface PublisherThemePreset {
  id: PublisherThemeId;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    text: string;
    accent: string;
    secondary: string;
  };
  typography: {
    heading: string;
    body: string;
    accent: string;
  };
  visualLanguage: string[];
  illustrationStyle: string;
  bestFor: string[];
}

export const publisherThemes: PublisherThemePreset[] = [
  {
    id: 'luxury_editorial',
    name: 'Luxury Editorial',
    description: 'Sofisticado, premium, editorial e vendavel.',
    colors: { background: '#0A0A0A', surface: '#120609', text: '#F5F0E8', accent: '#C9A84C', secondary: '#4A0404' },
    typography: { heading: 'Playfair Display', body: 'Inter', accent: 'Cormorant Garamond' },
    visualLanguage: ['linhas finas', 'selos', 'textura nobre', 'alto contraste', 'margens amplas'],
    illustrationStyle: 'editorial conceitual, dourado antigo, sombras profundas, diagramas elegantes',
    bestFor: ['relacionamentos', 'autoconhecimento', 'metodo premium', 'ebook de autoridade']
  },
  {
    id: 'clean_minimal',
    name: 'Clean Minimal',
    description: 'Claro, leve, moderno e facil de ler.',
    colors: { background: '#FFFFFF', surface: '#F7F4EF', text: '#1F1F1F', accent: '#2F6F73', secondary: '#D8E4E3' },
    typography: { heading: 'Inter', body: 'Lato', accent: 'Inter' },
    visualLanguage: ['espaco em branco', 'cards limpos', 'icones simples', 'linhas suaves'],
    illustrationStyle: 'minimalista, vetorial, claro e didatico',
    bestFor: ['educacao', 'negocios', 'saude', 'lead magnet']
  },
  {
    id: 'playful_kids',
    name: 'Ludico Infantil',
    description: 'Colorido, amigavel, alegre e visualmente educativo.',
    colors: { background: '#FFF6D8', surface: '#FFFFFF', text: '#2A2A2A', accent: '#FFB703', secondary: '#8ECAE6' },
    typography: { heading: 'Nunito', body: 'Arial', accent: 'Baloo' },
    visualLanguage: ['formas arredondadas', 'personagens', 'adesivos', 'mapas coloridos', 'jogos visuais'],
    illustrationStyle: 'ilustracao infantil, formas simples, expressiva, colorida e segura',
    bestFor: ['criancas', 'atividades', 'historias infantis', 'educacao ludica']
  },
  {
    id: 'premium_feminine',
    name: 'Feminino Premium',
    description: 'Elegante, sensivel, maduro e emocional.',
    colors: { background: '#2A0508', surface: '#4A0404', text: '#F5EBDD', accent: '#D4AF37', secondary: '#8C5A5A' },
    typography: { heading: 'Cormorant Garamond', body: 'Lato', accent: 'Playfair Display' },
    visualLanguage: ['seda', 'papel nobre', 'floral discreto', 'espelhos', 'selos', 'contraste suave'],
    illustrationStyle: 'editorial feminino, simbolico, premium, com texturas de seda e papel',
    bestFor: ['mulheres', 'relacionamento', 'autoestima', 'protocolos femininos']
  },
  {
    id: 'executive_masculine',
    name: 'Executivo Masculino',
    description: 'Forte, classico, estrategico e direto.',
    colors: { background: '#050505', surface: '#111827', text: '#E5E7EB', accent: '#C9A84C', secondary: '#374151' },
    typography: { heading: 'Cinzel', body: 'Inter', accent: 'Playfair Display' },
    visualLanguage: ['couro', 'metal', 'linhas geometricas', 'mapas estrategicos', 'contraste forte'],
    illustrationStyle: 'luxo masculino, minimalista, escuro, com diagramas de estrategia',
    bestFor: ['homens', 'negocios', 'atracao masculina', 'lideranca']
  },
  {
    id: 'spiritual_soft',
    name: 'Espiritual Suave',
    description: 'Acolhedor, luminoso, contemplativo e delicado.',
    colors: { background: '#FAF4E8', surface: '#FFFFFF', text: '#3A2F25', accent: '#B9975B', secondary: '#E7DCC8' },
    typography: { heading: 'Cormorant Garamond', body: 'Lato', accent: 'Playfair Display' },
    visualLanguage: ['luz suave', 'textura natural', 'simbolos delicados', 'respiro', 'rituais'],
    illustrationStyle: 'aquarela suave, simbolica, serena e espiritual',
    bestFor: ['espiritualidade', 'devocional', 'cura emocional', 'jornadas internas']
  },
  {
    id: 'clinical_modern',
    name: 'Clinico Moderno',
    description: 'Tecnico, confiavel, organizado e didatico.',
    colors: { background: '#F8FAFC', surface: '#FFFFFF', text: '#0F172A', accent: '#2563EB', secondary: '#E2E8F0' },
    typography: { heading: 'Inter', body: 'Inter', accent: 'Lato' },
    visualLanguage: ['quadros', 'tabelas', 'fluxos', 'graficos simples', 'diagnosticos'],
    illustrationStyle: 'infografico limpo, tecnico, moderno e confiavel',
    bestFor: ['saude', 'psicologia', 'metodo tecnico', 'manual profissional']
  }
];

export function getPublisherTheme(themeId: PublisherThemeId) {
  return publisherThemes.find((theme) => theme.id === themeId) ?? publisherThemes[0];
}
