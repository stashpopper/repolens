"""LLM Service — Factory pattern for creating LLM instances based on provider."""

from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.language_models import BaseChatModel
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Default model mappings
DEFAULT_MODELS = {
    "openai": "gpt-4o",
    "anthropic": "claude-sonnet-4-20250514",
    "ollama": "llama3.1",
}


class LLMService:
    """Factory for creating LLM instances with proper configuration."""

    @staticmethod
    def create(
        provider: str = "openai",
        api_key: Optional[str] = None,
        model: Optional[str] = None,
    ) -> BaseChatModel:
        """
        Create an LLM instance based on the specified provider.

        Args:
            provider: 'openai', 'anthropic', or 'ollama'
            api_key: API key for the provider (falls back to env var)
            model: Specific model to use (falls back to default)

        Returns:
            Configured ChatModel instance
        """
        model_name = model or DEFAULT_MODELS.get(provider, "gpt-4o")

        if provider == "openai":
            key = api_key or None
            return ChatOpenAI(
                model=model_name,
                api_key=key,
                temperature=0,
                max_tokens=8192,
            )
        elif provider == "anthropic":
            key = api_key or None
            return ChatAnthropic(
                model=model_name,
                api_key=key,
                temperature=0,
                max_tokens=8192,
            )
        elif provider == "ollama":
            return ChatOpenAI(
                model=model_name,
                base_url="http://localhost:11434/v1",
                api_key="ollama",
                temperature=0,
                max_tokens=4096,
            )
        else:
            raise ValueError(f"Unsupported LLM provider: {provider}")

    @staticmethod
    def create_batch_client(
        provider: str = "openai",
        api_key: Optional[str] = None,
    ):
        """
        Create a batch-capable LLM client for parallel processing.
        Returns the same type as create() but configured for throughput.
        """
        return LLMService.create(
            provider=provider,
            api_key=api_key,
        )
