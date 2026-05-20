# Arquitetura — Tronco IA

## Camadas

### 1. Interface

Chat central com composer, upload, seleção de módulo e painel lateral de projeto.

### 2. Tronco Central

Responsável por interpretar intenção, escolher agente, manter contexto e atualizar memória.

Componentes previstos:

- orchestrator.ts
- intentRouter.ts
- projectMemory.ts
- fileRouter.ts

### 3. Agentes

Cada agente tem prompt, pipeline e regras próprias.

Primeiro agente: publisher.

Agentes futuros: lawyer, video, visual e marketing.

### 4. Memória

Cada projeto mantém briefing, decisões aprovadas, arquivos anexados, etapa atual, entregas geradas e próximos passos.

### 5. Exportação

O sistema prepara saídas em HTML/WebBook, PDF premium, DOCX editável e ZIP final.

## Fluxo geral

Usuário envia mensagem e arquivos. A interface entrega ao Tronco Central. O Tronco classifica a intenção, escolhe o agente, atualiza a memória e executa o pipeline adequado. O agente entrega etapas aprováveis e arquivos finais.

## Regra de ouro

O Tronco nunca deve exigir que o usuário conheça prompts técnicos. O sistema deve oferecer opções guiadas, aprovações e próximas etapas.