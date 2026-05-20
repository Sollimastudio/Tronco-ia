# Tronco IA

Tronco IA é a base do Jarvis modular da Sol Lima: um app com cara de chat, memória de projeto, upload de arquivos e agentes especializados.

## Objetivo

Criar uma central de IA onde o usuário conversa, envia materiais e o Tronco Central decide qual módulo/agente deve atuar.

Primeiro módulo estruturado:

- **Publisher** — agente escritor, editor, diagramador e exportador de eBooks, livros, workbooks, protocolos e WebBooks.

Módulos futuros:

- Advogado
- Vídeo
- Visual/Design
- Marketing
- Pesquisa
- Automação

## Visão do MVP

O MVP inicial entrega:

1. Interface de chat estilo ChatGPT.
2. Seleção de módulo/agente.
3. Upload conceitual de arquivos.
4. Memória do projeto.
5. Pipeline editorial do Publisher.
6. Estrutura para exportar HTML, PDF, DOCX e pacote final.
7. Fonte de verdade dos prompts e conhecimentos do agente.

## Estrutura principal

```txt
src/
  app/                  # Next.js App Router
  components/           # Interface do chat e workspace
  core/                 # Tronco central, agentes e pipelines
  lib/                  # IA, arquivos e exportações
data/
  knowledge/            # Conhecimentos-base dos agentes
docs/                   # Arquitetura, roadmap e visão do produto
```

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois abra:

```txt
http://localhost:3000
```

## Próximos passos técnicos

- Conectar API de IA.
- Implementar upload real de arquivos.
- Adicionar extração de PDF/DOCX/TXT.
- Persistir memória em Supabase ou SQLite.
- Implementar exportação real para HTML, PDF, DOCX e ZIP.
- Criar login e projetos multiusuário.

## Observação

Este repositório não substitui o GPT personalizado dentro do ChatGPT. Ele replica e organiza o cérebro do GPT em uma aplicação própria, para uso externo e futura venda/licenciamento.
