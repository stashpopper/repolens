from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AnalyzeRequest(BaseModel):
    """Request to start a codebase analysis."""
    repo_url: Optional[str] = None  # GitHub URL
    local_path: Optional[str] = None  # Local directory path
    llm_provider: str = "openai"  # openai, anthropic, mistral, ollama
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    mistral_api_key: Optional[str] = None
    github_token: Optional[str] = None

    def model_post_init(self, __context):
        if not self.repo_url and not self.local_path:
            raise ValueError("Either repo_url or local_path must be provided")


class AnalysisStatus(BaseModel):
    """Current status of an analysis."""
    id: str
    status: str
    current_phase: int
    progress: int
    file_count: int
    tech_stack: Optional[dict] = None
    created_at: datetime
    error: Optional[str] = None


class LogEntry(BaseModel):
    """A single log entry from an analysis."""
    id: str
    phase: int
    message: str
    timestamp: datetime


class AnalysisHistoryItem(BaseModel):
    """Item in the analysis history list."""
    id: str
    repo_url: str
    status: str
    current_phase: int
    progress: int
    file_count: int
    created_at: datetime


class DownloadRequest(BaseModel):
    """Request to download analysis docs."""
    analysis_id: str
