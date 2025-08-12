-- AlterTable
ALTER TABLE "public"."UserProfile" ADD COLUMN     "expectedDeposit" INTEGER,
ADD COLUMN     "institutionName" TEXT,
ADD COLUMN     "sourceOfFunds" TEXT;
