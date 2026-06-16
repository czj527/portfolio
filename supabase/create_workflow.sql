-- =====================================================
-- 工作流编排表
-- 用于画布页面的 Agent/Skill/Document 管理
-- =====================================================

-- Agent 节点
CREATE TABLE IF NOT EXISTS workflow_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL DEFAULT '',
  config JSONB DEFAULT '{}',
  position_x REAL DEFAULT 0,
  position_y REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill 节点（关联 Agent）
CREATE TABLE IF NOT EXISTS workflow_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES workflow_agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document 节点（关联 Agent）
CREATE TABLE IF NOT EXISTS workflow_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES workflow_agents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_wf_skills_agent ON workflow_skills(agent_id);
CREATE INDEX IF NOT EXISTS idx_wf_docs_agent ON workflow_documents(agent_id);

-- RLS
ALTER TABLE workflow_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON workflow_agents FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON workflow_skills FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON workflow_documents FOR SELECT USING (true);

CREATE POLICY "Allow service role all" ON workflow_agents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role all" ON workflow_skills FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role all" ON workflow_documents FOR ALL USING (auth.role() = 'service_role');
