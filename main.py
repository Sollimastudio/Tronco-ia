from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from pydantic import BaseModel
from typing import List, Optional
import os
from pathlib import Path
from dotenv import load_dotenv

from database import init_db, get_db
from models import Conversation, Message, Document, Note
from ai_service import AIService
from document_processor import DocumentProcessor

# Carrega variáveis de ambiente
load_dotenv()

# Inicializa FastAPI
app = FastAPI(
    title="Tronco-IA",
    description="Assistente pessoal com IA e indexação de documentos",
    version="1.0.0"
)

# Configura CORS
# ATENÇÃO: Para produção, configure origins específicas ao invés de "*"
# Exemplo: allow_origins=["https://seu-dominio.com"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Para desenvolvimento. Restringir em produção!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializa serviços
ai_service = AIService()
doc_processor = DocumentProcessor()

# Cria diretório static se não existir
static_dir = Path("static")
static_dir.mkdir(exist_ok=True)


# Modelos Pydantic
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    use_context: bool = True


class ChatResponse(BaseModel):
    response: str
    conversation_id: int
    message_id: int


class StatusResponse(BaseModel):
    status: str
    version: str
    ai_provider: str
    database: str
    documents_count: int
    conversations_count: int


class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    status: str
    total_chunks: int
    uploaded_at: str


class NoteRequest(BaseModel):
    title: str
    content: str
    tags: Optional[str] = None


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    tags: Optional[str]
    created_at: str
    updated_at: str


# Eventos de inicialização
# Nota: Para FastAPI 0.104+, use lifespan context manager para novas aplicações
@app.on_event("startup")
async def startup_event():
    """Inicializa banco de dados na inicialização"""
    await init_db()
    print("✓ Banco de dados inicializado")
    print(f"✓ Provedor de IA: {os.getenv('AI_PROVIDER', 'gemini')}")


# Endpoints

@app.get("/", response_class=FileResponse)
async def read_root():
    """Serve a página principal"""
    index_file = static_dir / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse(
        content={"message": "Tronco-IA API está funcionando! Acesse /docs para documentação."},
        status_code=200
    )


@app.get("/api/status", response_model=StatusResponse)
async def get_status(db: AsyncSession = Depends(get_db)):
    """Endpoint de verificação de status do sistema"""
    try:
        # Conta documentos
        doc_result = await db.execute(select(Document))
        docs_count = len(doc_result.scalars().all())
        
        # Conta conversas
        conv_result = await db.execute(select(Conversation))
        conv_count = len(conv_result.scalars().all())
        
        return StatusResponse(
            status="online",
            version="1.0.0",
            ai_provider=os.getenv("AI_PROVIDER", "gemini"),
            database="connected",
            documents_count=docs_count,
            conversations_count=conv_count
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao verificar status: {str(e)}")


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """Endpoint de chat com IA"""
    try:
        # Obtém ou cria conversa
        conversation = None
        if request.conversation_id:
            result = await db.execute(
                select(Conversation).where(Conversation.id == request.conversation_id)
            )
            conversation = result.scalar_one_or_none()
        
        if not conversation:
            conversation = Conversation(title=request.message[:50])
            db.add(conversation)
            await db.flush()
        
        # Salva mensagem do usuário
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.message
        )
        db.add(user_message)
        await db.flush()
        
        # Busca contexto de documentos se solicitado
        context = ""
        if request.use_context:
            context = await doc_processor.get_context_for_query(request.message)
        
        # Obtém histórico da conversa
        msg_result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation.id)
            .order_by(Message.created_at)
        )
        messages_history = msg_result.scalars().all()
        
        # Prepara mensagens para IA
        ai_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in messages_history[:-1]  # Exclui última mensagem (já adicionada)
        ]
        ai_messages.append({"role": "user", "content": request.message})
        
        # Gera resposta da IA
        ai_response = await ai_service.chat(ai_messages, context)
        
        # Salva resposta da IA
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=ai_response
        )
        db.add(assistant_message)
        await db.commit()
        
        return ChatResponse(
            response=ai_response,
            conversation_id=conversation.id,
            message_id=assistant_message.id
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro no chat: {str(e)}")


@app.post("/api/documents/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Endpoint para upload e indexação de documentos"""
    try:
        # Valida tipo de arquivo
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in [".pdf", ".txt", ".md"]:
            raise HTTPException(
                status_code=400,
                detail="Tipo de arquivo não suportado. Use PDF, TXT ou MD."
            )
        
        # Salva arquivo
        content = await file.read()
        filepath = await doc_processor.save_file(file.filename, content)
        
        # Cria registro no banco
        document = Document(
            filename=file.filename,
            filepath=filepath,
            file_type=file_ext[1:],  # Remove o ponto
            status="pending"
        )
        db.add(document)
        await db.commit()
        await db.refresh(document)
        
        # Indexa documento em background (de forma síncrona para simplificar)
        try:
            await doc_processor.index_document(document.id, filepath, file_ext[1:], db)
            await db.refresh(document)
        except Exception as e:
            print(f"Erro ao indexar documento: {e}")
        
        return DocumentResponse(
            id=document.id,
            filename=document.filename,
            file_type=document.file_type,
            status=document.status,
            total_chunks=document.total_chunks,
            uploaded_at=document.uploaded_at.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao processar documento: {str(e)}")


@app.get("/api/documents", response_model=List[DocumentResponse])
async def list_documents(db: AsyncSession = Depends(get_db)):
    """Lista todos os documentos"""
    try:
        result = await db.execute(
            select(Document).order_by(desc(Document.uploaded_at))
        )
        documents = result.scalars().all()
        
        return [
            DocumentResponse(
                id=doc.id,
                filename=doc.filename,
                file_type=doc.file_type,
                status=doc.status,
                total_chunks=doc.total_chunks,
                uploaded_at=doc.uploaded_at.isoformat()
            )
            for doc in documents
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar documentos: {str(e)}")


@app.get("/api/conversations")
async def list_conversations(db: AsyncSession = Depends(get_db)):
    """Lista todas as conversas"""
    try:
        result = await db.execute(
            select(Conversation).order_by(desc(Conversation.updated_at))
        )
        conversations = result.scalars().all()
        
        return [
            {
                "id": conv.id,
                "title": conv.title,
                "created_at": conv.created_at.isoformat(),
                "updated_at": conv.updated_at.isoformat()
            }
            for conv in conversations
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar conversas: {str(e)}")


@app.get("/api/conversations/{conversation_id}/messages")
async def get_conversation_messages(conversation_id: int, db: AsyncSession = Depends(get_db)):
    """Obtém mensagens de uma conversa"""
    try:
        result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
        )
        messages = result.scalars().all()
        
        return [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at.isoformat()
            }
            for msg in messages
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao obter mensagens: {str(e)}")


@app.post("/api/notes", response_model=NoteResponse)
async def create_note(note: NoteRequest, db: AsyncSession = Depends(get_db)):
    """Cria uma nova nota"""
    try:
        new_note = Note(
            title=note.title,
            content=note.content,
            tags=note.tags
        )
        db.add(new_note)
        await db.commit()
        await db.refresh(new_note)
        
        return NoteResponse(
            id=new_note.id,
            title=new_note.title,
            content=new_note.content,
            tags=new_note.tags,
            created_at=new_note.created_at.isoformat(),
            updated_at=new_note.updated_at.isoformat()
        )
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao criar nota: {str(e)}")


@app.get("/api/notes", response_model=List[NoteResponse])
async def list_notes(db: AsyncSession = Depends(get_db)):
    """Lista todas as notas"""
    try:
        result = await db.execute(
            select(Note).order_by(desc(Note.updated_at))
        )
        notes = result.scalars().all()
        
        return [
            NoteResponse(
                id=note.id,
                title=note.title,
                content=note.content,
                tags=note.tags,
                created_at=note.created_at.isoformat(),
                updated_at=note.updated_at.isoformat()
            )
            for note in notes
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao listar notas: {str(e)}")


# Monta diretório static
app.mount("/static", StaticFiles(directory="static"), name="static")


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug
    )
