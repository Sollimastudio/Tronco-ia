# 📡 API Documentation - Tronco-IA

Esta documentação descreve os endpoints disponíveis na API do Tronco-IA.

## Base URL

```
http://localhost:8000
```

## Documentação Interativa

O FastAPI gera automaticamente documentação interativa:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Endpoints

### 🏥 Status do Sistema

**GET** `/api/status`

Verifica o status do sistema e retorna informações sobre a configuração atual.

**Resposta (200 OK)**:
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

---

### 💬 Chat

**POST** `/api/chat`

Envia uma mensagem para a IA e recebe uma resposta.

**Request Body**:
```json
{
  "message": "Qual é o resumo do documento X?",
  "conversation_id": 1,
  "use_context": true
}
```

**Parâmetros**:
- `message` (string, obrigatório): A mensagem do usuário
- `conversation_id` (integer, opcional): ID de uma conversa existente. Se omitido, cria uma nova conversa
- `use_context` (boolean, opcional): Se `true`, a IA usa contexto dos documentos indexados. Default: `true`

**Resposta (200 OK)**:
```json
{
  "response": "Com base no documento X, o resumo é...",
  "conversation_id": 1,
  "message_id": 42
}
```

---

### 📤 Upload de Documento

**POST** `/api/documents/upload`

Faz upload e indexa um documento.

**Request**: `multipart/form-data`
- `file`: Arquivo PDF, TXT ou MD

**Resposta (200 OK)**:
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

**Status possíveis**:
- `pending`: Aguardando indexação
- `indexed`: Indexado com sucesso
- `error`: Erro na indexação

---

### 📚 Listar Documentos

**GET** `/api/documents`

Lista todos os documentos enviados.

**Resposta (200 OK)**:
```json
[
  {
    "id": 1,
    "filename": "documento.pdf",
    "file_type": "pdf",
    "status": "indexed",
    "total_chunks": 25,
    "uploaded_at": "2025-11-06T14:30:00"
  },
  {
    "id": 2,
    "filename": "notas.txt",
    "file_type": "txt",
    "status": "indexed",
    "total_chunks": 10,
    "uploaded_at": "2025-11-06T15:00:00"
  }
]
```

---

### 💬 Listar Conversas

**GET** `/api/conversations`

Lista todas as conversas salvas.

**Resposta (200 OK)**:
```json
[
  {
    "id": 1,
    "title": "Qual é o resumo do documento X?",
    "created_at": "2025-11-06T14:30:00",
    "updated_at": "2025-11-06T14:35:00"
  },
  {
    "id": 2,
    "title": "Como fazer uma requisição POST?",
    "created_at": "2025-11-06T15:00:00",
    "updated_at": "2025-11-06T15:05:00"
  }
]
```

---

### 📝 Mensagens de uma Conversa

**GET** `/api/conversations/{conversation_id}/messages`

Obtém todas as mensagens de uma conversa específica.

**Parâmetros de URL**:
- `conversation_id` (integer): ID da conversa

**Resposta (200 OK)**:
```json
[
  {
    "id": 1,
    "role": "user",
    "content": "Qual é o resumo do documento X?",
    "created_at": "2025-11-06T14:30:00"
  },
  {
    "id": 2,
    "role": "assistant",
    "content": "Com base no documento X, o resumo é...",
    "created_at": "2025-11-06T14:30:05"
  }
]
```

---

### 📝 Criar Nota

**POST** `/api/notes`

Cria uma nova nota local.

**Request Body**:
```json
{
  "title": "Minha Nota Importante",
  "content": "Conteúdo da nota com informações relevantes.",
  "tags": "importante, lembrete, trabalho"
}
```

**Parâmetros**:
- `title` (string, obrigatório): Título da nota
- `content` (string, obrigatório): Conteúdo da nota
- `tags` (string, opcional): Tags separadas por vírgula

**Resposta (200 OK)**:
```json
{
  "id": 1,
  "title": "Minha Nota Importante",
  "content": "Conteúdo da nota com informações relevantes.",
  "tags": "importante, lembrete, trabalho",
  "created_at": "2025-11-06T14:30:00",
  "updated_at": "2025-11-06T14:30:00"
}
```

---

### 📋 Listar Notas

**GET** `/api/notes`

Lista todas as notas criadas.

**Resposta (200 OK)**:
```json
[
  {
    "id": 1,
    "title": "Minha Nota Importante",
    "content": "Conteúdo da nota com informações relevantes.",
    "tags": "importante, lembrete, trabalho",
    "created_at": "2025-11-06T14:30:00",
    "updated_at": "2025-11-06T14:30:00"
  },
  {
    "id": 2,
    "title": "Reunião de Projeto",
    "content": "Notas da reunião...",
    "tags": "reunião, projeto",
    "created_at": "2025-11-06T15:00:00",
    "updated_at": "2025-11-06T15:00:00"
  }
]
```

---

## Códigos de Status HTTP

- `200 OK`: Requisição bem-sucedida
- `400 Bad Request`: Dados inválidos ou faltando parâmetros obrigatórios
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

---

## Exemplos de Uso

### cURL

**Status do Sistema**:
```bash
curl http://localhost:8000/api/status
```

**Chat**:
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Olá, como você está?",
    "use_context": true
  }'
```

**Upload de Documento**:
```bash
curl -X POST http://localhost:8000/api/documents/upload \
  -F "file=@documento.pdf"
```

**Criar Nota**:
```bash
curl -X POST http://localhost:8000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Minha Nota",
    "content": "Conteúdo importante",
    "tags": "importante"
  }'
```

### Python

```python
import requests

# Status do sistema
response = requests.get('http://localhost:8000/api/status')
print(response.json())

# Chat
response = requests.post('http://localhost:8000/api/chat', json={
    'message': 'Olá!',
    'use_context': True
})
print(response.json())

# Upload de documento
with open('documento.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/documents/upload',
        files={'file': f}
    )
    print(response.json())
```

### JavaScript

```javascript
// Status do sistema
fetch('http://localhost:8000/api/status')
  .then(response => response.json())
  .then(data => console.log(data));

// Chat
fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Olá!',
    use_context: true
  })
})
  .then(response => response.json())
  .then(data => console.log(data));

// Upload de documento
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:8000/api/documents/upload', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## Autenticação

Atualmente, a API não requer autenticação. Para uso em produção, recomenda-se implementar:

- JWT (JSON Web Tokens)
- OAuth2
- API Keys

---

## Rate Limiting

Não há rate limiting implementado na versão atual. Para produção, considere:

- Implementar rate limiting por IP
- Limitar número de uploads por usuário
- Limitar tamanho de documentos

---

## CORS

A API está configurada para aceitar requisições de qualquer origem (`allow_origins=["*"]`).

Para produção, configure adequadamente:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://seu-dominio.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## WebSockets (Futuro)

Planejado para versões futuras:
- Streaming de respostas da IA
- Notificações em tempo real
- Progresso de indexação de documentos

---

Para mais informações, consulte o [README.md](README.md) completo.
