// src/modules/auth/refresh.service.ts

import Token from "./token.model";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { compareToken, hashToken } from "@/utils/hash";

export async function refresh(oldToken: string) {
  const decoded = verifyRefreshToken(oldToken);

  const tokens = await Token.find({ userId: decoded.id });

  let validToken = null;

  for (const t of tokens) {
    const match = await compareToken(oldToken, t.token);
    if (match) {
      validToken = t;
      break;
    }
  }

  if (!validToken) throw new Error("Invalid refresh token");

  // delete old token (rotation)
  await validToken.deleteOne();

  const payload = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };

  const newAccess = generateAccessToken(payload);
  const newRefresh = generateRefreshToken(payload);

  const hashed = await hashToken(newRefresh);

  await Token.create({
    userId: decoded.id,
    token: hashed,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { newAccess, newRefresh };
}

export async function logout(userId: string) {
  await Token.deleteMany({ userId });
}