"""
Tronco-IA - Assistente Pessoal Inteligente
Ponto de entrada principal da aplicação.

Execute este arquivo para iniciar o servidor:
    python main.py
"""

import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv
import uvicorn
from loguru import logger

# Importa módulos do backend
from backend.database import Database
from backend.ai_integration import AIIntegration
from backend.document_indexer import DocumentIndexer
from backend.notes import NotesManager
from backend.api import create_app


def setup_logging():
    """Configura o sistema de logs"""
    logger.remove()  # Remove handler padrão
    logger.add(
        sys.stderr,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>",
        level="INFO"
    )
    logger.add(
        "logs/tronco_{time:YYYY-MM-DD}.log",
        rotation="00:00",
        retention="30 days",
        level="DEBUG"
    )


def load_environment():
    """Carrega variáveis de ambiente do arquivo .env"""
    load_dotenv()
    logger.info("Variáveis de ambiente carregadas")


async def initialize_components():
    """
    Inicializa todos os componentes da aplicação.
    
    Returns:
        Tuple com (database, ai_integration, document_indexer, notes_manager)
    """
    # Configurações do ambiente
    db_path = os.getenv("DATABASE_PATH", "./data/tronco.db")
    upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
    
    # Inicializa banco de dados
    logger.info("Inicializando banco de dados...")
    database = Database(db_path)
    await database.initialize()
    
    # Inicializa integração com IA
    logger.info("Inicializando integrações com IA...")
    ai_integration = AIIntegration()
    
    # Inicializa indexador de documentos
    logger.info("Inicializando indexador de documentos...")
    document_indexer = DocumentIndexer(upload_dir)
    
    # Inicializa gerenciador de notas
    logger.info("Inicializando gerenciador de notas...")
    notes_manager = NotesManager(database)
    
    return database, ai_integration, document_indexer, notes_manager


async def startup():
    """Função executada na inicialização do servidor"""
    logger.info("=" * 60)
    logger.info("🌳 Tronco-IA - Assistente Pessoal Inteligente")
    logger.info("=" * 60)
    
    # Cria diretórios necessários
    os.makedirs("data", exist_ok=True)
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    os.makedirs("static", exist_ok=True)
    
    logger.info("Diretórios criados/verificados")


async def main():
    """Função principal da aplicação"""
    
    # Configuração inicial
    setup_logging()
    load_environment()
    await startup()
    
    # Inicializa componentes
    db, ai, indexer, notes = await initialize_components()
    
    # Cria aplicação FastAPI
    app = create_app(db, ai, indexer, notes)
    
    # Configurações do servidor
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    # Mensagem de boas-vindas
    logger.info("=" * 60)
    logger.info(f"🚀 Servidor iniciado!")
    logger.info(f"📍 Endereço: http://{host}:{port}")
    logger.info(f"📚 Documentação da API: http://{host}:{port}/docs")
    logger.info(f"🤖 Providers disponíveis: {ai.get_available_providers()}")
    logger.info("=" * 60)
    
    # Inicia servidor
    config = uvicorn.Config(
        app,
        host=host,
        port=port,
        log_level="info",
        access_log=True
    )
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    """
    Ponto de entrada quando o script é executado diretamente.
    
    Uso:
        python main.py
    """
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("\n👋 Encerrando Tronco-IA... Até logo!")
    except Exception as e:
        logger.error(f"❌ Erro fatal: {e}")
        sys.exit(1)
