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
Analyze the top-level structure and entry points to understand the project architecture.

Important files to examine:
{important_files_content}

## CRITICAL RULES
- Base your analysis SOLELY on the file contents provided above.
- Do NOT invent directories, files, or architectural patterns that are not evident from the provided files.
- If this is a library (not an application), describe it as a library, not as a web application.
- Do NOT assume common patterns (MVC, REST API, etc.) unless you see evidence of them in the actual files.

## Output Format
Write a comprehensive architecture overview in markdown:

# Architecture Overview

## Project Type
[What kind of project is this? Be specific — library, framework, application, etc.]

## Entry Points
- [List main entry files and what they do, based on actual files]

## Directory Structure
[Explain the purpose of each major directory based on actual file paths]

## Key Architectural Patterns
[Describe actual patterns you see — e.g., component composition, hooks, providers]

## Data Flow (High Level)
[How does data generally flow through the app/library — based on actual code]"""


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

## CRITICAL RULES
- Base your analysis ONLY on the actual file contents provided above.
- Do NOT invent functions, classes, or modules that are not in the code.
- If a file imports something, verify it by checking the actual import statements.
- Do NOT assume Express.js, REST APIs, databases, or other patterns unless they are in the actual code.

## Output Format
For each file, use this format:

### {{filename}}
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

## CRITICAL RULES
- Base your analysis ONLY on the file analysis results from Phase 4 above.
- Do NOT invent API endpoints, database connections, or backend flows unless they are explicitly in the code.
- If this is a frontend library (like React), focus on component rendering flow, not REST API flows.
- Do NOT assume Express.js, controllers, services, or database layers unless they exist in the actual code.

## Output Format
Write a comprehensive data flow document:

# Data Flow Analysis

## Rendering / Execution Flow
1. [How does execution start?]
2. [What components/modules are involved?]
3. [How does data/state flow?]
4. [What is the output?]

## Component / Module Relationships
[How do components or modules relate to each other — based on actual imports]

## State Management
[How state flows through the application — if applicable]

## File Dependencies
[Key dependency chains from actual imports]

## Circular Dependencies
[Any circular import/dependency warnings]"""


# Phase 6: Generate Docs
PHASE_6_INTRO = """You are a technical documentation generator.
Based on the COMPLETE analysis below, produce exactly 6 markdown documentation sections.

## CRITICAL RULES
- Your documentation MUST be based SOLELY on the analysis provided below.
- Do NOT invent technologies, frameworks, databases, or patterns that are not mentioned in the analysis.
- If the analysis shows this is a UI library (like React), document it as a UI library — NOT as a web application with APIs.
- Do NOT mention Express.js, Prisma, Multer, Sharp, Zod, PostgreSQL, or any backend technologies unless they are explicitly in the analysis.
- Be honest about what the code actually does.
- KEEP EACH SECTION CONCISE — aim for 3-5 key points per section, not exhaustive documentation.
- Avoid repeating information already covered in other sections.

## Analysis Summary (use ALL of this context):
{phase6_full_context}

Return ONLY a valid JSON object with these exact keys (no markdown, no preamble, no explanation):
{{
  "01_PROJECT_OVERVIEW.md": "<concise markdown content>",
  "02_FILE_BREAKDOWN.md": "<concise markdown content>",
  "03_DATA_FLOW.md": "<concise markdown content>",
  "04_API_ENDPOINTS.md": "<concise markdown content>",
  "05_DEPENDENCY_MAP.md": "<concise markdown content>",
  "06_GLOSSARY.md": "<concise markdown content>"
}}

IMPORTANT RULES FOR JSON OUTPUT:
- Start your response with {{ and end with }}
- Each value should be a single string with \n for newlines
- Do NOT use markdown code fences (```) around the JSON
- Do NOT add any text before or after the JSON object
- Keep each section under 1500 characters to ensure valid JSON
"""
