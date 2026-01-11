import jwt, { SignOptions, Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not defined');
}

export interface JwtPayload {
  userId: string;
  email?: string;
  role?: string;
  githubId?: string;
username?: string;
}

export const generateToken = (
  payload: JwtPayload,
  expiresIn: SignOptions['expiresIn'] = '7d'
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
