import { NextRequest } from 'next/server';
import { verifyAccessToken, TokenPayload } from '@/src/utils/jasonwebtoken';

export function getAuthUser(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function requireAuth(req: NextRequest): TokenPayload {
  const user = getAuthUser(req);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export function requireSuperAdmin(req: NextRequest): TokenPayload {
  const user = getAuthUser(req);
  if (!user || user.role !== 'superadmin') {
    throw new Error('FORBIDDEN');
  }
  return user;
}