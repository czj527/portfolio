# 🚀 GitHub Pages 部署指南

本目录包含将项目部署到 GitHub Pages 所需的所有文件和文档。

## 📁 文件说明

```
.
├── GITHUB_PAGES_DEPLOY.md      # 详细的部署文档（包含所有步骤和说明）
├── DEPLOYMENT_CHECKLIST.md     # 部署前检查清单
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署配置
├── deploy.sh                    # 快速部署脚本
└── .env.example                 # 环境变量示例文件
```

## 🎯 快速开始

### 1️⃣ 阅读文档

首先阅读 `GITHUB_PAGES_DEPLOY.md` 文档，了解完整的部署流程。

### 2️⃣ 检查清单

按照 `DEPLOYMENT_CHECKLIST.md` 逐项检查，确保所有配置正确。

### 3️⃣ 配置环境变量

1. 复制 `.env.example` 为 `.env`
2. 填入你的 Supabase 凭据
3. 在 GitHub Settings > Secrets 中添加相同的环境变量

### 4️⃣ 推送代码

```bash
# 方法 1: 使用部署脚本
chmod +x deploy.sh
./deploy.sh

# 方法 2: 手动部署
git add .
git commit -m "Initial deployment"
git push origin main
```

### 5️⃣ 验证部署

访问 `https://你的用户名.github.io/portfolio/` 查看网站。

## 📖 主要文档

### `GITHUB_PAGES_DEPLOY.md`

包含以下内容：
- 前置准备
- 项目配置
- GitHub 仓库设置
- GitHub Pages 配置
- 环境变量配置
- 自动部署配置（GitHub Actions）
- 验证部署
- 常见问题解答
- 高级配置（自定义域名、HTTPS、404 页面等）

### `DEPLOYMENT_CHECKLIST.md`

部署前的完整检查清单，确保不会遗漏任何步骤。

## 🔧 配置文件

### `.github/workflows/deploy.yml`

GitHub Actions 工作流配置文件，实现：
- 自动构建
- 自动部署
- 环境变量注入
- 构建产物上传

### `deploy.sh`

简化部署流程的 Shell 脚本，自动处理：
- 未提交更改的检测
- Git 提交
- 推送到 GitHub
- 显示部署链接

### `.env.example`

环境变量配置模板，需要填入：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ⚠️ 重要提示

### Supabase RLS 策略

部署前必须在 Supabase 中执行 RLS（行级安全）策略，否则无法读写数据。请参考 `DEPLOYMENT_CHECKLIST.md` 中的 SQL 语句。

### 环境变量

- 环境变量必须在 GitHub Secrets 中配置
- 变量名必须以 `NEXT_PUBLIC_` 开头
- 不要将 `.env` 文件提交到 Git

### 图片优化

- GitHub Pages 不支持 Next.js 图片优化
- 已在 `next.config.ts` 中设置 `unoptimized: true`
- 建议使用适当尺寸的图片以提升性能

## 🐛 故障排除

如果遇到问题，请按以下步骤排查：

1. 查看 GitHub Actions 日志
2. 检查浏览器控制台错误
3. 确认环境变量配置正确
4. 参考 `GITHUB_PAGES_DEPLOY.md` 的常见问题部分

## 📚 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Supabase 官方文档](https://supabase.com/docs)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 🎉 部署成功后

恭喜你的网站已经上线！接下来你可以：

- 定期更新内容和功能
- 监控网站性能
- 添加更多功能（如搜索、评论等）
- 考虑绑定自定义域名
- 配置 Google Analytics

---

**祝你部署顺利！如有问题，请参考详细文档。🚀**
