-- AlterTable
ALTER TABLE "Plan" ALTER COLUMN "savePercentage" SET DEFAULT 0,
ALTER COLUMN "savePercentage" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "joiningDate" TIMESTAMP(3);
