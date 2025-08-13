import express from "express"

import { createPortfolioController, getPortfolioSummaryController, createTransactionController } from "@/controllers/portfolioController"
import { authMiddleware } from "@/middlewares/authMiddleware"

const router = express.Router()

router.post("/", authMiddleware ,createPortfolioController)
router.get('/summary', authMiddleware, getPortfolioSummaryController);
router.get("/transact", authMiddleware , createTransactionController)


export default router