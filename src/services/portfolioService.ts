// src/services/portfolioService.ts

import { PrismaClient } from "../generated/prisma";
import { v4 as uuid } from "uuid";
import { recommendRiskProfile } from "./riskService";
import { getStockPrice } from "@/utils/alphavantage";

const prisma = new PrismaClient();

interface CreatePortfolioInput {
  userId: string;
  goal: string;
  autoInvest: boolean;
  investmentMode: "ACTIVE_INVESTMENT" | "AUTO_INVESTMENT";
}

interface CreateInvestmentProfileInput {
  objective: "FIXED_INCOME" | "BALANCED" | "GROWTH";
  knowledgeLevel: "NONE" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  investmentHorizon: "LESS_THAN_1_YEAR" | "ONE_TO_TWO_YEARS" | "THREE_TO_FOUR_YEARS" | "FIVE_PLUS_YEARS";
}

export const createPortfolioWithInvestmentProfile = async (
  userId: string,
  portfolioData: CreatePortfolioInput,
  profileData: CreateInvestmentProfileInput
) => {
  // 1. Create the Portfolio
  const portfolio = await prisma.portfolio.create({
    data: {
      id: uuid(),
      userId,
      goal: portfolioData.goal,
      autoInvest: portfolioData.autoInvest,
      investmentMode: portfolioData.investmentMode,
      riskLevel: "", // default empty for now, will update next
    },
  });

  // 2. Get recommendation based on profile data
  const recommendedRisk = recommendRiskProfile(profileData);

  // 3. Create InvestmentProfile linked to the portfolio
  const investmentProfile = await prisma.investmentProfile.create({
    data: {
      id: uuid(),
      portfolioId: portfolio.id,
      objective: profileData.objective,
      knowledgeLevel: profileData.knowledgeLevel,
      investmentHorizon: profileData.investmentHorizon,
    },
  });

  // 4. Update Portfolio with the recommended risk level
  await prisma.portfolio.update({
  where: { id: portfolio.id },
  data: { riskLevel: recommendedRisk },
});

// Update in-memory portfolio object
portfolio.riskLevel = recommendedRisk;

  return {
    portfolio,
    investmentProfile,
    recommendedRisk,
  };
};


// src/services/portfolioService.ts
export const getUserPortfolioSummary = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
  });

  const holdings: Record<string, { shares: number; invested: number }> = {};

  for (const tx of transactions) {
    if (!holdings[tx.symbol]) {
      holdings[tx.symbol] = { shares: 0, invested: 0 };
    }

    if (tx.type === 'buy') {
      holdings[tx.symbol].shares += tx.amount; // amount = shares bought
      holdings[tx.symbol].invested += tx.amount * (await getStockPrice(tx.symbol));
    } else if (tx.type === 'sell') {
      holdings[tx.symbol].shares -= tx.amount;
      holdings[tx.symbol].invested -= tx.amount * (await getStockPrice(tx.symbol));
    }
  }

  let totalValue = 0;
  let totalInvested = 0;

  for (const symbol of Object.keys(holdings)) {
    const currentPrice = await getStockPrice(symbol);
    const { shares, invested } = holdings[symbol];

    const value = shares * currentPrice;
    totalValue += value;
    totalInvested += invested;
  }

  const gainLoss = totalValue - totalInvested;
  const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;

  return {
    totalValue,
    gainLoss,
    gainLossPercent,
    holdings,
  };
};
