import { useState, useEffect, useMemo } from "react";
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
  PanelLeftClose,
  PanelLeft,
  FileCode,
  Terminal,
  Layers,
  Globe,
  Database,
  Settings,
  Hash,
} from "lucide-react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface DocViewerProps {
  analysisId: string;
}

const DOC_CONFIG: Record<string, { title: string; icon: any; description: string }> = {
  "01_PROJECT_OVERVIEW.md": {
    title: "Project Overview",
    icon: BookOpen,
    description: "Architecture, tech stack, and project structure",
  },
  "02_FILE_BREAKDOWN.md": {
    title: "File Breakdown",
    icon: FileCode,
    description: "Every file, function, class, and route documented",
  },
  "03_DATA_FLOW.md": {
    title: "Data Flow",
    icon: GitBranch,
    description: "End-to-end data flows and execution traces",
  },
  "04_API_ENDPOINTS.md": {
    title: "API & Interfaces",
    icon: Globe,
    description: "Routes, endpoints, and inter-module communication",
  },
  "05_DEPENDENCY_MAP.md": {
    title: "Dependency Map",
    icon: Network,
    description: "Dependencies, relationships, and interaction flows",
  },
  "06_GLOSSARY.md": {
    title: "Glossary",
    icon: BookMarked,
    description: "Technical terms, patterns, and concepts explained",
  },
};

// Detect file type for icon
function getFileIcon(filepath: string) {
  const ext = filepath.split(".").pop()?.toLowerCase() || "";
  const name = filepath.toLowerCase();

  if (ext === "py") return { icon: Terminal, color: "text-yellow-400" };
  if (ext === "tsx" || ext === "ts") return { icon: Code2, color: "text-blue-400" };
  if (ext === "jsx" || ext === "js") return { icon: Code2, color: "text-yellow-300" };
  if (ext === "css" || ext === "scss") return { icon: Settings, color: "text-purple-400" };
  if (ext === "json") return { icon: Database, color: "text-green-400" };
  if (ext === "md") return { icon: BookOpen, color: "text-gray-400" };
  if (name.includes("docker")) return { icon: Layers, color: "text-blue-300" };
  if (name.includes("config")) return { icon: Settings, color: "text-orange-400" };
  return { icon: FileText, color: "text-gray-400" };
}

// Extract FILE: blocks from markdown for special rendering
function parseFileBlocks(content: string) {
  const blocks: Array<{
    filename: string;
    purpose: string;
    functions: string;
    routes: string;
    imports: string;
    exports: string;
    connections: string;
    raw: string;
  }> = [];

  const fileRegex = /FILE:\s*(.+?)\n((?:.*?\n)*?)(?=FILE:|$)/g;
  let match;

  while ((match = fileRegex.exec(content)) !== null) {
    const filename = match[1].trim();
    const body = match[2].trim();

    const purposeMatch = body.match(/PURPOSE:\s*(.*?)(?=\n\w+:|$)/s);
    const functionsMatch = body.match(/FUNCTIONS:\s*(.*?)(?=\n\w+:|$)/s);
    const routesMatch = body.match(/ROUTES:\s*(.*?)(?=\n\w+:|$)/s);
    const importsMatch = body.match(/IMPORTS:\s*(.*?)(?=\n\w+:|$)/s);
    const exportsMatch = body.match(/EXPORTS:\s*(.*?)(?=\n\w+:|$)/s);
    const connectionsMatch = body.match(/CONNECTIONS:\s*(.*?)(?=\n\w+:|$)/s);

    blocks.push({
      filename,
      purpose: purposeMatch?.[1]?.trim() || "",
      functions: functionsMatch?.[1]?.trim() || "",
      routes: routesMatch?.[1]?.trim() || "",
      imports: importsMatch?.[1]?.trim() || "",
      exports: exportsMatch?.[1]?.trim() || "",
      connections: connectionsMatch?.[1]?.trim() || "",
      raw: match[0],
    });
  }

  return blocks;
}

// Custom markdown components for rich rendering
function MarkdownComponents({ content }: { content: string }) {
  const fileBlocks = useMemo(() => parseFileBlocks(content), [content]);
  const hasFileBlocks = fileBlocks.length > 0;

  const components: Components = {
    // H1 — Section header with top border
    h1: ({ children, ...props }) => (
      <div className="mb-8 mt-2">
        <h1
          className="text-3xl font-bold text-white tracking-tight pb-4 border-b border-white/10"
          {...props}
        >
          {children}
        </h1>
      </div>
    ),

    // H2 — Subsection with icon
    h2: ({ children, ...props }) => (
      <div className="mb-5 mt-10">
        <h2
          className="text-xl font-semibold text-white/90 tracking-tight pb-2 border-b border-white/5 flex items-center gap-2"
          {...props}
        >
          <Hash className="h-4 w-4 text-primary/50 shrink-0" />
          {children}
        </h2>
      </div>
    ),

    // H3 — File-level or route-level headers
    h3: ({ children, ...props }) => {
      const childStr = String(children);
      const fileIcon = getFileIcon(childStr);
      const Icon = fileIcon.icon;

      // Check if this is a FILE: block header
      const isFileHeader = fileBlocks.some(b => b.filename === childStr);

      return (
        <div className="mb-4 mt-7">
          <h3
            className={cn(
              "text-lg font-semibold tracking-tight flex items-center gap-2",
              isFileHeader ? "text-primary" : "text-white/80"
            )}
            {...props}
          >
            {isFileHeader ? (
              <Icon className={`h-4 w-4 ${fileIcon.color} shrink-0`} />
            ) : (
              <ChevronRight className="h-4 w-4 text-primary/40 shrink-0" />
            )}
            {children}
          </h3>
        </div>
      );
    },

    // H4 — Function/method level
    h4: ({ children, ...props }) => (
      <div className="mb-3 mt-5">
        <h4
          className="text-base font-semibold text-white/70 tracking-tight flex items-center gap-2"
          {...props}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
          {children}
        </h4>
      </div>
    ),

    // Paragraphs with better spacing
    p: ({ children, ...props }) => (
      <p className="text-muted-foreground leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),

    // Inline code with language-aware coloring
    code: ({ className, children, ...props }) => {
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return null; // Let pre handle it
      }
      return (
        <code
          className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Code blocks with header
    pre: ({ children, ...props }) => (
      <div className="my-6 rounded-xl overflow-hidden border border-white/10">
        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">code</span>
        </div>
        <pre className="bg-black/40 p-4 overflow-x-auto text-sm" {...props}>
          {children}
        </pre>
      </div>
    ),

    // Blockquotes as callout boxes
    blockquote: ({ children, ...props }) => (
      <div className="border-l-4 border-primary/50 bg-primary/5 py-3 px-4 rounded-r-lg my-6">
        <blockquote className="text-white/70 italic" {...props}>
          {children}
        </blockquote>
      </div>
    ),

    // Lists with better styling
    ul: ({ children, ...props }) => (
      <ul className="my-4 pl-2 space-y-1.5" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }) => (
      <ol className="my-4 pl-6 space-y-2" {...props}>
        {children}
      </ol>
    ),

    li: ({ children, ...props }) => (
      <li className="text-muted-foreground leading-relaxed flex items-start gap-2 marker:text-primary" {...props}>
        {children}
      </li>
    ),

    // Strong text
    strong: ({ children, ...props }) => (
      <strong className="text-white font-semibold" {...props}>
        {children}
      </strong>
    ),

    // Emphasis
    em: ({ children, ...props }) => (
      <em className="text-white/80" {...props}>
        {children}
      </em>
    ),

    // Links
    a: ({ children, ...props }) => (
      <a className="text-primary hover:underline" {...props}>
        {children}
      </a>
    ),

    // Tables with beautiful styling
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }) => (
      <thead className="bg-white/5" {...props}>
        {children}
      </thead>
    ),

    th: ({ children, ...props }) => (
      <th
        className="text-left px-4 py-3 text-sm font-semibold text-white/80 border-b border-white/10"
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }) => (
      <td
        className="px-4 py-3 text-sm text-muted-foreground border-b border-white/5"
        {...props}
      >
        {children}
      </td>
    ),

    tr: ({ children, ...props }) => (
      <tr className="hover:bg-white/[0.02] transition-colors" {...props}>
        {children}
      </tr>
    ),

    // Horizontal rules
    hr: (props) => (
      <hr className="border-white/10 my-8" {...props} />
    ),
  };

  return { components, hasFileBlocks, fileBlocks };
}

// File card component for structured rendering
function FileCard({ block, index }: { block: any; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const fileIcon = getFileIcon(block.filename);
  const Icon = fileIcon.icon;

  return (
    <div
      className="rounded-xl border border-white/10 overflow-hidden mb-4 transition-all"
    >
      {/* File header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center gap-3"
      >
        <Icon className={`h-4 w-4 ${fileIcon.color} shrink-0`} />
        <span className="font-mono text-sm text-primary font-medium">{block.filename}</span>
        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
          {expanded ? "▼" : "▶"}
        </span>
      </button>

      {/* File body — expandable */}
      {expanded && (
        <div className="p-4 space-y-4 border-t border-white/5">
          {/* Purpose */}
          {block.purpose && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Purpose</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{block.purpose}</p>
            </div>
          )}

          {/* Functions */}
          {block.functions && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Functions & Methods</h4>
              <div className="bg-black/20 rounded-lg p-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {block.functions}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Routes */}
          {block.routes && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Routes & Endpoints</h4>
              <div className="bg-black/20 rounded-lg p-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {block.routes}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Imports & Exports */}
          {(block.imports || block.exports) && (
            <div className="grid grid-cols-2 gap-4">
              {block.imports && (
                <div>
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Imports</h4>
                  <p className="text-muted-foreground text-sm">{block.imports}</p>
                </div>
              )}
              {block.exports && (
                <div>
                  <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Exports</h4>
                  <p className="text-muted-foreground text-sm">{block.exports}</p>
                </div>
              )}
            </div>
          )}

          {/* Connections */}
          {block.connections && (
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Connections</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">{block.connections}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Render content — either structured FILE: blocks or standard markdown
function ContentRenderer({ content }: { content: string }) {
  const { components, hasFileBlocks, fileBlocks } = MarkdownComponents({ content });

  if (hasFileBlocks) {
    // Render the non-FILE parts as markdown, and FILE blocks as cards
    const parts = content.split(/(FILE:\s*.+?\n(?:.*?\n)*?)(?=FILE:|$)/g);

    return (
      <div>
        {parts.map((part, i) => {
          const trimmed = part.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith("FILE:")) {
            const block = fileBlocks.find(b => b.raw.trim().startsWith(trimmed.split("\n")[0]));
            if (block) {
              return <FileCard key={i} block={block} index={i} />;
            }
          }
          return (
            <div key={i} className="mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {trimmed}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
    );
  }

  // Standard markdown rendering
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

export function DocViewer({ analysisId }: DocViewerProps) {
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

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

  const fontSizeClass = { sm: "text-sm", base: "", lg: "text-lg" }[fontSize];

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
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/5 rounded-xl border border-white/10">
            {(["sm", "base", "lg"] as const).map((size) => (
              <Button
                key={size}
                variant="ghost"
                size="sm"
                className={cn(
                  "px-2.5 h-8 text-xs hover:bg-white/10",
                  size === "sm" && "rounded-l-xl rounded-r-none",
                  size === "lg" && "rounded-r-xl rounded-l-none",
                  size === "base" && "rounded-none",
                  fontSize === size && "bg-white/10 text-white"
                )}
                onClick={() => setFontSize(size)}
              >
                {size === "sm" ? "A-" : size === "lg" ? "A+" : "A"}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-xl"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
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
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-72 shrink-0 glass rounded-2xl overflow-hidden animate-fade-in">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents</p>
            </div>
            <div className="p-2 space-y-0.5">
              {docList.map((doc) => {
                const config = DOC_CONFIG[doc];
                const Icon = config?.icon || FileText;
                const isSelected = selectedDoc === doc;
                return (
                  <button
                    key={doc}
                    onClick={() => setSelectedDoc(doc)}
                    className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all flex flex-col gap-1 ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium shadow-sm"
                        : "hover:bg-white/5 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground/50"}`} />
                      <span className="truncate">{config?.title || doc}</span>
                      {isSelected && (
                        <ChevronRight className="h-3 w-3 ml-auto text-primary shrink-0" />
                      )}
                    </div>
                    <p className={`text-[11px] leading-relaxed pl-7 ${isSelected ? "text-primary/70" : "text-muted-foreground/50"}`}>
                      {config?.description}
                    </p>
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
        )}

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
                  <span className="text-xs text-muted-foreground">{currentDoc.description}</span>
                </>
              )}
            </div>
            {selectedDoc && <CheckCircle2 className="h-4 w-4 text-green-400" />}
          </div>
          <ScrollArea className="h-[calc(100vh-260px)]">
            <div className={cn("p-8 max-w-5xl", fontSizeClass)}>
              {selectedDoc ? (
                <ContentRenderer content={docs[selectedDoc] || "No content available."} />
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
