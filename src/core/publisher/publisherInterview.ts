import type { PublisherStartOptionId } from './publisherStartOptions';

export interface InterviewQuestion {
  id: string;
  label: string;
  helper?: string;
  required?: boolean;
}

export const commonPublisherQuestions: InterviewQuestion[] = [
  { id: 'projectName', label: 'Qual e o nome do projeto ou produto?', required: true },
  { id: 'audience', label: 'Para quem esse material sera criado?', required: true },
  { id: 'goal', label: 'Voce quer vender, captar leads, ensinar, posicionar autoridade ou organizar conhecimento?', required: true },
  { id: 'tone', label: 'Qual tom deseja? Ex: tecnico, emocional, premium, popular, espiritual, provocativo.', required: false },
  { id: 'visualStyle', label: 'Qual estilo visual combina com o projeto?', required: false },
  { id: 'finalFormats', label: 'Quais formatos deseja no final? HTML, PDF, DOCX, pacote visual, ZIP.', required: false }
];

export const interviewByStartOption: Record<PublisherStartOptionId, InterviewQuestion[]> = {
  manuscript: [
    { id: 'file', label: 'Anexe o manuscrito ou cole o texto principal.', required: true },
    { id: 'knownProblems', label: 'O que voce sente que esta ruim ou incompleto no manuscrito?', required: false },
    { id: 'interventionLevel', label: 'Pode reescrever, expandir, reorganizar e criar partes novas?', required: true }
  ],
  idea: [
    { id: 'ideaSummary', label: 'Descreva sua ideia em poucas linhas.', required: true },
    { id: 'transformation', label: 'Que transformacao voce quer prometer ao leitor?', required: true },
    { id: 'experience', label: 'Voce tem experiencia, metodo ou historia propria ligada a isso?', required: false }
  ],
  posts: [
    { id: 'contentDump', label: 'Cole ou anexe seus posts, notas ou conteudos soltos.', required: true },
    { id: 'themeClusters', label: 'Existe algum tema principal que deve conduzir tudo?', required: false },
    { id: 'reuseStyle', label: 'Deseja manter a linguagem original dos posts ou transformar em livro?', required: true }
  ],
  class_or_video: [
    { id: 'transcript', label: 'Envie a transcricao ou resumo da aula/video.', required: true },
    { id: 'formatPreference', label: 'Esse material deve virar ebook, workbook, roteiro, protocolo ou curso?', required: false },
    { id: 'examples', label: 'Ha exemplos, casos ou exercicios que precisam entrar?', required: false }
  ],
  review_existing: [
    { id: 'existingFile', label: 'Anexe o ebook existente.', required: true },
    { id: 'mainComplaint', label: 'O que mais te incomoda nele hoje?', required: true },
    { id: 'desiredUpgrade', label: 'Voce quer melhorar texto, design, promessa, estrutura ou tudo?', required: true }
  ]
};

export function getInterview(option: PublisherStartOptionId) {
  return [...commonPublisherQuestions, ...interviewByStartOption[option]];
}
