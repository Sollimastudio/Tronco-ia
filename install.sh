#!/bin/bash

echo "================================================"
echo "🌳 INSTALAÇÃO DO TRONCO-IA"
echo "================================================"
echo ""

# Verifica Python
echo "1️⃣  Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.8 ou superior."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✓ Python $PYTHON_VERSION encontrado"
echo ""

# Verifica pip
echo "2️⃣  Verificando pip..."
if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
    echo "❌ pip não encontrado. Por favor, instale pip."
    exit 1
fi
echo "✓ pip encontrado"
echo ""

# Cria ambiente virtual (opcional mas recomendado)
echo "3️⃣  Deseja criar um ambiente virtual? (recomendado) [y/N]"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Criando ambiente virtual..."
    python3 -m venv venv
    echo "✓ Ambiente virtual criado"
    echo ""
    echo "Para ativar o ambiente virtual, execute:"
    echo "  source venv/bin/activate  (Mac/Linux)"
    echo "  venv\\Scripts\\activate    (Windows)"
    echo ""
    echo "Continue com a instalação após ativar o ambiente virtual."
    exit 0
fi

# Instala dependências
echo "4️⃣  Instalando dependências..."
echo "Isso pode levar alguns minutos..."
echo ""

pip3 install --upgrade pip
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Dependências instaladas com sucesso!"
    echo ""
else
    echo ""
    echo "❌ Erro ao instalar dependências."
    echo "Tente instalar manualmente: pip3 install -r requirements.txt"
    exit 1
fi

# Configura arquivo .env
echo "5️⃣  Configurando arquivo .env..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Arquivo .env criado"
    echo ""
    echo "⚠️  IMPORTANTE: Configure suas API keys no arquivo .env antes de iniciar!"
    echo ""
    echo "Opções de provedor de IA:"
    echo "  1. Google Gemini (RECOMENDADO - gratuito para começar)"
    echo "     Obtenha sua chave em: https://makersuite.google.com/app/apikey"
    echo "     Configure: GOOGLE_API_KEY e AI_PROVIDER=gemini"
    echo ""
    echo "  2. OpenAI"
    echo "     Obtenha sua chave em: https://platform.openai.com/api-keys"
    echo "     Configure: OPENAI_API_KEY e AI_PROVIDER=openai"
    echo ""
    echo "  3. Ollama (Local - sem necessidade de API key)"
    echo "     Instale: https://ollama.ai/"
    echo "     Configure: AI_PROVIDER=ollama"
    echo ""
else
    echo "✓ Arquivo .env já existe"
    echo ""
fi

# Conclusão
echo "================================================"
echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "================================================"
echo ""
echo "Próximos passos:"
echo "1. Edite o arquivo .env e configure suas API keys"
echo "2. Execute: ./start.sh (ou python3 main.py)"
echo "3. Acesse: http://localhost:8000"
echo ""
echo "Para documentação completa, consulte o README.md"
echo ""
echo "Divirta-se com o Tronco-IA! 🌳"
echo ""
