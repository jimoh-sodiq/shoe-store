import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import User from "../models/user.model";

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(createResponse(false, null, "Email already exists"));
  }

  // const user = await User.create({name, email, password})
  // await user.save()
  res
    .status(StatusCodes.CREATED)
    .json(createResponse(true, { user: "" }, "user created successfully"));
}

export async function login(req: Request, res: Response) {}

export async function logout(req: Request, res: Response) {}
