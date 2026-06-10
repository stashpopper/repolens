import { useState, useEffect } from "react";
import { RepoInput } from "@/components/RepoInput";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { DocViewer } from "@/components/DocViewer";
import { startAnalysis, getHistory } from "@/lib/api";
import { ArrowLeft, Github, Sparkles, History, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type View = "input" | "progress" | "docs" | "history";

interface HistoryItem {
  id: string;
  repo_url: string;
  status: string;
  current_phase: number;
  progress: number;
  file_count: number;
  created_at: string;
}

function App() {
  const [view, setView] = useState<View>("input");
  const [analysisId, setAnalysisId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Support URL-based navigation: #/analysis/<id> or #/history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      // Check analysis route first (more specific)
      if (hash.startsWith("#/analysis/")) {
        const id = hash.replace("#/analysis/", "");
        setAnalysisId(id);
        setView("progress");
      } else if (hash === "#/history") {
        setView("history");
        loadHistory();
      } else {
        // Default to history view
        setView("history");
        loadHistory();
      }
    };
    // Run immediately on mount
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory(20);
      setHistory(data);
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: string; label: string }> = {
      completed: { variant: "default" as const, label: "Completed" },
      running: { variant: "secondary" as const, label: "Running" },
      failed: { variant: "destructive" as const, label: "Failed" },
      pending: { variant: "outline" as const, label: "Pending" },
    };
    const c = config[status] || config.pending;
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const navigateToAnalysis = (id: string) => {
    setAnalysisId(id);
    setView("progress");
    window.location.hash = `#/analysis/${id}`;
  };

  const navigateToHistory = () => {
    setView("history");
    setAnalysisId("");
    window.location.hash = "#/history";
  };

  const navigateToInput = () => {
    setView("input");
    setAnalysisId("");
    window.location.hash = "";
  };

  const handleStartAnalysis = async (
    repoUrl: string,
    localPath: string,
    llmProvider: string,
    githubToken: string
  ) => {
    setIsLoading(true);
    try {
      const result = await startAnalysis({
        repo_url: repoUrl || undefined,
        local_path: localPath || undefined,
        llm_provider: llmProvider,
        github_token: githubToken || undefined,
      });
      setAnalysisId(result.analysis_id);
      setView("progress");
    } catch (err) {
      console.error("Failed to start analysis:", err);
      alert("Failed to start analysis. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysisComplete = () => {
    setView("docs");
  };

  const handleBackToInput = () => {
    setView("input");
    setAnalysisId("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Github className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">RepoLens</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={navigateToHistory}>
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            {view !== "input" && (
              <Button variant="ghost" size="sm" onClick={navigateToInput}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {view === "input" && (
          <div className="flex flex-col items-center gap-8">
            <div className="text-center space-y-2 max-w-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Understand Your Codebase
              </h2>
              <p className="text-muted-foreground">
                Paste a GitHub URL or point to a local directory. Our AI agent systematically analyzes every file and generates comprehensive documentation — so you actually understand your projects.
              </p>
            </div>
            <RepoInput onSubmit={handleStartAnalysis} isLoading={isLoading} />
          </div>
        )}

        {view === "progress" && (
          <ProgressDashboard analysisId={analysisId} onComplete={handleAnalysisComplete} />
        )}

        {view === "docs" && <DocViewer analysisId={analysisId} />}

        {view === "history" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Analysis History</h2>
            {history.length === 0 ? (
              <p className="text-muted-foreground">No analyses yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigateToAnalysis(item.id)}
                  >
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <Github className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.repo_url}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {item.file_count > 0 ? `${item.file_count} files` : "N/A"}
                        </span>
                        {getStatusBadge(item.status)}
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          RepoLens — AI Codebase Reverse-Documentation Agent
        </div>
      </footer>
    </div>
  );
}

export default App;
