import express, { Router } from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.middleware";

import {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
} from "../controllers/review.controller";

const router: Router = express.Router();

router.route("/").get(getAllReviews).post(authenticateUser, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router;
