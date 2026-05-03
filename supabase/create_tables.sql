-- =====================================================
-- 日程表 (schedules) - 创建脚本
-- 用于 Supabase PostgreSQL 数据库
-- =====================================================

-- 创建 schedules 表
CREATE TABLE IF NOT EXISTS schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id TEXT DEFAULT 'czj527',
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration INT DEFAULT 90,
  color TEXT DEFAULT '#3b82f6',
  type TEXT DEFAULT 'personal' CHECK (type IN ('class', 'work', 'personal', 'meeting')),
  
  -- 提醒相关字段
  remind_enabled BOOLEAN DEFAULT true,
  remind_minutes INT DEFAULT 10,
  
  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 索引
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_schedules_owner_id ON schedules(owner_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(date);
CREATE INDEX IF NOT EXISTS idx_schedules_owner_date ON schedules(owner_id, date);

-- =====================================================
-- Row Level Security (RLS) 配置
-- =====================================================

-- 启用 RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- 允许任何人读取数据（后续可以改为仅限本人）
CREATE POLICY "Allow public read" ON schedules
  FOR SELECT USING (true);

-- 允许服务端使用 service role key 进行所有操作
CREATE POLICY "Allow service role all" ON schedules
  FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- 自动更新 updated_at 触发器
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_schedules_updated_at
  BEFORE UPDATE ON schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 初始化示例数据
-- =====================================================
INSERT INTO schedules (title, description, date, start_time, duration, color, type, remind_enabled, remind_minutes)
VALUES 
  ('高等数学', '线性代数复习', CURRENT_DATE, '08:00', 90, '#3b82f6', 'class', true, 10),
  ('团队周会', '项目进度同步', CURRENT_DATE, '09:30', 60, '#10b981', 'meeting', true, 15),
  ('健身训练', '有氧 + 力量', CURRENT_DATE, '18:30', 90, '#f59e0b', 'personal', true, 30),
  ('算法刷题', 'LeetCode 每日一题', CURRENT_DATE, '20:00', 90, '#ef4444', 'work', false, 0)
ON CONFLICT DO NOTHING;
