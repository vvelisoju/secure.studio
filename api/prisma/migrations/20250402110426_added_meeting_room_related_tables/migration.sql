/*
  Warnings:

  - You are about to drop the column `availability` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "availability",
ADD COLUMN     "meetingRoomAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meetingRoomAccessInMinutes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MeetingRoomSetting" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "weekdays" TEXT[],
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slotDuration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingRoomSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "meetingRoomSettingId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "userId" TEXT,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MeetingRoomSetting_serviceId_key" ON "MeetingRoomSetting"("serviceId");

-- AddForeignKey
ALTER TABLE "MeetingRoomSetting" ADD CONSTRAINT "MeetingRoomSetting_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_meetingRoomSettingId_fkey" FOREIGN KEY ("meetingRoomSettingId") REFERENCES "MeetingRoomSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
