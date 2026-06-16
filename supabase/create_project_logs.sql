-- =====================================================
-- 项目开发日志表 (project_logs)
-- 用于记录每个项目的开发进度、里程碑、日常笔记
-- =====================================================

-- 创建表
CREATE TABLE IF NOT EXISTS project_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'note' CHECK (type IN ('progress', 'milestone', 'note')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_project_logs_project_id ON project_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_project_logs_created_at ON project_logs(created_at DESC);

-- RLS
ALTER TABLE project_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON project_logs FOR SELECT USING (true);
CREATE POLICY "Allow service role all" ON project_logs FOR ALL USING (auth.role() = 'service_role');
