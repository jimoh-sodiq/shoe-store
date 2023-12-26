import express from "express";
import {
  showCurrentUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword
} from "../controllers/user.controller";
import { authenticateUser } from "../middleware/authentication.middleware";

const router = express.Router();

router.route("/show").get(authenticateUser, showCurrentUser);
router.route("/").get(authenticateUser, getAllUsers);
router.route("/update").patch(authenticateUser,updateUser);
router.route("/update-password").patch(authenticateUser,updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);

export default router;
