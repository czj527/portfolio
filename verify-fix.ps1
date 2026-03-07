# 检查 Supabase 客户端创建方式（Windows PowerShell）

Write-Host "检查文件中的 Supabase 客户端创建方式..." -ForegroundColor Cyan
Write-Host ""

$files = @(
    "src\app\blog\manage\page.tsx",
    "src\app\projects\manage\page.tsx",
    "src\app\blog\page.tsx",
    "src\app\projects\page.tsx",
    "src\app\guestbook\page.tsx"
)

foreach ($file in $files) {
    Write-Host "📄 $file" -ForegroundColor White
    
    if (-not (Test-Path $file)) {
        Write-Host "  ⚠️  文件不存在" -ForegroundColor Yellow
        Write-Host ""
        continue
    }
    
    $content = Get-Content $file -Raw
    
    if ($content -match "const supabase = useMemo") {
        Write-Host "  ✅ 已使用 useMemo 创建 Supabase 客户端" -ForegroundColor Green
    }
    elseif ($content -match "(?m)^const supabase = createClient") {
        Write-Host "  ❌ 错误：仍在模块顶层创建 Supabase 客户端" -ForegroundColor Red
        Write-Host "  需要更新此文件！" -ForegroundColor Red
        Write-Host ""
        
        # 查找错误位置
        $lines = Get-Content $file
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "^const supabase = createClient") {
                Write-Host "  位置：第 $($i + 1) 行" -ForegroundColor Yellow
                Write-Host "  $($lines[$i])" -ForegroundColor Yellow
                Write-Host "  $($lines[$i + 1])" -ForegroundColor Yellow
                break
            }
        }
    }
    else {
        Write-Host "  ⚠️  未找到 Supabase 客户端创建代码" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "检查完成！" -ForegroundColor Green
Write-Host ""
Write-Host "如果有文件显示 '❌ 错误'，请运行：" -ForegroundColor Yellow
Write-Host "  git pull origin main" -ForegroundColor Cyan
Write-Host "  pnpm install" -ForegroundColor Cyan
Write-Host "  pnpm export" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
