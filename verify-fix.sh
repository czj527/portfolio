#!/bin/bash
# 检查 Supabase 客户端创建方式

echo "检查文件中的 Supabase 客户端创建方式..."
echo ""

files=(
  "src/app/blog/manage/page.tsx"
  "src/app/projects/manage/page.tsx"
  "src/app/blog/page.tsx"
  "src/app/projects/page.tsx"
  "src/app/guestbook/page.tsx"
)

for file in "${files[@]}"; do
  echo "📄 $file"
  if grep -q "const supabase = useMemo" "$file"; then
    echo "  ✅ 已使用 useMemo 创建 Supabase 客户端"
  elif grep -q "^const supabase = createClient" "$file"; then
    echo "  ❌ 错误：仍在模块顶层创建 Supabase 客户端"
    echo "  需要更新此文件！"
    echo "  位置："
    grep -n "^const supabase = createClient" "$file" | head -3
  else
    echo "  ⚠️  未找到 Supabase 客户端创建代码"
  fi
  echo ""
done
