import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { verify, Secret } from 'jsonwebtoken';
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing.');
  }

  const [, token] = authHeader.split(' ');

  const secret = authConfig.jwt.secret;

  if (secret === undefined) {
    throw new Error('JWT secret is missing in configuration');
  }

  try {
    const decodedToken = verify(token, secret as Secret);

    const { sub } = decodedToken as ITokenPayload;

    request.user = {
      id: sub
    }

    return next();
  } catch {
    throw new AppError('Invalid JWT Token');
  }
}
