import express, { Router } from "express";
import {
  showCurrentUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
} from "../controllers/user.controller";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication.middleware";

const router: Router = express.Router();

router.route("/show").get(authenticateUser, showCurrentUser);
router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/update").patch(authenticateUser, updateUser);
router.route("/update-password").patch(authenticateUser, updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);

export default router;
