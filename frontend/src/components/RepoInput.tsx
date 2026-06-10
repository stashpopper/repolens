import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Github, FolderOpen, Loader2 } from "lucide-react";

interface RepoInputProps {
  onSubmit: (repoUrl: string, localPath: string, llmProvider: string, apiKey: string, githubToken: string) => void;
  isLoading: boolean;
}

export function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [llmProvider, setLlmProvider] = useState("openai");
  const [apiKey, setApiKey] = useState("");
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

    if (llmProvider === "openai" && !apiKey.trim()) {
      setError("Please enter your OpenAI API key.");
      return;
    }

    if (llmProvider === "anthropic" && !apiKey.trim()) {
      setError("Please enter your Anthropic API key.");
      return;
    }

    onSubmit(
      isGitHub ? repoUrl.trim() : "",
      isLocal ? localPath.trim() : "",
      llmProvider,
      apiKey.trim(),
      githubToken.trim()
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Github className="h-6 w-6 text-primary" />
          Analyze a Codebase
        </CardTitle>
        <CardDescription>
          Paste a GitHub URL or point to a local directory. The AI agent will systematically analyze your project and generate comprehensive documentation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="github" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub URL
              </TabsTrigger>
              <TabsTrigger value="local" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Local Directory
              </TabsTrigger>
            </TabsList>

            <TabsContent value="github" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub Repository URL</label>
                <Input
                  placeholder="https://github.com/owner/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub Token (optional, for private repos)</label>
                <Input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="local" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Local Directory Path</label>
                <Input
                  placeholder="/path/to/your/project"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">LLM Provider</label>
              <select
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="openai">OpenAI (GPT-4o)</option>
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="ollama">Ollama (local)</option>
              </select>
            </div>

            {llmProvider !== "ollama" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <Input
                  type="password"
                  placeholder={llmProvider === "openai" ? "sk-..." : "sk-ant-..."}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your key is used only for this session and not stored.
                </p>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Analysis...
              </>
            ) : (
              "Start Analysis"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
