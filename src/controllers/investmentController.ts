import { Request, Response } from "express";
import { createInvestmentProfile } from "../services/investmentService";

export const createInvestmentProfileController = async (req: Request, res: Response) => {
  try {
    const { portfolioId, objective, knowledgeLevel, investmentHorizon } = req.body;

    const result = await createInvestmentProfile({
      portfolioId,
      objective,
      knowledgeLevel,
      investmentHorizon,
    });

    res.status(201).json({
      message: "Investment profile created",
      profile: result.profile,
      recommendedRiskLevel: result.recommendation,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};
