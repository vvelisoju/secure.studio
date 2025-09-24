import { Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";

class NotificationTemplateService {
    async getTemplate(id: string) {
        try {
            return await prisma.notificationTemplate.findUnique({ where: { id } });
        } catch (error) {
            throw error;
        }
    }

    async getAllTemplates() {
        try {
            return await prisma.notificationTemplate.findMany({
                orderBy: { createdAt: "desc" },
                include: {
                    emailTemplate: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async createTemplate(data: Prisma.NotificationTemplateUncheckedCreateInput) {
        try {
            return await prisma.notificationTemplate.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async updateTemplate(id: string, data: Partial<Prisma.NotificationTemplateUpdateInput>) {
        try {
            return await prisma.notificationTemplate.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteTemplate(id: string) {
        try {
            return await prisma.notificationTemplate.delete({
                where: { id },
            });
        } catch (error) {
            throw error;
        }
    }

    async findByName(name: string) {
        try {
            return await prisma.notificationTemplate.findUnique({
                where: { name },
                include: {
                    emailTemplate: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}

class NotificationMiscTemplateService {
    async getAllScheduledServices() {
        try {
            return await prisma.notificationTemplate.findMany({
                where: { isSchedulable: true }
            });
        } catch (error) {
            throw error;
        }
    }
}

export const notificationTemplateService = new NotificationTemplateService();
export const notificationMiscTemplateService = new NotificationMiscTemplateService();
