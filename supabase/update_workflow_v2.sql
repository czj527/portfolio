-- =====================================================
-- 工作流画布 v2 — 统一节点模型
-- 所有元素都是独立节点，支持 Agent / Skill / Document / Custom
-- =====================================================

-- 追加修改：skills 和 documents 的 agent_id 改为可空（支持独立节点）
ALTER TABLE workflow_skills ALTER COLUMN agent_id DROP NOT NULL;
ALTER TABLE workflow_documents ALTER COLUMN agent_id DROP NOT NULL;

-- 新增：自定义元素表
CREATE TABLE IF NOT EXISTS workflow_custom (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES workflow_agents(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  custom_type TEXT NOT NULL DEFAULT 'custom',
  description TEXT DEFAULT '',
  position_x REAL DEFAULT 0,
  position_y REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE workflow_custom ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON workflow_custom FOR SELECT USING (true);
CREATE POLICY "Allow service role all" ON workflow_custom FOR ALL USING (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_wf_custom_agent ON workflow_custom(agent_id);
