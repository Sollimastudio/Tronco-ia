"""
Processador e Indexador de Documentos
Extrai texto de PDFs, TXT, MD e outros formatos.
"""

import os
from typing import Optional
from pathlib import Path
import PyPDF2
from loguru import logger


class DocumentIndexer:
    """Processa e indexa documentos de diversos formatos"""
    
    def __init__(self, upload_dir: str):
        """
        Inicializa o indexador de documentos.
        
        Args:
            upload_dir: Diretório onde os documentos são armazenados
        """
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
        logger.info(f"Indexador de documentos inicializado. Upload dir: {upload_dir}")
    
    async def process_document(self, filepath: str) -> Optional[str]:
        """
        Processa um documento e extrai seu conteúdo.
        
        Args:
            filepath: Caminho do arquivo a processar
            
        Returns:
            Texto extraído do documento ou None se falhar
        """
        file_ext = Path(filepath).suffix.lower()
        
        try:
            if file_ext == '.pdf':
                return await self._process_pdf(filepath)
            elif file_ext == '.txt':
                return await self._process_txt(filepath)
            elif file_ext in ['.md', '.markdown']:
                return await self._process_markdown(filepath)
            else:
                logger.warning(f"Tipo de arquivo não suportado: {file_ext}")
                return None
        except Exception as e:
            logger.error(f"Erro ao processar documento {filepath}: {e}")
            return None
    
    async def _process_pdf(self, filepath: str) -> str:
        """
        Extrai texto de arquivo PDF.
        
        Args:
            filepath: Caminho do arquivo PDF
            
        Returns:
            Texto extraído
        """
        text = ""
        try:
            with open(filepath, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
            logger.info(f"PDF processado com sucesso: {filepath}")
            return text.strip()
        except Exception as e:
            logger.error(f"Erro ao processar PDF {filepath}: {e}")
            raise
    
    async def _process_txt(self, filepath: str) -> str:
        """
        Lê arquivo de texto simples.
        
        Args:
            filepath: Caminho do arquivo TXT
            
        Returns:
            Conteúdo do arquivo
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                text = file.read()
            logger.info(f"TXT processado com sucesso: {filepath}")
            return text.strip()
        except Exception as e:
            logger.error(f"Erro ao processar TXT {filepath}: {e}")
            raise
    
    async def _process_markdown(self, filepath: str) -> str:
        """
        Lê arquivo Markdown.
        
        Args:
            filepath: Caminho do arquivo MD
            
        Returns:
            Conteúdo do arquivo
        """
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                text = file.read()
            logger.info(f"Markdown processado com sucesso: {filepath}")
            return text.strip()
        except Exception as e:
            logger.error(f"Erro ao processar Markdown {filepath}: {e}")
            raise
    
    def get_file_info(self, filepath: str) -> dict:
        """
        Retorna informações sobre um arquivo.
        
        Args:
            filepath: Caminho do arquivo
            
        Returns:
            Dicionário com informações do arquivo
        """
        path = Path(filepath)
        return {
            'filename': path.name,
            'extension': path.suffix,
            'size': path.stat().st_size if path.exists() else 0,
            'exists': path.exists()
        }
