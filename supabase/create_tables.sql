-- ============================================
-- 博客智能体数据库表创建脚本
-- 在 Supabase Dashboard -> SQL Editor 中执行
-- ============================================

-- 1. 创建草稿表 (drafts)
CREATE TABLE IF NOT EXISTS drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id TEXT DEFAULT 'czj527',
  title TEXT,
  content TEXT DEFAULT '',
  outline JSONB DEFAULT '[]',
  current_phase TEXT DEFAULT 'capture',
  chat_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- 2. 创建已发布文章表 (posts)
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  markdown TEXT,
  excerpt TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE
);

-- 3. 创建想法记忆库表 (ideas)
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  source TEXT DEFAULT 'chat',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_in_posts UUID[] DEFAULT '{}'
);

-- 禁用 RLS（因为使用 API Key 认证）
ALTER TABLE drafts DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE ideas DISABLE ROW LEVEL SECURITY;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_drafts_owner ON drafts(owner_id);
CREATE INDEX IF NOT EXISTS idx_drafts_updated ON drafts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_created ON ideas(created_at DESC);

-- 验证表创建成功
SELECT 'Drafts table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'drafts');
SELECT 'Posts table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'posts');
SELECT 'Ideas table created' as status WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ideas');
