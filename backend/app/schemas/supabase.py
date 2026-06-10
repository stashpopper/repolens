from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class AnalysisRecord(BaseModel):
    """Represents an analysis record from Supabase."""
    id: str
    repo_url: str
    status: str
    current_phase: int
    progress: int
    file_count: int
    tech_stack: Optional[dict] = None
    architecture_summary: Optional[str] = None
    file_analyses: Optional[dict] = None
    data_flow: Optional[str] = None
    generated_docs: Optional[dict] = None
    error: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class LogRecord(BaseModel):
    """Represents a log entry from Supabase."""
    id: str
    analysis_id: str
    phase: int
    message: str
    timestamp: datetime
