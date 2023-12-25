import type { Response } from "express";
import type { TTokenUser } from "../types/user.type";
import { createJWT } from "./token.util";

export function createResponse(
  success: boolean,
  data: unknown = null,
  message: string = ""
) {
  return {
    success,
    data,
    message,
  };
}

export function attachCookiesToResponse(options: {
  res: Response;
  user: TTokenUser;
  refreshToken: string;
}) {
  const { res, user, refreshToken } = options;
  const accessTokenJWT = createJWT({ payload: user });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 24 * 60 * 60

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: process.env.NODE_ENV == "production",
    secure: process.env.NODE_ENV == "production",
    signed: true,
    maxAge: 1000
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: process.env.NODE_ENV == "production",
    secure: process.env.NODE_ENV == "production",
    expires: new Date(Date.now() + oneDay),
    signed: true,
    maxAge: 1000
  });
}
