import os
from typing import List, Dict, Optional
from abc import ABC, abstractmethod
import openai
import google.generativeai as genai
import aiohttp


class AIProvider(ABC):
    """Interface abstrata para provedores de IA"""
    
    @abstractmethod
    async def generate_response(self, messages: List[Dict[str, str]], context: str = "") -> str:
        pass


class OpenAIProvider(AIProvider):
    """Provedor OpenAI"""
    
    def __init__(self, api_key: str, model: str = "gpt-3.5-turbo"):
        self.client = openai.AsyncOpenAI(api_key=api_key)
        self.model = model
    
    async def generate_response(self, messages: List[Dict[str, str]], context: str = "") -> str:
        try:
            if context:
                messages = [{"role": "system", "content": f"Contexto relevante:\n{context}"}] + messages
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Erro ao gerar resposta com OpenAI: {str(e)}")


class GeminiProvider(AIProvider):
    """Provedor Google Gemini"""
    
    def __init__(self, api_key: str, model: str = "gemini-pro"):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model)
    
    async def generate_response(self, messages: List[Dict[str, str]], context: str = "") -> str:
        try:
            # Converte mensagens para o formato do Gemini
            prompt_parts = []
            if context:
                prompt_parts.append(f"Contexto relevante:\n{context}\n\n")
            
            for msg in messages:
                role = "Usuário" if msg["role"] == "user" else "Assistente"
                prompt_parts.append(f"{role}: {msg['content']}")
            
            prompt = "\n\n".join(prompt_parts)
            
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Erro ao gerar resposta com Gemini: {str(e)}")


class OllamaProvider(AIProvider):
    """Provedor Ollama (local)"""
    
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama2"):
        self.base_url = base_url
        self.model = model
    
    async def generate_response(self, messages: List[Dict[str, str]], context: str = "") -> str:
        try:
            # Converte mensagens para prompt
            prompt_parts = []
            if context:
                prompt_parts.append(f"Contexto relevante:\n{context}\n\n")
            
            for msg in messages:
                role = "Usuário" if msg["role"] == "user" else "Assistente"
                prompt_parts.append(f"{role}: {msg['content']}")
            
            prompt = "\n\n".join(prompt_parts)
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.base_url}/api/generate",
                    json={"model": self.model, "prompt": prompt, "stream": False}
                ) as response:
                    result = await response.json()
                    return result.get("response", "")
        except Exception as e:
            raise Exception(f"Erro ao gerar resposta com Ollama: {str(e)}")


class AIService:
    """Serviço principal de IA que gerencia diferentes provedores"""
    
    def __init__(self):
        self.provider: Optional[AIProvider] = None
        self._init_provider()
    
    def _init_provider(self):
        """Inicializa o provedor de IA baseado nas variáveis de ambiente"""
        provider_name = os.getenv("AI_PROVIDER", "gemini").lower()
        model_name = os.getenv("MODEL_NAME", "")
        
        if provider_name == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY não configurada")
            model = model_name or "gpt-3.5-turbo"
            self.provider = OpenAIProvider(api_key, model)
        
        elif provider_name == "gemini":
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                raise ValueError("GOOGLE_API_KEY não configurada")
            model = model_name or "gemini-pro"
            self.provider = GeminiProvider(api_key, model)
        
        elif provider_name == "ollama":
            base_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
            model = model_name or "llama2"
            self.provider = OllamaProvider(base_url, model)
        
        else:
            raise ValueError(f"Provedor de IA não suportado: {provider_name}")
    
    async def chat(self, messages: List[Dict[str, str]], context: str = "") -> str:
        """Gera resposta usando o provedor configurado"""
        if not self.provider:
            raise Exception("Provedor de IA não inicializado")
        return await self.provider.generate_response(messages, context)
