import type { NextConfig } from 'next';
import path from 'path';

// GitHub Pages 配置
// 如果你的仓库名不是 'portfolio'，请修改下面的 REPO_NAME
// 部署后访问路径将是: https://yourusername.github.io/portfolio/
const REPO_NAME = 'portfolio';

const nextConfig: NextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),
  // GitHub Pages 静态导出配置
  output: 'export',
  basePath: REPO_NAME === 'portfolio' ? '' : `/${REPO_NAME}`,
  trailingSlash: true, // 添加尾部斜杠以避免 404 错误

  // 开发环境配置
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    unoptimized: true, // 静态导出需要禁用图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
