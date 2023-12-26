import express from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logout,
} from "../controllers/auth.controller";
import { authenticateUser } from "../middleware/authentication.middleware";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/logout").delete(authenticateUser, logout);

export default router;
