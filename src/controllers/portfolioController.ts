// src/controllers/portfolioController.ts

import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import { createPortfolioWithInvestmentProfile } from "../services/portfolioService";
import { getUserPortfolioSummary } from "@/services/portfolioService";
import { getStockPrice } from "@/utils/alphavantage";



const prisma = new PrismaClient();
export const createPortfolioController = async (req: Request, res: Response) => {
  try {
    // userId should be set by authMiddleware, cast req to access it
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const { goal, autoInvest, investmentMode, objective, knowledgeLevel, investmentHorizon } = req.body;

    const result = await createPortfolioWithInvestmentProfile(
      userId,
      { userId, goal, autoInvest, investmentMode },
      { objective, knowledgeLevel, investmentHorizon }
    );

    res.status(201).json({
      message: "Portfolio and investment profile created",
      portfolio: result.portfolio,
      investmentProfile: result.investmentProfile,
      recommendedRisk: result.recommendedRisk,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};



// src/controllers/portfolioController.ts

export const getPortfolioSummaryController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const summary = await getUserPortfolioSummary(userId);
    res.json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const createTransactionController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { symbol, amount, type } = req.body;

  if (!userId || !symbol || !amount || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const price = await getStockPrice(symbol); // ✅ get live price at transaction time

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        symbol,
        type,
        amount,
        price, // ✅ record price used in this transaction
      },
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};