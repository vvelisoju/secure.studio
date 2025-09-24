import { prisma } from "../prismaClient";
import { timeSlotMiscService } from "./timeSlot";

export class MeetingRoomSettingService {
    async getMeetingRoomSetting() {
        try {
            return await prisma.meetingRoomSetting.findUnique({ where: { id:"3b0b8887-05d6-4bb9-ad7b-3160417e4a24" } });
        } catch (error) {
            throw (error)
        }
    }

    async createMeetingRoomSetting(data: any) {
        try {
            return await prisma.meetingRoomSetting.create({ data });
        } catch (error) {
            throw (error)
        }
    }

    async updateMeetingRoomSetting(data: any) {
        try {
            return await prisma.meetingRoomSetting.update({ where: { id: "3b0b8887-05d6-4bb9-ad7b-3160417e4a24" }, data });
        } catch (error) {
            throw (error)
        }
    }

    async deleteMeetingRoomSetting(id: string) {
        try {
            return await prisma.meetingRoomSetting.delete({ where: { id } });
        } catch (error) {
            throw (error)
        }
    }
}

export const meetingRoomSettingService = new MeetingRoomSettingService();
