import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/product.controller";

import { getSingleProductReviews } from "../controllers/review.controller";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.middleware";
import upload from "../middleware/uploader.middleware";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions("admin"), createProduct);

router
  .route("/upload-image")
  .post(
    authenticateUser,
    authorizePermissions("user"),
    upload.array("productImages", 7),
    uploadImage
  );

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermissions("admin"), deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

export default router;
