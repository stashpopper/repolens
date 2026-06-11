-- Create analysis_logs table
CREATE TABLE analysis_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
    phase INTEGER NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster log retrieval
CREATE INDEX idx_logs_analysis_id ON analysis_logs(analysis_id);
CREATE INDEX idx_logs_timestamp ON analysis_logs(timestamp);

-- Enable RLS
ALTER TABLE analysis_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to read/write (future auth: restrict to authenticated users)
CREATE POLICY "Service role full access on analysis_logs"
    ON analysis_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access on analyses"
    ON analyses
    FOR ALL
    USING (true)
    WITH CHECK (true);
