#!/usr/bin/env node

/**
 * 清理 Next.js 静态导出产物的脚本
 * 删除不需要的 .txt 文件，只保留 .html 文件
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');

/**
 * 递归删除目录中的所有 .txt 文件
 */
function cleanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      cleanDirectory(filePath);
    } else if (file.endsWith('.txt') && file !== 'README.md' && file !== 'robots.txt') {
      // 删除 .txt 文件（保留 README.md 和 robots.txt）
      fs.unlinkSync(filePath);
      console.log(`已删除: ${filePath}`);
    }
  });
}

console.log('开始清理导出产物...');
console.log(`目录: ${outDir}`);

if (fs.existsSync(outDir)) {
  cleanDirectory(outDir);
  console.log('清理完成！');
} else {
  console.log('out 目录不存在，无需清理');
}
