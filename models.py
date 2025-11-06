from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class Conversation(Base):
    """Armazena conversas do usuário"""
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    """Armazena mensagens individuais"""
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    role = Column(String(20))  # user, assistant, system
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    conversation = relationship("Conversation", back_populates="messages")


class Document(Base):
    """Armazena metadados de documentos indexados"""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    filepath = Column(String(500))
    file_type = Column(String(10))  # pdf, txt, md
    title = Column(String(255), nullable=True)
    content_preview = Column(Text)
    total_chunks = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    indexed_at = Column(DateTime, nullable=True)
    status = Column(String(20), default="pending")  # pending, indexed, error


class Note(Base):
    """Armazena notas locais do usuário"""
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    content = Column(Text)
    tags = Column(String(500), nullable=True)  # Comma-separated tags
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
