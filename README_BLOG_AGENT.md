# 博客智能体 AI Write

AI 驱动的博客写作助手，帮助你从模糊想法到完整文章。

## 功能特性

### 访客功能
- 输入模糊想法，AI 帮你拆解核心论点
- 生成完整文章大纲
- 分段生成内容，实时预览
- Markdown 格式导出

### 管理员功能
- 自动保存草稿到数据库
- 随时继续编辑
- 一键发布到博客
- 草稿管理

## 技术栈

- **前端**: Next.js 16 + Tailwind CSS + React 19
- **AI**: 硅基流动 SiliconFlow + DeepSeek V4 Flash
- **数据库**: Supabase (PostgreSQL)
- **实时预览**: 流式输出 (打字机效果)

## 数据库设置

### 创建表

在 Supabase Dashboard -> SQL Editor 中执行以下 SQL：

```sql
-- 1. 创建草稿表
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

-- 2. 创建已发布文章表
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

-- 3. 创建想法记忆库
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  source TEXT DEFAULT 'chat',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_in_posts UUID[] DEFAULT '{}'
);

-- 禁用 RLS
ALTER TABLE drafts DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE ideas DISABLE ROW LEVEL SECURITY;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_drafts_owner ON drafts(owner_id);
CREATE INDEX IF NOT EXISTS idx_drafts_updated ON drafts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_created ON ideas(created_at DESC);
```

## 环境变量

```env
# 硅基流动 API
SILICONFLOW_API_KEY=your_api_key
NEXT_PUBLIC_SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1

# 管理员密码
ADMIN_PASSWORD=your_admin_password

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 开发

```bash
pnpm install
pnpm dev
```

访问 http://localhost:3000/ai-write

## 页面路由

- `/ai-write` - AI 写作界面
- `/blog` - 博客列表
- `/blog/[slug]` - 文章详情

## 工作流程

1. **想法捕捉** - 输入模糊想法，AI 分析并拆解成核心论点
2. **生成大纲** - 根据论点自动生成文章大纲
3. **分段写作** - 逐章节生成内容
4. **润色** - AI 优化文字
5. **发布** - 一键发布到博客

## 管理员登录

点击右上角「管理员登录」，使用环境变量中的 `ADMIN_PASSWORD` 登录。
