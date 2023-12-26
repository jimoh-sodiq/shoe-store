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
  const accessTokenJWT = createJWT({user});
  const refreshTokenJWT = createJWT({ user, refreshToken });

  const oneMonth= 1000 * 24 * 60 * 60 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: process.env.NODE_ENV == "production",
    secure: process.env.NODE_ENV == "production",
    signed: true,
    maxAge: 1000 * 24 * 60 * 60, // one day
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: process.env.NODE_ENV == "production",
    secure: process.env.NODE_ENV == "production",
    expires: new Date(Date.now() + oneMonth),
    signed: true,
  });
}
