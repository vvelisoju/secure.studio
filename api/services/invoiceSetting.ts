import { Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";

class InvoiceSettingsService {
    async get() {
        try {
            return await prisma.invoiceSetting.findUnique({ 
                where: { id: "27361009-6a9f-44a7-b531-46aefefacca8" } 
            });
        } catch (error) {
            throw error;
        }
    }

    async update(data: Prisma.InvoiceSettingUncheckedUpdateInput) {
        try {
            return await prisma.invoiceSetting.update({ 
                where: { id: "27361009-6a9f-44a7-b531-46aefefacca8" }, 
                data 
            });
        } catch (error) {
            throw error;
        }
    }
}



export const invoiceSettingsService = new InvoiceSettingsService();
