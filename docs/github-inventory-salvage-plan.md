# GitHub Inventory Salvage Plan

Este documento organiza os repositorios relacionados ao ecossistema Sol.IA, Motion, video, audio, Jarvis e criacao de conteudo.

Objetivo: salvar o que presta, evitar duplicacao, centralizar o desenvolvimento no Tronco-ia e nao quebrar o que ja existe.

## Regra principal

- Tronco-ia e o repositorio principal do ecossistema.
- videoup_app e doador tecnico de video e audio.
- Jarvis-Sol.IA e doador de UI web e estrutura SaaS.
- JARVIS-SOL e doador de memoria/backend.
- maestro-viral-lab e modulo sonoro.
- Sol.IA e Laboratorio de Realidade / roteiros.

Nao criar novos repositorios para Motion sem necessidade.

## Matriz de salvamento

### Tronco-ia

Status: manter como tronco principal.

Funcao:
- cerebro do ecossistema Sol.IA;
- modulo oficial do Sol.IA Motion;
- documentacao estrategica;
- video-agent;
- integracao futura com Publisher, Laboratorio e Maestro.

Salvar:
- docs/video-agent.md;
- src/core/video-agent;
- logica de retencao, corte, legenda, som, b-roll, CTA e multi-editor.

Proxima acao:
- receber modulo de midia vindo do videoup_app;
- receber Visual Style Autopilot;
- receber template engine.

### videoup_app

Status: salvar com prioridade.

Funcao:
- app Expo/React Native com base real de video/audio;
- contem dependencias FFmpeg;
- contem modulo tecnico para processamento de midia.

Salvar:
- server/_core/ffmpeg.ts;
- dependencias ffmpeg-static, ffprobe-static e fluent-ffmpeg;
- referencias a expo-video, expo-audio, expo-document-picker, expo-file-system, expo-image-picker e expo-sharing.

Migrar para Tronco-ia:
- getVideoInfo;
- extractAudio;
- trimVideo;
- concatVideos;
- addSubtitles;
- addBackgroundMusic.

Cuidado:
- nao substituir arquitetura do Tronco-ia inteira;
- migrar como modulo isolado em src/core/media.

### Videoup_app---Criador-de-V-deos-Virais

Status: provavel duplicata menos completa.

Funcao:
- versao publica ou anterior do VideoUp;
- parece ter base Expo, mas nao mostrou as dependencias FFmpeg encontradas no videoup_app.

Acao:
- manter como referencia secundaria;
- nao usar como fonte principal.

### Jarvis-Sol.IA

Status: salvar como doador de UI e SaaS.

Funcao:
- app web com Vite, Express, tRPC, Radix UI, Framer Motion, Recharts, Drizzle e S3;
- pode ajudar na interface premium do ecossistema.

Salvar:
- componentes de dashboard;
- cards de modulos;
- layout de painel;
- estrutura tRPC;
- upload/S3, se estiver funcional;
- UI com Radix e Framer Motion.

Migrar para Tronco-ia:
- elementos visuais e estrutura de interface, nao necessariamente o app inteiro.

### JARVIS-SOL

Status: salvar como doador de memoria/backend.

Funcao:
- backend com Express, Supabase, SQLite, Winston, YAML e Zod;
- pode servir para memoria, historico e preferencias.

Salvar:
- padroes de persistencia;
- logs;
- memoria de usuario;
- estrutura de API.

Uso futuro:
- historico de projetos do Motion;
- presets salvos;
- preferencias por nicho;
- biblioteca de estilos usados.

### maestro-viral-lab

Status: manter como modulo sonoro separado.

Funcao:
- criacao de letras, melodias, jingles, sound logo, trilhas, loops e sound design;
- deve conversar com Motion por uma ponte de audio.

Salvar:
- lyricsGeneratorService;
- melodyGuidanceService;
- audioPlanTypes;
- simpleVideoAudioPlan;
- futuros servicos de sound design.

Integrar com Motion:
- Motion envia mapa de cortes;
- Maestro devolve plano sonoro, efeitos, prompt Suno/Udio e comandos de audio.

### Sol.IA

Status: manter como Laboratorio de Realidade / roteiros.

Funcao:
- criacao de tese, roteiro, storytelling, angulos e realidade narrativa.

Integracao:
- Laboratorio gera roteiro;
- Motion transforma roteiro em edicao;
- Maestro cria audio;
- Publisher transforma em produto editorial.

### adscript-ai

Status: verificar com calma.

Funcao provavel:
- scripts de anuncio, copy e criativos.

Uso possivel:
- ganchos;
- ofertas;
- roteiro de anuncio;
- criativos de venda.

### viralgenix / viralgenix-pro / captions-ai-mvp

Status: verificar com calma.

Funcao provavel:
- ideias anteriores de viralidade, captions ou geracao de conteudo.

Acao:
- manter como referencia secundaria;
- salvar apenas se houver logica real de captions, scores, hooks ou templates.

### Repos vazios ou quase vazios

Status: ignorar ou arquivar depois.

Exemplos:
- motion-hacker;
- SUPERA-AI;
- SolSysten;
- Solassistente;
- Narrativas-Chronoscribe1;
- SOL-IA;
- Mulheres10Xatraentes;
- Homens10xATRAENTES;
- app-limpa-iphone;
- carrosseis-stories;
- posicione-se;
- MAGNETUS-protocolo-masculino.

Acao:
- nao apagar agora;
- nao usar como base;
- arquivar somente depois de revisao final.

## Arquitetura alvo

Tronco-ia deve evoluir para:

- modules/motion;
- modules/publisher;
- modules/laboratorio;
- modules/maestro;
- modules/memory;
- src/core/media;
- src/core/templates;
- src/core/video-agent;
- src/core/audio-agent;
- src/core/analytics.

## Proximas acoes tecnicas

1. Criar src/core/media no Tronco-ia.
2. Migrar FFmpeg do videoup_app para src/core/media/ffmpeg.ts.
3. Atualizar package.json do Tronco-ia com dependencias de midia.
4. Criar Visual Style Autopilot.
5. Criar Template Schema.
6. Criar Object Orbit Template.
7. Criar ponte Motion-Maestro.
8. Testar build antes de deploy.

## Regra de seguranca

Toda migracao deve ser feita em arquivos novos quando possivel. Evitar sobrescrever arquivos existentes ate haver build validado.

Primeiro salvar. Depois refatorar. Depois integrar. Depois monetizar.
