import express from "express";
import {
  getAllOrders,
  createOrder,
  updateOrder,
  getCurrentUserOrder,
  getSingleOrder,
} from "../controllers/order.controller";

import {
  authorizePermissions,
  authenticateUser,
} from "../middleware/authentication.middleware";

const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllOrders)
  .post(authenticateUser, createOrder);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrder);
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

export default router;
