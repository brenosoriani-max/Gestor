import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

export interface TokenPayload {
  sub: string;
  email: string;
  role: 'FREE' | 'PRO';

  iat: number;
  exp: number;
}

const FREE_ROUTES = {
  POST: ['/users', '/login', '/reset-password'],
};

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (FREE_ROUTES[req.method as keyof typeof FREE_ROUTES]?.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Formato do token inválido' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, authConfig.jwt.secret) as TokenPayload;

    // Adiciona o usuário autenticado no req.user
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
