# 📚 部署文档导航

**项目路径**：`C:\Users\czj\Desktop\website\portfolio`

> 本目录包含所有部署和配置相关的文档。请根据你的需求选择对应的文档。

---

## 🎯 快速开始（推荐新手）

如果你是第一次部署，建议按照以下顺序阅读：

### 1️⃣ 环境变量配置
**文档**：[`ENV_CONFIG_GUIDE.md`](./ENV_CONFIG_GUIDE.md)

**用途**：
- 配置本地 `.env.local` 文件
- 获取 Supabase 凭据
- 在 GitHub Secrets 中配置环境变量

**适用场景**：
- ✅ 第一次使用该项目
- ✅ 本地构建报错 "supabaseUrl is required"
- ✅ 需要配置数据库连接

**关键步骤**：
1. 创建 `.env.local` 文件
2. 填入 Supabase URL 和 Anon Key
3. 运行 `pnpm export` 验证

---

### 2️⃣ 快速部署指南
**文档**：[`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

**用途**：
- 5 分钟快速部署到 GitHub Pages
- 包含完整的步骤说明
- 适合快速上手

**适用场景**：
- ✅ 已配置好环境变量
- ✅ 想快速部署网站
- ✅ 不需要详细了解技术细节

**关键步骤**：
1. 推送代码到 GitHub
2. 配置 GitHub Secrets
3. 启用 GitHub Pages
4. 等待自动部署

---

## 🔧 问题排查

如果你遇到了构建或部署问题，请参考以下文档：

### 本地构建问题
**文档**：[`LOCAL_BUILD_TROUBLESHOOTING.md`](./LOCAL_BUILD_TROUBLESHOOTING.md)

**适用场景**：
- ❌ `pnpm export` 失败
- ❌ "supabaseUrl is required" 错误
- ❌ 环境变量未加载
- ❌ 构建输出不完整

**常见问题**：
- 如何正确创建 `.env.local`
- 如何验证环境变量是否加载
- 如何清理缓存重新构建

---

### 静态导出问题
**文档**：[`STATIC_EXPORT_FIX.md`](./STATIC_EXPORT_FIX.md)

**适用场景**：
- ❌ Next.js 16 静态导出错误
- ❌ Supabase 客户端创建时机问题
- ❌ `useSearchParams` 需要 Suspense 包裹

**技术细节**：
- Supabase 客户端为何要移到组件内部
- 如何使用 `useMemo` 优化
- 静态导出的限制和解决方案

---

### 构建错误修复
**文档**：[`BUILD_FIX.md`](./BUILD_FIX.md)

**适用场景**：
- ❌ 任何构建相关的错误
- ❌ TypeScript 类型错误
- ❌ 依赖安装问题

**包含内容**：
- 所有已修复的错误列表
- 每个错误的解决方案
- 代码修改示例

---

## 📋 检查清单和详细指南

### 部署检查清单
**文档**：[`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)

**用途**：
- 部署前的完整检查清单
- 确保所有步骤都已完成
- 避免遗漏关键配置

**检查项包括**：
- ✅ 环境变量配置
- ✅ 代码推送
- ✅ GitHub Secrets 设置
- ✅ GitHub Pages 启用
- ✅ 域名配置（可选）

---

### GitHub Pages 详细部署
**文档**：[`GITHUB_PAGES_DEPLOY.md`](./GITHUB_PAGES_DEPLOY.md)

**用途**：
- GitHub Pages 部署的详细说明
- 包含所有技术细节
- 适合需要深入理解的用户

**包含内容**：
- GitHub Actions 工作流解析
- 自动部署原理
- 域名配置指南
- 故障排查

---

### 本地文件更新指南
**文档**：[`LOCAL_FILE_UPDATE_GUIDE.md`](./LOCAL_FILE_UPDATE_GUIDE.md)

**用途**：
- 本地文件修改后的同步方法
- Git 操作指南
- 避免覆盖远程更改

**适用场景**：
- ✅ 在沙箱中修改了代码
- ✅ 需要将更改同步到本地
- ✅ 需要更新特定文件

---

## 📊 报告和测试

### 导出测试报告
**文档**：[`EXPORT_TEST_REPORT.md`](./EXPORT_TEST_REPORT.md)

**用途**：
- 静态导出测试结果
- 验证构建输出
- 确认所有页面都正确生成

**包含内容**：
- 测试执行记录
- 生成的文件列表
- 性能指标

---

### 部署指南（旧版）
**文档**：[`DEPLOY.md`](./DEPLOY.md)

**用途**：
- 初版部署指南
- 可能包含一些过时的信息

**建议**：
- 请优先使用 [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

---

## 🔑 重要提醒

### 优先阅读顺序
1. **`ENV_CONFIG_GUIDE.md`** - 必读！配置环境变量
2. **`DEPLOYMENT_GUIDE.md`** - 快速部署
3. 其他文档 - 根据需要查阅

### 遇到问题时
1. 先看 [`LOCAL_BUILD_TROUBLESHOOTING.md`](./LOCAL_BUILD_TROUBLESHOOTING.md)
2. 如果是静态导出问题，看 [`STATIC_EXPORT_FIX.md`](./STATIC_EXPORT_FIX.md)
3. 如果是 GitHub Pages 问题，看 [`GITHUB_PAGES_DEPLOY.md`](./GITHUB_PAGES_DEPLOY.md)

### 需要更新本地代码时
- 参考 [`LOCAL_FILE_UPDATE_GUIDE.md`](./LOCAL_FILE_UPDATE_GUIDE.md)

---

## 📞 获取帮助

如果你按照文档操作后仍然遇到问题：

1. **检查错误信息**
   - 记录完整的错误信息
   - 查看对应的排查文档

2. **验证配置**
   - 使用 [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) 逐项检查
   - 确认环境变量配置正确

3. **查看日志**
   - GitHub Actions 日志（GitHub Pages 部署）
   - 本地构建日志（`pnpm export`）

---

## 📁 文档列表概览

| 文档名 | 用途 | 难度 | 优先级 |
|--------|------|------|--------|
| [`ENV_CONFIG_GUIDE.md`](./ENV_CONFIG_GUIDE.md) | 环境变量配置 | ⭐ | 🔥 必读 |
| [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) | 快速部署 | ⭐ | 🔥 必读 |
| [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md) | 部署检查清单 | ⭐ | 🔥 必读 |
| [`LOCAL_BUILD_TROUBLESHOOTING.md`](./LOCAL_BUILD_TROUBLESHOOTING.md) | 本地构建排查 | ⭐⭐ | 推荐 |
| [`STATIC_EXPORT_FIX.md`](./STATIC_EXPORT_FIX.md) | 静态导出修复 | ⭐⭐⭐ | 进阶 |
| [`GITHUB_PAGES_DEPLOY.md`](./GITHUB_PAGES_DEPLOY.md) | GitHub Pages 详细指南 | ⭐⭐ | 推荐 |
| [`LOCAL_FILE_UPDATE_GUIDE.md`](./LOCAL_FILE_UPDATE_GUIDE.md) | 本地文件更新 | ⭐⭐ | 可选 |
| [`BUILD_FIX.md`](./BUILD_FIX.md) | 构建错误修复 | ⭐⭐⭐ | 进阶 |
| [`EXPORT_TEST_REPORT.md`](./EXPORT_TEST_REPORT.md) | 导出测试报告 | ⭐⭐ | 参考 |
| [`DEPLOY.md`](./DEPLOY.md) | 旧版部署指南 | ⭐ | 仅供参考 |

**图例**：
- ⭐ 初级 - 适合新手
- ⭐⭐ 中级 - 需要一定技术基础
- ⭐⭐⭐ 高级 - 深入技术细节
- 🔥 必读 - 部署前必须阅读

---

**祝你部署顺利！🚀**
