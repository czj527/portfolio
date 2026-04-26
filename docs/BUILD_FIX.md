# 构建错误修复说明

## 修复历史

### 修复 #1: robots.ts 静态导出配置

**问题**：
```
Error: export const dynamic = "force-static"/export const revalidate not configured on route "/robots.txt" with "output: export".
```

**原因**：Next.js 16 在静态导出模式下要求所有路由必须显式配置为静态。

**解决方案**：在 `src/app/robots.ts` 中添加：

```typescript
export const dynamic = 'force-static';
```

---

### 修复 #2: 环境变量在静态导出中不可用

**问题**：
```
Error: supabaseUrl is required.
Error occurred prerendering page "/blog/manage".
```

**原因**：Supabase 客户端在模块顶层创建，静态导出时环境变量未加载。

**解决方案**：将 Supabase 客户端创建移到组件内部，使用 `useMemo`：

```typescript
// ❌ 错误做法
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ 正确做法
const supabase = useMemo(() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseAnonKey);
}, []);
```

**已修复文件**：
- `src/app/blog/manage/page.tsx`
- `src/app/projects/manage/page.tsx`
- `src/app/projects/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/guestbook/page.tsx`

---

## 验证修复

现在可以重新运行构建命令：

```bash
pnpm export
```

构建应该能够成功完成，在 `out/` 目录生成静态文件。

## 相关文档

- [静态导出环境变量问题详细说明](./STATIC_EXPORT_FIX.md)
- [GitHub Pages 部署指南](./GITHUB_PAGES_DEPLOY.md)

