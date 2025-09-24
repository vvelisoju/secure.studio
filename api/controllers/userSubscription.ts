import { Request, Response, NextFunction } from "express";
import { userSubscriptionMiscService } from "../services/userSubscription";
import { errorResponse, successResponse } from "../middlewares/responseHandler";

class UserSubscriptionController {
    async getAllSubscriptionsOfuser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.query?.id as string || req.user?.id as string;
            const subscriptions = await userSubscriptionMiscService.getSubscriptionsOfUser(userId);
            successResponse(res, "Subscriptions fetched successfully", subscriptions);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
    async getAllUsersofAssignedByCompanyAdmin(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.query?.id as string || req.user?.id as string;
            const employees = await userSubscriptionMiscService.getAllUsersofAssignedByCompanyAdmin(userId);
            successResponse(res, "Employees fetched successfully", employees);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }


}

export const userSubscriptionController = new UserSubscriptionController();
