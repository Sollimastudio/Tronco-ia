"""
Gerenciador de Banco de Dados SQLite
Responsável por gerenciar conversas, memória e metadados.
"""

import aiosqlite
import os
from datetime import datetime
from typing import List, Dict, Optional
from loguru import logger


class Database:
    """Gerenciador do banco de dados SQLite para o Tronco-IA"""
    
    def __init__(self, db_path: str):
        """
        Inicializa o gerenciador do banco de dados.
        
        Args:
            db_path: Caminho para o arquivo do banco de dados SQLite
        """
        self.db_path = db_path
        logger.info(f"Inicializando banco de dados em: {db_path}")
        
    async def initialize(self):
        """Cria as tabelas necessárias se não existirem"""
        # Garante que o diretório existe
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        async with aiosqlite.connect(self.db_path) as db:
            # Tabela de conversas
            await db.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    title TEXT,
                    model TEXT
                )
            """)
            
            # Tabela de mensagens
            await db.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id INTEGER,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                )
            """)
            
            # Tabela de documentos
            await db.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    filename TEXT NOT NULL,
                    filepath TEXT NOT NULL,
                    file_type TEXT,
                    content TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    indexed BOOLEAN DEFAULT FALSE
                )
            """)
            
            # Tabela de notas
            await db.execute("""
                CREATE TABLE IF NOT EXISTS notes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    tags TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            await db.commit()
        
        logger.info("Banco de dados inicializado com sucesso")
    
    async def create_conversation(self, title: str = "Nova Conversa", model: str = "gemini") -> int:
        """
        Cria uma nova conversa.
        
        Args:
            title: Título da conversa
            model: Modelo de IA usado
            
        Returns:
            ID da conversa criada
        """
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(
                "INSERT INTO conversations (title, model) VALUES (?, ?)",
                (title, model)
            )
            await db.commit()
            return cursor.lastrowid
    
    async def add_message(self, conversation_id: int, role: str, content: str):
        """
        Adiciona uma mensagem a uma conversa.
        
        Args:
            conversation_id: ID da conversa
            role: Papel (user, assistant, system)
            content: Conteúdo da mensagem
        """
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                "INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)",
                (conversation_id, role, content)
            )
            await db.commit()
    
    async def get_conversation_messages(self, conversation_id: int) -> List[Dict]:
        """
        Recupera todas as mensagens de uma conversa.
        
        Args:
            conversation_id: ID da conversa
            
        Returns:
            Lista de mensagens
        """
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute(
                "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at",
                (conversation_id,)
            ) as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]
    
    async def get_recent_conversations(self, limit: int = 10) -> List[Dict]:
        """
        Recupera as conversas mais recentes.
        
        Args:
            limit: Número máximo de conversas a retornar
            
        Returns:
            Lista de conversas
        """
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute(
                "SELECT * FROM conversations ORDER BY created_at DESC LIMIT ?",
                (limit,)
            ) as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]
    
    async def add_document(self, filename: str, filepath: str, file_type: str, content: str) -> int:
        """
        Adiciona um documento ao banco.
        
        Args:
            filename: Nome do arquivo
            filepath: Caminho do arquivo
            file_type: Tipo do arquivo
            content: Conteúdo extraído
            
        Returns:
            ID do documento criado
        """
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(
                "INSERT INTO documents (filename, filepath, file_type, content, indexed) VALUES (?, ?, ?, ?, ?)",
                (filename, filepath, file_type, content, True)
            )
            await db.commit()
            return cursor.lastrowid
    
    async def get_all_documents(self) -> List[Dict]:
        """
        Recupera todos os documentos.
        
        Returns:
            Lista de documentos
        """
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM documents ORDER BY created_at DESC") as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]
    
    async def search_documents(self, query: str) -> List[Dict]:
        """
        Busca documentos por conteúdo.
        
        Args:
            query: Texto para buscar
            
        Returns:
            Lista de documentos encontrados
        """
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute(
                "SELECT * FROM documents WHERE content LIKE ? ORDER BY created_at DESC",
                (f"%{query}%",)
            ) as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]
    
    async def create_note(self, title: str, content: str, tags: str = "") -> int:
        """
        Cria uma nova nota.
        
        Args:
            title: Título da nota
            content: Conteúdo da nota
            tags: Tags separadas por vírgula
            
        Returns:
            ID da nota criada
        """
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(
                "INSERT INTO notes (title, content, tags) VALUES (?, ?, ?)",
                (title, content, tags)
            )
            await db.commit()
            return cursor.lastrowid
    
    async def get_all_notes(self) -> List[Dict]:
        """
        Recupera todas as notas.
        
        Returns:
            Lista de notas
        """
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute("SELECT * FROM notes ORDER BY updated_at DESC") as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]
    
    async def update_note(self, note_id: int, title: str, content: str, tags: str = ""):
        """
        Atualiza uma nota existente.
        
        Args:
            note_id: ID da nota
            title: Novo título
            content: Novo conteúdo
            tags: Novas tags
        """
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(
                "UPDATE notes SET title = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
                (title, content, tags, note_id)
            )
            await db.commit()
    
    async def delete_note(self, note_id: int):
        """
        Remove uma nota.
        
        Args:
            note_id: ID da nota
        """
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("DELETE FROM notes WHERE id = ?", (note_id,))
            await db.commit()
    
    async def search_notes(self, query: str) -> List[Dict]:
        """
        Busca notas por título ou conteúdo.
        
        Args:
            query: Texto para buscar
            
        Returns:
            Lista de notas encontradas
        """
        async with aiosqlite.connect(self.db_path) as db:
            db.row_factory = aiosqlite.Row
            async with db.execute(
                "SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC",
                (f"%{query}%", f"%{query}%")
            ) as cursor:
                rows = await cursor.fetchall()
                return [dict(row) for row in rows]
