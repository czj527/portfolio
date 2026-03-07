#!/bin/bash

# GitHub Pages 部署脚本
# 使用方法: bash deploy.sh

set -e

echo "🚀 开始部署到 GitHub Pages..."

# 检查是否在 Git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ 错误: 当前目录不是一个 Git 仓库"
  exit 1
fi

# 检查是否有未提交的更改
if ! git diff-index --quiet HEAD --; then
  echo "⚠️  检测到未提交的更改"
  read -p "是否要提交更改? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 正在添加文件..."
    git add .

    read -p "请输入提交信息: " commit_msg
    if [ -z "$commit_msg" ]; then
      commit_msg="Update and deploy to GitHub Pages"
    fi

    echo "📤 正在提交..."
    git commit -m "$commit_msg"
  else
    echo "❌ 取消部署"
    exit 1
  fi
fi

# 推送到 GitHub
echo "📤 正在推送到 GitHub..."
git push origin main

echo "✅ 推送成功!"
echo ""
echo "🌐 部署流程已触发，请访问以下链接查看进度:"
echo "   https://github.com/$(git config --get remote.origin.url | sed -e 's|https://github.com/||' -e 's|\.git$||')/actions"
echo ""
echo "⏳ 预计 2-5 分钟后部署完成"
echo "🎉 部署完成后，你的网站将可通过以下地址访问:"
echo "   https://$(git config --get remote.origin.url | sed -e 's|https://github.com/||' -e 's|\.git$||').github.io/portfolio/"
