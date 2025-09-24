import { Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";

class AppSettingsService {
    async get() {
        try {
            return await prisma.appSetting.findUnique({ where: { id: "d7e6c23f-fccc-46ec-8a41-22d042511c15" }});
        } catch (error) {
            throw error;
        }
    }
    async update(data: Prisma.AppSettingUncheckedUpdateInput) {
        try {
            return await prisma.appSetting.update({ where: { id: "d7e6c23f-fccc-46ec-8a41-22d042511c15" }, data });
        } catch (error) {
            throw error;
        }
    }
}

class AppSettingsMiscService {
    async getGST() {
        try {
            const appSettings = await prisma.appSetting.findUnique({ where: { id: "d7e6c23f-fccc-46ec-8a41-22d042511c15" } });
            return appSettings;
        } catch (error) {
            throw error;
        }
    }
    async getCCMails() {
        try {
            const appSettings = await prisma.appSetting.findUnique({ where: { id: "d7e6c23f-fccc-46ec-8a41-22d042511c15" }, select: { ccEmails: true } });
            return appSettings?.ccEmails;
        } catch (error) {
            throw error;
        }
    }
}

export const appSettingsService = new AppSettingsService();
export const appSettingsMiscService = new AppSettingsMiscService();
