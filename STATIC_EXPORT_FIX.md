# 静态导出环境变量问题修复

## 问题描述

在运行 `pnpm export` 时遇到以下错误：

```
Error: supabaseUrl is required.
Error occurred prerendering page "/blog/manage".
```

## 原因分析

在多个页面文件（`blog/manage/page.tsx`、`projects/manage/page.tsx`、`projects/page.tsx`、`blog/page.tsx`、`guestbook/page.tsx`）中，Supabase 客户端在模块顶层创建：

```typescript
// ❌ 错误做法
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

在静态导出时，Next.js 会预渲染所有页面。此时环境变量可能还未加载，导致 `supabaseUrl` 为空字符串，从而报错。

## 解决方案

将 Supabase 客户端的创建移到组件内部，使用 `useMemo` 确保只在客户端加载时才创建：

```typescript
// ✅ 正确做法
'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function ComponentName() {
  // 创建 Supabase 客户端（在组件内部，确保环境变量已加载）
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  // ... 组件其他代码
}
```

## 已修复的文件

1. ✅ `src/app/blog/manage/page.tsx`
2. ✅ `src/app/projects/manage/page.tsx`
3. ✅ `src/app/projects/page.tsx`
4. ✅ `src/app/blog/page.tsx`
5. ✅ `src/app/guestbook/page.tsx`

## 验证修复

现在可以重新运行构建命令：

```bash
pnpm export
```

构建应该能够成功完成，在 `out/` 目录生成静态文件。

## 最佳实践

在 Next.js 静态导出模式下使用环境变量：

1. **客户端组件**：使用 `useMemo` 或 `useEffect` 创建依赖环境变量的对象
2. **服务端组件**：环境变量自动可用
3. **静态导出**：避免在模块顶层直接使用环境变量创建对象

## 参考资料

- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
