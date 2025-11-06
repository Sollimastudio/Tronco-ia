import os
import asyncio
from typing import List, Dict, Optional
from pathlib import Path
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import Document
from datetime import datetime


class DocumentProcessor:
    """Serviço para processar e indexar documentos"""
    
    def __init__(self, upload_dir: str = "uploads", chroma_dir: str = "chroma_db"):
        self.upload_dir = Path(upload_dir)
        self.chroma_dir = Path(chroma_dir)
        self.upload_dir.mkdir(exist_ok=True)
        self.chroma_dir.mkdir(exist_ok=True)
        
        # Inicializa embeddings e vector store
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
        )
        self.vector_store = Chroma(
            persist_directory=str(self.chroma_dir),
            embedding_function=self.embeddings
        )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
    
    async def save_file(self, filename: str, content: bytes) -> str:
        """Salva arquivo no diretório de uploads"""
        filepath = self.upload_dir / filename
        
        # Evita sobrescrever arquivos existentes
        counter = 1
        while filepath.exists():
            name, ext = os.path.splitext(filename)
            filepath = self.upload_dir / f"{name}_{counter}{ext}"
            counter += 1
        
        async with asyncio.Lock():
            with open(filepath, "wb") as f:
                f.write(content)
        
        return str(filepath)
    
    def extract_text_from_pdf(self, filepath: str) -> str:
        """Extrai texto de arquivo PDF"""
        try:
            with open(filepath, "rb") as f:
                pdf_reader = PyPDF2.PdfReader(f)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            raise Exception(f"Erro ao extrair texto do PDF: {str(e)}")
    
    def extract_text_from_txt(self, filepath: str) -> str:
        """Extrai texto de arquivo TXT ou MD"""
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            raise Exception(f"Erro ao ler arquivo de texto: {str(e)}")
    
    async def index_document(self, doc_id: int, filepath: str, file_type: str, db: AsyncSession):
        """Indexa documento no vector store"""
        try:
            # Extrai texto baseado no tipo de arquivo
            if file_type == "pdf":
                text = self.extract_text_from_pdf(filepath)
            elif file_type in ["txt", "md"]:
                text = self.extract_text_from_txt(filepath)
            else:
                raise ValueError(f"Tipo de arquivo não suportado: {file_type}")
            
            # Divide texto em chunks
            chunks = self.text_splitter.split_text(text)
            
            # Adiciona chunks ao vector store com metadados
            metadatas = [{"doc_id": doc_id, "chunk_index": i} for i in range(len(chunks))]
            self.vector_store.add_texts(chunks, metadatas=metadatas)
            
            # Atualiza documento no banco
            result = await db.execute(select(Document).where(Document.id == doc_id))
            document = result.scalar_one_or_none()
            
            if document:
                document.status = "indexed"
                document.indexed_at = datetime.utcnow()
                document.total_chunks = len(chunks)
                document.content_preview = text[:500]
                await db.commit()
            
            return len(chunks)
        except Exception as e:
            # Atualiza status para erro
            result = await db.execute(select(Document).where(Document.id == doc_id))
            document = result.scalar_one_or_none()
            if document:
                document.status = "error"
                await db.commit()
            raise Exception(f"Erro ao indexar documento: {str(e)}")
    
    async def search_similar(self, query: str, k: int = 3) -> List[Dict]:
        """Busca documentos similares à query"""
        try:
            results = self.vector_store.similarity_search_with_score(query, k=k)
            return [
                {
                    "content": doc.page_content,
                    "score": score,
                    "metadata": doc.metadata
                }
                for doc, score in results
            ]
        except Exception as e:
            raise Exception(f"Erro ao buscar documentos similares: {str(e)}")
    
    async def get_context_for_query(self, query: str, k: int = 3) -> str:
        """Obtém contexto relevante para uma query"""
        try:
            results = await self.search_similar(query, k)
            if not results:
                return ""
            
            context_parts = []
            for i, result in enumerate(results, 1):
                context_parts.append(f"[Documento {i}]\n{result['content']}")
            
            return "\n\n".join(context_parts)
        except Exception:
            return ""
