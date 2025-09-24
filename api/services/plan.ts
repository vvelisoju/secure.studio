import { prisma } from "../prismaClient";
import { PlanType } from "@prisma/client";


class PlanMiscService {
    async getPlanDetailsForOrder(id: string) {
        try {
            return await prisma.plan.findFirst({ where: { id }, include: { service: true } })
        } catch (error) {
            throw (error)
        }
    }

    async getPlanTime(type: PlanType, duration: number) {
        const startTime = new Date(); // Current UTC time
        const endTime = new Date(startTime); // Clone startTime for modification

        switch (type) {
            case "HOUR":
                endTime.setUTCHours(endTime.getUTCHours() + duration);
                break;
            case "DAY":
                endTime.setUTCDate(endTime.getUTCDate() + duration);
                break;
            case "MONTH":
                endTime.setUTCMonth(endTime.getUTCMonth() + duration);
                break;
            case "YEAR":
                endTime.setUTCFullYear(endTime.getUTCFullYear() + duration);
                break;
            default:
                throw new Error("Invalid Plan Type");
        }

        return { startTime, endTime };
    };

}

export const planMiscService = new PlanMiscService();

