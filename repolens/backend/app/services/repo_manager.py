"""Repo manager — clone GitHub repos and read local directories."""

import os
import shutil
from pathlib import Path
from git import Repo, GitCommandError
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Files and directories to exclude from analysis
EXCLUDED_PATTERNS = {
    "node_modules",
    ".git",
    ".github",
    ".vscode",
    ".idea",
    "__pycache__",
    ".next",
    ".nuxt",
    "dist",
    "build",
    "out",
    ".output",
    "venv",
    ".venv",
    "env",
    ".env",
    "*.egg-info",
    ".DS_Store",
    "Thumbs.db",
}

# Binary file extensions to skip
BINARY_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp",
    ".mp4", ".mp3", ".wav", ".avi",
    ".zip", ".tar", ".gz", ".rar", ".7z",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx",
    ".pyc", ".pyo", ".so", ".dll", ".exe", ".o", ".obj",
    ".woff", ".woff2", ".ttf", ".eot",
}


def should_exclude(path: Path) -> bool:
    """Check if a path should be excluded from analysis."""
    parts = path.parts
    for part in parts:
        if part in EXCLUDED_PATTERNS:
            return True
        if path.suffix.lower() in BINARY_EXTENSIONS:
            return True
    return False


def is_reasonable_file(path: Path) -> bool:
    """Check if a file is reasonable to analyze (text-based source code)."""
    if should_exclude(path):
        return False
    # Skip very large files (>500KB)
    try:
        if path.stat().st_size > 500_000:
            return False
    except OSError:
        return False
    return True


class RepoManager:
    """Manages cloning and reading of repositories."""

    @staticmethod
    def clone_github(url: str, token: str = None) -> Path:
        """Clone a GitHub repository to a local temp directory."""
        base_path = Path(settings.analysis_storage_path)
        base_path.mkdir(parents=True, exist_ok=True)

        # Extract repo name from URL
        url_clean = url.rstrip("/")
        if "github.com" in url_clean:
            parts = url_clean.split("github.com/")
            repo_name = parts[-1].rstrip("/")
            # Remove .git suffix if present
            repo_name = repo_name.replace(".git", "")
        else:
            repo_name = url_clean.split("/")[-1]

        repo_path = base_path / repo_name

        # Remove existing clone if any
        if repo_path.exists():
            shutil.rmtree(repo_path)

        # Build clone URL with token if provided
        if token:
            clone_url = f"https://{token}@github.com/{repo_name}.git"
        else:
            clone_url = f"https://github.com/{repo_name}.git"

        try:
            Repo.clone_from(clone_url, repo_path, depth=1)
            logger.info(f"Cloned repo to {repo_path}")
            return repo_path
        except GitCommandError as e:
            if repo_path.exists():
                shutil.rmtree(repo_path)
            raise RuntimeError(f"Failed to clone repository: {e}")

    @staticmethod
    def read_local(path: str) -> Path:
        """Validate and return a local directory path."""
        local_path = Path(path).resolve()
        if not local_path.exists():
            raise FileNotFoundError(f"Local path does not exist: {path}")
        if not local_path.is_dir():
            raise NotADirectoryError(f"Path is not a directory: {path}")
        if not any(local_path.iterdir()):
            raise ValueError(f"Directory is empty: {path}")
        return local_path

    @staticmethod
    def list_files(base_path: Path) -> list[dict]:
        """
        Recursively list all reasonable source files in a directory.
        Returns list of dicts with path, relative_path, and size.
        """
        files = []
        for root, dirs, filenames in os.walk(base_path):
            # Filter out excluded directories in-place
            dirs[:] = [d for d in dirs if d not in EXCLUDED_PATTERNS]

            for filename in filenames:
                file_path = Path(root) / filename
                rel_path = file_path.relative_to(base_path)

                if is_reasonable_file(file_path):
                    try:
                        size = file_path.stat().st_size
                    except OSError:
                        size = 0
                    files.append({
                        "path": str(file_path),
                        "relative_path": str(rel_path),
                        "size": size,
                    })

        return files

    @staticmethod
    def read_file_content(file_path: Path) -> str:
        """Read the content of a source file."""
        try:
            return file_path.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            logger.warning(f"Failed to read file {file_path}: {e}")
            return ""

    @staticmethod
    def cleanup(repo_path: Path):
        """Remove a cloned repo after analysis is complete."""
        if repo_path.exists() and repo_path.is_dir():
            shutil.rmtree(repo_path, ignore_errors=True)
