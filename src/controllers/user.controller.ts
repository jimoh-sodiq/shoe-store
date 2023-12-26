import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createResponse } from "../utils/response.util";
import { RequestWithUser } from "../types/request.type";
import User from "../models/user.model";
import * as CustomError from "../errors";
import { confirmOwnership } from "../utils/user.util";

export async function showCurrentUser(req: Request, res: Response) {
  res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        { user: (req as RequestWithUser).user },
        "user retrieved successfully"
      )
    );
}

export async function getAllUsers(req: Request, res: Response) {
  const users = await User.find({ role: "user" }).select(
    "-password -verificationToken -passwordToken -passwordTokenExpirationDate"
  );
  if (!users) {
    throw new CustomError.NotFoundError("No users found");
  }
  res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        { users, count: users.length },
        "users retrieved successfully"
      )
    );
}

export async function getSingleUser(req: Request, res: Response) {
  const { id } = req.params;
  const user = await User.findOne({ _id: id }).select(
    "-password -verificationToken -passwordToken -passwordTokenExpirationDate"
  );
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id ${id} found`);
  }
  confirmOwnership((req as RequestWithUser).user, user._id);
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, { user }, "user retrieved successfully"));
}
