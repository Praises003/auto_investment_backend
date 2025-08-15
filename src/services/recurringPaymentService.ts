import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const setRecurringPayment = async (userId: string, data: {
  type: "WEEKLY" | "BIWEEKLY" | "MONTHLY",
  weekType?: "ODD" | "EVEN",
  startDate: Date,
  dayOfMonth?: number
}) => {
  return await prisma.recurringPayment.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

export const getRecurringPayment = async (userId: string) => {
  return await prisma.recurringPayment.findUnique({
    where: { userId }
  });
};
