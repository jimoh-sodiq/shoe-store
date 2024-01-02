import { Types } from "mongoose";

export type TReview = {
  rating: number;
  title: string;
  user: Types.ObjectId;
  comment: string;
  product: Types.ObjectId;
};
