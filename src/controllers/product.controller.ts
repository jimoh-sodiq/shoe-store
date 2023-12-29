import Product from "../models/product.model";
import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import {
  createResponse,
  attachCookiesToResponse,
} from "../utils/response.util";
import * as CustomError from "../errors";
import { RequestWithUser } from "../types/request.type";

export async function createProduct(req: Request, res: Response) {
  req.body.user = (req as RequestWithUser).user.userId;
  const product = await Product.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json(createResponse(true, { product }, "Product created successfully"));
}

export async function getAllProducts(req: Request, res: Response) {
  const products = await Product.find({});
  return res
    .status(StatusCodes.OK)
    .json(createResponse(true, { products, count: products.length }, "Products fetched successfully"));
}

export async function getSingleProduct(req: Request, res: Response) {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id ${productId}`
    );
  }
  return res
    .status(StatusCodes.OK)
    .json(createResponse(true, { product }, "Product fetched successfully"));
}

export async function updateProduct(req: Request, res: Response) {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id ${productId}`
    );
  }
  return res
    .status(StatusCodes.OK)
    .json(createResponse(true, { product }, "Product updated successfully"));
}

export async function deleteProduct(req: Request, res: Response) {
  const { id: productId } = req.params;
  const product = await Product.findById({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id ${productId}`
    );
  }
  await product.deleteOne();
  return res
    .status(StatusCodes.OK)
    .json(createResponse(true, null, "Product deleted successfully"));
}

export async function uploadImage(req: Request, res: Response) {
  return res.send("uploadImage");
}
