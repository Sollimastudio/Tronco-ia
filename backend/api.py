"""
API FastAPI - Rotas e Endpoints
Define todas as rotas da aplicação Tronco-IA.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
from pathlib import Path
from loguru import logger

from backend.database import Database
from backend.ai_integration import AIIntegration
from backend.document_indexer import DocumentIndexer
from backend.notes import NotesManager


# Modelos Pydantic para requisições
class ChatRequest(BaseModel):
    """Modelo para requisição de chat"""
    message: str
    provider: str = "gemini"
    model: Optional[str] = None
    conversation_id: Optional[int] = None
    use_context: bool = True


class NoteRequest(BaseModel):
    """Modelo para requisição de nota"""
    title: str
    content: str
    tags: str = ""


class NoteUpdateRequest(BaseModel):
    """Modelo para atualização de nota"""
    note_id: int
    title: str
    content: str
    tags: str = ""


def create_app(db: Database, ai: AIIntegration, indexer: DocumentIndexer, notes: NotesManager) -> FastAPI:
    """
    Cria e configura a aplicação FastAPI.
    
    Args:
        db: Instância do banco de dados
        ai: Instância do gerenciador de IA
        indexer: Instância do indexador de documentos
        notes: Instância do gerenciador de notas
        
    Returns:
        Aplicação FastAPI configurada
    """
    app = FastAPI(
        title="Tronco-IA API",
        description="API do Assistente Pessoal Inteligente",
        version="1.0.0"
    )
    
    # Monta diretório estático
    static_path = Path(__file__).parent.parent / "static"
    app.mount("/static", StaticFiles(directory=str(static_path)), name="static")
    
    @app.get("/")
    async def root():
        """Serve a página principal"""
        return FileResponse(static_path / "index.html")
    
    @app.get("/api/health")
    async def health_check():
        """Verifica o status da aplicação"""
        return {
            "status": "ok",
            "providers": ai.get_available_providers()
        }
    
    @app.post("/api/chat")
    async def chat(request: ChatRequest):
        """
        Endpoint principal de chat com a IA.
        
        Args:
            request: Dados da requisição de chat
            
        Returns:
            Resposta da IA
        """
        try:
            # Verifica se o provider está disponível
            if not ai.is_provider_available(request.provider):
                raise HTTPException(
                    status_code=400,
                    detail=f"Provider '{request.provider}' não disponível. Use: {ai.get_available_providers()}"
                )
            
            # Cria ou recupera conversa
            if request.conversation_id is None:
                conversation_id = await db.create_conversation(
                    title="Nova Conversa",
                    model=request.provider
                )
            else:
                conversation_id = request.conversation_id
            
            # Salva mensagem do usuário
            await db.add_message(conversation_id, "user", request.message)
            
            # Prepara histórico de mensagens
            history = await db.get_conversation_messages(conversation_id)
            messages = [
                {"role": msg["role"], "content": msg["content"]}
                for msg in history
            ]
            
            # Adiciona contexto se solicitado
            if request.use_context:
                # Adiciona notas como contexto
                notes_context = await notes.get_notes_as_context()
                
                # Adiciona documentos relevantes
                docs = await db.search_documents(request.message)
                if docs:
                    doc_context = "\n### Documentos Relevantes:\n"
                    for doc in docs[:3]:  # Limita a 3 documentos
                        doc_context += f"**{doc['filename']}**\n{doc['content'][:500]}...\n---\n"
                else:
                    doc_context = ""
                
                # Prepend contexto ao histórico
                if notes_context or doc_context:
                    context_message = {
                        "role": "system",
                        "content": f"Contexto adicional disponível:\n{notes_context}\n{doc_context}"
                    }
                    messages.insert(0, context_message)
            
            # Chama a IA
            response = await ai.chat(request.provider, messages, request.model)
            
            # Salva resposta da IA
            await db.add_message(conversation_id, "assistant", response)
            
            return {
                "response": response,
                "conversation_id": conversation_id
            }
            
        except Exception as e:
            logger.error(f"Erro no chat: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/conversations")
    async def get_conversations():
        """Lista conversas recentes"""
        try:
            conversations = await db.get_recent_conversations()
            return {"conversations": conversations}
        except Exception as e:
            logger.error(f"Erro ao listar conversas: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/conversations/{conversation_id}")
    async def get_conversation(conversation_id: int):
        """Recupera mensagens de uma conversa específica"""
        try:
            messages = await db.get_conversation_messages(conversation_id)
            return {"messages": messages}
        except Exception as e:
            logger.error(f"Erro ao recuperar conversa: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.post("/api/upload")
    async def upload_document(file: UploadFile = File(...)):
        """
        Upload e processamento de documentos.
        
        Args:
            file: Arquivo enviado
            
        Returns:
            Informações do documento processado
        """
        try:
            # Valida extensão
            ext = Path(file.filename).suffix.lower()
            if ext not in ['.pdf', '.txt', '.md', '.markdown']:
                raise HTTPException(
                    status_code=400,
                    detail="Tipo de arquivo não suportado. Use: PDF, TXT ou MD"
                )
            
            # Salva arquivo
            upload_path = Path(indexer.upload_dir) / file.filename
            with open(upload_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            logger.info(f"Arquivo salvo: {upload_path}")
            
            # Processa documento
            content = await indexer.process_document(str(upload_path))
            
            if content is None:
                raise HTTPException(
                    status_code=500,
                    detail="Falha ao processar documento"
                )
            
            # Salva no banco
            doc_id = await db.add_document(
                filename=file.filename,
                filepath=str(upload_path),
                file_type=ext,
                content=content
            )
            
            return {
                "id": doc_id,
                "filename": file.filename,
                "status": "processed"
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Erro no upload: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/documents")
    async def list_documents():
        """Lista todos os documentos"""
        try:
            documents = await db.get_all_documents()
            # Remove conteúdo completo da listagem
            for doc in documents:
                if 'content' in doc and doc['content']:
                    doc['content_preview'] = doc['content'][:200] + "..."
                    del doc['content']
            return {"documents": documents}
        except Exception as e:
            logger.error(f"Erro ao listar documentos: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.post("/api/notes")
    async def create_note(request: NoteRequest):
        """Cria uma nova nota"""
        try:
            note_id = await notes.create_note(
                title=request.title,
                content=request.content,
                tags=request.tags
            )
            return {
                "id": note_id,
                "status": "created"
            }
        except Exception as e:
            logger.error(f"Erro ao criar nota: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/notes")
    async def list_notes():
        """Lista todas as notas"""
        try:
            all_notes = await notes.get_all_notes()
            return {"notes": all_notes}
        except Exception as e:
            logger.error(f"Erro ao listar notas: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.put("/api/notes")
    async def update_note(request: NoteUpdateRequest):
        """Atualiza uma nota existente"""
        try:
            await notes.update_note(
                note_id=request.note_id,
                title=request.title,
                content=request.content,
                tags=request.tags
            )
            return {"status": "updated"}
        except Exception as e:
            logger.error(f"Erro ao atualizar nota: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.delete("/api/notes/{note_id}")
    async def delete_note(note_id: int):
        """Remove uma nota"""
        try:
            await notes.delete_note(note_id)
            return {"status": "deleted"}
        except Exception as e:
            logger.error(f"Erro ao deletar nota: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/notes/search")
    async def search_notes(q: str):
        """Busca notas por texto"""
        try:
            results = await notes.search_notes(q)
            return {"notes": results}
        except Exception as e:
            logger.error(f"Erro ao buscar notas: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/providers")
    async def list_providers():
        """Lista providers de IA disponíveis"""
        return {
            "providers": ai.get_available_providers()
        }
    
    return app
