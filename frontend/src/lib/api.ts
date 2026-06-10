const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface AnalyzeRequest {
  repo_url?: string;
  local_path?: string;
  llm_provider?: string;
  openai_api_key?: string;
  anthropic_api_key?: string;
  github_token?: string;
}

export interface AnalysisStatus {
  id: string;
  status: string;
  current_phase: number;
  progress: number;
  file_count: number;
  tech_stack?: Record<string, unknown>;
  created_at: string;
  error?: string;
}

export interface LogEntry {
  id: string;
  phase: number;
  message: string;
  timestamp: string;
}

export interface HistoryItem {
  id: string;
  repo_url: string;
  status: string;
  current_phase: number;
  progress: number;
  file_count: number;
  created_at: string;
}

export async function startAnalysis(request: AnalyzeRequest): Promise<{ analysis_id: string }> {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Failed to start analysis: ${response.statusText}`);
  return response.json();
}

export async function getStatus(analysisId: string): Promise<AnalysisStatus> {
  const response = await fetch(`${API_BASE}/api/status/${analysisId}`);
  if (!response.ok) throw new Error(`Failed to get status: ${response.statusText}`);
  return response.json();
}

export async function getLogs(analysisId: string): Promise<LogEntry[]> {
  const response = await fetch(`${API_BASE}/api/logs/${analysisId}`);
  if (!response.ok) throw new Error(`Failed to get logs: ${response.statusText}`);
  return response.json();
}

export async function getDocs(analysisId: string): Promise<Record<string, string>> {
  const response = await fetch(`${API_BASE}/api/docs/${analysisId}`);
  if (!response.ok) {
    if (response.status === 202) return {};
    throw new Error(`Failed to get docs: ${response.statusText}`);
  }
  return response.json();
}

export async function getHistory(limit = 20, offset = 0): Promise<HistoryItem[]> {
  const response = await fetch(`${API_BASE}/api/history?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error(`Failed to get history: ${response.statusText}`);
  return response.json();
}

export async function deleteAnalysis(analysisId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/cleanup/${analysisId}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete analysis: ${response.statusText}`);
}

export function downloadDocs(analysisId: string): void {
  window.open(`${API_BASE}/api/download/${analysisId}`, "_blank");
}
