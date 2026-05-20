# Jarvis Video Editor

Modulo oficial de video do Tronco IA.

## Objetivo

Transformar video bruto, audio, transcricao ou briefing em um plano de edicao altamente acionavel para conteudos curtos, UGC, videos de venda, autoridade, stories e cortes virais.

O agente nao deve prometer magia. Ele deve entregar uma decisao editorial precisa: o que cortar, onde cortar, o que manter, que texto colocar na tela, qual ritmo usar, qual CTA aplicar e como exportar.

## Fluxo do usuario

1. Usuario escolhe o modulo Video.
2. Usuario anexa video/audio ou cola transcricao.
3. Sistema cria um projeto de video.
4. Pipeline extrai audio e transcreve com timestamps.
5. Agente avalia gancho, clareza, emocao, autoridade, ritmo e conversao.
6. Agente gera:
   - diagnostico;
   - mapa de cortes;
   - roteiro de edicao;
   - textos de tela;
   - legendas;
   - CTA;
   - b-roll;
   - design sonoro;
   - checklist para CapCut, Premiere, Canva ou editor humano.

## MVP implementado

- Base Next/React adicionada.
- Interface do ChatShell adaptada para o modulo Video.
- Area de upload de video/audio.
- Campos de transcricao, publico, objetivo e oferta.
- Tipos de dominio do agente.
- Prompt-mestre do agente de video.

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

### 5. Exportacao

Gerar:

- JSON do plano;
- Markdown do roteiro de edicao;
- TXT para editor humano;
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
