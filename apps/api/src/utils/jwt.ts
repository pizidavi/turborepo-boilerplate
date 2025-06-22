import {
  type AccessToken,
  accessTokenSchema,
  type JWT,
  JWT_TYPE,
  jwtSchema,
  refreshTokenSchema,
} from '@repo/types';

import { decode as decodeJwt, sign as signJwt, verify as verifyJwt } from 'hono/jwt';
import type { SignatureKey } from 'hono/utils/jwt/jws';
import { JwtTokenExpired } from 'hono/utils/jwt/types';
import { v4 as uuid } from 'uuid';
import type { AuthUser } from '../types/entities';

const alg = 'HS256';

export const generateRefreshToken = async (
  secret: SignatureKey,
  userId: number,
  expiresIn: number | null,
) => {
  const id = uuid();
  const token = await sign(secret, JWT_TYPE.REFRESH, id, expiresIn, userId.toString());

  return { id, token, expiresIn };
};

export const generateAccessTokens = async (
  secret: SignatureKey,
  refreshTokenId: string,
  user: AuthUser,
  expiresIn: number,
) => {
  const id = uuid();
  const token = await sign(secret, JWT_TYPE.ACCESS, id, expiresIn, user.id.toString(), {
    refreshTokenId,
    role: user.role,
    permissions: Array.from(user.permissions),
  } satisfies AccessToken['data']);

  return { id, token, expiresIn };
};

export const verifyRefreshToken = async (secret: SignatureKey, token: string) => {
  const jwt = await verify(secret, token);
  return await refreshTokenSchema.parseAsync(jwt);
};

export const verifyAccessToken = async (
  secret: SignatureKey,
  token: string,
  ignoreExpired = false,
) => {
  const jwt = await verify(secret, token, { ignoreExpired });
  return await accessTokenSchema.parseAsync(jwt);
};

const sign = async (
  secret: SignatureKey,
  type: JWT_TYPE,
  id: string,
  expiresIn: number | null,
  subject: string,
  data?: Record<string, unknown>,
): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);

  const payload: JWT = {
    typ: type,
    jti: id,
    iss: 'hono',
    iat: now,
    nbf: now,
  };
  if (expiresIn !== null) payload.exp = now + expiresIn;
  if (subject) payload.sub = subject;
  if (data) payload.data = data;

  return signJwt(payload, secret, alg);
};

const verify = async (
  secret: SignatureKey,
  token: string,
  options?: {
    ignoreExpired?: boolean;
  },
): Promise<JWT> => {
  try {
    const payload = await verifyJwt(token, secret, alg);
    return jwtSchema.parse(payload);
  } catch (error) {
    if (error instanceof JwtTokenExpired && options?.ignoreExpired) {
      return await decode(token);
    }
    throw error;
  }
};

const decode = async (token: string): Promise<JWT> => {
  const payload = decodeJwt(token).payload;
  return jwtSchema.parse(payload);
};
