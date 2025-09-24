import { Request, Response } from "express";
import { meetingRoomSettingService } from "../services/meetingRoom";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { validateCreateMeetingRoomSetting } from "../validators/meetingRoomSetting";
import { timeSlotMiscService } from "../services/timeSlot";
import { getNextThreeMonthsDayRange } from "../utils/date";

class MeetingRoomSettingController {
    async updateMeetingRoomSettings(req: Request, res: Response): Promise<void> {
        try {
            const pass409 = req.query.pass409;
            let validatedData = await validateCreateMeetingRoomSetting(req.body);
            // Get default 3-month range
            const { start, end, days } = getNextThreeMonthsDayRange();
            // Check if any booked slots already exist in that 3-month window
            const bookedSlots = await timeSlotMiscService.getTimeslotsBookedInFuture({ start: start.toISOString(), end: end.toISOString() });
            // If any exist, return 409 Conflict
            if (bookedSlots.length > 0 && pass409 !=="true") {
                throw { status: 409, message: "Some slots are already booked in the default 3-month window." };
            }
            const meetingRoomSetting = await meetingRoomSettingService.updateMeetingRoomSetting(validatedData);
            // delete all slots which are not booked.
            await timeSlotMiscService.deleteTimeslotByMeetingId("3b0b8887-05d6-4bb9-ad7b-3160417e4a24");
            await timeSlotMiscService.createTimeslots({ start, end, days, id: "3b0b8887-05d6-4bb9-ad7b-3160417e4a24", ...validatedData });
            successResponse(res, "Meeting Room Settings updated successfully");
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async getMeetingRoomSettings(req: Request, res: Response): Promise<void> {
        try {
            const meetingRoomSetting = await meetingRoomSettingService.getMeetingRoomSetting();
            successResponse(res, "Meeting Room Settings fetched successfully", meetingRoomSetting);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
}

export const meetingRoomSettingController = new MeetingRoomSettingController();
