import { createClient } from '@libsql/client'
import 'dotenv/config'

const url = process.env.TURSO_DATABASE_URL!
const authToken = process.env.TURSO_AUTH_TOKEN!

if (!url || !authToken) {
  console.error('❌ TURSO_DATABASE_URL 和 TURSO_AUTH_TOKEN 未设置')
  process.exit(1)
}

const db = createClient({ url, authToken })

const DDL = `
CREATE TABLE IF NOT EXISTS SiteConfig (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Category (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Tag (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Post (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT NOT NULL UNIQUE,
  coverImage TEXT,
  published BOOLEAN NOT NULL DEFAULT 0,
  pinned BOOLEAN NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now')),
  categoryId INTEGER,
  FOREIGN KEY (categoryId) REFERENCES Category(id)
);

CREATE TABLE IF NOT EXISTS TagOnPost (
  postId INTEGER NOT NULL,
  tagId INTEGER NOT NULL,
  PRIMARY KEY (postId, tagId),
  FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Comment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  postId INTEGER NOT NULL,
  FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Like (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  postId INTEGER NOT NULL,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE,
  UNIQUE(ip, postId)
);

CREATE TABLE IF NOT EXISTS Project (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  techStack TEXT NOT NULL DEFAULT '',
  imageUrl TEXT,
  githubUrl TEXT,
  demoUrl TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS FriendLink (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  logo TEXT,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS GuestbookMessage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  content TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '😀',
  likes INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
`

const SEED = `
INSERT OR IGNORE INTO SiteConfig (key, value) VALUES ('admin_password', 'admin123');
INSERT OR IGNORE INTO SiteConfig (key, value) VALUES ('about_me', '热爱编程与技术分享的全栈开发者');

INSERT OR IGNORE INTO Category (name, slug) VALUES ('技术文章', 'tech');
INSERT OR IGNORE INTO Category (name, slug) VALUES ('生活', 'life');
INSERT OR IGNORE INTO Category (name, slug) VALUES ('思考', 'thought');

INSERT OR IGNORE INTO Tag (name, slug) VALUES ('React', 'react');
INSERT OR IGNORE INTO Tag (name, slug) VALUES ('Next.js', 'nextjs');
INSERT OR IGNORE INTO Tag (name, slug) VALUES ('TypeScript', 'typescript');
INSERT OR IGNORE INTO Tag (name, slug) VALUES ('Vue', 'vue');
INSERT OR IGNORE INTO Tag (name, slug) VALUES ('Web', 'web');
INSERT OR IGNORE INTO Tag (name, slug) VALUES ('Python', 'python');
INSERT OR IGNORE INTO Tag (name, slug) VALUES ('AI', 'ai');

INSERT OR IGNORE INTO Post (title, slug, excerpt, content, published, pinned, categoryId) VALUES (
  'Hello World！欢迎来到我的博客',
  'hello-world',
  '这是博客的第一篇文章，欢迎来到我的个人空间！',
  '# Hello World！

欢迎来到我的个人博客！这是我的第一篇文章。

## 关于这个博客

这个博客使用 **Next.js 16** + **React 19** 构建，支持文章管理、点赞评论、留言板、深色模式等完整功能。

## 技术栈

- **前端**: Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Framer Motion
- **数据库**: Turso (云端 SQLite) + Prisma
- **部署**: Vercel

## 未来计划

我会在这里分享技术心得、项目经验以及生活感悟。

> 用文字记录思考，用代码构建世界。',
  1, 1, 1
);

INSERT OR IGNORE INTO TagOnPost (postId, tagId) VALUES (1, 1);
INSERT OR IGNORE INTO TagOnPost (postId, tagId) VALUES (1, 2);
INSERT OR IGNORE INTO TagOnPost (postId, tagId) VALUES (1, 3);

INSERT OR IGNORE INTO Project (title, description, techStack, githubUrl, "order") VALUES ('四季清单 - TaskFlow', '基于 AI 的个人任务管理应用，支持日程管理、项目管理、番茄钟，集成 Coze Agent。', 'Next.js 16, React 19, TypeScript, shadcn/ui, Coze Agent, Supabase', 'https://github.com/czj527/taskflow', 1);
INSERT OR IGNORE INTO Project (title, description, techStack, githubUrl, "order") VALUES ('个人博客网站', '基于 Next.js 16 构建的现代简约风格个人博客，支持文章管理、项目展示、点赞评论、留言板、深色模式、RSS 订阅。', 'Next.js 16, React 19, TypeScript, shadcn/ui, Framer Motion, Prisma, Turso', 'https://github.com/czj527/portfolio', 2);
INSERT OR IGNORE INTO Project (title, description, techStack, githubUrl, "order") VALUES ('四季清单智能助手', 'TaskFlow 的 Python Agent 后端，提供日程管理、项目管理和番茄钟工具的智能代理能力。', 'Python, Coze Agent, Supabase, FastAPI', 'https://github.com/czj527/taskflow-agent', 3);
INSERT OR IGNORE INTO Project (title, description, techStack, githubUrl, "order") VALUES ('疆韵易购 - 团购电商平台', '面向新疆特色产品的团购电商平台（武汉工程大学课程设计），包含用户端、商家端和管理后台。', 'Vue.js, Vuex, Element UI', 'https://github.com/czj527/jyyg', 4);
INSERT OR IGNORE INTO Project (title, description, techStack, githubUrl, "order") VALUES ('问卷自动填写脚本', '基于 TypeScript + Puppeteer 的自动化工具，支持批量自动填写问卷、多种题型适配。', 'TypeScript, Puppeteer, Node.js', 'https://github.com/czj527/jiaoben', 5);

INSERT OR IGNORE INTO FriendLink (name, url, "order") VALUES ('GitHub', 'https://github.com/czj527', 1);

INSERT OR IGNORE INTO GuestbookMessage (name, content, emoji) VALUES ('长岛冰茶', '自己的博客，第一条留言自己来！欢迎大家来玩~ 🎉', '🚀');
`

const stmts = DDL.split(';').filter(s => s.trim())

async function main() {
  console.log('🚀 正在初始化 Turso 数据库...')

  for (const stmt of stmts) {
    try { await db.execute(stmt.trim() + ';') } catch (e: any) { if (!e.message?.includes('already exists')) console.warn('  ⚠', e.message?.split('\n')[0]) }
  }
  console.log('✅ 表结构创建完成')

  const seedStmts = SEED.split(';').filter(s => s.trim())
  for (const stmt of seedStmts) {
    try { await db.execute(stmt.trim() + ';') } catch (e: any) { if (!e.message?.includes('UNIQUE constraint')) console.warn('  ⚠', e.message?.split('\n')[0]) }
  }
  console.log('✅ 种子数据填充完成')

  const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
  console.log('📊 已创建表:', tables.rows.map((r: any) => r[0]).join(', '))

  const count = await db.execute('SELECT COUNT(*) as cnt FROM Post')
  console.log(`📝 文章数: ${count.rows[0]?.cnt || 0}`)

  console.log('🎉 Turso 数据库初始化完成！')
}

main().catch(e => { console.error('❌ 失败:', e); process.exit(1) })
