from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_service_role_key: str

    # LLM Providers (user provides at runtime, but defaults here)
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    mistral_api_key: Optional[str] = None
    mistral_model: str = "labs-leanstral-2603"

    # Analysis limits
    max_repo_size_mb: int = 100
    max_files: int = 500

    # GitHub
    github_token: Optional[str] = None

    # Storage
    analysis_storage_path: str = "/tmp/repolens_analyses"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
