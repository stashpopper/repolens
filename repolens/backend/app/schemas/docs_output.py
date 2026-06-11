"""Pydantic schema for structured Phase 6 documentation output."""

from pydantic import BaseModel, Field


class DocsOutput(BaseModel):
    """Structured documentation output from Phase 6."""
    project_overview: str = Field(
        description="Project overview: what the project does, tech stack, architecture, entry points"
    )
    file_breakdown: str = Field(
        description="File-by-file analysis grouped by category with purpose and connections"
    )
    data_flow: str = Field(
        description="How data moves through the app: API routes, frontend flow, state management"
    )
    api_endpoints: str = Field(
        description="All API routes/endpoints with request/response shapes and business logic"
    )
    dependency_map: str = Field(
        description="Import/export graph, file dependencies, circular dependency warnings"
    )
    glossary: str = Field(
        description="Key terms, custom types, interfaces, constants, naming conventions"
    )
