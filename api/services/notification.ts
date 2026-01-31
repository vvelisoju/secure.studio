import { AppSetting, Notification, NotificationChannel, NotificationSchedule, NotificationTemplate, Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";
import { mailService } from "./mail";
import { subscriptionMiscService } from "./subscription";
import { userService } from "./user";
import { convertDatePrimaryStyle, convertTimePrimaryStyle } from "../utils/date";
import { notificationTemplateService } from "./notificationTemplate";
import { appSettingsService } from "./appSetting";

export class NotificationService {
    async getNotification(id: string) {
        try {
            return await prisma.notification.findUnique({ where: { id } });
        } catch (error) {
            throw error;
        }
    }

    async getAllNotificationsForUser(userId: string) {
        try {
            return await prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            throw error;
        }
    }

    async createNotification(data: Prisma.NotificationUncheckedCreateInput) {
        try {
            const notification: Notification = await prisma.notification.create({ data });
            if (notification.templateName) {
                const notificationTemplate = await notificationTemplateService.findByName(notification.templateName) as NotificationTemplate;
                if (notificationTemplate && notificationTemplate.channel && notificationTemplate.channel.includes("EMAIL")) {
                    mailService.send(notification);
                }
                // Add if whatsapp or inApp are included too.
            }
            return;
        } catch (error) {
            throw error;
        }
    }

    async updateNotification(id: string, data: any) {
        try {
            return await prisma.notification.update({
                where: { id },
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteNotification(id: string) {
        try {
            return await prisma.notification.delete({ where: { id } });
        } catch (error) {
            throw error;
        }
    }

    async markAsRead(id: string) {
        try {
            return await prisma.notification.update({
                where: { id },
                data: { isRead: true },
            });
        } catch (error) {
            throw error;
        }
    }
}


const scheduleMailHandlers: { [key: string]: (data: any, channel: NotificationChannel[]) => Promise<void> } = {
    subscriptionExpiringSoon: async (data, channel) => {
        const { daysBefore } = data;
        const subscriptions = await subscriptionMiscService.getSubscriptionsEndingInDays(daysBefore);
        const appSetting = await appSettingsService.get() as AppSetting;

        for (let sub of subscriptions) {
            const user = await userService.getUser(sub.createdBy);
            const notificationData: Prisma.NotificationUncheckedCreateInput = {
                userId: user?.id,
                channel,
                templateName: "subscriptionExpiringSoon",
                placeHolders: {
                    email: user?.email,
                    service: sub.service.name,
                    daysLeft: sub.daysLeft,
                    name: user?.name,
                    plan: sub.plan.name,
                    expiryDate: convertDatePrimaryStyle(sub.endTime) + " , " + convertTimePrimaryStyle(sub.endTime)
                },
                ccEmails: appSetting.ccEmails
            }

            await notificationService.createNotification(notificationData);
        }
    },
    subscriptionExpired: async (data, channel) => {
        const { daysBefore } = data;
        const subscriptions = await subscriptionMiscService.getSubscriptionsEndingInDays(daysBefore);

        for (let sub of subscriptions) {
            const user = await userService.getUser(sub.createdBy);
            const notificationData: Prisma.NotificationUncheckedCreateInput = {
                userId: user?.id,
                channel,
                templateName: "subscriptionExpired",
                placeHolders: {
                    email: user?.email,
                    service: sub.service.name,
                    daysLeft: sub.daysLeft,
                    name: user?.name,
                    plan: sub.plan.name,
                    expiryDate: convertDatePrimaryStyle(sub.endTime) + " , " + convertTimePrimaryStyle(sub.endTime)
                }
            }
            await notificationService.createNotification(notificationData);
        }
    },

};



class NotificationScheduledService {
    async send(notificationSchedule: NotificationSchedule) {
        const notificationTemplate = await notificationTemplateService.getTemplate(notificationSchedule.notificationTemplateId) as NotificationTemplate;
        const handler = scheduleMailHandlers[notificationTemplate.name];
        if (handler) handler(notificationSchedule, notificationTemplate.channel);
    }
}



export const notificationService = new NotificationService();
export const notificationScheduledService = new NotificationScheduledService();