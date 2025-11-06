# Arquitetura de Integração - Tronco-IA

## Visão Geral

O Tronco-IA foi projetado com uma arquitetura modular e extensível, preparada para integração com sistemas externos como **Sol.IA** (Assistente Estratégico Pessoal) e **Sistema Supera** (Rede de Automação).

## 🔌 Pontos de Integração Atuais

### 1. API RESTful (FastAPI)

Todos os endpoints estão disponíveis via API REST documentada automaticamente:

```
Base URL: http://localhost:8000
Documentação: http://localhost:8000/docs
```

#### Endpoints Principais:

**Chat e Conversação:**
- `POST /api/chat` - Envia mensagem para IA
- `GET /api/conversations` - Lista conversas
- `GET /api/conversations/{id}` - Detalhes de uma conversa

**Gerenciamento de Notas:**
- `POST /api/notes` - Cria nota
- `GET /api/notes` - Lista notas
- `PUT /api/notes` - Atualiza nota
- `DELETE /api/notes/{id}` - Remove nota
- `GET /api/notes/search?q={query}` - Busca notas

**Documentos:**
- `POST /api/upload` - Upload de documento
- `GET /api/documents` - Lista documentos

**Sistema:**
- `GET /api/health` - Status do sistema
- `GET /api/providers` - Providers de IA disponíveis

### 2. Banco de Dados SQLite

Localização padrão: `./data/tronco.db`

Todas as tabelas são acessíveis via SQL direto ou através do módulo `backend/database.py`:

```python
from backend.database import Database

db = Database("./data/tronco.db")
await db.initialize()

# Acesso direto às tabelas
conversations = await db.get_recent_conversations()
notes = await db.get_all_notes()
```

### 3. Sistema de Plugins (Preparado para Expansão)

A estrutura modular permite adicionar novos componentes facilmente:

```
backend/
├── ai_integration.py  # Adicionar novos providers
├── database.py        # Extensões de schema
├── document_indexer.py # Novos formatos
└── notes.py          # Lógica de contexto
```

## 🤝 Integração com Sol.IA

### Estratégia de Integração

O Sol.IA pode se conectar ao Tronco-IA de duas formas:

#### 1. **Via API (Recomendado)**

Comunicação através dos endpoints REST existentes:

```python
# Exemplo de integração Sol.IA
import httpx

class SolIAConnector:
    def __init__(self, tronco_url="http://localhost:8000"):
        self.base_url = tronco_url
    
    async def query_tronco(self, message: str, use_context=True):
        """Consulta o Tronco-IA com contexto completo"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                json={
                    "message": message,
                    "provider": "gemini",
                    "use_context": use_context
                }
            )
            return response.json()
    
    async def get_memory_context(self):
        """Recupera contexto de memória do Tronco-IA"""
        async with httpx.AsyncClient() as client:
            notes = await client.get(f"{self.base_url}/api/notes")
            docs = await client.get(f"{self.base_url}/api/documents")
            return {
                "notes": notes.json(),
                "documents": docs.json()
            }
```

#### 2. **Módulo Dedicado (Para Integração Profunda)**

Crie um módulo específico em `backend/sol_ia_integration.py`:

```python
"""
Integração dedicada com Sol.IA
Hook points para decisões estratégicas
"""

from typing import Dict, Any
from loguru import logger

class SolIABridge:
    """
    Ponte de comunicação entre Tronco-IA e Sol.IA
    """
    
    def __init__(self, database, ai_integration):
        self.db = database
        self.ai = ai_integration
        logger.info("Sol.IA Bridge inicializada")
    
    async def strategic_query(self, context: Dict[str, Any]) -> str:
        """
        Processa query estratégica com contexto enriquecido
        
        Args:
            context: Dicionário com contexto do Sol.IA
            
        Returns:
            Resposta processada
        """
        # Enriquece com memória local
        notes = await self.db.get_all_notes()
        docs = await self.db.get_all_documents()
        
        # Prepara mensagem contextualizada
        enriched_context = {
            "sol_ia_context": context,
            "tronco_memory": {
                "notes": notes,
                "documents": docs
            }
        }
        
        # Processa com IA
        return await self._process_strategic_decision(enriched_context)
    
    async def share_insight(self, insight: Dict[str, Any]):
        """
        Recebe e armazena insights do Sol.IA
        """
        await self.db.create_note(
            title=f"[Sol.IA] {insight['title']}",
            content=insight['content'],
            tags="sol-ia,strategic"
        )
    
    async def _process_strategic_decision(self, context):
        """Lógica interna de processamento"""
        # Implementar lógica específica
        pass
```

### Endpoints Dedicados Sol.IA

Adicione rotas específicas em `backend/api.py`:

```python
@app.post("/api/sol-ia/strategic-query")
async def sol_ia_strategic_query(context: dict):
    """Endpoint dedicado para queries estratégicas do Sol.IA"""
    # Implementar lógica
    pass

@app.post("/api/sol-ia/share-insight")
async def sol_ia_share_insight(insight: dict):
    """Recebe insights do Sol.IA"""
    # Implementar lógica
    pass
```

## 🌐 Integração com Sistema Supera

### Estratégia de Integração

O Sistema Supera pode orquestrar o Tronco-IA como parte de sua rede de automação:

#### 1. **Webhooks (Eventos)**

Crie módulo de webhooks em `backend/webhooks.py`:

```python
"""
Sistema de Webhooks para integração com Supera
"""

from typing import List, Callable
from loguru import logger

class WebhookManager:
    """Gerencia webhooks para eventos do Tronco-IA"""
    
    def __init__(self):
        self.webhooks: Dict[str, List[str]] = {}
    
    def register_webhook(self, event: str, url: str):
        """Registra webhook para evento específico"""
        if event not in self.webhooks:
            self.webhooks[event] = []
        self.webhooks[event].append(url)
        logger.info(f"Webhook registrado: {event} -> {url}")
    
    async def trigger_event(self, event: str, data: dict):
        """Dispara evento para webhooks registrados"""
        if event not in self.webhooks:
            return
        
        import httpx
        async with httpx.AsyncClient() as client:
            for url in self.webhooks[event]:
                try:
                    await client.post(url, json={
                        "event": event,
                        "data": data,
                        "source": "tronco-ia"
                    })
                    logger.info(f"Evento enviado: {event} -> {url}")
                except Exception as e:
                    logger.error(f"Erro ao enviar webhook: {e}")

# Eventos disponíveis:
# - "note.created"
# - "document.uploaded"
# - "chat.completed"
# - "conversation.started"
```

#### 2. **API de Automação**

Endpoints específicos para automação em `backend/api.py`:

```python
# Webhooks
@app.post("/api/supera/webhooks/register")
async def register_webhook(event: str, url: str):
    """Registra webhook para o Sistema Supera"""
    webhook_manager.register_webhook(event, url)
    return {"status": "registered"}

# Ações em lote
@app.post("/api/supera/batch/process-documents")
async def batch_process_documents(files: List[str]):
    """Processa múltiplos documentos"""
    results = []
    for file in files:
        result = await indexer.process_document(file)
        results.append(result)
    return {"processed": len(results), "results": results}

# Status e métricas
@app.get("/api/supera/metrics")
async def get_metrics():
    """Retorna métricas do sistema"""
    return {
        "total_conversations": await db.count_conversations(),
        "total_notes": await db.count_notes(),
        "total_documents": await db.count_documents(),
        "available_providers": ai.get_available_providers()
    }
```

#### 3. **Fila de Tarefas**

Para processamento assíncrono em background:

```python
# backend/task_queue.py
"""
Sistema de fila de tarefas para processamento assíncrono
"""

import asyncio
from typing import Callable, Any
from loguru import logger

class TaskQueue:
    """Gerencia fila de tarefas assíncronas"""
    
    def __init__(self):
        self.queue = asyncio.Queue()
        self.running = False
    
    async def add_task(self, task: Callable, *args, **kwargs):
        """Adiciona tarefa à fila"""
        await self.queue.put((task, args, kwargs))
        logger.info(f"Tarefa adicionada: {task.__name__}")
    
    async def worker(self):
        """Processa tarefas da fila"""
        while self.running:
            task, args, kwargs = await self.queue.get()
            try:
                await task(*args, **kwargs)
                logger.info(f"Tarefa concluída: {task.__name__}")
            except Exception as e:
                logger.error(f"Erro na tarefa: {e}")
            finally:
                self.queue.task_done()
    
    async def start(self):
        """Inicia processamento da fila"""
        self.running = True
        asyncio.create_task(self.worker())
```

## 📦 Estrutura de Dados Compartilhada

### Formato de Mensagens

```json
{
  "id": 123,
  "role": "user|assistant|system",
  "content": "Texto da mensagem",
  "created_at": "2025-11-06T14:00:00Z",
  "conversation_id": 1
}
```

### Formato de Notas

```json
{
  "id": 456,
  "title": "Título da nota",
  "content": "Conteúdo completo",
  "tags": "tag1,tag2,tag3",
  "created_at": "2025-11-06T14:00:00Z",
  "updated_at": "2025-11-06T14:30:00Z"
}
```

### Formato de Documentos

```json
{
  "id": 789,
  "filename": "documento.pdf",
  "filepath": "/uploads/documento.pdf",
  "file_type": ".pdf",
  "content": "Texto extraído...",
  "created_at": "2025-11-06T14:00:00Z",
  "indexed": true
}
```

## 🔐 Segurança e Autenticação

Para produção, implemente autenticação nos endpoints:

```python
# backend/auth.py
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verifica token de autenticação"""
    token = credentials.credentials
    # Implementar validação de token
    if not is_valid_token(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    return token

# Uso nas rotas:
@app.post("/api/sol-ia/strategic-query")
async def strategic_query(data: dict, token: str = Depends(verify_token)):
    # Rota protegida
    pass
```

## 📊 Monitoramento e Logs

Todos os logs são salvos em `logs/tronco_{data}.log` usando Loguru:

```python
from loguru import logger

# Logs automáticos em todas as operações
logger.info("Operação bem-sucedida")
logger.warning("Atenção necessária")
logger.error("Erro encontrado")
```

## 🚀 Próximos Passos

1. **Implementar autenticação JWT** para endpoints públicos
2. **Criar webhooks manager** para eventos do sistema
3. **Desenvolver task queue** para processamento assíncrono
4. **Adicionar métricas e monitoramento** com Prometheus
5. **Criar módulo de sincronização** para múltiplas instâncias
6. **Implementar cache** com Redis para performance
7. **Adicionar rate limiting** para proteção contra abuso

## 📚 Referências

- Documentação FastAPI: https://fastapi.tiangolo.com/
- Tronco-IA API Docs: http://localhost:8000/docs
- SQLite Python: https://docs.python.org/3/library/sqlite3.html

---

**Nota:** Esta documentação será atualizada conforme as integrações são implementadas.
