import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/product.controller";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.middleware";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions("admin"), createProduct);

router
  .route("/upload-image")
  .post(authenticateUser, authorizePermissions("admin"), uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct)
  .delete(authenticateUser, authorizePermissions("user"), deleteProduct);

// router.route("/:id/reviews").get(getSingleProductReviews);

export default router;