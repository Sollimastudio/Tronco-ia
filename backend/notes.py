"""
Sistema de Gerenciamento de Notas
Permite criar, editar e buscar notas locais.
"""

from typing import List, Dict, Optional
from loguru import logger
from backend.database import Database


class NotesManager:
    """Gerenciador de notas locais"""
    
    def __init__(self, database: Database):
        """
        Inicializa o gerenciador de notas.
        
        Args:
            database: Instância do gerenciador de banco de dados
        """
        self.db = database
        logger.info("Gerenciador de notas inicializado")
    
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
        note_id = await self.db.create_note(title, content, tags)
        logger.info(f"Nota criada com ID: {note_id}")
        return note_id
    
    async def get_all_notes(self) -> List[Dict]:
        """
        Recupera todas as notas.
        
        Returns:
            Lista de notas
        """
        notes = await self.db.get_all_notes()
        logger.info(f"Recuperadas {len(notes)} notas")
        return notes
    
    async def update_note(self, note_id: int, title: str, content: str, tags: str = ""):
        """
        Atualiza uma nota existente.
        
        Args:
            note_id: ID da nota
            title: Novo título
            content: Novo conteúdo
            tags: Novas tags
        """
        await self.db.update_note(note_id, title, content, tags)
        logger.info(f"Nota {note_id} atualizada")
    
    async def delete_note(self, note_id: int):
        """
        Remove uma nota.
        
        Args:
            note_id: ID da nota
        """
        await self.db.delete_note(note_id)
        logger.info(f"Nota {note_id} removida")
    
    async def search_notes(self, query: str) -> List[Dict]:
        """
        Busca notas por título ou conteúdo.
        
        Args:
            query: Texto para buscar
            
        Returns:
            Lista de notas encontradas
        """
        notes = await self.db.search_notes(query)
        logger.info(f"Busca por '{query}' retornou {len(notes)} notas")
        return notes
    
    async def get_notes_as_context(self, limit: int = 5) -> str:
        """
        Retorna notas recentes como contexto para a IA.
        
        Args:
            limit: Número máximo de notas a incluir
            
        Returns:
            String formatada com as notas
        """
        notes = await self.db.get_all_notes()
        if not notes:
            return ""
        
        context_parts = ["### Notas Pessoais Disponíveis:\n"]
        for note in notes[:limit]:
            context_parts.append(f"**{note['title']}**")
            context_parts.append(note['content'])
            context_parts.append("---")
        
        return "\n".join(context_parts)
