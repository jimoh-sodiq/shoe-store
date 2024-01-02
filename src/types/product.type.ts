import { Types } from "mongoose";

export type TProduct = {
  name: string;
  description: string;
  price: number;
  images: Types.Array<string>;
  category: "men" | "women" | "kids" | "unisex";
  colors: Types.Array<string>;
  brand: string;
  sizes: Types.Array<number>
  featured?: boolean;
  freeShipping?: boolean;
  inventory: number;
  orderCount: number;
  averageRating?: number;
  numOfReviews?: number;
  user: Types.ObjectId;
};
