// src/services/investmentService.ts

import { PrismaClient } from '../generated/prisma';
import { v4 as uuid } from "uuid";
import { recommendRiskProfile } from './riskService';

const prisma = new PrismaClient();

interface CreateInvestmentProfileInput {
  portfolioId: string;
  objective: "FIXED_INCOME" | "BALANCED" | "GROWTH";
  knowledgeLevel: "NONE" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  investmentHorizon: "LESS_THAN_1_YEAR" | "ONE_TO_TWO_YEARS" | "THREE_TO_FOUR_YEARS" | "FIVE_PLUS_YEARS";
}

export const createInvestmentProfile = async (data: CreateInvestmentProfileInput) => {
  const { portfolioId, objective, knowledgeLevel, investmentHorizon } = data;

  // Generate recommendation
  const recommendedRisk = recommendRiskProfile({ objective, knowledgeLevel, investmentHorizon });

  // Save profile
  const profile = await prisma.investmentProfile.create({
    data: {
      id: uuid(),
      portfolioId,
      objective,
      knowledgeLevel,
      investmentHorizon,
    },
  });

  // Update Portfolio with recommendation
  await prisma.portfolio.update({
    where: { id: portfolioId },
    data: { riskLevel: recommendedRisk },
  });

  return {
    profile,
    recommendation: recommendedRisk,
  };
};
