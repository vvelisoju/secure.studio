import { Request, Response } from "express";
import { invoiceMiscService, invoiceService } from "../services/invoice";
import { errorResponse, successResponse } from "../middlewares/responseHandler";

class InvoiceController {
    async getAllInvoicesOfUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.query?.id as string || req.user?.id as string;
            const { page, limit } = req.query as any;
            const invoices = await invoiceMiscService.getAllInvoicesOfUser(userId, parseInt(page), parseInt(limit));
            successResponse(res, "All Invoices fetched successfully", invoices);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async getInvoicesOfUser(req: Request, res: Response): Promise<void> {
        try {
            const invoiceId = req.query?.invoiceId as string;
            const invoice = await invoiceService.getInvoice(invoiceId);
            successResponse(res, "Invoice fetched successfully", invoice);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }

    async updateInvoicesOfUser(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;
            const invoice = await invoiceService.updateInvoice(body);
            successResponse(res, "Invoice updated successfully", invoice);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
}

export const invoiceController = new InvoiceController();
