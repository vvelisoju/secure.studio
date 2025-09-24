import { Prisma } from "@prisma/client";
import { prisma } from "../prismaClient";
import { getTimeLeft, getTimeUntilStart } from "../utils/date";
import { DateTime } from "luxon";
import { invoiceSettingsService } from "./invoiceSetting";

class SubscriptionService {
    async createSubscription(data: Prisma.SubscriptionUncheckedCreateInput) {
        try {
            return await prisma.subscription.create({ data });
        } catch (error) {
            throw (error)
        }
    }

    async get(id: string) {
        try {
            return await prisma.subscription.findUnique({ where: { id }, include: { booking: { include: { invoice: true } } } });
        } catch (error) {
            throw (error)
        }
    }

    async updateSubscription(data: any) {
        try {

            const now = DateTime.utc();

            if (data.startTime && data.endTime) {
                const start = DateTime.fromISO(data.startTime.toString());
                const end = DateTime.fromISO(data.endTime.toString());

                if (now > end) {
                    data.status = "INACTIVE"; // Not started yet
                } else if (now >= start && now <= end) {
                    data.status = "ACTIVE"; // Within valid range
                }

            }
            return await prisma.subscription.update({
                where: { id: data?.id },
                data,
                include: {
                    booking: {
                        select: {
                            invoice: true,
                        },
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }
}


class SubscriptionMiscService {

    async compareDatesAndUpdateStatus(subId: string) {

    }

    async checkDuplicateSubscription(userId: string, serviceId: string, planId: string) {
        try {
            // const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscriptions: true } });
            // const subscriptions = user?.subscriptions;
            // // Check if any subscription has the same serviceId and planId
            // const duplicateSubscription = subscriptions?.find(
            //     (subscription) => subscription.serviceId === serviceId && subscription.planId === planId
            // );
            return !!true; // Return true if duplicate found, false 
        } catch (error) {
            throw (error)
        }
    }

    async increaseSubscriptionEmployeesFilled(id: any) {
        try {
            const company: any = await prisma.subscription.findUnique({ where: { id } })
            return await prisma.subscription.update({ where: { id }, data: { employeesFilled: company?.employeesFilled + 1 } });
        } catch (error) {
            throw (error)
        }
    }

    async decreaseSubscriptionEmployeesFilled(id: any) {
        try {
            const company: any = await prisma.subscription.findUnique({ where: { id } })
            return await prisma.subscription.update({ where: { id }, data: { employeesFilled: company?.employeesFilled - 1 } });
        } catch (error) {
            throw (error)
        }
    }

    async getSubscriptionsEndingInDays(daysBefore: number[]) {
        try {
            const dateRanges = daysBefore.map((days) => {
                const targetDate = DateTime.now().plus({ days }).startOf("day");
                return {
                    gte: targetDate.toJSDate(),
                    lte: targetDate.endOf("day").toJSDate(),
                };
            });

            // Combine all ranges using OR
            const subscriptions = await prisma.subscription.findMany({
                where: {
                    OR: dateRanges.map((range) => ({
                        endTime: {
                            gte: range.gte,
                            lte: range.lte,
                        },
                    })),
                    status: { not: "DELETED" },
                },
                include: { service: true, plan: true }
            });

            // Add `daysLeft` field
            const enrichedSubscriptions = subscriptions.map((sub) => {
                const daysLeft = Math.ceil(
                    DateTime.fromJSDate(sub.endTime).diffNow("days").days
                );
                return { ...sub, daysLeft };
            });

            return enrichedSubscriptions;
        } catch (error) {
            throw (error)
        }
    }


    async getExpiredSubscriptions() {
        try {
            const now = DateTime.now().startOf("day").toJSDate();

            const subscriptions = await prisma.subscription.findMany({
                where: {
                    status: { not: "DELETED" },
                    endTime: {
                        lt: now,
                    },
                },
                include: { service: true, plan: true },
            });

            return subscriptions;
        } catch (error) {
            throw error;
        }
    }

    async getExpiredSubscriptionsOfUser(userId: string) {
        try {
            const now = DateTime.now().startOf("day").toJSDate();

            const subscriptions = await prisma.subscription.findMany({
                where: {
                    status: { not: "DELETED" },
                    UserSubscription: { some: { userId } }, // filter by user
                    endTime: {
                        lt: now, // already expired
                    },
                },
                include: { service: true, plan: true },
            });

            // Add `daysLeft` field
            const enrichedSubscriptions = subscriptions.map((sub) => {
                const daysLeft = Math.ceil(
                    DateTime.fromJSDate(sub.endTime).diffNow("days").days
                );
                return { ...sub, daysLeft };
            });

            return enrichedSubscriptions;
        } catch (error) {
            throw error;
        }
    }

    async getExpiringSoonSubscriptionsOfUser(userId: string) {
        try {
            const now = DateTime.now().startOf("day");
            const threeDaysLater = now.plus({ days: 3 }).endOf("day").toJSDate();

            const subscriptions = await prisma.subscription.findMany({
                where: {
                    status: { not: "DELETED" },
                    UserSubscription: { some: { userId } }, // filter by user
                    endTime: {
                        gte: now.toJSDate(),     // not yet expired
                        lte: threeDaysLater,     // expiring soon (<= 3 days)
                    },
                },
                include: { service: true, plan: true },
            });

            // Add `daysLeft` field
            const enrichedSubscriptions = subscriptions.map((sub) => {
                const daysLeft = Math.ceil(
                    DateTime.fromJSDate(sub.endTime).diffNow("days").days
                );
                return { ...sub, daysLeft };
            });

            return enrichedSubscriptions;
        } catch (error) {
            throw error;
        }
    }


    async getExpiringSoonSubscriptionsCount() {
        try {
            const now = DateTime.now().startOf("day").toJSDate();
            const threeDaysLater = DateTime.now().plus({ days: 3 }).endOf("day").toJSDate();

            const count = await prisma.subscription.count({
                where: {
                    status: { not: "DELETED" },
                    endTime: {
                        gte: now,       // still active
                        lte: threeDaysLater, // expiring within 3 days
                    },
                },
            });

            return count;
        } catch (error) {
            throw error;
        }
    }
}


class SubscriptionCronService {
    async compareStartTimeAndModifyStatus() {
        try {
            const now = new Date();
            const currentTime = DateTime.now();

            // Bring all subscriptions which are created 12 mins ago and if still the payment is not COMPLETED delete them.
            const twelveMinsAgo = currentTime.minus({ minutes: 12 });
            const pendingPaymentSubs = await prisma.subscription.findMany({
                where: {
                    status: 'HOLD',
                    createdAt: {
                        lt: twelveMinsAgo.toJSDate(), // Prisma expects JS Date
                    },
                    booking: {
                        payment: {
                            status: {
                                not: 'COMPLETED',
                            },
                        },
                    },
                },
            }); const pendingIds = pendingPaymentSubs.map(data => data.id);
            await prisma.userSubscription.deleteMany({ where: { subscriptionId: { in: pendingIds } } });
            await prisma.subscription.deleteMany({ where: { id: { in: pendingIds } } });

            // to update status to ACTIVE which crossed StartTime
            await prisma.subscription.updateMany({ where: { startTime: { lte: now }, status: "HOLD", booking: { payment: { status: { equals: "COMPLETED" } } } }, data: { status: "ACTIVE" } });


            // Find subscriptions to mark INACTIVE
            const toInactivate = await prisma.subscription.findMany({
                where: {
                    endTime: { lte: now },
                    status: "ACTIVE",
                },
                include: {
                    booking: {
                        include: { user: true },
                    },
                    plan: true,
                },
            });

            const inactiveIds = toInactivate.map(s => s.id);

            // Mark them as INACTIVE
            await prisma.subscription.updateMany({
                where: {
                    id: { in: inactiveIds },
                },
                data: {
                    status: "INACTIVE",
                },
            });
            // for (const sub of toInactivate) {
            //     console.log("subs", sub)
            //     const oldInvoice: any = await prisma.invoice.findUnique({
            //         where: { bookingId: sub.bookingId, },
            //         include: { User: { select: { taxInvoice: true } } }
            //     });

            //     if (!oldInvoice?.dueDate) continue;

            //     const effectiveDate = DateTime.fromJSDate(oldInvoice.dueDate);
            //     const dueDate = effectiveDate.plus({ months: 1 });

            //     const invoiceSettings: any = await invoiceSettingsService.get();
            //     const invoiceCode: any = oldInvoice?.User.taxInvoice ? invoiceSettings?.taxInvoiceNumber : invoiceSettings?.invoiceNumber;


            //     await prisma.invoice.create({
            //         data: {
            //             userId: oldInvoice.userId,
            //             code: JSON.stringify(invoiceCode),
            //             effectiveDate: effectiveDate.toJSDate(),
            //             dueDate: dueDate.toJSDate(),
            //             description: oldInvoice.description,
            //             SAC: oldInvoice.SAC,
            //             HSN: oldInvoice.HSN,
            //             perQuantityAmount: oldInvoice.perQuantityAmount,
            //             quantity: oldInvoice.quantity,
            //             totalAmount: oldInvoice.totalAmount,
            //             discount: oldInvoice.discount,
            //             taxableAmount: oldInvoice.taxableAmount,
            //             cgst: oldInvoice.cgst,
            //             sgst: oldInvoice.sgst,
            //             cgstAmount: oldInvoice.cgstAmount,
            //             sgstAmount: oldInvoice.sgstAmount,
            //             finalAmount: oldInvoice.finalAmount,
            //             headingsJson: oldInvoice.headingsJson as any,
            //             poNumber: oldInvoice.poNumber,
            //             amountPaid: 0,
            //             balanceDue: oldInvoice.finalAmount,
            //             periodOfService: `${effectiveDate.toFormat('LLLL yyyy')}`,
            //             type: oldInvoice.type,
            //             status: true,
            //         },
            //     });

            //     await invoiceSettingsService.update({
            //         taxInvoiceNumber: oldInvoice?.User.taxInvoice ? invoiceSettings?.taxInvoiceNumber + 1 : invoiceSettings?.taxInvoiceNumber,
            //         invoiceNumber: oldInvoice?.User.taxInvoice ? invoiceSettings?.invoiceNumber : invoiceSettings?.invoiceNumber + 1,
            //     })
            // }



        } catch (error) {
            throw error;
        }
    }
}


export const subscriptionService = new SubscriptionService();
export const subscriptionMiscService = new SubscriptionMiscService();
export const subscriptionCronService = new SubscriptionCronService();