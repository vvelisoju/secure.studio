import { prisma } from "../prismaClient";
import { Prisma } from "@prisma/client";
import { DateTime } from 'luxon';
class InvoiceService {
    // Create a Invoice
    async createInvoice(data: Prisma.InvoiceUncheckedCreateInput) {
        try {
            return await prisma.invoice.create({ data });
        } catch (error) {
            throw error;
        }
    }

    async updateInvoice(data: any) {
        try {
            return await prisma.invoice.update({ where: { id: data.id }, data });
        } catch (error) {
            throw error;
        }
    }

    async getInvoice(invoiceId: any) {
        try {
            return await prisma.invoice.findUnique({ where: { id: invoiceId }, });
        } catch (error) {
            throw error;
        }
    }
}

class InvoiceMiscService {

    async generateInvoiceCode() {
        const year = new Date().getFullYear();
        const count = await prisma.invoice.count({
            where: { code: { startsWith: `IN${year}` } }
        });
        return `IN${year}${String(count + 1).padStart(3, '0')}`;
    }


    // Get all Invoices with pagination
    async getAllInvoicesOfUser(userId: string, page: number = 1, limit: number = 10) {
        try {
            const [invoices, totalCount] = await Promise.all([
                prisma.invoice.findMany({
                    where: { userId},
                    include: {
                        booking: { include: { payment: true, service: true, user: { include: { company: true } } }, }
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: "desc" }
                }),
                prisma.invoice.count({ where: { userId } })
            ]);
            return { invoices, totalCount };
        } catch (error) {
            throw error;
        }
    }

    async invoiceDetailsForDownload(id: string) {
        try {
            return prisma.invoice.findUnique({ where: { id }, include: { User: true, booking: { include: { service: { select: { name: true } }, payment: true, plan: { select: { gstValue: true } } } } } })
        } catch (error) {
            throw error;
        }
    }

    async recentInvoices(userId: string) {
        try {
            return await prisma.invoice.findMany({
                where: { userId },
                include: {
                    booking: { include: { service: true, payment: true, plan: true, invoice: true, user: true }, },
                },
                orderBy: { createdAt: 'desc', }, take: 4
            });
        } catch (error) {
            throw error;
        }
    }

    async totalFinalAmount() {
        try {
            const totalFinalAmount = await prisma.invoice.aggregate({
                _sum: {
                    finalAmount: true,
                },
                where: {
                    booking: {
                        payment: {
                            status: 'COMPLETED',
                        },
                    },
                },
            });
            return totalFinalAmount._sum.finalAmount
        } catch (error) {
            throw error;
        }
    }

    async totalFinalAmountPerMonth() {
    try {
        const invoices = await prisma.invoice.findMany({
            where: {
                createdAt: {
                    gte: DateTime.utc().startOf('year').toJSDate(),
                    lte: DateTime.utc().endOf('year').endOf('year').toJSDate(),
                },
                booking: {
                    payment: {
                        status: 'COMPLETED',
                    },
                },
            },
            select: {
                finalAmount: true,
                createdAt: true, // UTC time from DB
            },
        });

        const monthTotals: Record<number, number> = {};

        invoices.forEach(invoice => {
            // Convert UTC date to Asia/Kolkata local time
            const monthInIST = DateTime.fromJSDate(invoice.createdAt, { zone: 'utc' })
                .setZone('Asia/Kolkata')
                .month; // 1 to 12

            monthTotals[monthInIST] = (monthTotals[monthInIST] || 0) + (invoice.finalAmount || 0);
        });

        const result = Array.from({ length: 12 }, (_, i) => {
            const monthNum = i + 1;
            return {
                x: DateTime.local().set({ month: monthNum }).toFormat('LLL'), // Jan, Feb, etc.
                y: monthTotals[monthNum] || 0,
            };
        });

        return result;
    } catch (error) {
        throw error;
    }
}

}

export const invoiceService = new InvoiceService();
export const invoiceMiscService = new InvoiceMiscService();
