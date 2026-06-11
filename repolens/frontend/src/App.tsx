import { useState, useEffect } from "react";
import { RepoInput } from "@/components/RepoInput";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { DocViewer } from "@/components/DocViewer";
import { LandingPage } from "@/components/LandingPage";
import { startAnalysis, getHistory } from "@/lib/api";
import { ArrowLeft, Github, History, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type View = "landing" | "input" | "progress" | "docs" | "history";

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
  const [view, setView] = useState<View>("landing");
  const [analysisId, setAnalysisId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Support URL-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#/analysis/")) {
        const id = hash.replace("#/analysis/", "");
        setAnalysisId(id);
        setView("progress");
      } else if (hash === "#/history") {
        setView("history");
        loadHistory();
      } else if (hash === "#/app" || hash === "#/new") {
        setView("input");
      } else if (hash === "") {
        setView("landing");
      } else {
        setView("landing");
      }
    };
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
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      completed: { variant: "default", label: "Completed" },
      running: { variant: "secondary", label: "Running" },
      failed: { variant: "destructive", label: "Failed" },
      pending: { variant: "outline", label: "Pending" },
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
    window.location.hash = "#/new";
  };

  const navigateToApp = () => {
    setView("input");
    window.location.hash = "#/app";
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



  // Show landing page
  if (view === "landing") {
    return <LandingPage onGetStarted={navigateToApp} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-card/30 backdrop-blur-xl supports-[backdrop-filter]:bg-card/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { window.location.hash = ""; }}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Github className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              RepoLens
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={navigateToHistory} className="text-muted-foreground hover:text-white">
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            {view !== "input" && (
              <Button variant="ghost" size="sm" onClick={navigateToInput} className="text-muted-foreground hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        {view === "input" && (
          <div className="flex flex-col items-center gap-8 animate-fade-in-up">
            <div className="text-center space-y-3 max-w-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Understand Your Codebase
              </h2>
              <p className="text-muted-foreground">
                Paste a GitHub URL or point to a local directory. Our AI agent systematically analyzes every file and generates comprehensive documentation.
              </p>
            </div>
            <RepoInput onSubmit={handleStartAnalysis} isLoading={isLoading} />
          </div>
        )}

        {view === "progress" && (
          <div className="animate-fade-in-up">
            <ProgressDashboard analysisId={analysisId} onComplete={handleAnalysisComplete} />
          </div>
        )}

        {view === "docs" && (
          <div className="animate-fade-in-up">
            <DocViewer analysisId={analysisId} />
          </div>
        )}

        {view === "history" && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Analysis History</h2>
              <Button variant="outline" size="sm" onClick={navigateToInput}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                New Analysis
              </Button>
            </div>
            {history.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <Github className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No analyses yet.</p>
                <Button onClick={navigateToInput} className="bg-gradient-to-r from-blue-500 to-violet-500">
                  Start Your First Analysis
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer glass hover:glow-primary transition-all duration-300 hover:scale-[1.01] rounded-xl"
                    onClick={() => navigateToAnalysis(item.id)}
                  >
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Github className="h-5 w-5 text-primary" />
                        </div>
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
      <footer className="border-t border-white/5 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          RepoLens — AI Codebase Reverse-Documentation Agent
        </div>
      </footer>
    </div>
  );
}

export default App;
