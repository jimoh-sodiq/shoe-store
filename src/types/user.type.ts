import { Types } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  verificationToken: string;
  isVerified: boolean;
  verifiedDate: Date;
  passwordToken?: string;
  passwordTokenExpirationDate?: Date;
};

export type TTokenUser = {
  name: string;
  userId: Types.ObjectId;
  role: "admin" | "user";
};
