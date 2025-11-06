# 🌳 Tronco-IA

**Assistente Pessoal Inteligente com IA e Indexação de Documentos**

Tronco-IA é um assistente pessoal que roda no Mac (e outros sistemas), com backend FastAPI e interface web moderna. Conecta-se a Gemini, OpenAI ou Ollama, guarda memória em SQLite, indexa PDFs/TXT/MD e permite criar notas locais para responder às suas perguntas com contexto rico e relevante.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Endpoints da API](#-endpoints-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Integração Futura](#-integração-futura-solia-e-supera-system)
- [Solução de Problemas](#-solução-de-problemas)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O Tronco-IA é uma solução completa de assistente pessoal que combina:

- **Interface Web Moderna**: UI responsiva e intuitiva
- **Backend FastAPI**: API robusta e escalável
- **Múltiplos Provedores de IA**: Suporte para OpenAI, Google Gemini e Ollama (local)
- **Indexação de Documentos**: Processa e indexa PDFs, TXT e Markdown
- **Memória Persistente**: Armazena conversas e contexto em SQLite
- **Sistema de Notas**: Crie e organize notas locais
- **Busca Semântica**: Recupera informações relevantes dos documentos

---

## ✨ Funcionalidades

### 🤖 Chat Inteligente
- Conversas naturais com IA
- Histórico de conversas persistente
- Suporte para múltiplos provedores (OpenAI, Gemini, Ollama)
- Contexto enriquecido com documentos indexados

### 📄 Processamento de Documentos
- Upload de PDFs, TXT e Markdown
- Indexação automática com embeddings
- Busca semântica vetorial
- Extração e chunking inteligente de texto

### 📝 Sistema de Notas
- Criação de notas locais
- Organização com tags
- Busca e recuperação rápida

### 💾 Persistência de Dados
- Banco de dados SQLite
- Armazenamento de conversas
- Metadados de documentos
- Sistema de notas

---

## 🏗️ Arquitetura

### Componentes Principais

```
┌─────────────────────────────────────────────────┐
│           Frontend (HTML/CSS/JS)                │
│         Interface Web Responsiva                │
└─────────────────┬───────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────────┐
│              Backend FastAPI                    │
│  ┌──────────────────────────────────────────┐  │
│  │  Endpoints REST:                         │  │
│  │  - /api/status (Status do sistema)       │  │
│  │  - /api/chat (Chat com IA)               │  │
│  │  - /api/documents/* (Gestão docs)        │  │
│  │  - /api/conversations/* (Histórico)      │  │
│  │  - /api/notes/* (Sistema de notas)       │  │
│  └──────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        ↓                    ↓
┌───────────────┐    ┌──────────────────┐
│   AI Service  │    │ Document         │
│               │    │ Processor        │
│ - OpenAI      │    │                  │
│ - Gemini      │    │ - PyPDF2         │
│ - Ollama      │    │ - LangChain      │
└───────┬───────┘    │ - ChromaDB       │
        │            │ - Embeddings     │
        │            └────────┬─────────┘
        │                     │
        ↓                     ↓
┌─────────────────────────────────────┐
│         SQLite Database             │
│                                     │
│ Tables:                             │
│ - conversations                     │
│ - messages                          │
│ - documents                         │
│ - notes                             │
└─────────────────────────────────────┘
```

### Fluxo de Dados

1. **Chat com IA**:
   - Usuário envia mensagem via frontend
   - Backend busca contexto relevante nos documentos (se habilitado)
   - Provedor de IA gera resposta enriquecida com contexto
   - Resposta é salva no banco e retornada ao usuário

2. **Processamento de Documentos**:
   - Usuário faz upload de documento
   - Sistema extrai texto (PDF/TXT/MD)
   - Texto é dividido em chunks
   - Chunks são convertidos em embeddings
   - Embeddings são armazenados no ChromaDB
   - Metadados salvos no SQLite

3. **Busca Semântica**:
   - Query do usuário é convertida em embedding
   - ChromaDB busca chunks similares
   - Resultados são agregados como contexto
   - Contexto é enviado junto com a query para a IA

---

## 🔧 Pré-requisitos

- **Python 3.8+**
- **pip** (gerenciador de pacotes Python)
- **Git**
- Chave de API de pelo menos um provedor:
  - OpenAI API Key (opcional)
  - Google Gemini API Key (opcional)
  - Ollama instalado localmente (opcional)

---

## 📦 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/Sollimastudio/Tronco-ia.git
cd Tronco-ia
```

### 2. Crie um Ambiente Virtual

```bash
python3 -m venv venv
source venv/bin/activate  # No Mac/Linux
# ou
venv\Scripts\activate  # No Windows
```

### 3. Instale as Dependências

```bash
pip install -r requirements.txt
```

---

## ⚙️ Configuração

### 1. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e edite com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# API Keys (configure pelo menos uma)
OPENAI_API_KEY=sua_chave_openai_aqui
GOOGLE_API_KEY=sua_chave_gemini_aqui
OLLAMA_URL=http://localhost:11434

# Database
DATABASE_URL=sqlite+aiosqlite:///./tronco_ia.db

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# AI Model Selection (openai, gemini, ollama)
AI_PROVIDER=gemini
MODEL_NAME=gemini-pro
```

### 2. Obtenha as Chaves de API

#### Google Gemini (Recomendado para começar - Grátis)
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma chave de API
3. Copie e cole no `.env` como `GOOGLE_API_KEY`

#### OpenAI
1. Acesse [OpenAI Platform](https://platform.openai.com/api-keys)
2. Crie uma chave de API
3. Copie e cole no `.env` como `OPENAI_API_KEY`

#### Ollama (Local - Sem necessidade de API Key)
1. Instale o [Ollama](https://ollama.ai/)
2. Baixe um modelo: `ollama pull llama2`
3. Configure `AI_PROVIDER=ollama` no `.env`

---

## 🚀 Uso

### 1. Inicie o Servidor

```bash
python main.py
```

Ou usando uvicorn diretamente:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Acesse a Interface Web

Abra seu navegador e acesse:

```
http://localhost:8000
```

### 3. Funcionalidades Principais

#### Chat com IA
1. Digite sua pergunta na caixa de texto
2. Pressione Enter ou clique em "Enviar"
3. A IA responderá considerando o contexto dos documentos (se habilitado)

#### Upload de Documentos
1. Clique em "Enviar Documento" na barra lateral
2. Selecione um arquivo PDF, TXT ou MD
3. O documento será processado e indexado automaticamente
4. Agora você pode fazer perguntas sobre o conteúdo

#### Criar Notas
1. Clique em "Nova Nota" na barra lateral
2. Preencha título, conteúdo e tags
3. Clique em "Salvar Nota"
4. A nota ficará disponível para consulta

#### Gerenciar Conversas
- Clique em "Nova Conversa" para começar do zero
- Clique em qualquer conversa anterior para continuar

---

## 🔌 Endpoints da API

### Status do Sistema

```http
GET /api/status
```

**Resposta:**
```json
{
  "status": "online",
  "version": "1.0.0",
  "ai_provider": "gemini",
  "database": "connected",
  "documents_count": 5,
  "conversations_count": 10
}
```

### Chat

```http
POST /api/chat
Content-Type: application/json

{
  "message": "Qual é o resumo do documento X?",
  "conversation_id": 1,  // opcional
  "use_context": true
}
```

**Resposta:**
```json
{
  "response": "Com base no documento...",
  "conversation_id": 1,
  "message_id": 42
}
```

### Upload de Documento

```http
POST /api/documents/upload
Content-Type: multipart/form-data

file: [arquivo]
```

**Resposta:**
```json
{
  "id": 1,
  "filename": "documento.pdf",
  "file_type": "pdf",
  "status": "indexed",
  "total_chunks": 25,
  "uploaded_at": "2025-11-06T14:30:00"
}
```

### Listar Documentos

```http
GET /api/documents
```

### Listar Conversas

```http
GET /api/conversations
```

### Mensagens de uma Conversa

```http
GET /api/conversations/{conversation_id}/messages
```

### Criar Nota

```http
POST /api/notes
Content-Type: application/json

{
  "title": "Minha Nota",
  "content": "Conteúdo da nota",
  "tags": "importante, lembrete"
}
```

### Listar Notas

```http
GET /api/notes
```

---

## 📁 Estrutura do Projeto

```
Tronco-ia/
├── main.py                  # Aplicação FastAPI principal
├── models.py                # Modelos SQLAlchemy (database schema)
├── database.py              # Configuração do banco de dados
├── ai_service.py            # Serviço de integração com IAs
├── document_processor.py    # Processamento e indexação de docs
├── requirements.txt         # Dependências Python
├── .env.example            # Exemplo de configuração
├── .gitignore              # Arquivos ignorados pelo Git
├── README.md               # Esta documentação
├── static/                 # Frontend
│   ├── index.html          # Interface principal
│   ├── style.css           # Estilos
│   └── app.js              # Lógica do frontend
├── uploads/                # Documentos enviados (criado automaticamente)
├── chroma_db/              # Banco vetorial (criado automaticamente)
└── tronco_ia.db            # Banco SQLite (criado automaticamente)
```

---

## 🔮 Integração Futura: Sol.IA e Supera System

O Tronco-IA foi projetado com arquitetura modular para facilitar futuras integrações:

### Preparação para Sol.IA

**Sol.IA** será integrado como um assistente especializado adicional. A arquitetura atual já suporta:

- **Endpoints Extensíveis**: Novos endpoints podem ser adicionados facilmente
- **Sistema de Provedores Plugável**: `AIProvider` abstrato permite adicionar novos provedores
- **Compartilhamento de Contexto**: Sistema de busca semântica pode ser usado por Sol.IA

**Pontos de Integração Planejados:**

```python
# Futuro: ai_service.py
class SolIAProvider(AIProvider):
    """Provedor Sol.IA especializado"""
    
    async def generate_response(self, messages, context):
        # Lógica específica do Sol.IA
        pass
```

### Preparação para Supera System

**Supera System** será integrado como camada de orquestração superior:

- **API Gateway**: FastAPI pode atuar como microserviço no Supera System
- **Event-Driven**: Arquitetura preparada para eventos e webhooks
- **Escalabilidade**: FastAPI assíncrono permite alta concorrência

**Estrutura Proposta:**

```
Supera System (Orchestrator)
    ↓
    ├── Tronco-IA (Knowledge & Memory)
    ├── Sol.IA (Specialized Assistant)
    └── [Outros Módulos]
```

### Padrões de Integração

1. **API REST**: Endpoints já padronizados com OpenAPI/Swagger
2. **Webhooks**: Facilmente implementáveis com FastAPI BackgroundTasks
3. **Message Queue**: Pronto para RabbitMQ/Redis se necessário
4. **Authentication**: JWT/OAuth2 pode ser adicionado sem refatoração

### Próximos Passos

- [ ] Implementar autenticação e autorização
- [ ] Adicionar sistema de webhooks
- [ ] Criar SDK para integração com Sol.IA
- [ ] Desenvolver API Gateway para Supera System
- [ ] Implementar sistema de eventos
- [ ] Adicionar monitoramento e logs estruturados

---

## 🔍 Solução de Problemas

### Erro: "Provedor de IA não inicializado"

**Causa**: Chave de API não configurada ou inválida.

**Solução**:
1. Verifique se o arquivo `.env` existe
2. Confirme que a chave de API está correta
3. Verifique se o `AI_PROVIDER` corresponde à chave configurada

### Erro ao Processar PDFs

**Causa**: Arquivo PDF corrompido ou protegido por senha.

**Solução**:
1. Tente abrir o PDF em um leitor para verificar
2. Remova proteções por senha
3. Converta para PDF/A se houver problemas de compatibilidade

### Banco de Dados Travado

**Causa**: SQLite não suporta múltiplas escritas simultâneas.

**Solução**:
1. Reinicie o servidor
2. Para produção, considere PostgreSQL ou MySQL

### ChromaDB não Indexando

**Causa**: Modelo de embeddings não baixado.

**Solução**:
```bash
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')"
```

### Ollama não Conecta

**Causa**: Ollama não está rodando.

**Solução**:
1. Instale o Ollama: https://ollama.ai/
2. Inicie o serviço: `ollama serve`
3. Baixe um modelo: `ollama pull llama2`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga o estilo de código Python PEP 8
- Adicione testes para novas funcionalidades
- Atualize a documentação conforme necessário
- Mantenha commits pequenos e descritivos

---

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

## 📞 Suporte

Para questões e suporte:
- Abra uma [Issue](https://github.com/Sollimastudio/Tronco-ia/issues)
- Consulte a [Documentação da API](http://localhost:8000/docs) quando o servidor estiver rodando

---

## 🙏 Agradecimentos

- FastAPI pela excelente framework
- LangChain pelo processamento de documentos
- ChromaDB pelo banco vetorial
- OpenAI, Google e Ollama pelos modelos de IA
- Comunidade open-source

---

**Desenvolvido com ❤️ pela Sollimastudio**
