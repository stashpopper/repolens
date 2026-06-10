# Repolens

An AI-powered codebase explainer that systematically analyzes GitHub repos and generates comprehensive multi-file documentation — so you actually understand your vibe-coded projects.

## Features

- **GitHub URL or Local Directory** input
- **Step-by-step analysis** via LangGraph agent pipeline
- **Multi-file documentation** output (Architecture, Components, Routing, Data Flow, etc.)
- **Configurable LLM** — use OpenAI, Anthropic, or any LangChain-compatible provider
- **Beautiful React UI** with shadcn/ui

## Tech Stack

- **Frontend:** React + Vite + shadcn/ui + Tailwind CSS
- **Backend:** Python + FastAPI
- **Agent Framework:** LangGraph
- **Database:** Supabase (PostgreSQL)
- **LLM:** Configurable (OpenAI / Anthropic / etc.)

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
