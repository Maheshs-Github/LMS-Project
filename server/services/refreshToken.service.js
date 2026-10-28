import crypto from "crypto";
import { RefreshToken } from "../models/refreshToken.model.js";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export const hashRefreshToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const createRefreshToken = async (userId, familyId) => {
  const token = crypto.randomBytes(48).toString("base64url");
  const sessionFamily = familyId || crypto.randomUUID();

  const record = await RefreshToken.create({
    user: userId,
    tokenHash: hashRefreshToken(token),
    familyId: sessionFamily,
    expiresAt: new Date(Date.now() + SEVEN_DAYS),
  });

  return { token, familyId: sessionFamily, record };
};

export const accessCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

export const refreshCookieOptions = () => ({
  ...accessCookieOptions(),
  path: "/api/v1/user",
  maxAge: SEVEN_DAYS,
});