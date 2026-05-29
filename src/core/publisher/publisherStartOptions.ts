export type PublisherStartOptionId =
  | 'manuscript'
  | 'idea'
  | 'posts'
  | 'class_or_video'
  | 'review_existing';

export interface PublisherStartOption {
  id: PublisherStartOptionId;
  label: string;
  description: string;
  firstQuestion: string;
}

export const publisherStartOptions: PublisherStartOption[] = [
  {
    id: 'manuscript',
    label: 'Tenho um manuscrito',
    description: 'Use quando o usuario ja tem PDF, DOCX ou texto pronto.',
    firstQuestion: 'Anexe seu manuscrito ou cole o texto principal. Eu vou ler, diagnosticar e recomendar o melhor formato.'
  },
  {
    id: 'idea',
    label: 'Tenho uma ideia',
    description: 'Use quando o usuario ainda nao tem material escrito.',
    firstQuestion: 'Me conte a ideia em poucas linhas. Eu vou transformar em briefing, promessa e estrutura.'
  },
  {
    id: 'posts',
    label: 'Tenho posts soltos',
    description: 'Use quando o usuario tem conteudos de Instagram, TikTok, aulas curtas ou notas.',
    firstQuestion: 'Cole ou anexe seus posts. Eu vou agrupar temas, criar ordem e transformar em produto editorial.'
  },
  {
    id: 'class_or_video',
    label: 'Tenho aula ou video',
    description: 'Use quando o usuario tem transcricao, aula gravada ou roteiro.',
    firstQuestion: 'Envie a transcricao ou descreva a aula. Eu vou organizar em capitulos, modulos ou workbook.'
  },
  {
    id: 'review_existing',
    label: 'Quero revisar um ebook',
    description: 'Use quando o usuario ja tem um ebook e quer melhorar.',
    firstQuestion: 'Anexe o ebook existente. Eu vou revisar estrutura, texto, design, promessa e valor percebido.'
  }
];
