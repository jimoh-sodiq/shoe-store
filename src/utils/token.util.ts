import { Response } from "express";
import jwt from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import type { TUser, TTokenUser } from "../types/user.type";
import globalConfig from "../core/config";

export function createTokenUser(user: HydratedDocument<TUser>): TTokenUser {
  return { name: user.name, userId: user._id, role: user.role };
}

export function createJWT({ payload }: any) {
  const token = jwt.sign(
    payload,
    globalConfig.auth.jwtSecret as string
  );
  return token;
}

// export function isTokenValid({ token }) {
//   return jwt.verify(token, process.env.JWT_SECRET);
// }
