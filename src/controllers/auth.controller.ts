import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/user.model";
import Token from "../models/token.model";
import {
  createResponse,
  attachCookiesToResponse,
} from "../utils/response.util";
import { createTokenUser, createHashedString } from "../utils/token.util";
import { sendEmail } from "../utils/mailer.util";
import * as CustomError from "../errors";
import { RequestWithUser } from "../types/request.type";

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
  console.log("user created");

  // TODO: create an actual link gotten from the frontend

  const emailHtml =
    process.env.NODE_ENV == "development"
      ? `<p>Hello ${user.name}, please verify your email address by clicking this link <a href='http://localhost:3000/auth/verify-email?token=${verificationToken}&email=${user.email}' target='_blank'>HERE</a></p>`
      : `<p>Hello ${user.name}, please verify your email address by clicking this link <a href='https://jshoes.netlify.app/auth/verify-email?token=${verificationToken}&email=${user.email}' target='_blank'>HERE</a></p>`;

  await sendEmail({
    to: user.email,
    subject: "Shoe Store Email Verification link",
    html: emailHtml,
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

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    throw new CustomError.BadRequestError(
      "Your Email or Password is incorrect"
    );
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthorizedError("Please verify your email");
  }
  const tokenUser = createTokenUser(user);

  let refreshToken = "";
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res
      .status(StatusCodes.OK)
      .json(
        createResponse(true, { user: tokenUser }, "logged in successfully")
      );
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  await Token.create({
    refreshToken,
    ip,
    userAgent,
    user: user._id,
  });

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res
    .status(StatusCodes.OK)
    .json(createResponse(true, { user: tokenUser }, "logged in successfully"));
}

export async function logout(req: Request, res: Response) {
  await Token.findOneAndDelete({ user: (req as RequestWithUser).user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, null, "Logged out successfully"));
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  if (email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.BadRequestError(
        `No user with email ${email} found`
      );
    }
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const thirtyMinutes = 1000 * 60 * 30;
    const passwordTokenExpirationDate = new Date(Date.now() + thirtyMinutes);
    user.passwordToken = createHashedString(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    const emailHtml =
      process.env.NODE_ENV == "development"
        ? `<p>Hello ${user.name}, please reset your password by clicking this link <a href='http://localhost:3000/auth/reset-password/${user.passwordToken}?email=${user.email}' target='_blank'>"RESET PASSWORD LINK"</a> link is valid for 30mins</p>`
        : `<p>Hello ${user.name}, please reset your password by clicking this link <a href='https://jshoes.netlify.app/auth/reset-password/${user.passwordToken}?email=${user.email}' target='_blank'>"RESET PASSWORD LINK"</a> link is valid for 30mins</p>`;

    await sendEmail({
      to: user.email,
      subject: "Shoe Store Password Reset link",
      html: emailHtml,
    });
  }

  res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        null,
        "Success! Please check your email to reset your password using the password reset link"
      )
    );
}

export async function resetPassword(req: Request, res: Response) {
  const { passwordToken, password, email } = req.body;
  if (!passwordToken || !password || !email) {
    throw new CustomError.BadRequestError(
      "Please provide passwordToken, password and email"
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();

    if (
      user.passwordTokenExpirationDate &&
      currentDate > user.passwordTokenExpirationDate
    ) {
      throw new CustomError.BadRequestError(
        "Password token has expired, please visit the forgot password page and try again"
      );
    }
    if (user.passwordToken == createHashedString(passwordToken)) {
      user.password = password;
      user.passwordToken = undefined;
      user.passwordTokenExpirationDate = undefined;
    }

    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, null, "Password reset successfully"));
}
