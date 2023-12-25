import { HydratedDocument } from "mongoose";
import { TUser, TTokenUser } from "../types/user.type";


export function createTokenUser(user: HydratedDocument<TUser>) : TTokenUser {
  return { name: user.name, userId: user._id, role: user.role };
}
