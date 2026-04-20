

export const accessCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 15 * 60 * 1000, // 15 min
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};