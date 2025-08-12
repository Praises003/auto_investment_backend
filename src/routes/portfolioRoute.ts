import express from "express"

import { createPortfolioController, getPortfolioSummaryController } from "@/controllers/portfolioController"
import { authMiddleware } from "@/middlewares/authMiddleware"

const router = express.Router()

router.post("/", authMiddleware ,createPortfolioController)
router.get('/summary', authMiddleware, getPortfolioSummaryController);


export default router