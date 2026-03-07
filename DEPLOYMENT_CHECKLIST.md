# GitHub Pages 部署检查清单

在部署到 GitHub Pages 之前，请确认以下所有项目：

## ✅ 前置准备

- [ ] 已注册 GitHub 账号
- [ ] 已创建 Supabase 项目
- [ ] Supabase 数据库表已创建（projects、blogs、guestbook_messages）
- [ ] 已获取 Supabase URL 和 Anon Key
- [ ] Git 已安装在本地

## ✅ 项目配置

- [ ] `next.config.ts` 已配置 `output: 'export'`
- [ ] `next.config.ts` 已配置 `images: { unoptimized: true }`
- [ ] `public/.nojekyll` 文件已创建
- [ ] `package.json` 包含构建脚本
- [ ] `src/app/robots.ts` 已添加 `export const dynamic = 'force-static'` 配置（静态导出必需）
- [ ] Supabase 客户端在组件内部创建（使用 `useMemo`），而非模块顶层（静态导出必需）
  - [ ] `src/app/blog/manage/page.tsx`
  - [ ] `src/app/projects/manage/page.tsx`
  - [ ] `src/app/projects/page.tsx`
  - [ ] `src/app/blog/page.tsx`
  - [ ] `src/app/guestbook/page.tsx`

## ✅ GitHub 仓库

- [ ] 已创建 GitHub 仓库（Public）
- [ ] 本地代码已推送到 GitHub
- [ ] GitHub Pages 已启用（Settings > Pages > Source: GitHub Actions）

## ✅ 环境变量

在 GitHub Settings > Secrets and variables > Actions 中添加：

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已添加
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已添加

## ✅ Supabase 配置

在 Supabase SQL Editor 中执行以下策略：

```sql
-- 允许公开读取项目
CREATE POLICY IF NOT EXISTS "Allow public read projects"
ON projects FOR SELECT TO public USING (true);

-- 允许公开插入项目
CREATE POLICY IF NOT EXISTS "Allow public insert projects"
ON projects FOR INSERT TO public WITH CHECK (true);

-- 允许公开更新项目
CREATE POLICY IF NOT EXISTS "Allow public update projects"
ON projects FOR UPDATE TO public USING (true);

-- 允许公开删除项目
CREATE POLICY IF NOT EXISTS "Allow public delete projects"
ON projects FOR DELETE TO public USING (true);

-- 允许公开读取博客
CREATE POLICY IF NOT EXISTS "Allow public read blogs"
ON blogs FOR SELECT TO public USING (true);

-- 允许公开插入博客
CREATE POLICY IF NOT EXISTS "Allow public insert blogs"
ON blogs FOR INSERT TO public WITH CHECK (true);

-- 允许公开更新博客
CREATE POLICY IF NOT EXISTS "Allow public update blogs"
ON blogs FOR UPDATE TO public USING (true);

-- 允许公开删除博客
CREATE POLICY IF NOT EXISTS "Allow public delete blogs"
ON blogs FOR DELETE TO public USING (true);

-- 允许公开读取留言
CREATE POLICY IF NOT EXISTS "Allow public read messages"
ON guestbook_messages FOR SELECT TO public USING (true);

-- 允许公开插入留言
CREATE POLICY IF NOT EXISTS "Allow public insert messages"
ON guestbook_messages FOR INSERT TO public WITH CHECK (true);

-- 允许公开更新留言
CREATE POLICY IF NOT EXISTS "Allow public update messages"
ON guestbook_messages FOR UPDATE TO public USING (true);

-- 允许公开删除留言
CREATE POLICY IF NOT EXISTS "Allow public delete messages"
ON guestbook_messages FOR DELETE TO public USING (true);
```

## ✅ GitHub Actions

- [ ] `.github/workflows/deploy.yml` 文件已创建
- [ ] workflow 文件已推送到 GitHub

## ✅ 本地测试

- [ ] 本地构建成功：`pnpm build`
- [ ] 本地预览成功：`pnpm start` 或 `pnpm export && npx serve out`
- [ ] 所有功能在本地正常工作

## ✅ 部署测试

- [ ] 代码已推送到 GitHub
- [ ] GitHub Actions workflow 已触发
- [ ] Workflow 构建成功（绿色 ✓）
- [ ] 部署成功（绿色 ✓）
- [ ] 可以访问网站：`https://username.github.io/portfolio/`

## ✅ 功能验证

- [ ] 首页加载正常
- [ ] 导航菜单工作正常
- [ ] 项目列表从 Supabase 加载
- [ ] 项目可以添加/编辑/删除
- [ ] 博客列表从 Supabase 加载
- [ ] 博客可以添加/编辑/删除
- [ ] 留言板可以添加留言
- [ ] 留言板可以显示留言
- [ ] 留言板点赞功能正常
- [ ] 移动端适配正常
- [ ] 图片正常显示

## ✅ 性能检查

- [ ] Lighthouse 性能评分 > 80
- [ ] 没有控制台错误
- [ ] 页面加载速度合理（< 3 秒）

## ✅ SEO 检查

- [ ] 页面标题正确
- [ ] Meta 描述正确
- [ ] Open Graph 标签正确
- [ ] Favicon 显示正常

## 📝 备注

如果遇到问题，请参考 `GITHUB_PAGES_DEPLOY.md` 文档中的常见问题部分。

---

## 🚀 快速部署命令

```bash
# 方法 1: 使用部署脚本
chmod +x deploy.sh
./deploy.sh

# 方法 2: 手动部署
git add .
git commit -m "Update and deploy"
git push origin main
```

---

**祝部署顺利！🎉**
