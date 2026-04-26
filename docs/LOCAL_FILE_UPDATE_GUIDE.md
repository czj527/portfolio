# 本地文件更新指南

## 问题诊断

你的本地文件可能没有同步最新的修复代码。即使我们修改了服务器上的文件，你的本地环境可能仍然使用旧版本。

## 解决方案（按顺序尝试）

### 方案 1：拉取最新代码（最可能成功）

```powershell
# 1. 检查远程仓库状态
git status

# 2. 查看未提交的更改
git diff

# 3. 如果有本地更改，先暂存或提交
git stash

# 4. 拉取最新代码
git pull origin main

# 5. 如果有暂存的更改，恢复它们
git stash pop

# 6. 清理缓存
Remove-Item -Recurse -Force .next

# 7. 重新构建
pnpm export
```

### 方案 2：强制重置到最新版本（如果方案1失败）

```powershell
# 警告：这会丢弃所有本地更改！

# 1. 清理缓存
Remove-Item -Recurse -Force .next

# 2. 重置到远程最新版本
git fetch origin
git reset --hard origin/main

# 3. 重新构建
pnpm export
```

### 方案 3：手动检查文件

运行检查脚本查看哪些文件需要更新：

```powershell
.\verify-fix.ps1
```

如果某个文件显示"❌ 错误"，说明该文件需要更新。

### 方案 4：直接复制正确文件（如果上述都失败）

手动检查你的 `src/app/blog/manage/page.tsx` 文件前50行：

**正确版本应该是这样**：
```typescript
export default function BlogManagePage() {
  // 创建 Supabase 客户端（在组件内部，确保环境变量已加载）
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);
```

**错误版本是这样**：
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function BlogManagePage() {
```

如果你看到"错误版本"，说明你的文件没有更新。

## 验证步骤

修复后，运行以下命令验证：

```powershell
# 1. 清理所有缓存
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item pnpm-lock.yaml

# 2. 重新安装依赖
pnpm install

# 3. 重新构建
pnpm export
```

**应该看到成功输出**：
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages

Route (app)
┌ ○ /
├ ○ /blog
├ ○ /blog/manage
...
```

## 如果仍然失败

请提供以下信息：

1. `git status` 的输出
2. `git log --oneline -5` 的输出
3. 运行 `.\verify-fix.ps1` 的结果
4. `src/app/blog/manage/page.tsx` 文件前 50 行的内容

## 快速参考

**最快速的修复命令**（假设你可以丢弃本地更改）：

```powershell
git fetch origin
git reset --hard origin/main
Remove-Item -Recurse -Force .next
pnpm install
pnpm export
```

**如果需要保留本地更改**：

```powershell
git stash
git pull origin main
git stash pop
Remove-Item -Recurse -Force .next
pnpm install
pnpm export
```
