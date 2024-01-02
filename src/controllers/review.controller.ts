import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/product.model";
import Review from "../models/review.model";
import { createResponse } from "../utils/response.util";
import * as CustomError from "../errors";
import { RequestWithUser } from "../types/request.type";
import { confirmOwnership } from "../utils/user.util";

export async function createReview(req: Request, res: Response) {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.BadRequestError("product not found");
  }

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: (req as RequestWithUser).user.userId,
  });
  if (alreadyReviewed) {
    throw new CustomError.BadRequestError("already reviewed product");
  }
  req.body.user = (req as RequestWithUser).user.userId;
  const review = await Review.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json(createResponse(true, { review }, "review created successfully"));
}

export async function getAllReviews(req: Request, res: Response) {
  const reviews = await Review.find({})
    .populate({ path: "product", select: "name company price" })
    .populate({ path: "user", select: "name" });
  res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        { reviews, count: reviews.length },
        "reviews fetched successfully"
      )
    );
}

export async function getSingleReview(req: Request, res: Response) {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError("review not found");
  }
  res
    .status(StatusCodes.OK)
    .json(createResponse(true, { review }, "review fetched successfully"));
}

export async function updateReview(req: Request, res: Response) {
  const { rating, comment, title } = req.body;
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  console.log(review);
  if (!review) {
    throw new CustomError.NotFoundError("review not found");
  }
  confirmOwnership((req as RequestWithUser).user, review.user);
  review.comment = comment ?? review.comment;
  review.title = title ?? review.title;
  review.rating = rating ?? review.rating;
  await review.save();
  return res
    .status(StatusCodes.OK)
    .json(createResponse(true, { review }, "review updated successfully"));
}

export async function deleteReview(req, res) {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError("review not found");
  }
  confirmOwnership((req as RequestWithUser).user, review.user);

  await review.deleteOne();

  res
    .status(StatusCodes.OK)
    .json(createResponse(true, { review }, "review deleted successfully"));
}

export async function getSingleProductReviews(req: Request, res: Response) {
  const productId = req.params.id;
  const reviews = await Review.find({ product: productId });
  res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        { reviews, count: reviews.length },
        "review deleted successfully"
      )
    );
}
