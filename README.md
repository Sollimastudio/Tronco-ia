# Tronco-IA 🌳🤖

**Assistente Pessoal Inteligente** - Um assistente IA que roda localmente no seu Mac, com backend FastAPI e interface web moderna.

## 📋 Descrição

Tronco-IA é um assistente pessoal que conecta-se a múltiplos serviços de IA (Gemini, OpenAI, Ollama), mantém memória conversacional em SQLite, indexa documentos locais (PDF, TXT, MD) e permite criar notas para responder suas perguntas com contexto rico e personalizado.

## ✨ Funcionalidades

- 🤖 **Múltiplas IAs**: Suporta Gemini, OpenAI e Ollama
- 💾 **Memória Persistente**: Armazena conversas em banco SQLite
- 📚 **Indexação de Documentos**: Processa e indexa PDFs, TXT e Markdown
- 📝 **Sistema de Notas**: Crie notas locais para enriquecer as respostas
- 🌐 **Interface Web**: Interface moderna e responsiva
- 🔌 **Extensível**: Arquitetura modular pronta para integrações

## 🚀 Instalação

### Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Passos de Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/Sollimastudio/Tronco-ia.git
cd Tronco-ia
```

2. **Crie um ambiente virtual**
```bash
python3 -m venv venv
source venv/bin/activate  # No Mac/Linux
# ou
venv\Scripts\activate  # No Windows
```

3. **Instale as dependências**
```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas chaves de API
```

5. **Execute o servidor**
```bash
python main.py
```

6. **Acesse a interface**
```
Abra seu navegador em: http://localhost:8000
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas credenciais:

```env
# API Keys (opcional - use apenas as que você possui)
OPENAI_API_KEY=sua_chave_aqui
GEMINI_API_KEY=sua_chave_aqui
OLLAMA_URL=http://localhost:11434  # Se estiver usando Ollama local

# Configurações do banco de dados
DATABASE_PATH=./data/tronco.db

# Configurações do servidor
HOST=0.0.0.0
PORT=8000
```

## 📖 Como Usar

### Chat Básico

1. Acesse a interface web
2. Digite sua pergunta no campo de texto
3. Selecione o modelo de IA desejado (Gemini, OpenAI ou Ollama)
4. Clique em "Enviar" ou pressione Enter

### Upload de Documentos

1. Clique em "Upload Documentos" na interface
2. Selecione arquivos PDF, TXT ou MD
3. Aguarde o processamento e indexação
4. Os documentos estarão disponíveis como contexto nas conversas

### Criar Notas

1. Clique em "Notas" no menu
2. Crie novas notas com títulos e conteúdo
3. As notas serão usadas automaticamente como contexto

## 🏗️ Estrutura do Projeto

```
Tronco-ia/
├── main.py                 # Ponto de entrada da aplicação
├── backend/
│   ├── __init__.py
│   ├── api.py             # Rotas FastAPI
│   ├── ai_integration.py  # Integração com serviços de IA
│   ├── database.py        # Gerenciamento do SQLite
│   ├── document_indexer.py # Processamento de documentos
│   └── notes.py           # Sistema de notas
├── static/
│   ├── index.html         # Interface principal
│   ├── style.css          # Estilos
│   └── app.js             # Lógica do frontend
├── data/                  # Dados e banco (criado automaticamente)
├── uploads/               # Documentos enviados (criado automaticamente)
├── requirements.txt       # Dependências Python
└── README.md             # Esta documentação
```

## 🔧 Extensão e Desenvolvimento

### Adicionar Novo Modelo de IA

1. Abra `backend/ai_integration.py`
2. Adicione uma nova classe herdando de `BaseAIProvider`
3. Implemente os métodos `chat()` e `get_embeddings()`
4. Registre o provider na factory

```python
class NovoProvider(BaseAIProvider):
    def chat(self, messages, model):
        # Sua implementação aqui
        pass
```

### Adicionar Novo Tipo de Documento

1. Abra `backend/document_indexer.py`
2. Adicione um novo método de processamento
3. Registre a extensão no parser

```python
def process_novo_formato(self, filepath):
    # Sua implementação aqui
    pass
```

### Criar Nova Rota API

1. Abra `backend/api.py`
2. Adicione uma nova rota usando decoradores FastAPI

```python
@app.post("/api/nova-rota")
async def nova_funcionalidade(data: dict):
    # Sua implementação aqui
    return {"status": "success"}
```

## 🔮 Integrações Futuras

O Tronco-IA está preparado para integração com:

### Sol.IA (Assistente Estratégico Pessoal)
- Hooks para decisões estratégicas
- Interface de comunicação entre agentes
- Sistema de compartilhamento de contexto

### Sistema Supera (Rede de Automação)
- Endpoints para automação
- Webhooks para eventos
- API de integração com outras ferramentas

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a documentação acima
2. Procure em [Issues](https://github.com/Sollimastudio/Tronco-ia/issues) existentes
3. Crie uma nova issue se necessário

## 👨‍💻 Autor

Desenvolvido por Sollimastudio

---

**Tronco-IA** - Seu assistente pessoal inteligente, local e extensível 🌳✨
