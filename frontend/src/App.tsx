import { useState } from "react";
import { RepoInput } from "@/components/RepoInput";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { DocViewer } from "@/components/DocViewer";
import { startAnalysis } from "@/lib/api";
import { ArrowLeft, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type View = "input" | "progress" | "docs";

function App() {
  const [view, setView] = useState<View>("input");
  const [analysisId, setAnalysisId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartAnalysis = async (
    repoUrl: string,
    localPath: string,
    llmProvider: string,
    apiKey: string,
    githubToken: string
  ) => {
    setIsLoading(true);
    try {
      const result = await startAnalysis({
        repo_url: repoUrl || undefined,
        local_path: localPath || undefined,
        llm_provider: llmProvider,
        openai_api_key: llmProvider === "openai" ? apiKey : undefined,
        anthropic_api_key: llmProvider === "anthropic" ? apiKey : undefined,
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
          {view !== "input" && (
            <Button variant="ghost" size="sm" onClick={handleBackToInput}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          )}
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
