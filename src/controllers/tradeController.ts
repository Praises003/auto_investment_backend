// src/controllers/tradeController.ts
import { Request, Response } from "express";
import { buyStock, sellStock } from "@/services/tradeService";

export const buyStockController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { symbol, shares } = req.body;

  if (!symbol || !shares) {
    return res.status(400).json({ message: "Symbol and shares are required" });
  }

  try {
    const result = await buyStock(userId, symbol, shares);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sellStockController = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { symbol, shares } = req.body;

  if (!symbol || !shares) {
    return res.status(400).json({ message: "Symbol and shares are required" });
  }

  try {
    const result = await sellStock(userId, symbol, shares);
    res.status(201).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
