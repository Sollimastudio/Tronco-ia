#!/bin/bash

# Script de inicialização do Tronco-IA
# Este script facilita o início do servidor

echo "🌳 Iniciando Tronco-IA..."
echo ""

# Verifica se o Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.8 ou superior."
    exit 1
fi

# Verifica se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "⚠️  Ambiente virtual não encontrado."
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
    
    echo "📥 Instalando dependências..."
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Verifica se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado."
    echo "📝 Criando .env a partir do exemplo..."
    cp .env.example .env
    echo "✅ Arquivo .env criado. Configure suas API keys antes de usar."
fi

# Inicia o servidor
echo ""
echo "🚀 Iniciando servidor..."
echo "📍 Acesse: http://localhost:8000"
echo "📚 Documentação: http://localhost:8000/docs"
echo ""
echo "Pressione Ctrl+C para encerrar"
echo ""

python main.py
