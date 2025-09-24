import { Request, Response } from "express";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { notificationScheduleService } from "../services/notificationSchedule";
import { validateUpdateNotificationSchedule } from "../validators/notificationSchedule";

class NotificationScheduleController {

    async updateNotificationSchedule(req: Request, res: Response): Promise<void> {
        try {
            let validatedData = await validateUpdateNotificationSchedule(req.body);
            await notificationScheduleService.updateSchedule(validatedData);
            successResponse(res, "Notification Schedule updated successfully");
        } catch (error: any) {
            errorResponse(error, res);
        }
    }

    async getAllNotificationSchedules(req: Request, res: Response): Promise<void> {
        try {
            const notificationSchedules = await notificationScheduleService.getAllSchedules();;
            successResponse(res, "Notification Schedules fetched successfully", notificationSchedules);
        } catch (error: any) {
            errorResponse(error, res);
        }
    }
}

export const notificationScheduleController = new NotificationScheduleController();
