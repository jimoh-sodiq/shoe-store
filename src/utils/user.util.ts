import { TTokenUser } from "../types/user.type";
import { Types } from "mongoose";
import * as CustomError from "../errors";

export function confirmOwnership(
  requestUser: TTokenUser,
  resourceUserId: Types.ObjectId
) {
  if (requestUser.role == "admin") return;
  if (requestUser.userId == resourceUserId) return;
  throw new CustomError.UnauthorizedError(
    "Sorry, you are not authorized to access this resource"
  );
}
