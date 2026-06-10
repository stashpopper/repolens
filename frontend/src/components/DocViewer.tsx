import { useState } from "react";
import { getDocs, downloadDocs } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocViewerProps {
  analysisId: string;
}

const DOC_TITLES: Record<string, string> = {
  "01_PROJECT_OVERVIEW.md": "Project Overview",
  "02_FILE_BREAKDOWN.md": "File Breakdown",
  "03_DATA_FLOW.md": "Data Flow",
  "04_API_ENDPOINTS.md": "API Endpoints",
  "05_DEPENDENCY_MAP.md": "Dependency Map",
  "06_GLOSSARY.md": "Glossary",
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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="w-64 shrink-0 space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (docList.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No documentation generated yet.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <Card className="w-72 shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {docList.map((doc) => (
              <button
                key={doc}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                  selectedDoc === doc
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <ChevronRight className={`h-3 w-3 transition-transform ${selectedDoc === doc ? "rotate-90" : ""}`} />
                {DOC_TITLES[doc] || doc}
              </button>
            ))}
          </div>
          <Separator className="my-4" />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => downloadDocs(analysisId)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download ZIP
          </Button>
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="flex-1">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {selectedDoc && (
              <Badge variant="secondary" className="text-xs">
                {selectedDoc}
              </Badge>
            )}
            {DOC_TITLES[selectedDoc || ""] || "Documentation"}
          </CardTitle>
          {selectedDoc && <CheckCircle2 className="h-4 w-4 text-green-500" />}
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            {selectedDoc ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {docs[selectedDoc] || "No content available."}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Select a document from the sidebar.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
