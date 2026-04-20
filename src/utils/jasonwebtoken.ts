

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets missing");
}

export interface TokenPayload {
  id: string;
  email: string;
  role: "admin" | "superadmin";
}

const baseOptions = {
  algorithm: "HS256" as const,
  issuer: "gulf-empire",
  audience: "admin-panel",
};

export function generateAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    ...baseOptions,
    expiresIn: "15m",
  });
}

export function generateRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    ...baseOptions,
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET, baseOptions) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET, baseOptions) as TokenPayload;
}