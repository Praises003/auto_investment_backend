// scripts/backfillTransactionPrices.ts
import { PrismaClient } from '@prisma/client';
import { getStockPrice } from './alphavantage';
const prisma = new PrismaClient()
async function backfillPrices() {
  // Find all transactions with null or zero price
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { price: null },
        { price: 0 }
      ]
    }
  });

  console.log(`Found ${transactions.length} transactions to backfill.`);

  for (const tx of transactions) {
    try {
      const currentPrice = await getStockPrice(tx.symbol);

      if (!currentPrice || currentPrice <= 0) {
        console.warn(`Skipping ${tx.id} - invalid price fetched: ${currentPrice}`);
        continue;
      }

      await prisma.transaction.update({
        where: { id: tx.id },
        data: { price: currentPrice }
      });

      console.log(`Updated transaction ${tx.id} with price ${currentPrice}`);
    } catch (error) {
      console.error(`Failed to update transaction ${tx.id}:`, error);
    }
  }
}

backfillPrices()
  .then(() => {
    console.log('✅ Backfill complete.');
    prisma.$disconnect();
  })
  .catch(e => {
    console.error('Backfill failed:', e);
    prisma.$disconnect();
    process.exit(1);
  });
