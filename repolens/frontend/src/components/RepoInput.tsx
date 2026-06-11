import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Github, FolderOpen, Loader2, Sparkles, ArrowRight } from "lucide-react";

interface RepoInputProps {
  onSubmit: (repoUrl: string, localPath: string, llmProvider: string, githubToken: string) => void;
  isLoading: boolean;
}

export function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [llmProvider] = useState("mistral");
  const [githubToken, setGithubToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isGitHub = repoUrl.trim() !== "";
    const isLocal = localPath.trim() !== "";

    if (!isGitHub && !isLocal) {
      setError("Please enter a GitHub URL or a local directory path.");
      return;
    }

    onSubmit(
      isGitHub ? repoUrl.trim() : "",
      isLocal ? localPath.trim() : "",
      llmProvider,
      githubToken.trim()
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass rounded-2xl overflow-hidden glow-primary">
      {/* Header */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <Github className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Analyze a Codebase</h2>
            <p className="text-sm text-muted-foreground">
              The AI agent will systematically analyze your project and generate comprehensive documentation.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="github" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="github" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
                <Github className="h-4 w-4" />
                GitHub URL
              </TabsTrigger>
              <TabsTrigger value="local" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg">
                <FolderOpen className="h-4 w-4" />
                Local Directory
              </TabsTrigger>
            </TabsList>

            <TabsContent value="github" className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">GitHub Repository URL</label>
                <Input
                  placeholder="https://github.com/owner/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="h-12 bg-background/50 border-white/10 focus:border-primary/50 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">GitHub Token <span className="text-muted-foreground font-normal">(optional, for private repos)</span></label>
                <Input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="h-12 bg-background/50 border-white/10 focus:border-primary/50 rounded-xl"
                />
              </div>
            </TabsContent>

            <TabsContent value="local" className="space-y-4 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Local Directory Path</label>
                <Input
                  placeholder="/path/to/your/project"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  className="h-12 bg-background/50 border-white/10 focus:border-primary/50 rounded-xl"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* LLM Provider */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">AI Engine</label>
            <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-white/10 bg-background/50">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm">Mistral AI — labs-leanstral-2603</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/30 hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Starting Analysis...
              </>
            ) : (
              <>
                Start Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
