import { Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";

export class OtpService {
    async getOtpById(id: string) {
        try {
            return await prisma.otp.findUnique({ where: { id } });
        } catch (error) {
            throw error;
        }
    }

    async getOtpByToken(otpToken: string) {
        try {
            return await prisma.otp.findUnique({ where: { otpToken } });
        } catch (error) {
            throw error;
        }
    }

    async createOtp(data: Prisma.OtpUncheckedCreateInput) {
        try {
            return await prisma.otp.create({ data });
        } catch (error) {
            throw error;
        }
    }

    async deleteOtp(id: string) {
        try {
            return await prisma.otp.delete({ where: { id } });
        } catch (error) {
            throw error;
        }
    }

    async deleteOtpByToken(otpToken: string) {
        try {
            return await prisma.otp.delete({ where: { otpToken } });
        } catch (error) {
            throw error;
        }
    }
}

export const otpService = new OtpService();
