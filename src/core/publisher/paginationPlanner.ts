export type PageKind =
  | 'cover'
  | 'title_page'
  | 'copyright'
  | 'manifesto'
  | 'how_to_use'
  | 'index'
  | 'chapter_opening'
  | 'text'
  | 'quote'
  | 'exercise'
  | 'checklist'
  | 'diagram'
  | 'infographic'
  | 'summary'
  | 'cta'
  | 'bonus';

export interface PagePlanItem {
  pageNumber: number;
  kind: PageKind;
  title: string;
  purpose: string;
  contentSource: string;
  visualAsset?: string;
  themeRole?: string;
}

export interface PaginationPlanInput {
  productTitle: string;
  estimatedWords: number;
  hasExercises?: boolean;
  hasDiagrams?: boolean;
  hasBonuses?: boolean;
  chapterCount?: number;
}

export function planPagination(input: PaginationPlanInput): PagePlanItem[] {
  const pages: PagePlanItem[] = [];
  let page = 1;

  function add(kind: PageKind, title: string, purpose: string, contentSource: string, visualAsset?: string, themeRole?: string) {
    pages.push({ pageNumber: page, kind, title, purpose, contentSource, visualAsset, themeRole });
    page += 1;
  }

  add('cover', input.productTitle, 'Primeira impressao e valor percebido.', 'criar do zero', 'hero visual de capa', 'impacto');
  add('title_page', 'Folha de rosto', 'Apresentar titulo, subtitulo e autoria.', 'criar do zero', 'selo editorial', 'institucional');
  add('copyright', 'Direitos e aviso de uso', 'Proteger material e orientar uso.', 'template', undefined, 'legal');
  add('manifesto', 'Carta de abertura', 'Criar conexao emocional e contexto.', 'manuscrito ou briefing', 'imagem conceitual', 'emocional');
  add('how_to_use', 'Como usar este material', 'Ensinar leitura e aplicacao.', 'criar do zero', 'fluxo simples', 'didatico');
  add('index', 'Indice', 'Orientar navegacao.', 'arquitetura', 'mapa editorial', 'navegacao');

  const chapterCount = input.chapterCount || Math.max(3, Math.ceil(input.estimatedWords / 2500));
  const textPagesPerChapter = Math.max(2, Math.ceil(input.estimatedWords / chapterCount / 450));

  for (let chapter = 1; chapter <= chapterCount; chapter += 1) {
    add('chapter_opening', `Abertura do capitulo ${chapter}`, 'Criar transicao visual e conceitual.', 'arquitetura', 'abertura tematica', 'respiro');

    for (let i = 1; i <= textPagesPerChapter; i += 1) {
      add('text', `Capitulo ${chapter} - pagina ${i}`, 'Desenvolver conteudo principal.', 'manuscrito aprovado', undefined, 'leitura');
    }

    if (input.hasDiagrams) {
      add('diagram', `Diagrama do capitulo ${chapter}`, 'Explicar visualmente o conceito central.', 'criar do zero', 'diagrama ou ideograma', 'compreensao');
    }

    if (input.hasExercises) {
      add('exercise', `Exercicio do capitulo ${chapter}`, 'Transformar leitura em aplicacao.', 'design instrucional', 'card de exercicio', 'acao');
    }

    add('summary', `Resumo do capitulo ${chapter}`, 'Fixar ideias principais.', 'criar do zero', 'card de sintese', 'fixacao');
  }

  if (input.hasBonuses) {
    add('bonus', 'Bonus', 'Aumentar valor percebido.', 'criar do zero', 'selo de bonus', 'valor');
  }

  add('cta', 'Proximo passo', 'Conduzir para acao final.', 'estrategia comercial', 'botao ou pagina final', 'conversao');

  return pages;
}
