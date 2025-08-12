import express from "express";
import { registerUserController, loginUserController, updateUserProfileController } from "../controllers/authController";
import { authMiddleware } from "@/middlewares/authMiddleware";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController)
router.post("/user-profile", authMiddleware , updateUserProfileController)

export default router;
