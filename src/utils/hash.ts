// src/utils/hash.ts

import bcrypt from "bcryptjs";

export async function hashToken(token: string) {
  return bcrypt.hash(token, 10);
}

export async function compareToken(token: string, hashed: string) {
  return bcrypt.compare(token, hashed);
}