
import express from "express";
import { createInvestmentProfileController } from "../controllers/investmentController";

const router = express.Router();

router.post("/investment-profile", createInvestmentProfileController);

export default router;
