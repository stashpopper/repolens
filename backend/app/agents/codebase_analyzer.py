"""LangGraph agent — 6-phase codebase analyzer state machine."""

import json
import logging
from typing import TypedDict, Annotated
from typing_extensions import Annotated as Ann
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import JsonOutputParser
from pathlib import Path

from app.services.repo_manager import RepoManager
from app.services.llm_service import LLMService
from app.services.supabase_service import SupabaseService
from app.services.storage import StorageService
from app.agents.prompts import (
    PHASE_1_INTRO, PHASE_2_INTRO, PHASE_3_INTRO,
    PHASE_4_INTRO, PHASE_5_INTRO, PHASE_6_INTRO,
)

logger = logging.getLogger(__name__)


class AnalysisState(TypedDict):
    """Shared state across all phases."""
    repo_url: str
    local_path: str
    llm_provider: str
    api_key: str
    github_token: str
    repo_path: str
    file_list: list
    tech_stack: dict
    architecture_summary: str
    file_analyses: dict
    data_flow: str
    generated_docs: dict
    progress: int
    error: str | None


def _parse_json_response(response) -> dict:
    """Safely parse JSON from an LLM response."""
    content = response.content.strip()
    # Try to extract JSON from markdown code blocks
    if "```" in content:
        for block in content.split("```"):
            if "json" in block.lower() or "{" in block:
                content = block.split("\n", 1)[-1] if "\n" in block else block
                break

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        logger.warning(f"Failed to parse JSON from LLM response: {content[:200]}...")
        return {}


def _write_log(analysis_id: str, phase: int, message: str):
    """Write a log entry to Supabase."""
    try:
        SupabaseService.add_log_entry(analysis_id, phase, message)
    except Exception as e:
        logger.error(f"Failed to write log: {e}")


def _update_state(state: AnalysisState, updates: dict) -> AnalysisState:
    """Update state and write to Supabase."""
    state.update(updates)
    analysis_id = state.get("repo_url", "")  # We use repo_url as the analysis ID
    if state.get("current_phase", 0) > 0:
        SupabaseService.update_analysis(
            analysis_id,
            {
                "current_phase": state.get("current_phase", 0),
                "progress": state.get("progress", 0),
                "file_count": state.get("file_count", 0),
                "tech_stack": state.get("tech_stack"),
                "architecture_summary": state.get("architecture_summary"),
                "file_analyses": state.get("file_analyses"),
                "data_flow": state.get("data_flow"),
                "generated_docs": state.get("generated_docs"),
                "error": state.get("error"),
            },
        )
    return state


# Phase 1: Intake Repo
def phase_1_intake(state: AnalysisState) -> AnalysisState:
    """Clone the repo and list all files."""
    analysis_id = state["repo_url"]
    _write_log(analysis_id, 1, "Starting Phase 1: Intaking repository...")

    try:
        repo_manager = RepoManager()

        if state.get("local_path"):
            _write_log(analysis_id, 1, f"Reading local directory: {state['local_path']}")
            repo_path = repo_manager.read_local(state["local_path"])
        else:
            _write_log(analysis_id, 1, f"Cloning GitHub repo: {state['repo_url']}")
            repo_path = repo_manager.clone_github(
                state["repo_url"],
                state.get("github_token"),
            )

        state["repo_path"] = str(repo_path)
        files = repo_manager.list_files(repo_path)

        _write_log(analysis_id, 1, f"Found {len(files)} source files")

        # Limit files to prevent token overflow
        if len(files) > 100:
            files = files[:100]
            _write_log(analysis_id, 1, f"Trimmed to first 100 files (limit)")

        state["file_list"] = files
        state["file_count"] = len(files)
        state["progress"] = 15

        _write_log(analysis_id, 1, "Phase 1 complete: Repository analyzed")

    except Exception as e:
        state["error"] = f"Phase 1 failed: {str(e)}"
        _write_log(analysis_id, 1, f"ERROR: {str(e)}")
        SupabaseService.update_analysis(
            analysis_id, {"status": "failed", "error": state["error"]}
        )
        raise

    return _update_state(state, {"progress": 15})


# Phase 2: Detect Tech Stack
def phase_2_detect(state: AnalysisState) -> AnalysisState:
    """Detect the tech stack from config files."""
    analysis_id = state["repo_url"]
    _write_log(analysis_id, 2, "Starting Phase 2: Detecting tech stack...")

    try:
        llm = LLMService.create(
            state["llm_provider"],
            state.get("api_key"),
        )

        repo_manager = RepoManager()
        repo_path = Path(state["repo_path"])

        # Read config files
        config_files = {}
        config_names = [
            "package.json", "requirements.txt", "Cargo.toml", "go.mod",
            "setup.py", "pyproject.toml", "composer.json", "Gemfile",
            "tsconfig.json", "vite.config.ts", "next.config.js",
            "tailwind.config.js", "Dockerfile", "docker-compose.yml",
        ]

        for name in config_names:
            file_path = repo_path / name
            if file_path.exists():
                content = repo_manager.read_file_content(file_path)
                config_files[name] = content

        # Build prompt
        config_content = "\n\n".join(
            f"### {name}\n```{name}\n{content}\n```"
            for name, content in config_files.items()
        )

        prompt = PHASE_2_INTRO.format(
            phase1_summary=f"Found {len(state['file_list'])} source files across the repository.",
            config_files_content=config_content if config_content else "No standard config files found.",
        )

        response = llm.invoke([HumanMessage(content=prompt)])
        result = _parse_json_response(response)

        state["tech_stack"] = result
        state["progress"] = 30

        _write_log(analysis_id, 2, f"Detected tech stack: {result.get('framework', 'Unknown')}")
        _write_log(analysis_id, 2, "Phase 2 complete: Tech stack detected")

    except Exception as e:
        state["error"] = f"Phase 2 failed: {str(e)}"
        _write_log(analysis_id, 2, f"ERROR: {str(e)}")
        raise

    return _update_state(state, {"progress": 30})


# Phase 3: Architecture Overview
def phase_3_architecture(state: AnalysisState) -> AnalysisState:
    """Analyze high-level architecture."""
    analysis_id = state["repo_url"]
    _write_log(analysis_id, 3, "Starting Phase 3: Architecture overview...")

    try:
        llm = LLMService.create(
            state["llm_provider"],
            state.get("api_key"),
        )

        repo_manager = RepoManager()
        repo_path = Path(state["repo_path"])

        # Read key architectural files
        important_files = {}
        important_names = [
            "README.md", "src/main.ts", "src/main.tsx", "src/index.ts",
            "app.py", "main.py", "index.js", "server.js", "app.ts",
            "src/App.tsx", "src/App.js", "package.json", "next.config.js",
            "nuxt.config.ts", "angular.json", "svelte.config.js",
        ]

        for name in important_names:
            file_path = repo_path / name
            if file_path.exists():
                content = repo_manager.read_file_content(file_path)
                important_files[name] = content

        files_content = "\n\n".join(
            f"### {name}\n```{name}\n{content}\n```"
            for name, content in important_files.items()
        )

        prompt = PHASE_3_INTRO.format(
            phase2_summary=json.dumps(state.get("tech_stack", {})),
            important_files_content=files_content if files_content else "No key architectural files found.",
        )

        response = llm.invoke([HumanMessage(content=prompt)])

        state["architecture_summary"] = response.content
        state["progress"] = 50

        _write_log(analysis_id, 3, "Phase 3 complete: Architecture overview generated")

    except Exception as e:
        state["error"] = f"Phase 3 failed: {str(e)}"
        _write_log(analysis_id, 3, f"ERROR: {str(e)}")
        raise

    return _update_state(state, {"progress": 50})


# Phase 4: File-by-File Analysis (with grouping)
def phase_4_analyze_files(state: AnalysisState) -> AnalysisState:
    """Analyze files grouped by category."""
    analysis_id = state["repo_url"]
    _write_log(analysis_id, 4, "Starting Phase 4: File-by-file analysis...")

    try:
        llm = LLMService.create(
            state["llm_provider"],
            state.get("api_key"),
        )

        repo_manager = RepoManager()
        repo_path = Path(state["repo_path"])

        # Group files by category
        groups = {
            "Components": [],
            "Routes/API": [],
            "Utils/Hooks": [],
            "Models/Types": [],
            "Config": [],
            "Other": [],
        }

        for file_info in state["file_list"]:
            rel_path = file_info["relative_path"]
            name = Path(rel_path).name.lower()

            if any(x in rel_path for x in ["/components/", "/ui/", "/widgets/"]):
                groups["Components"].append(file_info)
            elif any(x in rel_path for x in ["/routes/", "/api/", "/controllers/"]):
                groups["Routes/API"].append(file_info)
            elif any(x in name for x in ["util", "helper", "hook", "service", "store"]) or \
                 any(rel_path.endswith(x) for x in [".utils.ts", ".utils.js", ".helpers.ts"]):
                groups["Utils/Hooks"].append(file_info)
            elif any(x in rel_path for x in ["/models/", "/types/", "/schemas/"]) or \
                 any(name.endswith(x) for x in [".types.ts", ".types.js", ".interface.ts"]):
                groups["Models/Types"].append(file_info)
            elif any(x in name for x in ["config", ".env", "settings", "constants"]):
                groups["Config"].append(file_info)
            else:
                groups["Other"].append(file_info)

        file_analyses = {}

        for group_name, files in groups.items():
            if not files:
                continue

            _write_log(analysis_id, 4, f"Analyzing {group_name} group ({len(files)} files)")

            # Read file contents
            files_content = ""
            for file_info in files[:20]:  # Limit per group
                file_path = Path(file_info["path"])
                content = repo_manager.read_file_content(file_path)
                files_content += f"\n### {file_info['relative_path']}\n```{file_info['relative_path'].split('.')[-1]}\n{content}\n```\n"

            prompt = PHASE_4_INTRO.format(
                phase3_summary=f"Architecture: {state.get('architecture_summary', '')[:200]}...",
                group_name=group_name,
                files_content=files_content,
            )

            response = llm.invoke([HumanMessage(content=prompt)])
            file_analyses[group_name] = response.content

            state["file_analyses"] = file_analyses
            state["progress"] = 50 + int(25 * (len(groups) / max(len(groups), 1)))

        state["progress"] = 75
        _write_log(analysis_id, 4, "Phase 4 complete: All files analyzed")

    except Exception as e:
        state["error"] = f"Phase 4 failed: {str(e)}"
        _write_log(analysis_id, 4, f"ERROR: {str(e)}")
        raise

    return _update_state(state, {"progress": 75})


# Phase 5: Data Flow Mapping
def phase_5_data_flow(state: AnalysisState) -> AnalysisState:
    """Map data flow through the project."""
    analysis_id = state["repo_url"]
    _write_log(analysis_id, 5, "Starting Phase 5: Data flow mapping...")

    try:
        llm = LLMService.create(
            state["llm_provider"],
            state.get("api_key"),
        )

        prompt = PHASE_5_INTRO.format(
            phase4_summary=f"Analyzed {len(state.get('file_analyses', {}))} file groups with detailed breakdowns.",
        )

        response = llm.invoke([HumanMessage(content=prompt)])

        state["data_flow"] = response.content
        state["progress"] = 90

        _write_log(analysis_id, 5, "Phase 5 complete: Data flow mapped")

    except Exception as e:
        state["error"] = f"Phase 5 failed: {str(e)}"
        _write_log(analysis_id, 5, f"ERROR: {str(e)}")
        raise

    return _update_state(state, {"progress": 90})


# Phase 6: Generate Docs
def phase_6_generate_docs(state: AnalysisState) -> AnalysisState:
    """Generate final multi-file documentation."""
    analysis_id = state["repo_url"]
    _write_log(analysis_id, 6, "Starting Phase 6: Generating documentation...")

    try:
        llm = LLMService.create(
            state["llm_provider"],
            state.get("api_key"),
        )

        storage = StorageService()

        prompt = PHASE_6_INTRO.format(
            phase5_summary=f"Data flow: {state.get('data_flow', '')[:300]}...",
        )

        response = llm.invoke([HumanMessage(content=prompt)])
        docs = _parse_json_response(response)

        # Save each doc file
        for filename, content in docs.items():
            storage.write_doc(analysis_id, filename, content)
            _write_log(analysis_id, 6, f"Generated {filename}")

        state["generated_docs"] = list(docs.keys())
        state["progress"] = 100

        _write_log(analysis_id, 6, "Phase 6 complete: All documentation generated")
        SupabaseService.update_analysis(
            analysis_id, {"status": "completed", "generated_docs": docs}
        )

    except Exception as e:
        state["error"] = f"Phase 6 failed: {str(e)}"
        _write_log(analysis_id, 6, f"ERROR: {str(e)}")
        SupabaseService.update_analysis(
            analysis_id, {"status": "failed", "error": state["error"]}
        )
        raise

    return _update_state(state, {"progress": 100})


# Build the LangGraph StateGraph
def build_analyzer_graph():
    """Build and compile the LangGraph state machine."""
    workflow = StateGraph(AnalysisState)

    # Add nodes
    workflow.add_node("phase_1_intake", phase_1_intake)
    workflow.add_node("phase_2_detect", phase_2_detect)
    workflow.add_node("phase_3_architecture", phase_3_architecture)
    workflow.add_node("phase_4_analyze_files", phase_4_analyze_files)
    workflow.add_node("phase_5_data_flow", phase_5_data_flow)
    workflow.add_node("phase_6_generate_docs", phase_6_generate_docs)

    # Set entry point
    workflow.set_entry_point("phase_1_intake")

    # Add sequential edges
    workflow.add_edge("phase_1_intake", "phase_2_detect")
    workflow.add_edge("phase_2_detect", "phase_3_architecture")
    workflow.add_edge("phase_3_architecture", "phase_4_analyze_files")
    workflow.add_edge("phase_4_analyze_files", "phase_5_data_flow")
    workflow.add_edge("phase_5_data_flow", "phase_6_generate_docs")
    workflow.add_edge("phase_6_generate_docs", END)

    return workflow.compile()
