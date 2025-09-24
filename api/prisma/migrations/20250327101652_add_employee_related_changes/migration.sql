/*
  Warnings:

  - You are about to drop the column `userId` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userAdminId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subscriptionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookingId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- AlterEnum
ALTER TYPE "UserType" ADD VALUE 'EMPLOYEE';

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userAdminId_fkey";

-- DropIndex
DROP INDEX "Company_userId_key";

-- DropIndex
DROP INDEX "Subscription_serviceId_planId_userId_key";

-- DropIndex
DROP INDEX "User_userAdminId_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "subscriptionId" TEXT;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "userId",
ADD COLUMN     "bookingId" TEXT NOT NULL,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "employeesAllowed" INTEGER,
ADD COLUMN     "employeesFilled" INTEGER,
ADD COLUMN     "type" "SubscriptionType" NOT NULL DEFAULT 'INDIVIDUAL';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userAdminId",
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "isSubscriptionUsed" BOOLEAN NOT NULL DEFAULT true,
    "assignedBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_userId_subscriptionId_key" ON "UserSubscription"("userId", "subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_subscriptionId_key" ON "Booking"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_bookingId_key" ON "Subscription"("bookingId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
