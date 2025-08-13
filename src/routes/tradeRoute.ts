// src/routes/tradeRoutes.ts
import express from "express";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { buyStockController, sellStockController } from "@/controllers/tradeController";

const router = express.Router();

router.post("/buy", authMiddleware, buyStockController);
router.post("/sell", authMiddleware, sellStockController);

export default router;
