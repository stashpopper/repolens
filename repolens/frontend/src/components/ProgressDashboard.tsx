import { useEffect, useState } from "react";
import { getStatus, getLogs, type AnalysisStatus, type LogEntry } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Clock, FileText, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressDashboardProps {
  analysisId: string;
  onComplete: () => void;
}

const PHASE_NAMES = [
  "Initializing",
  "Intaking Repository",
  "Detecting Tech Stack",
  "Architecture Overview",
  "File-by-File Analysis",
  "Data Flow Mapping",
  "Generating Documentation",
];

const PHASE_ICONS = [
  <Sparkles key="init" className="h-4 w-4" />,
  <FileText key="intake" className="h-4 w-4" />,
  <Clock key="detect" className="h-4 w-4" />,
  <Clock key="arch" className="h-4 w-4" />,
  <FileText key="files" className="h-4 w-4" />,
  <Clock key="flow" className="h-4 w-4" />,
  <CheckCircle2 key="docs" className="h-4 w-4" />,
];

function PhaseStep({ name, icon, index, currentPhase, status }: { name: string; icon: React.ReactNode; index: number; currentPhase: number; status: string }) {
  const isComplete = index < currentPhase || status === "completed";
  const isActive = index === currentPhase && status === "running";

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
        isComplete
          ? "bg-green-500/20 text-green-400"
          : isActive
          ? "bg-blue-500/20 text-blue-400 animate-pulse"
          : "bg-white/5 text-muted-foreground"
      }`}>
        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium transition-colors ${
          isComplete ? "text-green-400" : isActive ? "text-white" : "text-muted-foreground"
        }`}>
          {name}
        </p>
      </div>
      {isActive && (
        <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
      )}
    </div>
  );
}

export function ProgressDashboard({ analysisId, onComplete }: ProgressDashboardProps) {
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let polling = true;
    const poll = async () => {
      if (!polling) return;
      try {
        const s = await getStatus(analysisId);
        setStatus(s);

        if (s.status === "completed") {
          onComplete();
          return;
        }
        if (s.status === "failed") {
          setError(s.error || "Analysis failed");
          return;
        }

        const l = await getLogs(analysisId);
        setLogs(l);

        setTimeout(poll, 2000);
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    poll();
    return () => { polling = false; };
  }, [analysisId, onComplete]);

  const currentPhase = status?.current_phase || 0;
  const progress = status?.progress || 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in-up">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => { window.location.hash = "#/new"; }} className="text-muted-foreground hover:text-white -ml-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        New Analysis
      </Button>

      {/* Status Card */}
      <div className="glass rounded-2xl p-6 glow-primary">
        <div className="flex items-center gap-3 mb-6">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
            status?.status === "completed"
              ? "bg-green-500/20 text-green-400"
              : status?.status === "failed"
              ? "bg-red-500/20 text-red-400"
              : "bg-blue-500/20 text-blue-400"
          }`}>
            {status?.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : status?.status === "failed" ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">Analysis Status</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={
                status?.status === "completed" ? "default" 
                  : status?.status === "failed" ? "destructive" 
                  : "secondary"
              } className="text-xs">
                {status?.status?.toUpperCase() || "PENDING"}
              </Badge>
              {status && (
                <span className="text-sm text-muted-foreground">
                  Phase {currentPhase + 1}/6
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        {/* Phase steps */}
        <div className="space-y-3">
          {PHASE_NAMES.map((name, i) => (
            <PhaseStep
              key={i}
              name={name}
              icon={PHASE_ICONS[i]}
              index={i}
              currentPhase={currentPhase}
              status={status?.status || "pending"}
            />
          ))}
        </div>

        {/* Additional info */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/5">
          {status?.file_count ? (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{status.file_count} files detected</span>
            </div>
          ) : null}
          {status?.tech_stack && (
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="text-muted-foreground">Framework: </span>
              <span className="font-medium">{(status.tech_stack as any)?.framework || "Unknown"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Live Log */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Live Log</h3>
          {status?.status === "running" && (
            <span className="flex items-center gap-1 text-xs text-green-400 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <ScrollArea className="h-72">
          <div className="p-4 space-y-1">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Waiting for analysis to start...</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-3 text-sm py-1.5 px-2 rounded-md hover:bg-white/5">
                  <span className="text-muted-foreground shrink-0 min-w-[60px] font-mono text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={log.message.startsWith("ERROR") ? "text-red-400" : "text-foreground/90"}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
