import { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'czj527-blue-blog-2026';

export function verifyAdmin(request: NextRequest): boolean {
  // 检查cookie
  const token = request.cookies.get('admin_token')?.value;
  
  if (token) {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      return decoded.startsWith('admin:');
    } catch {
      return false;
    }
  }

  // 检查header（用于API调用）
  const authHeader = request.headers.get('x-admin-token');
  if (authHeader === ADMIN_PASSWORD) {
    return true;
  }

  return false;
}
