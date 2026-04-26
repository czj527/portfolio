# 环境变量配置完整指南

## 📋 为什么需要环境变量？

本项目使用 Supabase 数据库来存储项目、博客和留言数据。环境变量用于告诉应用如何连接到你的 Supabase 数据库。

---

## 🚀 配置步骤

### 第一步：获取 Supabase 凭据

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 登录你的账号
3. 选择你的项目（或创建一个新项目）
4. 点击左侧菜单的 **Settings**（齿轮图标）
5. 点击 **API** 标签
6. 找到以下信息：

   **Project URL**（类似这样）：
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon public**（类似这样）：
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 第二步：创建本地环境变量文件

在项目根目录（`C:\Users\czj\Desktop\website\portfolio`）创建 `.env.local` 文件：

**方法 1：复制示例文件（推荐）**
```powershell
# 在 PowerShell 中执行
Copy-Item .env.example .env.local
```

**方法 2：手动创建**
1. 打开记事本或任何文本编辑器
2. 粘贴以下内容
3. 保存为 `.env.local`（注意文件名前的点）

### 第三步：编辑 .env.local 文件

用记事本打开 `.env.local` 文件，将以下两行修改为你的实际值：

```env
# Supabase 项目 URL
# 复制你从 Supabase Dashboard 获取的 URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Supabase Anon Key
# 复制你从 Supabase Dashboard 获取的 anon public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**完整示例**：
```env
NEXT_PUBLIC_SUPABASE_URL=https://abgtyxwjlqhzqvhqlls.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiZ3R5eHdqbHFoenF2aHFs bHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk2NzgzMTUsImV4cCI6MjAxNTI1NDMxNX0.qW-6B6z7jR7-6ZtZy-6ZtZy-6ZtZy-6ZtZy
NODE_ENV=development
```

### 第四步：验证配置

保存文件后，在 PowerShell 中运行：

```powershell
# 清理缓存
Remove-Item -Recurse -Force .next

# 重新构建
pnpm export
```

如果看到成功输出，说明配置正确！

---

## 🌐 GitHub Pages 部署时的环境变量

当你部署到 GitHub Pages 时，还需要在 GitHub 上配置相同的环境变量：

### 在 GitHub 中添加 Secrets

1. 打开你的 GitHub 仓库
2. 点击 **Settings** 标签
3. 左侧菜单点击 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 添加第一个 secret：
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Secret**: 粘贴你的 Supabase URL
   - 点击 **Add secret**
6. 点击 **New repository secret**，添加第二个：
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Secret**: 粘贴你的 Supabase Anon Key
   - 点击 **Add secret**

**重要**：变量名必须完全一致，包括 `NEXT_PUBLIC_` 前缀！

---

## ⚠️ 常见错误

### 错误 1：文件名错误

❌ 错误的文件名：
- `env.local`（缺少开头的点）
- `.env`（会被提交到 Git）
- `.env.txt`（文件扩展名错误）

✅ 正确的文件名：
- `.env.local`（正确）

### 错误 2：值中包含空格

❌ 错误：
```env
NEXT_PUBLIC_SUPABASE_URL= https://xxx.supabase.co
```

✅ 正确（不要有空格）：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
```

### 错误 3：变量名错误

❌ 错误（缺少 `NEXT_PUBLIC_`）：
```env
SUPABASE_URL=https://xxx.supabase.co
```

✅ 正确：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
```

### 错误 4：复制了引号

❌ 错误（包含了 JSON 格式的引号）：
```env
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
```

✅ 正确（直接粘贴值，不要加引号）：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
```

---

## 🔍 如何验证配置是否正确？

### 方法 1：运行构建

```powershell
pnpm export
```

如果构建成功且没有 "supabaseUrl is required" 错误，说明配置正确。

### 方法 2：检查环境变量是否加载

在代码中临时添加调试（仅用于测试）：

```typescript
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

---

## 📝 .env.local 文件示例

完整的 `.env.local` 文件应该长这样：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 开发环境配置
NODE_ENV=development
```

**注意**：
- 每行一个变量
- 等号前后不要有空格
- 不要加引号
- 变量名必须大写

---

## 🚫 不要做什么

❌ **不要**将 `.env.local` 文件提交到 Git
- 该文件已在 `.gitignore` 中
- 它包含敏感信息
- 只在你的本地机器上使用

❌ **不要**分享你的 Supabase 凭据
- Anon Key 是公开的，但 URL 包含你的项目信息
- 不要在公开仓库中提交真实凭据

❌ **不要**在客户端代码中使用 Service Role Key
- Service Role Key 有完全访问权限
- 只在服务端使用

---

## ✅ 完成检查清单

- [ ] 已创建 `.env.local` 文件
- [ ] 已填入正确的 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 已填入正确的 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 文件保存成功（无扩展名）
- [ ] 运行 `pnpm export` 无报错
- [ ]（可选）已在 GitHub Secrets 中配置相同的环境变量

---

## 🆘 遇到问题？

### 问题：运行 `pnpm export` 仍然报错

**解决方案**：
1. 确认文件名是 `.env.local`（有开头的点）
2. 确认在项目根目录（`C:\Users\czj\Desktop\website\portfolio`）
3. 删除 `.next` 文件夹后重试
4. 检查变量名是否包含 `NEXT_PUBLIC_` 前缀

### 问题：找不到 Supabase 凭据

**解决方案**：
1. 登录 Supabase Dashboard
2. 选择你的项目
3. Settings → API
4. 复制 "Project URL" 和 "anon public"

### 问题：Git 提示未跟踪 .env.local

**解决方案**：
这是正常的！`.env.local` 应该在 `.gitignore` 中，不会被提交。

如果提示你提交，运行：
```powershell
echo ".env.local" | Out-File -Append -Encoding utf8 .gitignore
```

---

## 📚 相关文档

- [Supabase 环境变量文档](https://supabase.com/docs/guides/functions/managing-secrets)
- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)

---

**配置完成后，你的应用就可以连接到 Supabase 数据库了！🎉**
