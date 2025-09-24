/*
  Warnings:

  - You are about to drop the column `isRegistered` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpGeneratedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isRegistered",
DROP COLUMN "otp",
DROP COLUMN "otpExpiresAt",
DROP COLUMN "otpGeneratedAt",
DROP COLUMN "otpToken",
DROP COLUMN "password";

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "otpToken" TEXT NOT NULL,
    "otpGeneratedAt" TIMESTAMP(3) NOT NULL,
    "otpExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_otpToken_key" ON "Otp"("otpToken");
