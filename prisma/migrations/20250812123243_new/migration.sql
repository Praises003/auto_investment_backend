-- CreateEnum
CREATE TYPE "public"."Frequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "public"."WeekType" AS ENUM ('ODD', 'EVEN');

-- CreateTable
CREATE TABLE "public"."RecurringPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."Frequency" NOT NULL,
    "weekType" "public"."WeekType",
    "startDate" TIMESTAMP(3) NOT NULL,
    "dayOfMonth" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecurringPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecurringPayment_userId_key" ON "public"."RecurringPayment"("userId");

-- AddForeignKey
ALTER TABLE "public"."RecurringPayment" ADD CONSTRAINT "RecurringPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
