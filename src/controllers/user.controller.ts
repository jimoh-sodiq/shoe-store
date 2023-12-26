import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  attachCookiesToResponse,
  createResponse,
} from "../utils/response.util";
import { RequestWithUser } from "../types/request.type";
import User from "../models/user.model";
import * as CustomError from "../errors";
import { confirmOwnership } from "../utils/user.util";
import { createTokenUser } from "../utils/token.util";
import Token from "../models/token.model";

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

export async function updateUser(req: Request, res: Response) {
  const { email, name } = req.body;

  if (!email && !name) {
    throw new CustomError.BadRequestError("Please provide email or name");
  }

  const user = await User.findOne({
    _id: (req as RequestWithUser).user.userId,
  });
  if (!user) {
    throw new CustomError.NotFoundError(
      "User not found, please contact support if you think this is a mistake"
    );
  }
  user.email = email ?? user.email;
  user.name = name ?? user.name;
  await user.save();

  const tokenUser = createTokenUser(user);
  const existingToken = await Token.findOne({ user: user._id });
  attachCookiesToResponse({
    res,
    user: tokenUser,
    refreshToken: existingToken!.refreshToken,
  });
  res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        { user: tokenUser },
        "user details updated successfully"
      )
    );
}

export async function updateUserPassword(req: Request, res: Response) {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide old and new password"
    );
  }
  if (oldPassword === newPassword) {
    throw new CustomError.BadRequestError(
      "New password cannot be the same as old password"
    );
  }
  const user = await User.findOne({
    _id: (req as RequestWithUser).user.userId,
  });

  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError("Incorrect password");
  }
  user.password = newPassword;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, {}, "password updated successfully"));
}
