#!/bin/bash

echo "🌳 Iniciando Tronco-IA..."
echo ""

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando a partir do .env.example..."
    cp .env.example .env
    echo "✓ Arquivo .env criado. Por favor, configure suas API keys antes de continuar."
    echo ""
    echo "Edite o arquivo .env e adicione pelo menos uma chave de API:"
    echo "  - GOOGLE_API_KEY (Google Gemini - Recomendado)"
    echo "  - OPENAI_API_KEY (OpenAI GPT)"
    echo "  - ou configure AI_PROVIDER=ollama para usar Ollama local"
    echo ""
    exit 1
fi

# Verifica se as dependências estão instaladas
echo "🔍 Verificando dependências..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "⚠️  Dependências não instaladas. Execute:"
    echo "   pip install -r requirements.txt"
    echo ""
    exit 1
fi

echo "✓ Dependências instaladas"
echo ""

# Cria diretórios necessários
mkdir -p uploads
mkdir -p chroma_db
mkdir -p static

echo "✓ Diretórios criados"
echo ""

# Inicia o servidor
echo "🚀 Iniciando servidor FastAPI..."
echo ""
echo "Acesse a interface em: http://localhost:8000"
echo "Documentação da API: http://localhost:8000/docs"
echo ""

python3 main.py
