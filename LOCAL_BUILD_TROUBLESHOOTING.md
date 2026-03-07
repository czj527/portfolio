# 本地构建问题排查

## 问题描述

运行 `pnpm export` 时出现错误：
```
Error: supabaseUrl is required.
Error occurred prerendering page "/blog/manage".
```

## 解决方案

### 方法 1：清除构建缓存（推荐）

```powershell
# Windows PowerShell
Remove-Item -Recurse -Force .next
pnpm export
```

或使用 Git Bash/CMD：
```bash
rm -rf .next
pnpm export
```

### 方法 2：重新安装依赖

```powershell
# 删除 node_modules 和 pnpm-lock.yaml
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml

# 重新安装依赖
pnpm install

# 清除缓存
pnpm store prune

# 重新构建
pnpm export
```

### 方法 3：验证文件是否已更新

检查 `src/app/blog/manage/page.tsx` 文件开头是否包含以下代码：

```typescript
export default function BlogManagePage() {
  // 创建 Supabase 客户端（在组件内部，确保环境变量已加载）
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);
```

如果文件中还有这样的代码：
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BlogManagePage() {
```

说明文件没有更新，需要重新拉取最新代码。

### 方法 4：检查是否有多个 .env 文件

有时候多个环境变量文件会导致冲突：

```powershell
# 删除所有 .env 文件（除了 .env.example）
Get-ChildItem -Filter .env* | Where-Object { $_.Name -ne '.env.example' } | Remove-Item

# 重新创建 .env.local
Copy-Item .env.example .env.local

# 编辑 .env.local 填入正确的 Supabase 凭据
```

## 常见原因

1. **构建缓存未清除**：Next.js 的构建缓存可能保留了旧的代码
2. **依赖未更新**：node_modules 中的某些包可能需要重新安装
3. **文件未同步**：本地文件与远程仓库不同步
4. **环境变量冲突**：多个 .env 文件导致环境变量混乱

## 验证修复

执行以上步骤后，再次运行：

```powershell
pnpm export
```

应该看到以下输出：

```
✓ Compiled successfully in X.Xs
✓ Finished TypeScript in X.Xs
✓ Collecting page data
✓ Generating static pages

Route (app)
┌ ○ /
├ ○ /about
├ ○ /blog
├ ○ /blog/manage
...

○  (Static)  prerendered as static content
```

## 如果仍然失败

请提供以下信息以便进一步排查：

1. PowerShell 输出的完整错误信息
2. `src/app/blog/manage/page.tsx` 文件的前 30 行内容
3. 执行 `Get-Content .next\BUILD_ID` 的结果
4. Node.js 版本：`node --version`
5. pnpm 版本：`pnpm --version`
