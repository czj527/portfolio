import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  // 构建时忽略 ESLint 错误
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 构建时忽略 TypeScript 错误
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
