import { Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";
import { getTimeLeft, getTimeUntilStart } from "../utils/date";


class UserSubscriptionService {
    async createUserSubscription(data: Prisma.UserSubscriptionUncheckedCreateInput) {
        try {
            return await prisma.userSubscription.create({ data })
        } catch (error) {
            throw (error)
        }
    }

    async updateUserSubscription(userId: string, subscriptionId: string, data: Prisma.UserSubscriptionUpdateInput) {
        try {
            return await prisma.userSubscription.update({
                where: {
                    userId_subscriptionId: {
                        userId: userId,
                        subscriptionId: subscriptionId,

                    }
                }, data
            })
        } catch (error) {
            throw (error)
        }
    }
}



class UserSubscriptionMiscService {
    async getSubscriptionsOfUser(userId: string, page: number = 1, limit: number = 10) {
        try {
            const now = new Date();
            const userSubscriptions = await prisma.userSubscription.findMany({
                where: { userId, subscription: { status: { notIn: ["HOLD"] } }, user: { status: "ACTIVE" } },
                orderBy: { createdAt: "desc" },
                include: {
                    subscription: { include: { service: true, booking: { include: { plan: true, invoice: true } }, UserSubscription: { include: { user: true } } } }
                },
                skip: (page - 1) * limit,
                take: limit,
            });
            // Add timeLeft and isStarted key to each booking
            const updatedSubscriptions = userSubscriptions.map((userSubscription: any) => {
                const isStarted = userSubscription.subscription.startTime <= now;
                return {
                    ...userSubscription.subscription,
                    isStarted,
                    timeLeft: isStarted ? getTimeLeft(userSubscription.subscription.endTime) : getTimeUntilStart(userSubscription.subscription.startTime)
                };
            });

            return { subscriptions: updatedSubscriptions };
        } catch (error) {
            throw error;
        }
    }

    async getAllUsersofAssignedByCompanyAdmin(assignedBy: string, page: number = 1, limit: number = 10) {
        try {
            const now = new Date();
            const userSubscriptions = await
                prisma.userSubscription.findMany({
                    where: { assignedBy, subscription: { endTime: { gt: now }, }, user: { status: "ACTIVE" } },
                    orderBy: { subscription: { endTime: 'asc' } },
                    include: {
                        subscription: { include: { service: true } },
                        user: true
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                });


            const employees = userSubscriptions.map(item => {
                return { ...item?.user, subscription: item?.subscription }
            })
            const serialNumbers = Array.from({ length: employees.length }, (_, i) => (page - 1) * limit + i + 1);
            const users = employees.map((user, index) => ({ ...user, serialNumber: serialNumbers[index] }));
            return { users, serialNumbers };
        } catch (error) {
            throw error;
        }
    }


    async getActiveSubscriptions(userId: string) {
        try {
            const userSubscriptions: any = await prisma.userSubscription.findMany({
                where: { userId, subscription: { status: "ACTIVE", booking: { payment: { status: "COMPLETED" } } }, },
                include: { subscription: { include: { service: true } } },
                orderBy: { subscription: { startTime: "asc" } },
                take: 3,
            });
            const subscriptions = userSubscriptions.map((userSub: any) => userSub.subscription);
            return subscriptions;
        } catch (error) {
            throw (error)
        }
    }

    async checkFirstSubscriptionForReferralGift(userId: string) {
        const subscriptions = await prisma.userSubscription.findMany({ where: { userId, subscription: { booking: { payment: { status: "COMPLETED" } } } } });
        return subscriptions.length === 1;
    }
}


export const userSubscriptionMiscService = new UserSubscriptionMiscService();
export const userSubscriptionService = new UserSubscriptionService();