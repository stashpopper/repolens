import { useEffect, useState } from "react";
import { getStatus, getLogs, type AnalysisStatus, type LogEntry } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Clock, FileText } from "lucide-react";

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

export function ProgressDashboard({ analysisId, onComplete }: ProgressDashboardProps) {
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const poll = async () => {
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
    return () => {};
  }, [analysisId, onComplete]);

  const currentPhase = status?.current_phase || 0;
  const progress = status?.progress || 0;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status?.status === "completed" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : status?.status === "failed" ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
            Analysis Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />

          <div className="flex items-center gap-2">
            <Badge variant={status?.status === "completed" ? "default" : status?.status === "failed" ? "destructive" : "secondary"}>
              {status?.status?.toUpperCase() || "PENDING"}
            </Badge>
            {status && (
              <span className="text-sm text-muted-foreground">
                Phase {currentPhase}/6 — {PHASE_NAMES[currentPhase] || PHASE_NAMES[0]}
              </span>
            )}
          </div>

          {status?.file_count ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              {status.file_count} files detected
            </div>
          ) : null}

          {status?.tech_stack && (
            <div className="text-sm">
              <span className="text-muted-foreground">Framework: </span>
              <span className="font-medium">{(status.tech_stack as any)?.framework || "Unknown"}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-4 w-4" />
            Live Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 rounded-md border p-4">
            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Waiting for analysis to start...</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <span className="text-muted-foreground shrink-0 min-w-[60px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={log.message.startsWith("ERROR") ? "text-destructive" : "text-foreground"}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
