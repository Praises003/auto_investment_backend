// src/services/tradeService.ts
import { PrismaClient } from "../generated/prisma";
import { getStockPrice } from "@/utils/alphavantage";
const prisma = new PrismaClient();

export const buyStock = async (userId: string, symbol: string, shares: number) => {
  const price = await getStockPrice(symbol);
  const totalAmount = shares;

  await prisma.transaction.create({
    data: {
      userId,
      symbol,
      type: 'buy',
      amount: totalAmount,
      date: new Date(),
    },
  });

  return {
    message: `Bought ${shares} shares of ${symbol} at $${price.toFixed(2)}`,
    price,
    shares,
    symbol,
  };
};

export const sellStock = async (userId: string, symbol: string, shares: number) => {
  // Step 1: Get user's holdings
  const transactions = await prisma.transaction.findMany({
    where: { userId, symbol },
  });

  const totalOwned = transactions.reduce((sum, tx) => {
    return tx.type === 'buy' ? sum + tx.amount : sum - tx.amount;
  }, 0);

  if (shares > totalOwned) {
    throw new Error(`Not enough shares. You own ${totalOwned} shares of ${symbol}`);
  }

  const price = await getStockPrice(symbol);

  await prisma.transaction.create({
    data: {
      userId,
      symbol,
      type: 'sell',
      amount: shares,
      date: new Date(),
    },
  });

  return {
    message: `Sold ${shares} shares of ${symbol} at $${price.toFixed(2)}`,
    price,
    shares,
    symbol,
  };
};
