import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', '@libsql/client', '@prisma/adapter-libsql'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  outputFileTracingExcludes: {
    '*': ['**/blog-site/**'],
  },
  turbopack: {},
};

export default nextConfig;
