// src/services/stockService.ts
import { PrismaClient } from '@prisma/client';
import { getStockPrice } from "@/utils/alphavantage";
const prisma = new PrismaClient();

export const saveOrUpdateStockPrice = async (symbol: string) => {
  const price = await getStockPrice(symbol);
  const date = new Date();

  await prisma.stockPrice.upsert({
    where: {
      symbol_date: { symbol, date }, // compound unique index in schema
    },
    update: { price },
    create: { symbol, price, date },
  });

  return price;
};
