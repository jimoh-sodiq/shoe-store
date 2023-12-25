import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import crypto from "crypto";
import { createResponse } from "../utils/response.util";
import { sendEmail } from "../utils/mailer.util";
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

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({ name, email, password, verificationToken });

  // TODO: create an actual link gotten from the frontend
  await sendEmail({
    to: user.email,
    subject: "Shoe Store Email Verification",
    html: `<p>Hello ${user.name}, please verify your email address by clicking this link <a>${user.verificationToken}</a></p>`,
  });

  res
    .status(StatusCodes.CREATED)
    .json(
      createResponse(
        true,
        null,
        "Success! Please check your email to verify your account"
      )
    );
}

export async function verifyEmail(req: Request, res: Response) {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError(
      `No user with email ${email} found`
    );
  }
  if (user.verificationToken !== verificationToken) {
    throw new CustomError.BadRequestError("Invalid verification token");
  }
  user.isVerified = true;
  user.verifiedDate = new Date();
  user.verificationToken = "";
  await user.save();
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, { user }, "verified successfully"));
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

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
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, { user }, "logged in successfully"));
}

export async function logout(req: Request, res: Response) {
  console.log("logging out in the name of the things");
  res.send("Done");
}
