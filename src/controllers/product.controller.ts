import Product from "../models/product.model";
import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import {
  createResponse,
  attachCookiesToResponse,
} from "../utils/response.util";
import * as CustomError from "../errors";
import { RequestWithUser } from "../types/request.type";
import fs from "fs/promises";

export async function createProduct(req: Request, res: Response) {
  req.body.user = (req as RequestWithUser).user.userId;
  const { images } = req.body;
  const product = await Product.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json(createResponse(true, { product }, "Product created successfully"));
}

export async function getAllProducts(req: Request, res: Response) {
  const products = await Product.find({});
  return res
    .status(StatusCodes.OK)
    .json(
      createResponse(
        true,
        { products, count: products.length },
        "Products fetched successfully"
      )
    );
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

export async function uploadImageLocal(req: Request, res: Response) {
  //   console.log("file", req.files);
  const files = req.files;
  if (!files || !files.length) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  (req.files as Array<Express.Multer.File>).forEach(
    (file: Express.Multer.File) => {
      if (!file.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please upload a valid image");
      }
      if (file.size > 1024 ** 5) {
        throw new CustomError.BadRequestError(
          "Please, all image sizes should be less than 5mb"
        );
      }
    }
  );

  const images = (files as Express.Multer.File[]).map(
    (file) => `/uploads/${file.originalname}`
  );

  return res
    .status(StatusCodes.OK)
    .json(createResponse(true, { images }, "image upload successful"));
}

export async function uploadImage(req: Request, res: Response) {
  const files = req.files;
  if (!files || !files.length) {
    throw new CustomError.BadRequestError("No file uploaded");
  }
  (req.files as Array<Express.Multer.File>).forEach(
    (file: Express.Multer.File) => {
      if (!file.mimetype.startsWith("image")) {
        throw new CustomError.BadRequestError("Please upload a valid image");
      }
      if (file.size > 1024 ** 5) {
        throw new CustomError.BadRequestError(
          "Please, all image sizes should be less than 5mb"
        );
      }
    }
  );
  try {
    const uploadImages = await Promise.all(
      (req.files as Array<Express.Multer.File>).map(async (file, index) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "shoe-store-product-images",
          public_id: crypto.randomBytes(12).toString("hex"),
        });
        await fs.unlink(file.path);
        return result.secure_url;
      })
    );
    return res
      .status(StatusCodes.OK)
      .json(
        createResponse(
          true,
          { images: uploadImages },
          "image upload successful"
        )
      );
  } catch (err) {
    throw new CustomError.BadRequestError("Failed to upload images");
  }
}
