import type { MiddlewareHandler } from 'hono';
import { verifyToken } from '../utils/jwt.utils.ts';

interface CustomJwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const authenticate: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return c.json({ message: 'Authentication required' }, 401);
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return c.json({ message: 'Invalid token' }, 401);
  }

  // Attach user ID to context
  const { userId } = decodedToken as CustomJwtPayload;
  c.set('userId', userId);

  await next();
};

export default authenticate;