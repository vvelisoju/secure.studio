import { Request, Response } from "express";
import { invoiceMiscService, invoiceService } from "../services/invoice";
import { errorResponse, successResponse } from "../middlewares/responseHandler";
import { invoiceSettingsService } from "../services/invoiceSetting";
import { Prisma } from "@prisma/client";

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

    async createDirectInvoice(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;
            
            // Get invoice settings to determine invoice number
            let invoiceSettings: any = await invoiceSettingsService.get();
            const isTaxInvoice = body.type === "TAXABLE";
            
            // If invoice settings don't exist, use default values
            if (!invoiceSettings) {
                console.warn('Invoice settings not found, using default values');
                invoiceSettings = {
                    invoiceNumber: 1,
                    taxInvoiceNumber: 1
                };
            }
            
            const invoiceCode = isTaxInvoice ? invoiceSettings.taxInvoiceNumber : invoiceSettings.invoiceNumber;
            
            // Debug logging
            console.log('Invoice Settings:', invoiceSettings);
            console.log('Is Tax Invoice:', isTaxInvoice);
            console.log('Invoice Code:', invoiceCode);
            
            // Prepare invoice data with only valid Invoice schema fields
            const invoiceData: Prisma.InvoiceUncheckedCreateInput = {
                code: JSON.stringify(invoiceCode),
                userId: body.userId,
                effectiveDate: body.effectiveDate,
                dueDate: body.dueDate,
                description: body.description,
                SAC: body.SAC,
                HSN: body.HSN,
                perQuantityAmount: body.perQuantityAmount,
                quantity: body.quantity,
                totalAmount: body.totalAmount,
                discount: body.discount,
                taxableAmount: body.taxableAmount,
                cgst: body.cgst,
                sgst: body.sgst,
                cgstAmount: body.cgstAmount,
                sgstAmount: body.sgstAmount,
                finalAmount: body.finalAmount,
                amountPaid: body.amountPaid,
                poNumber: body.poNumber,
                balanceDue: body.balanceDue,
                periodOfService: body.periodOfService,
                type: body.type,
                itemsJson: body.itemsJson,
                headingsJson: body.headingsJson,
                status: body.status !== undefined ? body.status : true,
            };
            
            // Create the invoice
            const invoice = await invoiceService.createInvoice(invoiceData);
            
            // Update invoice settings counter only if settings exist in database
            const settingsExist = await invoiceSettingsService.get();
            if (settingsExist) {
                await invoiceSettingsService.update({
                    taxInvoiceNumber: isTaxInvoice ? (invoiceSettings.taxInvoiceNumber + 1) : invoiceSettings.taxInvoiceNumber,
                    invoiceNumber: isTaxInvoice ? invoiceSettings.invoiceNumber : (invoiceSettings.invoiceNumber + 1),
                });
            } else {
                console.warn('Skipping invoice settings update - record does not exist in database');
            }
            
            successResponse(res, "Invoice created successfully", invoice);
        } catch (error: any) {
            errorResponse(error, res)
        }
    }
}

export const invoiceController = new InvoiceController();
