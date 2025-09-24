import { Request, Response } from "express";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { appSettingsService } from "../services/appSetting";

class AppSettingsController {
    async getSettings(req: Request, res: Response): Promise<void> {
        try {
            const appSetting = await appSettingsService.get();
            successResponse(res, "Application Settings fetched successfully", appSetting);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async updateSettings(req: Request, res: Response): Promise<void> {
        try {
            const appSetting = await appSettingsService.update(req.body);
            successResponse(res, "Application Settings updated successfully", appSetting);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
}

export const appSettingController = new AppSettingsController();
