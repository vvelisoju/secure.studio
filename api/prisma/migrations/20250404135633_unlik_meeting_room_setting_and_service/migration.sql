/*
  Warnings:

  - You are about to drop the column `serviceId` on the `MeetingRoomSetting` table. All the data in the column will be lost.
  - You are about to drop the column `meetingRoomAccess` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `meetingRoomAccessInMinutes` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MeetingRoomSetting" DROP CONSTRAINT "MeetingRoomSetting_serviceId_fkey";

-- DropIndex
DROP INDEX "MeetingRoomSetting_serviceId_key";

-- AlterTable
ALTER TABLE "MeetingRoomSetting" DROP COLUMN "serviceId";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "meetingRoomAccess",
DROP COLUMN "meetingRoomAccessInMinutes";
