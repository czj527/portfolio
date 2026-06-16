-- 修复 project_logs 表结构
-- project_id 改为 TEXT，兼容种子数据的整数 ID 和 Supabase 的 UUID

ALTER TABLE project_logs DROP CONSTRAINT IF EXISTS project_logs_project_id_fkey;
ALTER TABLE project_logs ALTER COLUMN project_id TYPE TEXT;
