@echo off
echo 🌳 Iniciando Tronco-IA...
echo.

REM Verifica se o arquivo .env existe
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado. Criando a partir do .env.example...
    copy .env.example .env
    echo ✓ Arquivo .env criado. Por favor, configure suas API keys antes de continuar.
    echo.
    echo Edite o arquivo .env e adicione pelo menos uma chave de API:
    echo   - GOOGLE_API_KEY (Google Gemini - Recomendado^)
    echo   - OPENAI_API_KEY (OpenAI GPT^)
    echo   - ou configure AI_PROVIDER=ollama para usar Ollama local
    echo.
    pause
    exit /b 1
)

REM Verifica se as dependências estão instaladas
echo 🔍 Verificando dependências...
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo ⚠️  Dependências não instaladas. Execute:
    echo    pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

echo ✓ Dependências instaladas
echo.

REM Cria diretórios necessários
if not exist uploads mkdir uploads
if not exist chroma_db mkdir chroma_db
if not exist static mkdir static

echo ✓ Diretórios criados
echo.

REM Inicia o servidor
echo 🚀 Iniciando servidor FastAPI...
echo.
echo Acesse a interface em: http://localhost:8000
echo Documentação da API: http://localhost:8000/docs
echo.

python main.py
