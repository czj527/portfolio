# 快速清理并重新构建脚本
# 使用方法：在项目根目录运行 .\clean-build.ps1

Write-Host "🧹 开始清理构建缓存..." -ForegroundColor Cyan

# 清理 .next 目录
if (Test-Path .next) {
    Write-Host "  - 删除 .next 目录" -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
    Write-Host "  ✓ .next 目录已删除" -ForegroundColor Green
} else {
    Write-Host "  - .next 目录不存在，跳过" -ForegroundColor Gray
}

# 清理 node_modules（可选）
$cleanNodeModules = Read-Host "是否清理 node_modules? (y/N)"
if ($cleanNodeModules -eq 'y' -or $cleanNodeModules -eq 'Y') {
    if (Test-Path node_modules) {
        Write-Host "  - 删除 node_modules 目录" -ForegroundColor Yellow
        Remove-Item -Recurse -Force node_modules
        Write-Host "  ✓ node_modules 已删除" -ForegroundColor Green
    }
    
    if (Test-Path pnpm-lock.yaml) {
        Write-Host "  - 删除 pnpm-lock.yaml" -ForegroundColor Yellow
        Remove-Item pnpm-lock.yaml
        Write-Host "  ✓ pnpm-lock.yaml 已删除" -ForegroundColor Green
    }
    
    Write-Host "📦 重新安装依赖..." -ForegroundColor Cyan
    pnpm install
}

Write-Host "`n🚀 开始构建..." -ForegroundColor Cyan
pnpm export

Write-Host "`n✨ 完成！" -ForegroundColor Green
