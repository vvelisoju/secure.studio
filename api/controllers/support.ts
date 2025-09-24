import { Request, Response, NextFunction } from "express";
import { serviceCategory } from "../services/serviceCategory";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { mailService } from "../services/mail";
import { notificationService } from "../services/notification";
import { Prisma } from "@prisma/client";
import { convertDatePrimaryStyle, convertTimePrimaryStyle } from "../utils/date";

class SupportController {
    async getInTouch(req: Request, res: Response): Promise<void> {
        try {
            const data = req?.body;
            // create notification record
            const notificationData: Prisma.NotificationUncheckedCreateInput = {
                placeHolders: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    message: data.message,
                    submissionDate: convertDatePrimaryStyle(),
                    submissionTime: convertTimePrimaryStyle(),
                },
                templateName: "getInTouch",
            };
            await notificationService.createNotification(notificationData);
            successResponse(res, "Message Sent successfully");
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

}

export const supportController = new SupportController();
