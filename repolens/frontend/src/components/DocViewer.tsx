import { useState, useEffect } from "react";
import { getDocs, downloadDocs } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Download,
  FileText,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  GitBranch,
  Code2,
  Network,
  BookMarked,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocViewerProps {
  analysisId: string;
}

const DOC_CONFIG: Record<string, { title: string; icon: any }> = {
  "01_PROJECT_OVERVIEW.md": { title: "Project Overview", icon: BookOpen },
  "02_FILE_BREAKDOWN.md": { title: "File Breakdown", icon: FileText },
  "03_DATA_FLOW.md": { title: "Data Flow", icon: GitBranch },
  "04_API_ENDPOINTS.md": { title: "API Endpoints", icon: Code2 },
  "05_DEPENDENCY_MAP.md": { title: "Dependency Map", icon: Network },
  "06_GLOSSARY.md": { title: "Glossary", icon: BookMarked },
};

export function DocViewer({ analysisId }: DocViewerProps) {
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const data = await getDocs(analysisId);
      setDocs(data);
      const firstKey = Object.keys(data)[0];
      setSelectedDoc(firstKey || null);
      setError(null);
    } catch (err) {
      setError("Failed to load documentation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [analysisId]);

  const docList = Object.keys(docs);
  const currentDoc = selectedDoc ? DOC_CONFIG[selectedDoc] : null;
  const CurrentIcon = currentDoc?.icon || FileText;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex gap-4">
          <div className="w-72 shrink-0 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="rounded-xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (docList.length === 0) {
    return (
      <Alert variant="destructive" className="rounded-xl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>The AI failed to generate documentation. The analysis may have encountered an error.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { window.location.hash = "#/new"; }} className="text-muted-foreground hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
          <div className="h-6 w-px bg-white/10" />
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CurrentIcon className="h-5 w-5 text-primary" />
            Documentation
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadDocs(analysisId)}
          className="rounded-xl"
        >
          <Download className="mr-2 h-4 w-4" />
          Download ZIP
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-72 shrink-0 glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents</p>
          </div>
          <div className="p-2 space-y-0.5">
            {docList.map((doc) => {
              const config = DOC_CONFIG[doc];
              const Icon = config?.icon || FileText;
              return (
                <button
                  key={doc}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${
                    selectedDoc === doc
                      ? "bg-primary/10 text-primary font-medium shadow-sm"
                      : "hover:bg-white/5 text-muted-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${selectedDoc === doc ? "text-primary" : "text-muted-foreground/50"}`} />
                  <span>{config?.title || doc}</span>
                  {selectedDoc === doc && (
                    <ChevronRight className="h-3 w-3 ml-auto text-primary" />
                  )}
                </button>
              );
            })}
          </div>
          <Separator className="mx-2" />
          <div className="p-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl"
              onClick={() => downloadDocs(analysisId)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedDoc && currentDoc && (
                <>
                  <Badge variant="secondary" className="text-xs rounded-lg">
                    <CurrentIcon className="h-3 w-3 mr-1" />
                    {currentDoc.title}
                  </Badge>
                </>
              )}
            </div>
            {selectedDoc && <CheckCircle2 className="h-4 w-4 text-green-400" />}
          </div>
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="p-6">
              {selectedDoc ? (
                <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-muted-foreground prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-background/50 prose-pre:border prose-pre:border-white/10 prose-li:text-muted-foreground prose-a:text-primary prose-strong:text-white prose-table:border-white/10">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {docs[selectedDoc] || "No content available."}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Select a document from the sidebar.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
