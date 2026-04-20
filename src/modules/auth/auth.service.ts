// src/modules/auth/auth.service.ts

import Token from "./token.model";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { hashToken } from "@/utils/hash";

export async function login(admin: any) {
  const payload = {
    id: admin._id.toString(),
    email: admin.email,
    role: admin.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const hashedRefresh = await hashToken(refreshToken);

  await Token.create({
    userId: admin._id,
    token: hashedRefresh,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}