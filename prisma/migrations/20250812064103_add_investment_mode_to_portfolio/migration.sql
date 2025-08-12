-- CreateEnum
CREATE TYPE "public"."InvestmentMode" AS ENUM ('ACTIVE_INVESTMENT', 'AUTO_INVESTMENT');

-- AlterTable
ALTER TABLE "public"."Portfolio" ADD COLUMN     "investmentMode" "public"."InvestmentMode" NOT NULL DEFAULT 'AUTO_INVESTMENT';
