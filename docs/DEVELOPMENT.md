# Guia de Desenvolvimento - Tronco-IA

## 📚 Índice

1. [Configuração do Ambiente](#configuração-do-ambiente)
2. [Estrutura do Código](#estrutura-do-código)
3. [Adicionando Funcionalidades](#adicionando-funcionalidades)
4. [Testes](#testes)
5. [Boas Práticas](#boas-práticas)
6. [Troubleshooting](#troubleshooting)

## 🛠️ Configuração do Ambiente

### Requisitos

- Python 3.8+
- pip
- Git

### Instalação para Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/Sollimastudio/Tronco-ia.git
cd Tronco-ia

# Crie ambiente virtual
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# ou venv\Scripts\activate  # Windows

# Instale dependências
pip install -r requirements.txt

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações
```

### Configuração das APIs de IA

Edite o arquivo `.env`:

```bash
# OpenAI (opcional)
OPENAI_API_KEY=sk-...

# Google Gemini (opcional)
GEMINI_API_KEY=AIza...

# Ollama (local - recomendado para desenvolvimento)
OLLAMA_URL=http://localhost:11434
```

**Nota:** Você pode usar Ollama localmente sem necessidade de API keys. Instale o Ollama em: https://ollama.ai/

## 📁 Estrutura do Código

```
Tronco-ia/
├── main.py                    # Ponto de entrada
├── backend/
│   ├── __init__.py           # Inicialização do módulo
│   ├── api.py                # Rotas FastAPI
│   ├── ai_integration.py     # Providers de IA
│   ├── database.py           # Gerenciador SQLite
│   ├── document_indexer.py   # Processamento de docs
│   └── notes.py              # Sistema de notas
├── static/
│   ├── index.html            # Interface web
│   ├── style.css             # Estilos
│   └── app.js                # Lógica frontend
├── data/                     # Banco de dados (criado automaticamente)
├── uploads/                  # Documentos (criado automaticamente)
├── logs/                     # Logs (criado automaticamente)
├── docs/                     # Documentação
│   ├── INTEGRATION.md        # Guia de integração
│   └── DEVELOPMENT.md        # Este arquivo
├── requirements.txt          # Dependências Python
├── .env.example             # Template de configuração
├── .gitignore               # Arquivos ignorados pelo Git
└── README.md                # Documentação principal
```

## 🔧 Adicionando Funcionalidades

### 1. Adicionar Novo Provider de IA

Crie uma nova classe em `backend/ai_integration.py`:

```python
class NovoProvider(BaseAIProvider):
    """Provider para [Nome do Serviço]"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        logger.info("NovoProvider inicializado")
    
    async def chat(self, messages: List[Dict[str, str]], model: str) -> str:
        """
        Implementa comunicação com o serviço de IA.
        
        Args:
            messages: Lista de mensagens no formato [{"role": "user", "content": "..."}]
            model: Nome do modelo a usar
            
        Returns:
            Resposta da IA como string
        """
        try:
            # Sua lógica de integração aqui
            # Exemplo:
            # response = await seu_cliente.chat(messages)
            # return response.text
            pass
        except Exception as e:
            logger.error(f"Erro ao chamar NovoProvider: {e}")
            raise
```

Depois, registre o provider em `AIIntegration._initialize_providers()`:

```python
def _initialize_providers(self):
    # ... código existente ...
    
    # Novo provider
    novo_key = os.getenv("NOVO_PROVIDER_KEY")
    if novo_key:
        try:
            self.providers["novo"] = NovoProvider(novo_key)
            logger.info("Provider Novo registrado")
        except Exception as e:
            logger.warning(f"Falha ao inicializar Novo: {e}")
```

### 2. Adicionar Nova Rota API

Em `backend/api.py`, adicione uma nova rota:

```python
@app.post("/api/minha-nova-rota")
async def minha_funcionalidade(data: dict):
    """
    Descrição da funcionalidade.
    
    Args:
        data: Dados da requisição
        
    Returns:
        Resposta em JSON
    """
    try:
        # Sua lógica aqui
        resultado = processar_dados(data)
        
        return {
            "status": "success",
            "resultado": resultado
        }
    except Exception as e:
        logger.error(f"Erro na rota: {e}")
        raise HTTPException(status_code=500, detail=str(e))
```

**Modelo Pydantic para validação:**

```python
class MinhaRequest(BaseModel):
    """Modelo para validação de dados"""
    campo1: str
    campo2: int
    campo3: Optional[str] = None

@app.post("/api/minha-nova-rota")
async def minha_funcionalidade(request: MinhaRequest):
    # request.campo1, request.campo2 são validados automaticamente
    pass
```

### 3. Adicionar Novo Tipo de Documento

Em `backend/document_indexer.py`, adicione método de processamento:

```python
async def _process_novo_formato(self, filepath: str) -> str:
    """
    Processa arquivo no novo formato.
    
    Args:
        filepath: Caminho do arquivo
        
    Returns:
        Texto extraído
    """
    try:
        # Sua lógica de extração aqui
        with open(filepath, 'r') as file:
            content = processar_arquivo(file)
        
        logger.info(f"Novo formato processado: {filepath}")
        return content.strip()
    except Exception as e:
        logger.error(f"Erro ao processar novo formato: {e}")
        raise
```

Depois, atualize `process_document()`:

```python
async def process_document(self, filepath: str) -> Optional[str]:
    file_ext = Path(filepath).suffix.lower()
    
    try:
        if file_ext == '.pdf':
            return await self._process_pdf(filepath)
        elif file_ext == '.txt':
            return await self._process_txt(filepath)
        elif file_ext in ['.md', '.markdown']:
            return await self._process_markdown(filepath)
        elif file_ext == '.novo':  # Nova extensão
            return await self._process_novo_formato(filepath)
        else:
            logger.warning(f"Tipo não suportado: {file_ext}")
            return None
    except Exception as e:
        logger.error(f"Erro: {e}")
        return None
```

### 4. Adicionar Nova Funcionalidade ao Frontend

Em `static/app.js`, adicione função:

```javascript
// Adicionar nova funcionalidade
async function minhaNovaFuncao(parametros) {
    showLoading(true);
    
    try {
        const response = await fetch('/api/minha-nova-rota', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parametros)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Processa resposta
        console.log('Sucesso:', data);
        
    } catch (error) {
        console.error('Erro:', error);
        alert('❌ Erro ao executar funcionalidade');
    } finally {
        showLoading(false);
    }
}
```

Em `static/index.html`, adicione botão:

```html
<button class="btn btn-primary" onclick="minhaNovaFuncao()">
    ✨ Nova Funcionalidade
</button>
```

### 5. Adicionar Nova Tabela ao Banco

Em `backend/database.py`, atualize `initialize()`:

```python
async def initialize(self):
    os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
    
    async with aiosqlite.connect(self.db_path) as db:
        # ... tabelas existentes ...
        
        # Nova tabela
        await db.execute("""
            CREATE TABLE IF NOT EXISTS minha_tabela (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campo1 TEXT NOT NULL,
                campo2 INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        await db.commit()
```

Adicione métodos para manipular a tabela:

```python
async def criar_registro(self, campo1: str, campo2: int) -> int:
    """Cria novo registro"""
    async with aiosqlite.connect(self.db_path) as db:
        cursor = await db.execute(
            "INSERT INTO minha_tabela (campo1, campo2) VALUES (?, ?)",
            (campo1, campo2)
        )
        await db.commit()
        return cursor.lastrowid

async def listar_registros(self) -> List[Dict]:
    """Lista todos os registros"""
    async with aiosqlite.connect(self.db_path) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM minha_tabela") as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]
```

## 🧪 Testes

### Testando Manualmente

```bash
# Inicie o servidor
python main.py

# Em outro terminal, teste os endpoints
curl http://localhost:8000/api/health
curl http://localhost:8000/api/providers
```

### Testando com a Interface

1. Abra http://localhost:8000 no navegador
2. Teste funcionalidades:
   - Enviar mensagens no chat
   - Criar notas
   - Fazer upload de documentos

### Verificando Logs

```bash
# Visualize logs em tempo real
tail -f logs/tronco_$(date +%Y-%m-%d).log
```

### Inspecionando o Banco de Dados

```bash
# Abra o banco SQLite
sqlite3 data/tronco.db

# Comandos úteis:
.tables                    # Lista tabelas
.schema conversations      # Mostra schema de uma tabela
SELECT * FROM notes;       # Lista notas
.exit                      # Sai do SQLite
```

## 🎯 Boas Práticas

### 1. Logs

Use o logger do Loguru em todo o código:

```python
from loguru import logger

logger.info("Operação iniciada")
logger.warning("Possível problema")
logger.error("Erro encontrado")
logger.debug("Informação de debug")
```

### 2. Tratamento de Erros

Sempre trate exceções adequadamente:

```python
try:
    resultado = operacao_arriscada()
except SpecificException as e:
    logger.error(f"Erro específico: {e}")
    # Trate o erro
except Exception as e:
    logger.error(f"Erro genérico: {e}")
    # Fallback
```

### 3. Documentação

Documente suas funções com docstrings:

```python
async def minha_funcao(parametro: str) -> dict:
    """
    Descrição breve da função.
    
    Descrição mais detalhada se necessário.
    
    Args:
        parametro: Descrição do parâmetro
        
    Returns:
        Descrição do retorno
        
    Raises:
        ExceptionType: Quando ocorre
    """
    pass
```

### 4. Type Hints

Use type hints para melhor documentação:

```python
from typing import List, Dict, Optional

async def processar(
    dados: List[str],
    opcoes: Optional[Dict[str, Any]] = None
) -> bool:
    pass
```

### 5. Commits

Use mensagens de commit claras:

```bash
git commit -m "Adiciona suporte para arquivos DOCX"
git commit -m "Fix: Corrige erro ao processar PDF vazio"
git commit -m "Refactor: Melhora estrutura do indexador"
```

## 🐛 Troubleshooting

### Erro: Porta 8000 já em uso

```bash
# Encontre o processo usando a porta
lsof -i :8000

# Mate o processo
kill -9 <PID>

# Ou use outra porta
PORT=8080 python main.py
```

### Erro: Provider não disponível

1. Verifique se a API key está configurada no `.env`
2. Verifique se a biblioteca necessária está instalada
3. Veja os logs para detalhes do erro

### Erro: Banco de dados corrompido

```bash
# Backup do banco atual
cp data/tronco.db data/tronco.db.backup

# Delete e recrie
rm data/tronco.db
python main.py  # Recria automaticamente
```

### Erro: Módulo não encontrado

```bash
# Reinstale as dependências
pip install -r requirements.txt
```

### Servidor não inicia

1. Verifique se todas as dependências estão instaladas
2. Verifique os logs em `logs/`
3. Verifique permissões dos diretórios

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a [documentação completa](../README.md)
2. Veja a [arquitetura de integração](INTEGRATION.md)
3. Abra uma issue no GitHub

## 🚀 Deploy

### Produção

Para deploy em produção, considere:

1. **Use um servidor ASGI production-ready:**
   ```bash
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. **Configure variáveis de ambiente adequadas**
3. **Use HTTPS (certificado SSL)**
4. **Implemente autenticação e autorização**
5. **Configure backups do banco de dados**
6. **Use proxy reverso (nginx)**
7. **Monitore logs e métricas**

### Docker (Opcional)

Crie um `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]
```

```bash
docker build -t tronco-ia .
docker run -p 8000:8000 tronco-ia
```

---

**Happy Coding! 🌳✨**
