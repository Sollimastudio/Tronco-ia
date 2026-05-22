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
- `editor-types.ts`: define editores suportados e entrada de comandos multi-editor.
- `editor-command-engine.ts`: traduz estrategia de edicao para CapCut, Canva e Premiere.
- `src/core/media/ffmpeg.ts`: modulo migrado do `videoup_app` para processamento real de midia.
- `index.ts`: centraliza os exports do modulo.

## Modulo de midia migrado

O repositorio `videoup_app` foi identificado como doador tecnico de video e audio. O arquivo `server/_core/ffmpeg.ts` foi migrado para o Tronco IA em:

`src/core/media/ffmpeg.ts`

Funcoes ja salvas no Tronco:

- `getVideoInfo`: le metadados do video com ffprobe.
- `extractAudio`: extrai audio em MP3 mono 16kHz para transcricao.
- `trimVideo`: corta video por tempo inicial e duracao.
- `concatVideos`: junta clipes em um arquivo final.
- `addSubtitles`: aplica legenda ASS no video.
- `addBackgroundMusic`: mistura musica de fundo com o audio original.

Dependencias adicionadas:

- `ffmpeg-static`;
- `ffprobe-static`;
- `fluent-ffmpeg`;
- `@types/fluent-ffmpeg`.

Regra: este modulo fica isolado ate que upload, transcricao e exportacao sejam integrados com seguranca.

## Atualizacao multi-editor

O Sol.IA Motion nao deve entregar um unico comando generico. Ele deve primeiro definir a estrategia e depois traduzir para a ferramenta escolhida pelo usuario.

Editores previstos:

- CapCut: cortes rapidos, auto captions, keyframes, templates e edicao mobile.
- Canva: capas, cenas visuais, mockups, stories, textos grandes e assets de marca.
- Adobe Premiere: timeline profissional, markers, tracks, SRT, audio, cor e exportacao.
- DaVinci Resolve: timeline, color, Fairlight e finalizacao profissional.
- Final Cut: magnetic timeline, roles, captions e fluxo rapido para Mac.
- Descript: edicao por transcricao, limpeza de fala e cortes a partir do texto.
- Captions: videos com rosto, legenda dinamica e fala direta.
- Adobe Express: pecas rapidas, stories, anuncios leves e cortes simples.
- Editor humano: briefing, mapa de cortes, textos, b-roll, som, CTA e referencias.

Regra: um cerebro, varias linguas de edicao.

## Parede Netflix do ecossistema

O usuario pode usar cada agente separadamente ou em fluxo integrado.

- Laboratorio de Realidade: gera tese, roteiro, gravar agora, testar, reaproveitar e vender sem parecer venda.
- Sol.IA Motion: transforma roteiro, video ou transcricao em guia de gravacao, mapa de cortes, textos, legenda, b-roll, som e CTA.
- Maestro Viral Lab: cria trilhas, jingles, sound logo, loops, prompts Suno/Udio e mapa sonoro.

Quando o usuario termina um modulo, o sistema deve sugerir o proximo passo como card de continuidade:

- Se gerou roteiro no Laboratorio, oferecer: transformar em guia de gravacao e mapa de edicao no Motion.
- Se editou no Motion e falta som, oferecer: gerar trilha, jingle ou sound design no Maestro.
- Se o video gravado esta fraco, oferecer: reconstruir a tese no Laboratorio.

## Integracao com Maestro Viral Lab

O Motion deve tratar audio como camada de retencao, nao como enfeite.

Tipos de saida sonora esperados:

- trilha de fundo para video;
- loop de 7, 15, 30 e 60 segundos;
- jingle curto;
- sound logo de marca;
- impacto grave no gancho;
- riser antes da virada;
- silencio dramatico;
- som de texto entrando;
- queda de trilha antes da frase forte;
- sting final para CTA;
- comandos de audio para CapCut, Premiere, Canva, DaVinci e outros.

O Motion deve solicitar ao Maestro um plano sonoro quando o video tiver mapa de cortes, oferta, CTA ou estilo emocional definido.

## MVP implementado

- Base Next/React adicionada.
- Interface do ChatShell adaptada para o modulo Video.
- Area de upload de video/audio.
- Campos de transcricao, publico, objetivo e oferta.
- Tipos de dominio do agente.
- Prompt-mestre do agente de video.
- Motores de retencao, viralizacao, cortes, legenda, b-roll, som, oferta, exportacao e pos-publicacao.
- Comandos iniciais multi-editor para CapCut, Canva e Premiere.
- Inventario de salvamento do GitHub em `docs/github-inventory-salvage-plan.md`.
- Modulo FFmpeg migrado para `src/core/media/ffmpeg.ts`.

## Proximas implementacoes tecnicas

### 1. Upload real

Criar rota de API para receber arquivos com limite configuravel.
Sugestao:

- `/api/video/upload`
- armazenar temporariamente em `/tmp` no desenvolvimento;
- em producao, usar Supabase Storage, S3, Cloudflare R2 ou Vercel Blob.

### 2. Extracao de audio

Usar o modulo migrado `src/core/media/ffmpeg.ts` para extrair o audio do video.

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
- pacote de comandos Canva;
- opcional: EDL/XML para Premiere/DaVinci em versao futura.

### 6. Maestro Motion Audio Bridge

Criar ponte tecnica com Maestro Viral Lab para receber mapa de cortes e devolver:

- estrategia sonora;
- prompt Suno/Udio;
- lista de efeitos;
- timeline sonora;
- comandos de audio por editor;
- sugestao de sound logo ou jingle.

### 7. Visual Style Autopilot

Criar modulo para receber print, video ou referencia visual e detectar automaticamente o estilo de edicao.

Primeiro estilo obrigatorio:

- Objeto-Orbita / Floating Product Collage.

Saida esperada:

- estilo detectado;
- por que prende o scroll;
- assets necessarios;
- plano de cena;
- comandos CapCut;
- comandos Canva;
- comandos Premiere/After Effects;
- plano sonoro;
- checklist final.

Regra: o usuario nao cola prompt. O agente cria prompt interno e entrega plano executavel.

## Regra de qualidade do agente

O agente precisa ser assertivo, mas honesto:

- nunca inventar frase que nao esta no video;
- separar o que foi dito do que e sugestao;
- marcar trechos fracos;
- explicar por que cada corte existe;
- priorizar legibilidade mobile;
- criar CTA sem parecer mendicancia digital;
- adaptar linguagem ao nicho da Sol: relacionamento, magnetismo, autoestima, autoridade e venda emocional;
- traduzir o mesmo plano para o editor escolhido;
- usar som para emocao, clareza, ritmo e memoria, sem prometer manipulacao mental ou efeito medico.

## Nome comercial sugerido

**Jarvis Video Editor — Corte, Retencao e Venda**

Subtitulo:

**O agente que transforma video bruto em roteiro de edicao cirurgico.**
