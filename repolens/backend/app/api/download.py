"""API route for ZIP download of generated docs."""

import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.supabase_service import SupabaseService
from app.services.storage import StorageService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["download"])


@router.get("/download/{analysis_id}")
async def download_docs(analysis_id: str):
    """Download all generated docs as a ZIP archive."""
    # Verify analysis exists and is completed
    record = SupabaseService.get_analysis(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if record.get("status") != "completed":
        raise HTTPException(
            status_code=400,
            detail="Analysis not yet completed. Please wait.",
        )

    storage = StorageService()
    zip_path = storage.create_zip(analysis_id)

    if not zip_path.exists():
        raise HTTPException(status_code=500, detail="Failed to create ZIP archive")

    return FileResponse(
        path=str(zip_path),
        media_type="application/zip",
        filename=f"repolens-{analysis_id[:8]}-docs.zip",
    )
