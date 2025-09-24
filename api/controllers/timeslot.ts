import { Request, Response, NextFunction } from "express";
import { serviceCategory } from "../services/serviceCategory";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { mailService } from "../services/mail";
import { timeSlotMiscService } from "../services/timeSlot";
import { userMiscService, userService } from "../services/user";

class TimeslotController {
    async getBookedTimeslotOfUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.id;
            const timeSlots = await timeSlotMiscService.getTimeSlotsOfUserByUserId(userId)
            successResponse(res, "Booked timeslots fetched successfully", timeSlots);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async getTimeslotsByDates(req: Request, res: Response): Promise<void> {
        try {
            const startTime = req.query.startTime;
            const endTime = req.query.endTime;
            const timeSlots = await timeSlotMiscService.getAllTimeslotByDates({ startTime, endTime });
            successResponse(res, "Timeslots fetched successfully", timeSlots);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async bookTimeSlots(req: Request, res: Response): Promise<void> {
        try {
            const slots = req.body.slots;
            const userId = req.user.id;
            //update user 
            const freeSlotsCount: any = await userMiscService.getFreeMeetingRoomSlots(userId);
            await userService.updateUser(userId, { freeMeetingRoomSlots: freeSlotsCount - slots.length <= 0 ? 0 : freeSlotsCount - slots.length })

            await timeSlotMiscService.bookSlots(userId, slots);
            successResponse(res, "Timeslots Booked successfully");
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

}

export const timeslotController = new TimeslotController();
