"""Supabase service — CRUD wrapper for analyses and analysis_logs tables."""

from supabase import create_client, Client
from app.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

_client: Optional[Client] = None


def get_supabase_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_role_key)
    return _client


class SupabaseService:
    """Async-compatible wrapper around Supabase client."""

    @staticmethod
    def create_analysis(
        repo_url: str,
        llm_provider: str = "openai",
        github_token: Optional[str] = None,
    ) -> dict:
        """Create a new analysis record with pending status."""
        client = get_supabase_client()
        data = {
            "repo_url": repo_url,
            "status": "pending",
            "current_phase": 0,
            "progress": 0,
            "file_count": 0,
        }
        result = client.table("analyses").insert(data).execute()
        if not result.data:
            raise RuntimeError("Failed to create analysis record")
        return result.data[0]

    @staticmethod
    def get_analysis(analysis_id: str) -> Optional[dict]:
        """Get a single analysis by ID."""
        client = get_supabase_client()
        result = (
            client.table("analyses")
            .select("*")
            .eq("id", analysis_id)
            .execute()
        )
        if not result.data:
            return None
        return result.data[0]

    @staticmethod
    def update_analysis(
        analysis_id: str,
        updates: dict,
    ) -> dict:
        """Update analysis fields (status, phase, progress, results, etc.)."""
        client = get_supabase_client()
        result = (
            client.table("analyses")
            .update(updates)
            .eq("id", analysis_id)
            .execute()
        )
        if not result.data:
            raise RuntimeError(f"Failed to update analysis {analysis_id}")
        return result.data[0]

    @staticmethod
    def add_log_entry(
        analysis_id: str,
        phase: int,
        message: str,
    ) -> dict:
        """Add a log entry for an analysis."""
        client = get_supabase_client()
        data = {
            "analysis_id": analysis_id,
            "phase": phase,
            "message": message,
        }
        result = client.table("analysis_logs").insert(data).execute()
        if not result.data:
            logger.warning(f"Failed to add log entry for analysis {analysis_id}")
            return {}
        return result.data[0]

    @staticmethod
    def get_logs(analysis_id: str) -> list[dict]:
        """Get all log entries for an analysis, ordered by timestamp."""
        client = get_supabase_client()
        result = (
            client.table("analysis_logs")
            .select("*")
            .eq("analysis_id", analysis_id)
            .order("timestamp", desc=False)
            .execute()
        )
        return result.data or []

    @staticmethod
    def get_analyses(
        limit: int = 20,
        offset: int = 0,
    ) -> list[dict]:
        """Get list of past analyses, ordered by created_at DESC."""
        client = get_supabase_client()
        result = (
            client.table("analyses")
            .select("id, repo_url, status, current_phase, progress, file_count, created_at")
            .order("created_at", desc=True)
            .range(offset, offset + limit - 1)
            .execute()
        )
        return result.data or []

    @staticmethod
    def delete_analysis(analysis_id: str) -> bool:
        """Delete an analysis and its logs (cascade)."""
        client = get_supabase_client()
        result = (
            client.table("analyses")
            .delete()
            .eq("id", analysis_id)
            .execute()
        )
        return len(result.data) > 0 if result.data else False

    @staticmethod
    def update_analysis_progress(
        analysis_id: str,
        phase: int,
        progress: int,
        file_count: int = 0,
    ):
        """Convenience method to update phase and progress."""
        SupabaseService.update_analysis(
            analysis_id,
            {
                "current_phase": phase,
                "progress": progress,
                "file_count": file_count,
            },
        )
