"""API routes for analysis management."""

import threading
import logging
from fastapi import APIRouter, HTTPException
from app.schemas.analysis import AnalyzeRequest, AnalysisStatus, LogEntry, AnalysisHistoryItem
from app.services.supabase_service import SupabaseService
from app.services.storage import StorageService
from app.agents.codebase_analyzer import build_analyzer_graph, AnalysisState

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["analysis"])


def run_analysis(analysis_id: str, request: AnalyzeRequest):
    """Run the analysis in a background thread."""
    try:
        # Update status to running
        SupabaseService.update_analysis(analysis_id, {"status": "running"})
        SupabaseService.add_log_entry(analysis_id, 0, "Analysis started")

        # Build initial state
        initial_state: AnalysisState = {
            "repo_url": analysis_id,
            "local_path": request.local_path,
            "llm_provider": request.llm_provider,
            "api_key": request.openai_api_key or request.anthropic_api_key,
            "github_token": request.github_token,
            "repo_path": "",
            "file_list": [],
            "tech_stack": {},
            "architecture_summary": "",
            "file_analyses": {},
            "data_flow": "",
            "generated_docs": {},
            "progress": 0,
            "error": None,
        }

        # Run the LangGraph pipeline
        graph = build_analyzer_graph()
        graph.invoke(initial_state)

        SupabaseService.add_log_entry(analysis_id, 6, "Analysis completed successfully")

    except Exception as e:
        logger.exception(f"Analysis failed for {analysis_id}")
        SupabaseService.update_analysis(
            analysis_id,
            {"status": "failed", "error": str(e)},
        )
        SupabaseService.add_log_entry(
            analysis_id, 0, f"ERROR: {str(e)}"
        )


@router.post("/analyze")
async def start_analysis(request: AnalyzeRequest):
    """Submit a repo for analysis. Returns the analysis ID."""
    try:
        # Create the analysis record in Supabase
        analysis_record = SupabaseService.create_analysis(
            repo_url=request.repo_url or request.local_path,
            llm_provider=request.llm_provider,
            github_token=request.github_token,
        )
        analysis_id = analysis_record["id"]

        # Start analysis in background thread
        thread = threading.Thread(
            target=run_analysis,
            args=(analysis_id, request),
            daemon=True,
        )
        thread.start()

        return {"analysis_id": analysis_id, "status": "pending"}

    except Exception as e:
        logger.exception("Failed to start analysis")
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/status/{analysis_id}")
async def get_status(analysis_id: str):
    """Get current status of an analysis."""
    record = SupabaseService.get_analysis(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return AnalysisStatus(
        id=record["id"],
        status=record["status"],
        current_phase=record["current_phase"],
        progress=record["progress"],
        file_count=record["file_count"],
        tech_stack=record.get("tech_stack"),
        created_at=record["created_at"],
        error=record.get("error"),
    )


@router.get("/logs/{analysis_id}")
async def get_logs(analysis_id: str):
    """Get all log entries for an analysis."""
    logs = SupabaseService.get_logs(analysis_id)
    return [LogEntry(**log) for log in logs]


@router.get("/docs/{analysis_id}")
async def get_docs(analysis_id: str):
    """Get all generated docs as JSON."""
    record = SupabaseService.get_analysis(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    docs = record.get("generated_docs", {})
    if not docs:
        raise HTTPException(status_code=202, detail="Docs not yet generated. Analysis may still be running.")

    # Load doc contents from storage
    storage = StorageService()
    result = {}
    for filename in docs:
        content = storage.get_doc(analysis_id, filename)
        if content:
            result[filename] = content

    return result


@router.get("/history")
async def get_history(limit: int = 20, offset: int = 0):
    """List past analyses."""
    analyses = SupabaseService.get_analyses(limit=limit, offset=offset)
    return [AnalysisHistoryItem(**a) for a in analyses]


@router.delete("/cleanup/{analysis_id}")
async def cleanup_analysis(analysis_id: str):
    """Delete an analysis and its data."""
    deleted = SupabaseService.delete_analysis(analysis_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Analysis not found")

    StorageService().cleanup(analysis_id)
    return {"message": "Analysis deleted"}
