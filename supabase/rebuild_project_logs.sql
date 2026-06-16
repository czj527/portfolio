-- 重建 project_logs（修复 UUID → TEXT）
DROP TABLE IF EXISTS project_logs;

CREATE TABLE project_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'note' CHECK (type IN ('progress', 'milestone', 'note')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_logs_project_id ON project_logs(project_id);
CREATE INDEX idx_project_logs_created_at ON project_logs(created_at DESC);

ALTER TABLE project_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON project_logs FOR SELECT USING (true);
CREATE POLICY "Allow service role all" ON project_logs FOR ALL USING (auth.role() = 'service_role');
