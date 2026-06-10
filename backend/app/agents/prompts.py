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

## Output Format
Return a JSON object:
{{
  "framework": "e.g., React, Next.js, FastAPI, Django",
  "language": "e.g., TypeScript, Python, JavaScript",
  "dependencies": {{
    "frontend": ["list of frontend libs"],
    "backend": ["list of backend libs"],
    "tools": ["build tools, linters, etc."]
  }},
  "styling": "e.g., Tailwind CSS, CSS Modules, Styled Components",
  "state_management": "e.g., Redux, Context API, Zustand, or 'None detected'",
  "build_system": "e.g., Vite, Webpack, Next.js built-in",
  "testing": "e.g., Jest, Pytest, Vitest",
  "notes": "Any additional tech observations"
}}"""


# Phase 3: Architecture Overview
PHASE_3_INTRO = """## Context (from Phase 2)
{phase2_summary}

## Your Task
Analyze the top-level structure and entry points to understand the project architecture.

Important files to examine:
{important_files_content}

## Output Format
Write a comprehensive architecture overview in markdown:

# Architecture Overview

## Project Type
[What kind of project is this?]

## Entry Points
- [List main entry files and what they do]

## Directory Structure
[Explain the purpose of each major directory]

## Key Architectural Patterns
[Singleton, MVC, MVVM, etc.]

## Data Flow (High Level)
[How does data generally flow through the app?]"""


# Phase 4: File-by-File Analysis
PHASE_4_INTRO = """## Context (from Phase 3)
{phase3_summary}

## Your Task
Analyze the following files grouped by category. For each file, explain:
- **Purpose:** What this file does in 1-2 sentences
- **Key Functions/Classes:** List each with a brief description
- **Imports/Exports:** Key dependencies and what it provides
- **Connections:** How this file interacts with other files

Group: {group_name}
Files:
{files_content}

## Output Format
For each file, use this format:

### {filename}
- **Purpose:** [1-2 sentences]
- **Key Functions:**
  - `function_name` — [what it does]
- **Imports:** [list key imports]
- **Connections:** [how it connects to other files]

---

Repeat for each file in the group. End with a summary of the group's role in the project."""


# Phase 5: Data Flow Mapping
PHASE_5_INTRO = """## Context (from Phase 4)
{phase4_summary}

## Your Task
Map the complete data flow through this project. Trace how data moves from input to output.

## Output Format
Write a comprehensive data flow document:

# Data Flow Analysis

## API / Backend Flow
1. [Request enters via...]
2. [Routes to...]
3. [Processes through...]
4. [Returns...]

## Frontend Flow
1. [User interacts with...]
2. [Triggers...]
3. [State updates via...]
4. [Renders...]

## State Management
[How state flows through the application]

## File Dependencies
[Key dependency chains]

## Circular Dependencies
[Any circular import/dependency warnings]"""


# Phase 6: Generate Docs
PHASE_6_INTRO = """## Context (from Phase 5)
{phase5_summary}

## Your Task
Compile all the analysis into 6 comprehensive markdown documentation files.

## Output Format
Generate the following 6 files. Return a JSON object with filename as key and content as value:

{{
  "01_PROJECT_OVERVIEW.md": "[Content]",
  "02_FILE_BREAKDOWN.md": "[Content]",
  "03_DATA_FLOW.md": "[Content]",
  "04_API_ENDPOINTS.md": "[Content]",
  "05_DEPENDENCY_MAP.md": "[Content]",
  "06_GLOSSARY.md": "[Content]"
}}

## File Specifications:

### 01_PROJECT_OVERVIEW.md
- What the project does
- Tech stack summary
- Architecture diagram (text-based using ASCII/unicode)
- Entry points and main files

### 02_FILE_BREAKDOWN.md
- File-by-file analysis grouped by category
- For each file: purpose, key functions, connections

### 03_DATA_FLOW.md
- How data moves through the app
- API routes and their logic
- Frontend component tree
- State management flow

### 04_API_ENDPOINTS.md
- All API routes/endpoints
- Request/response shapes
- Business logic each endpoint triggers

### 05_DEPENDENCY_MAP.md
- Import/export graph
- Which files depend on which
- Circular dependency warnings
- External dependency usage

### 06_GLOSSARY.md
- Key terms and domain concepts
- Custom types and interfaces
- Important constants and configuration
- Abbreviations and naming conventions used in the codebase"""
