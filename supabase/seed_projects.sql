-- =====================================================
-- 项目表重建脚本
-- 用于 Supabase PostgreSQL（规划页使用）
-- 执行前先清空旧数据
-- =====================================================

-- 1. 清空旧数据（如果有）
DELETE FROM activity_log;
DELETE FROM tasks;
DELETE FROM projects;

-- 2. 插入新项目
INSERT INTO projects (name, description, progress, status, current_phase, tech_stack, priority)
VALUES
  (
    '新叶日报',
    'AI资讯聚合平台，基于 xyai / aiweb 迭代的下一代 AI 资讯服务。每日聚合 AI 领域最新动态，支持智能筛选、分类与个性化推送。',
    15,
    'in_progress',
    '本地开发中，后续新建仓库',
    ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    1
  ),
  (
    'opencolorful',
    '个人 AI 智能体项目，融合关于私人助理 Agent 的独立思考与理念。类似 OpenHanako 架构，支持多角色、多模型编排与个性化交互。',
    10,
    'in_progress',
    '架构设计与核心模块开发',
    ARRAY['TypeScript', 'React', 'AI SDK', 'Agent Framework'],
    2
  ),
  (
    'body',
    '为 AI Agent 构建可在网页或桌面活动的虚拟身体。探索 Agent 在数字空间中的具身化交互体验。',
    5,
    'planning',
    '概念验证阶段',
    ARRAY['JavaScript', 'Web/Desktop'],
    3
  ),
  (
    '个人博客',
    '基于 Next.js 16 构建的现代简约风格个人博客，支持文章管理、项目展示、日程管理、访客问答等完整功能。',
    80,
    'active',
    '日常维护与功能优化',
    ARRAY['Next.js', 'React', 'TypeScript', 'shadcn/ui', 'Supabase'],
    4
  );

-- 3. 验证
SELECT id, name, status, priority FROM projects ORDER BY priority;
