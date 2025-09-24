/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('HOUR', 'DAY', 'MONTH', 'YEAR');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_serviceId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "subscriptionId",
ADD COLUMN     "planId" TEXT;

-- DropTable
DROP TABLE "Subscription";

-- DropEnum
DROP TYPE "SubscriptionType";

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'name',
    "features" TEXT[],
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "savePercentage" INTEGER NOT NULL DEFAULT 0,
    "gstType" "GstType" NOT NULL DEFAULT 'PERCENTAGE',
    "gstValue" DOUBLE PRECISION NOT NULL DEFAULT 18.0,
    "duration" "PlanType" NOT NULL,
    "durationValueSelect" "DurationValueSelect" NOT NULL DEFAULT 'DEFAULT_VALUE',
    "defaultValue" INTEGER NOT NULL DEFAULT 1,
    "advanceType" "AdvanceType" NOT NULL DEFAULT 'NIL',
    "advanceValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
