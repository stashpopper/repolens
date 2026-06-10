#!/usr/bin/env bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "========================================="
echo "  RepoLens — Starting Backend & Frontend"
echo "========================================="

# ── Backend ──────────────────────────────────────────────────
echo ""
echo "[1/3] Starting backend on http://localhost:8000 ..."
cd "$PROJECT_DIR/backend"

# Activate venv if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start uvicorn (background)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "      Backend PID: $BACKEND_PID"

# ── Frontend ─────────────────────────────────────────────────
echo ""
echo "[2/3] Starting frontend on http://localhost:5173 ..."
cd "$PROJECT_DIR/frontend"

# Install deps if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "      Installing frontend dependencies..."
    npm install
fi

# Start Vite dev server (background, host 0.0.0.0 for browser access)
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
echo "      Frontend PID: $FRONTEND_PID"

# ── Wait for servers ─────────────────────────────────────────
echo ""
echo "[3/3] Waiting for servers to be ready..."
for i in $(seq 1 30); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health | grep -q "200"; then
        echo "      ✅ Backend is ready!"
        break
    fi
    if [ "$i" -eq 30 ]; then
        echo "      ❌ Backend failed to start. Check logs above."
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

for i in $(seq 1 30); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200"; then
        echo "      ✅ Frontend is ready!"
        break
    fi
    if [ "$i" -eq 30 ]; then
        echo "      ❌ Frontend failed to start. Check logs above."
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

echo ""
echo "========================================="
echo "  ✅ Repolens is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "========================================="

# ── Open in browser ──────────────────────────────────────────
echo ""
echo "Opening browser..."
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:5173"
elif command -v open &> /dev/null; then
    open "http://localhost:5173"
elif command -v google-chrome &> /dev/null; then
    google-chrome "http://localhost:5173"
else
    echo "      Could not auto-open browser. Visit http://localhost:5173 manually."
fi

# ── Keep running & cleanup on Ctrl+C ─────────────────────────
echo ""
echo "Press Ctrl+C to stop all servers..."
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait
