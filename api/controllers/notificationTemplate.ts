import { Request, Response } from "express";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { notificationMiscTemplateService } from "../services/notificationTemplate";

class NotificationTemplateController {
    async getAllSchedulableTemplates(req: Request, res: Response): Promise<void> {
        try {
            const notificationTemplates = await notificationMiscTemplateService.getAllScheduledServices();
            successResponse(res, "Notification Templates fetched successfully", notificationTemplates);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
}

export const notificationTemplateController = new NotificationTemplateController();
