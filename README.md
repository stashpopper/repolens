# Repolens

An AI-powered codebase explainer that systematically analyzes GitHub repos and generates comprehensive multi-file documentation — so you actually understand your vibe-coded projects.

## Features

- **GitHub URL or Local Directory** input
- **Step-by-step analysis** via LangGraph agent pipeline (6 phases)
- **Multi-file documentation** output (Overview, File Breakdown, Data Flow, API Endpoints, Dependency Map, Glossary)
- **Mistral AI** — powered by `labs-leanstral-2603` model
- **Real-time progress** tracking via Supabase
- **Beautiful React UI** with shadcn/ui

## Tech Stack

- **Frontend:** React + Vite + shadcn/ui + Tailwind CSS
- **Backend:** Python + FastAPI
- **Agent Framework:** LangGraph (StateGraph with 6 phased nodes)
- **Database:** Supabase (PostgreSQL) — `analyses` + `analysis_logs` tables
- **LLM:** Mistral AI (`labs-leanstral-2603`) — configurable at runtime

## Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

## License

MIT
