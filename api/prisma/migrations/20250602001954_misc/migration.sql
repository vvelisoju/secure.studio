-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
