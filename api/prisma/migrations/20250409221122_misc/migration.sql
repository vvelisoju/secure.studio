/*
  Warnings:

  - You are about to drop the column `emailTemplateName` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `whatAppTemplateName` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `channel` on the `NotificationSchedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "emailTemplateName",
DROP COLUMN "whatAppTemplateName",
ADD COLUMN     "templateName" TEXT;

-- AlterTable
ALTER TABLE "NotificationSchedule" DROP COLUMN "channel";

-- AlterTable
ALTER TABLE "NotificationTemplate" ADD COLUMN     "isSchedulable" BOOLEAN NOT NULL DEFAULT false;
