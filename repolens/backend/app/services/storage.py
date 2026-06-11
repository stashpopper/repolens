"""Storage service — manages analysis lifecycle (temp files, ZIP creation)."""

import os
import zipfile
from pathlib import Path
from app.config import settings
import logging

logger = logging.getLogger(__name__)


class StorageService:
    """Handles temporary file storage for analyses."""

    def __init__(self):
        self.base_path = Path(settings.analysis_storage_path)
        self.base_path.mkdir(parents=True, exist_ok=True)

    def get_analysis_dir(self, analysis_id: str) -> Path:
        """Get the directory for a specific analysis."""
        dir_path = self.base_path / analysis_id
        dir_path.mkdir(parents=True, exist_ok=True)
        return dir_path

    def write_doc(self, analysis_id: str, filename: str, content: str) -> Path:
        """Write a generated doc file to the analysis directory."""
        dir_path = self.get_analysis_dir(analysis_id)
        file_path = dir_path / filename
        file_path.write_text(content, encoding="utf-8")
        return file_path

    def create_zip(self, analysis_id: str) -> Path:
        """Create a ZIP archive of all docs for an analysis."""
        dir_path = self.get_analysis_dir(analysis_id)
        zip_path = dir_path / "docs.zip"

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for file_path in dir_path.glob("*.md"):
                zipf.write(file_path, file_path.name)

        return zip_path

    def get_doc(self, analysis_id: str, filename: str) -> str | None:
        """Read a generated doc file."""
        dir_path = self.get_analysis_dir(analysis_id)
        file_path = dir_path / filename
        if file_path.exists():
            return file_path.read_text(encoding="utf-8")
        return None

    def list_docs(self, analysis_id: str) -> list[str]:
        """List all doc files for an analysis."""
        dir_path = self.get_analysis_dir(analysis_id)
        return [f.name for f in dir_path.glob("*.md")]

    def cleanup(self, analysis_id: str):
        """Remove all files for an analysis."""
        dir_path = self.base_path / analysis_id
        if dir_path.exists():
            import shutil
            shutil.rmtree(dir_path, ignore_errors=True)
