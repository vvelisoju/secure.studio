
import { AdvanceTransactionType, Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";

class AdvanceHistoryService {
    // Create a New Advance History Entry
    async createAdvanceHistory(data: Prisma.AdvanceHistoryUncheckedCreateInput) {
        try {
            const newEntry = await prisma.advanceHistory.create({ data });
            return newEntry
        } catch (error: any) {
            return error;
        }
    }
    async updateAdvanceHistory(data: any) {
        try {
            const updatedData = await prisma.advanceHistory.update({ where: { id: data.id }, data });
            return updatedData
        } catch (error: any) {
            return error;
        }
    }
}

class AdvanceHistoryMiscService {
    // Get total advance balance for a user, considering type
    async getUserAdvanceBalance(userId: string) {
        try {
            const given = await prisma.advanceHistory.aggregate({
                _sum: { amount: true },
                where: { userId, type: AdvanceTransactionType.GIVEN },
            });

            const repaid = await prisma.advanceHistory.aggregate({
                _sum: { amount: true },
                where: { userId, type: AdvanceTransactionType.REPAID },
            });

            const adjustment = await prisma.advanceHistory.aggregate({
                _sum: { amount: true },
                where: { userId, type: AdvanceTransactionType.ADJUSTMENT },
            });

            const totalAdvance =
                (given._sum.amount || 0) -
                (repaid._sum.amount || 0) +
                (adjustment._sum.amount || 0); // Adjustments can be positive or negative

            return {
                totalAdvance,
                given: given._sum.amount || 0,
                repaid: repaid._sum.amount || 0,
                adjustment: adjustment._sum.amount || 0,
            };
        } catch (error) {
            return error;
        }
    }

    async getAllAdvanceBalance() {
        try {
            const given = await prisma.advanceHistory.aggregate({
                _sum: { amount: true },
                where: { type: AdvanceTransactionType.GIVEN, user: { status: "ACTIVE" } },
            });

            const repaid = await prisma.advanceHistory.aggregate({
                _sum: { amount: true },
                where: { type: AdvanceTransactionType.REPAID, user: { status: "ACTIVE" } },
            });

            const adjustment = await prisma.advanceHistory.aggregate({
                _sum: { amount: true },
                where: { type: AdvanceTransactionType.ADJUSTMENT, user: { status: "ACTIVE" } },
            });

            const totalAdvance =
                (given._sum.amount || 0) -
                (repaid._sum.amount || 0) +
                (adjustment._sum.amount || 0); // Adjustments can be positive or negative

            return totalAdvance;
        } catch (error) {
            return error;
        }
    }

    async getUserAdvanceHistory(userId: string) {
        try {
            const history = await prisma.advanceHistory.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" }
            });
            const data: any = await this.getUserAdvanceBalance(userId);
            return { total: data.totalAdvance, history };
        } catch (error: any) {
            return error;
        }
    }

    async getUserGivenAdvanceHistory(userId: string) {
        try {
            const history = await prisma.advanceHistory.findMany({
                where: { userId, type: "GIVEN" },
                orderBy: { createdAt: "desc" }
            });
            return history;
        } catch (error: any) {
            return error;
        }
    }

    async generateReceiptCode() {
        const year = new Date().getFullYear();
        const count = await prisma.advanceHistory.count({
            where: { code: { startsWith: `RCPT${year}` } }
        });
        console.log(`RCPT${year}${String(count + 1).padStart(3, '0')}`);
        return `RCPT${year}${String(count + 1).padStart(3, '0')}`;
    }
}

export const advanceHistoryService = new AdvanceHistoryService();
export const advanceHistoryMiscService = new AdvanceHistoryMiscService();
