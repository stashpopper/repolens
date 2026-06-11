"""Prompts for each phase of the codebase analysis."""

# Phase 1: Intake Repo
PHASE_1_INTRO = """## Context
No previous phase. Starting fresh analysis.

## Your Task
Analyze the file structure of this repository and provide a high-level overview.

Repository: {repo_url_or_path}
Total files to analyze: {file_count}
Files listed:
{file_list}

## Output Format
Return a JSON object:
{{
  "overview": "1-2 sentence description of the project type",
  "file_categories": {{
    "source_files": [count],
    "config_files": [count],
    "test_files": [count],
    "other": [count]
  }},
  "key_files": ["list of important files like package.json, main entry points, etc."],
  "notes": "Any observations about the structure"
}}"""


# Phase 2: Detect Tech Stack
PHASE_2_INTRO = """## Context (from Phase 1)
{phase1_summary}

## Your Task
Examine the configuration and dependency files to determine the tech stack.

Key files to analyze:
{config_files_content}

## CRITICAL RULES
- ONLY report dependencies and tools that you ACTUALLY SEE in the config files provided above.
- Do NOT invent or guess dependencies. If a dependency is not listed in any config file, do NOT include it.
- If no backend dependencies exist, set "backend" to an empty list.
- Be precise: report exact package names as they appear in the config files.

## Output Format
Return a JSON object:
{{
  "framework": "e.g., React, Next.js, FastAPI, Django",
  "language": "e.g., TypeScript, Python, JavaScript",
  "dependencies": {{
    "frontend": ["list of frontend libs found in config files"],
    "backend": ["list of backend libs found in config files, or [] if none"],
    "tools": ["build tools, linters, etc. found in config files"]
  }},
  "styling": "e.g., Tailwind CSS, CSS Modules, Styled Components, or 'None detected'",
  "state_management": "e.g., Redux, Context API, Zustand, or 'None detected'",
  "build_system": "e.g., Vite, Webpack, Next.js built-in",
  "testing": "e.g., Jest, Pytest, Vitest",
  "notes": "Any additional tech observations based on actual config files"
}}"""


# Phase 3: Architecture Overview
PHASE_3_INTRO = """## Context (from Phase 2)
{phase2_summary}

## Your Task
Analyze the top-level structure and entry points to understand the project architecture in DEPTH.

Important files to examine:
{important_files_content}

## CRITICAL RULES
- Base your analysis SOLELY on the file contents provided above.
- Do NOT invent directories, files, or architectural patterns that are not evident from the provided files.
- If this is a library (not an application), describe it as a library, not as a web application.
- Do NOT assume common patterns (MVC, REST API, etc.) unless you see evidence of them in the actual files.
- **BE COMPREHENSIVE** — explain architectural decisions and their rationale.

## Output Format
Write a detailed architecture overview in markdown:

# Architecture Overview

## Project Type
[What kind of project is this? Be specific — library, framework, application, CLI, etc. What problem does it solve?]

## Entry Points
- [List ALL main entry files, what they do, how they bootstrap the application]
- [Explain initialization sequence and startup flow]

## Directory Structure
[Explain the purpose of each major directory with detail. Why is the project organized this way?]

## Key Architectural Patterns
[Describe actual patterns you see in detail — e.g., component composition, hooks, providers, dependency injection, middleware]
[Explain WHY these patterns were chosen and how they work]

## Data Flow (High Level)
[How does data generally flow through the app/library — based on actual code]
[Include specific examples of data transformations and state management]

## Configuration and Build
[How the project is configured, built, and deployed based on config files seen]

## Notable Design Decisions
[What stands out about this project's architecture? What's clever or unique?]"""


# Phase 4: File-by-File Analysis
PHASE_4_INTRO = """## Context (from Phase 3)
{phase3_summary}

## Your Task
Analyze the following files grouped by category. For each file, provide an EXHAUSTIVE, line-by-line analysis:
- **Purpose:** What this file does, why it exists, its role in the system
- **Every Function/Class/Method:** Full signature, parameters, return type, detailed behavior, side effects
- **Every Route/Endpoint:** Path, HTTP method, what it does step by step, request/response format
- **Logic Flow:** Trace the execution path — conditionals, loops, error handling
- **Imports/Exports:** What it depends on and what it provides
- **Connections:** How it interacts with other files — trace data/state flow
- **Patterns:** Design patterns, architectural patterns used

Group: {group_name}
Files:
{files_content}

## CRITICAL RULES
- Base your analysis ONLY on the actual file contents provided above.
- Do NOT invent functions, classes, or modules that are not in the code.
- If a file imports something, verify it by checking the actual import statements.
- Do NOT assume Express.js, REST APIs, databases, or other patterns unless they are in the actual code.
- **BE EXTREMELY DETAILED** — document EVERY function, class, route, and method.
- For backend routes: document each route handler step by step.
- For Python: document each class, method, pipeline node, and decorator.
- For frontend: document each component, hook, state variable, and effect.
- Include code snippets for complex logic.

## Output Format
For each file, use this format:

### {{filename}}
- **Purpose:** [Detailed explanation — what it does, why it exists, how it fits into the project]
- **Key Functions/Classes:**
  - `function_name(params): return_type` — [Detailed explanation of behavior, side effects, edge cases, error handling]
  - `class_name` — [Class purpose, attributes, methods]
    - `method_name(params): return_type` — [Method behavior explained step by step]
- **Routes/Endpoints (if applicable):**
  - `METHOD /path` — [Handler name] — [Step-by-step: what it receives, validates, processes, returns]
- **Logic Flow:** [Trace the main execution path. What happens first, second, third. Key conditionals and branches.]
- **Imports:** [list key imports with brief explanation of why each is needed]
- **Exports:** [what this file provides to the rest of the project]
- **Connections:** [Detailed explanation of how it connects to other files, what data it passes/receives]

---

Repeat for EACH file. End with a comprehensive summary of the group's role and how the files work together."""


# Phase 5: Data Flow Mapping
PHASE_5_INTRO = """## Context (from Phase 4)
{phase4_summary}

## Your Task
Map the COMPLETE data flow through this project in exhaustive detail. Trace how data moves from input to output, including every transformation.

## CRITICAL RULES
- Base your analysis ONLY on the file analysis results from Phase 4 above.
- Do NOT invent API endpoints, database connections, or backend flows unless they are explicitly in the code.
- If this is a frontend library (like React), focus on component rendering flow, not REST API flows.
- Do NOT assume Express.js, controllers, services, or database layers unless they exist in the actual code.
- **BE DETAILED** — trace each flow step by step with specific file and function references.

## Output Format
Write a comprehensive data flow document:

# Data Flow Analysis

## Primary Execution Flow
[Step-by-step trace from application entry point through to output. Reference specific files and functions.]
1. [Entry point — which file/function starts everything?]
2. [Initialization — what happens during setup?]
3. [Main processing — how is data transformed?]
4. [Output — how is the result delivered?]

## Secondary Flows
[Additional flows: event handlers, API calls, state updates, etc. — each traced step by step]

## API Request Flow (if applicable)
[For each major API route, trace the complete request lifecycle: client → route → handler → service → database → response]

## Component / Module Relationships
[Detailed map of how components or modules relate to each other — based on actual imports]
[Include dependency chains and interaction patterns]

## State Management
[Detailed explanation of how state/data flows through the application]
[Include state initialization, updates, propagation, and cleanup]

## Data Transformations
[Where and how is data transformed? Include specific function references and transformation logic.]

## File Dependencies
[Key dependency chains from actual imports — map the critical paths]

## Circular Dependencies
[Any circular import/dependency warnings with impact analysis]

## Architecture Diagram (Text-based)
[Create a text-based visual representation of the major flows using arrows and boxes]"""


# Phase 6: Generate Docs — one section at a time
# Each section gets its own LLM call with full context

PHASE_6_OVERVIEW = """You are an expert technical documentation generator.
Generate a COMPREHENSIVE project overview document based on the complete analysis below.

## CRITICAL RULES
- Base your documentation SOLELY on the analysis provided below.
- Do NOT invent technologies, frameworks, or patterns not in the analysis.
- **BE EXTREMELY DETAILED** — this is a reference document for developers who need to deeply understand the project.
- Use rich markdown: tables, code blocks, blockquotes, structured headings.
- Include a tech stack table, directory tree, and quick-start guide.
- Explain WHY architectural decisions were made, not just WHAT exists.

## Analysis Context:
{phase6_full_context}

Return ONLY the markdown content for the Project Overview document. No preamble, no explanation."""


PHASE_6_FILE_BREAKDOWN = """You are an expert technical documentation generator.
Generate an EXHAUSTIVE file-by-file breakdown document based on the complete analysis below.

## CRITICAL RULES
- Base your documentation SOLELY on the analysis provided below.
- **DO NOT SUMMARIZE** — include every function, class, route, and method.
- For backend routes: document each route with method, path, handler, step-by-step logic.
- For Python: document each class, method, pipeline node, decorator.
- For frontend: document each component, hook, state, effect.
- Use the `FILE:` marker format for each file (see format below).
- Include code snippets for complex logic.

## Output Format — use this EXACT structure:

# File-by-File Breakdown

## [Group Name]
[Brief description of this group's role]

FILE: filename.ext
PURPOSE: Detailed explanation of what this file does
FUNCTIONS:
- `func_name(params): return_type` — Detailed behavior explanation
- `class_name.method(params): return_type` — Method behavior step by step
ROUTES:
- `METHOD /path` — Handler: `handler_name` — Step-by-step logic trace
IMPORTS: Key imports and why
EXPORTS: What it provides
CONNECTIONS: How it connects to other files

FILE: next_file.ext
...

## [Next Group Name]
...

## Summary
[How all files work together as a system]

## Analysis Context:
{phase6_full_context}

Return ONLY the markdown content. No preamble, no explanation."""


PHASE_6_DATA_FLOW = """You are an expert technical documentation generator.
Generate a COMPREHENSIVE data flow document based on the complete analysis below.

## CRITICAL RULES
- Base your documentation SOLELY on the analysis provided below.
- **TRACE EVERY FLOW STEP BY STEP** with file and function references.
- For each API route, trace the full request lifecycle.
- For each user action, trace the complete event flow.
- Include text-based diagrams for visual understanding.

## Analysis Context:
{phase6_full_context}

Return ONLY the markdown content. No preamble, no explanation."""


PHASE_6_API_ENDPOINTS = """You are an expert technical documentation generator.
Generate a COMPREHENSIVE API and interfaces document based on the complete analysis below.

## CRITICAL RULES
- Base your documentation SOLELY on the analysis provided below.
- **DOCUMENT EVERY ROUTE AND ENDPOINT** with full details.
- For each endpoint: method, path, handler function, parameters, request body, response format, error cases.
- If no REST APIs exist, document all inter-module communication, function call signatures, event flows.
- Include request/response examples.

## Output Format:

# API Endpoints & Interfaces

## Backend Routes

### Route Group: [/prefix]

| Method | Path | Handler | Description |
|--------|------|---------|-------------|
| GET    | /path | `handler` | What it does |

#### `GET /path`
- **Handler:** `function_name` in `file.py`
- **Parameters:** [query params, path params]
- **Request Body:** [if applicable]
- **Response:** [format and fields]
- **Error Cases:** [status codes and when]
- **Step-by-step logic:** [what the handler does internally]

### Route Group: [/another]
...

## Frontend API Calls
[How the frontend consumes these APIs]

## Inter-Module Communication
[Function calls, events, message passing between modules]

## Analysis Context:
{phase6_full_context}

Return ONLY the markdown content. No preamble, no explanation."""


PHASE_6_DEPENDENCY_MAP = """You are an expert technical documentation generator.
Generate a COMPREHENSIVE dependency map document based on the complete analysis below.

## CRITICAL RULES
- Base your documentation SOLELY on the analysis provided below.
- List ALL dependencies with purpose and version.
- Explain WHY each dependency is needed.
- Map internal module dependencies.
- Include a visual dependency graph.

## Analysis Context:
{phase6_full_context}

Return ONLY the markdown content. No preamble, no explanation."""


PHASE_6_GLOSSARY = """You are an expert technical documentation generator.
Generate a COMPREHENSIVE glossary document based on the complete analysis below.

## CRITICAL RULES
- Base your documentation SOLELY on the analysis provided below.
- Define EVERY technical term, custom type, interface, pattern, and concept.
- Include code examples for each term.
- Group by category.
- Cross-reference related terms.

## Analysis Context:
{phase6_full_context}

Return ONLY the markdown content. No preamble, no explanation."""

# Map of doc filename → prompt template
PHASE_6_PROMPTS = {
    "01_PROJECT_OVERVIEW.md": PHASE_6_OVERVIEW,
    "02_FILE_BREAKDOWN.md": PHASE_6_FILE_BREAKDOWN,
    "03_DATA_FLOW.md": PHASE_6_DATA_FLOW,
    "04_API_ENDPOINTS.md": PHASE_6_API_ENDPOINTS,
    "05_DEPENDENCY_MAP.md": PHASE_6_DEPENDENCY_MAP,
    "06_GLOSSARY.md": PHASE_6_GLOSSARY,
}
