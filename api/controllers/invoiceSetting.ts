import { Request, Response } from "express";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { invoiceSettingsService } from "../services/invoiceSetting";

class InvoiceSettingsController {
    async getSettings(req: Request, res: Response): Promise<void> {
        try {
            const invoiceSetting = await invoiceSettingsService.get();
            successResponse(res, "Invoice Settings fetched successfully", invoiceSetting);
        } catch (error: any) {
            errorResponse(error, res);
        }
    }

    async updateSettings(req: Request, res: Response): Promise<void> {
        try {
            const invoiceSetting = await invoiceSettingsService.update(req.body);
            successResponse(res, "Invoice Settings updated successfully", invoiceSetting);
        } catch (error: any) {
            errorResponse(error, res);
        }
    }
}

export const invoiceSettingsController = new InvoiceSettingsController();
