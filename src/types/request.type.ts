import { Request } from "express";
import { TTokenUser } from "../types/user.type";

export type RequestWithUser = Request & { user: TTokenUser };
