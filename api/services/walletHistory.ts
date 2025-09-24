import { Prisma, User, WalletTransactionType } from "@prisma/client";
import { prisma } from "../prismaClient";

class WalletHistoryService {
    async create(data: Prisma.WalletHistoryUncheckedCreateInput) {
        try {
            return await prisma.walletHistory.create({ data })
        } catch (error) {
            throw (error)
        }
    }

}

class WalletHistoryMiscService {
    // Get total wallet balance for a user, considering type
    async getUserWalletBalance(userId: string) {
        try {
            const credited = await prisma.walletHistory.aggregate({
                _sum: { amount: true },
                where: { userId, type: WalletTransactionType.CREDIT },
            });

            const debited = await prisma.walletHistory.aggregate({
                _sum: { amount: true },
                where: { userId, type: WalletTransactionType.DEBIT },
            });


            const totalWallet=
                (credited._sum.amount || 0) -
                (debited._sum.amount || 0) 

            return {
                totalWallet,
                credited: credited._sum.amount || 0,
                debited: debited._sum.amount || 0,
            };
        } catch (error) {
            return error;
        }
    }

}


export const walletHistoryService = new WalletHistoryService();
export const walletHistoryMiscService = new WalletHistoryMiscService();

