#!/bin/bash
# 如果本地文件有问题，可以运行此脚本从工作区复制正确版本

WORKSPACE="/workspace/projects"
LOCAL="."

echo "📦 从工作区复制修复后的文件到本地..."
echo ""

# 复制文件
files=(
  "src/app/blog/manage/page.tsx"
  "src/app/projects/manage/page.tsx"
  "src/app/blog/page.tsx"
  "src/app/projects/page.tsx"
  "src/app/guestbook/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$WORKSPACE/$file" ]; then
    echo "  复制 $file"
    cp "$WORKSPACE/$file" "$LOCAL/$file"
  else
    echo "  ⚠️  $file 不存在于工作区"
  fi
done

echo ""
echo "✅ 文件复制完成！"
echo ""
echo "请运行："
echo "  rm -rf .next"
echo "  pnpm export"
