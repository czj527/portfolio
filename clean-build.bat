@echo off
REM 快速清理并重新构建脚本（Windows 批处理）
REM 使用方法：在项目根目录双击运行此文件

echo ========================================
echo   清理构建缓存并重新构建
echo ========================================
echo.

REM 清理 .next 目录
if exist .next (
    echo [1/3] 删除 .next 目录...
    rmdir /s /q .next
    echo      [OK] .next 已删除
) else (
    echo [1/3] .next 目录不存在，跳过
)

REM 询问是否清理 node_modules
set /p clean_node="是否清理 node_modules? (y/N): "
if /i "%clean_node%"=="y" (
    if exist node_modules (
        echo [2/3] 删除 node_modules 目录...
        rmdir /s /q node_modules
        echo      [OK] node_modules 已删除
    )
    if exist pnpm-lock.yaml (
        echo      删除 pnpm-lock.yaml...
        del /q pnpm-lock.yaml
        echo      [OK] pnpm-lock.yaml 已删除
    )
    echo [2/3] 重新安装依赖...
    call pnpm install
) else (
    echo [2/3] 跳过 node_modules 清理
)

echo.
echo [3/3] 开始构建...
call pnpm export

echo.
echo ========================================
echo   完成！
echo ========================================
pause
