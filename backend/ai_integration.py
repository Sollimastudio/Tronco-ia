"""
Integração com Serviços de IA
Suporta OpenAI, Google Gemini e Ollama.
"""

import os
from typing import List, Dict, Optional
from abc import ABC, abstractmethod
import httpx
from loguru import logger


class BaseAIProvider(ABC):
    """Classe base para provedores de IA"""
    
    @abstractmethod
    async def chat(self, messages: List[Dict[str, str]], model: str) -> str:
        """
        Envia mensagens para a IA e retorna a resposta.
        
        Args:
            messages: Lista de mensagens (role, content)
            model: Nome do modelo a usar
            
        Returns:
            Resposta da IA
        """
        pass


class OpenAIProvider(BaseAIProvider):
    """Provider para OpenAI (ChatGPT)"""
    
    def __init__(self, api_key: str):
        """
        Inicializa o provider OpenAI.
        
        Args:
            api_key: Chave de API da OpenAI
        """
        self.api_key = api_key
        try:
            import openai
            self.client = openai.AsyncOpenAI(api_key=api_key)
            logger.info("OpenAI provider inicializado")
        except ImportError:
            logger.error("Biblioteca openai não instalada")
            raise
    
    async def chat(self, messages: List[Dict[str, str]], model: str = "gpt-3.5-turbo") -> str:
        """
        Envia mensagens para OpenAI e retorna resposta.
        
        Args:
            messages: Lista de mensagens
            model: Modelo a usar (padrão: gpt-3.5-turbo)
            
        Returns:
            Resposta do modelo
        """
        try:
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Erro ao chamar OpenAI: {e}")
            raise


class GeminiProvider(BaseAIProvider):
    """Provider para Google Gemini"""
    
    def __init__(self, api_key: str):
        """
        Inicializa o provider Gemini.
        
        Args:
            api_key: Chave de API do Google
        """
        self.api_key = api_key
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            self.genai = genai
            logger.info("Gemini provider inicializado")
        except ImportError:
            logger.error("Biblioteca google-generativeai não instalada")
            raise
    
    async def chat(self, messages: List[Dict[str, str]], model: str = "gemini-pro") -> str:
        """
        Envia mensagens para Gemini e retorna resposta.
        
        Args:
            messages: Lista de mensagens
            model: Modelo a usar (padrão: gemini-pro)
            
        Returns:
            Resposta do modelo
        """
        try:
            # Converte mensagens para formato do Gemini
            chat_history = []
            for msg in messages[:-1]:
                role = "user" if msg["role"] == "user" else "model"
                chat_history.append({
                    "role": role,
                    "parts": [msg["content"]]
                })
            
            model_instance = self.genai.GenerativeModel(model)
            chat = model_instance.start_chat(history=chat_history)
            
            # Envia última mensagem
            response = chat.send_message(messages[-1]["content"])
            return response.text
        except Exception as e:
            logger.error(f"Erro ao chamar Gemini: {e}")
            raise


class OllamaProvider(BaseAIProvider):
    """Provider para Ollama (local)"""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        """
        Inicializa o provider Ollama.
        
        Args:
            base_url: URL base do servidor Ollama
        """
        self.base_url = base_url
        logger.info(f"Ollama provider inicializado com URL: {base_url}")
    
    async def chat(self, messages: List[Dict[str, str]], model: str = "llama2") -> str:
        """
        Envia mensagens para Ollama e retorna resposta.
        
        Args:
            messages: Lista de mensagens
            model: Modelo a usar (padrão: llama2)
            
        Returns:
            Resposta do modelo
        """
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json={
                        "model": model,
                        "messages": messages,
                        "stream": False
                    }
                )
                response.raise_for_status()
                return response.json()["message"]["content"]
        except Exception as e:
            logger.error(f"Erro ao chamar Ollama: {e}")
            raise


class AIIntegration:
    """Gerenciador principal de integrações com IA"""
    
    def __init__(self):
        """Inicializa o gerenciador de IA"""
        self.providers: Dict[str, BaseAIProvider] = {}
        self._initialize_providers()
    
    def _initialize_providers(self):
        """Inicializa os providers disponíveis baseado nas variáveis de ambiente"""
        
        # OpenAI
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            try:
                self.providers["openai"] = OpenAIProvider(openai_key)
                logger.info("Provider OpenAI registrado")
            except Exception as e:
                logger.warning(f"Falha ao inicializar OpenAI: {e}")
        
        # Gemini
        gemini_key = os.getenv("GEMINI_API_KEY")
        if gemini_key:
            try:
                self.providers["gemini"] = GeminiProvider(gemini_key)
                logger.info("Provider Gemini registrado")
            except Exception as e:
                logger.warning(f"Falha ao inicializar Gemini: {e}")
        
        # Ollama
        ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434")
        try:
            self.providers["ollama"] = OllamaProvider(ollama_url)
            logger.info("Provider Ollama registrado")
        except Exception as e:
            logger.warning(f"Falha ao inicializar Ollama: {e}")
        
        if not self.providers:
            logger.warning("Nenhum provider de IA foi configurado!")
    
    async def chat(self, provider_name: str, messages: List[Dict[str, str]], model: Optional[str] = None) -> str:
        """
        Envia mensagens para o provider especificado.
        
        Args:
            provider_name: Nome do provider (openai, gemini, ollama)
            messages: Lista de mensagens
            model: Modelo específico (opcional)
            
        Returns:
            Resposta da IA
        """
        provider = self.providers.get(provider_name)
        if not provider:
            raise ValueError(f"Provider '{provider_name}' não disponível. Providers disponíveis: {list(self.providers.keys())}")
        
        # Define modelos padrão se não especificado
        if model is None:
            default_models = {
                "openai": "gpt-3.5-turbo",
                "gemini": "gemini-pro",
                "ollama": "llama2"
            }
            model = default_models.get(provider_name, "")
        
        return await provider.chat(messages, model)
    
    def get_available_providers(self) -> List[str]:
        """
        Retorna lista de providers disponíveis.
        
        Returns:
            Lista com nomes dos providers configurados
        """
        return list(self.providers.keys())
    
    def is_provider_available(self, provider_name: str) -> bool:
        """
        Verifica se um provider está disponível.
        
        Args:
            provider_name: Nome do provider
            
        Returns:
            True se disponível, False caso contrário
        """
        return provider_name in self.providers
