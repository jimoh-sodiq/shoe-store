import express from "express";
import { register, login, logout, verifyEmail } from "../controllers/auth.controller";

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-email").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").get(logout);

export default router;