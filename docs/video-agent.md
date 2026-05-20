# Jarvis Video Editor

Modulo oficial de video do Tronco IA.

## Objetivo

Transformar video bruto, audio, transcricao ou briefing em um plano de edicao altamente acionavel para conteudos curtos, UGC, videos de venda, autoridade, stories e cortes virais.

O agente nao promete viralizacao garantida. Ele aumenta a probabilidade de retencao, replay, comentario, salvamento, clique e conversao com decisao editorial precisa: o que cortar, onde cortar, o que manter, que texto colocar na tela, qual ritmo usar, qual CTA aplicar e como exportar.

## Fluxo do usuario

1. Usuario escolhe o modulo Video.
2. Usuario anexa video/audio ou cola transcricao.
3. Sistema cria um projeto de video.
4. Pipeline extrai audio e transcreve com timestamps.
5. Agente avalia gancho, clareza, emocao, autoridade, ritmo e conversao.
6. Agente gera diagnostico, mapa de cortes, roteiro de edicao, textos de tela, legendas, CTA, b-roll, design sonoro e checklist.

## Motores profissionais adicionados

- `retention-score.ts`: avalia trechos por potencial de retencao e recomenda manter, cortar, apertar ou mover para o gancho.
- `viral-score.ts`: calcula score de gancho, retencao, clareza, emocao, pressao de venda, autoridade e nota geral.
- `hook-generator.ts`: cria variacoes de gancho por ameaca, identificacao, autoridade, storytelling, venda indireta, comentario, salvamento e polemica.
- `cut-map-generator.ts`: transforma segmentos de transcricao em mapa de cortes com acao, motivo, texto na tela, b-roll e som.
- `caption-engine.ts`: cria pacotes de legenda fiel, retencao, minimalista, agressiva e premium, alem de SRT simples.
- `broll-engine.ts`: sugere b-roll coerente com nicho, emocao, produto e estetica premium.
- `sound-design-engine.ts`: sugere pausas, impacto grave, queda de trilha e trilha baixa para reforcar frases fortes.
- `offer-bridge.ts`: cria pontes naturais entre dor, consciencia e oferta sem parecer mendigancia digital.
- `exporters.ts`: exporta analise em Markdown, JSON e checklists para CapCut/Premiere.
- `post-performance-analyzer.ts`: analisa metricas publicadas e sugere o que repetir, corrigir e testar.
- `index.ts`: centraliza os exports do modulo.

## MVP implementado

- Base Next/React adicionada.
- Interface do ChatShell adaptada para o modulo Video.
- Area de upload de video/audio.
- Campos de transcricao, publico, objetivo e oferta.
- Tipos de dominio do agente.
- Prompt-mestre do agente de video.
- Motores de retencao, viralizacao, cortes, legenda, b-roll, som, oferta, exportacao e pos-publicacao.

## Proximas implementacoes tecnicas

### 1. Upload real

Criar rota de API para receber arquivos com limite configuravel.
Sugestao:

- `/api/video/upload`
- armazenar temporariamente em `/tmp` no desenvolvimento;
- em producao, usar Supabase Storage, S3, Cloudflare R2 ou Vercel Blob.

### 2. Extracao de audio

Usar FFmpeg para extrair o audio do video.

Saida esperada:

- `audio.wav` ou `audio.mp3`;
- metadados: duracao, formato, tamanho, resolucao.

### 3. Transcricao

Opcoes:

- OpenAI Whisper / audio transcription;
- AssemblyAI;
- Deepgram;
- Google Speech-to-Text.

A transcricao deve retornar timestamps por frase ou segmento.

### 4. Analise editorial

Usar o prompt de `src/core/video-agent/prompt.ts` com o modelo de IA.

O resultado deve preencher o contrato de `VideoAnalysisResult`.

### 5. Exportacao avancada

Gerar:

- JSON do plano;
- Markdown do roteiro de edicao;
- TXT para editor humano;
- SRT para legendas;
- pacote de checklist para CapCut;
- pacote de checklist para Premiere;
- opcional: EDL/XML para Premiere/DaVinci em versao futura.

## Regra de qualidade do agente

O agente precisa ser assertivo, mas honesto:

- nunca inventar frase que nao esta no video;
- separar o que foi dito do que e sugestao;
- marcar trechos fracos;
- explicar por que cada corte existe;
- priorizar legibilidade mobile;
- criar CTA sem parecer mendicancia digital;
- adaptar linguagem ao nicho da Sol: relacionamento, magnetismo, autoestima, autoridade e venda emocional.

## Nome comercial sugerido

**Jarvis Video Editor — Corte, Retencao e Venda**

Subtitulo:

**O agente que transforma video bruto em roteiro de edicao cirurgico.**
