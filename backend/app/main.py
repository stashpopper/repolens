"""FastAPI application — RepoLens backend entry point."""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analyze import router as analyze_router
from app.api.download import router as download_router
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RepoLens",
    description="AI-powered codebase reverse-documentation agent",
    version="0.1.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analyze_router)
app.include_router(download_router)


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "repolens-backend"}


# Startup event — ensure storage directory exists
@app.on_event("startup")
async def startup():
    settings.analysis_storage_path = "/tmp/repolens_analyses"
    import os
    os.makedirs(settings.analysis_storage_path, exist_ok=True)
    logger.info("RepoLens backend started")
