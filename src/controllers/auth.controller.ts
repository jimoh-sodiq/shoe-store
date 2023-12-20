import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import User from "../models/user.model";
import * as CustomError from "../errors";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponse(false, null, "Email already exists"));
  }

  const verificationToken = "fake token";

  const user = await User.create({ name, email, password, verificationToken });
  await user.save();
  res
    .status(StatusCodes.CREATED)
    .json(
      createResponse(
        true,
        { verificationToken: user.verificationToken },
        "Success! Please check your email to verify your account"
      )
    );
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError(`No user with email ${email} found`);
  }

  const passwordMatches = user.comparePassword(password);
  if (!passwordMatches) {
    throw new CustomError.BadRequestError("Password is incorrect");
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthorizedError("Please verify your email");
  }
}

export async function logout(req: Request, res: Response) {}
