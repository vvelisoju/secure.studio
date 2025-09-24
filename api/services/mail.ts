import { Notification } from "@prisma/client";
import { sendMail } from "../utils/mail";
import { superAdminService } from "./superAdmin";

const mailHandlers: { [key: string]: (data: any, cc?: string | null) => Promise<void> } = {
    registeredUser: async (data) => {
        sendMail("registeredUser", data, { to: data.email },);

        const admins = await superAdminService.getAllAdmins();
        for (let admin of admins) {
            sendMail("registeredUs", data, { to: admin.user.email });
        }
    },

    otpRequest: async (data) => {
        sendMail("otpRequest", data, { to: data.email });
    },

    getInTouch: async (data) => {
        sendMail("getInTouchUser", data, { to: data.email });

        const admins = await superAdminService.getAllAdmins();
        for (let admin of admins) {
            sendMail("getInTouchUs", data, { to: admin.user.email });
        }
    },

    subscriptionExpiringSoon: async (data, cc) => {
        sendMail("subscriptionExpiringSoon", data, { to: data.email, cc });
    },

    subscriptionExpired: async (data, cc) => {
        sendMail("subscriptionExpired", data, { to: data.email, cc });
    },

    newSubscription: async (data, cc) => {
        sendMail("newSubscription", data, { to: data.email, cc });
    },

    updatedSubscription: async (data, cc) => {
        sendMail("updatedSubscription", data, { to: data.email, cc });
    },

    meetingRoomConfirmation: async (data, cc) => {
        sendMail("meetingRoomConfirmation", data, { to: data.email, cc });
    },
    
    companyInvitation: async (data, cc) => {
        sendMail("companyInvitation", data, { to: data.email, cc });
    },
};



class MailService {
    async send(notification: Notification) {
        if (notification.templateName) {
            const handler = mailHandlers[notification?.templateName];
            if (handler) await handler(notification.placeHolders, notification?.ccEmails);
        }
    }
}

export const mailService = new MailService();

