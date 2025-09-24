import { prisma } from "../prismaClient";
import { Prisma } from "@prisma/client";
import { getTimeLeft, getTimeUntilStart } from "../utils/date";
import { paymentMiscService } from "./payment";

class BookingService {
    // Get all bookings with pagination
    async getAllBookingsOfUser(userId: string, page: number = 1, limit: number = 10) {
        try {
            const [bookings, totalCount] = await Promise.all([
                prisma.booking.findMany({
                    where: { userId },
                    include: {
                        service: true,
                        payment: { select: { id: true, amount: true, code: true, status: true } },
                        plan: { select: { defaultValue: true, duration: true } },
                        invoice: true
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { createdAt: "desc" }
                }),
                prisma.booking.count({ where: { userId } })
            ]);
            return { bookings, totalCount };
        } catch (error) {
            throw error;
        }
    }

    // Get a single booking by ID
    async getBookingById(id: string) {
        try {
            return await prisma.booking.findUnique({ where: { id }, include: { payment: true, plan: { select: { id: true, duration: true, serviceId: true } } } });
        } catch (error) {
            throw error;
        }
    }

    // Create a new booking
    async createBooking(data: Prisma.BookingUncheckedCreateInput) {
        try {
            return await prisma.booking.create({
                data, include: { plan: true, user: true, service: true }
            });
        } catch (error) {
            throw error;
        }
    }

    // Update a booking
    async updateBooking(id: string, data: Prisma.BookingUncheckedUpdateInput) {
        try {
            return await prisma.booking.update({ where: { id }, data });
        } catch (error) {
            throw error;
        }
    }
}

class BookingMiscService {
    async generateBookingCode() {
        const year = new Date().getFullYear();
        const count = await prisma.booking.count({
            where: { code: { startsWith: `BK${year}` } }
        });
        return `BK${year}${String(count + 1).padStart(3, '0')}`;
    }

    // Update a booking
    async updateBookingForPaymentVerification(id: string, data: Prisma.BookingUncheckedUpdateInput) {
        try {
            return await prisma.booking.update(
                {
                    where: { id }, data,
                    include: {
                        service: true,
                        plan: true,
                        payment: true,
                        user: { include: { company: true } },
                        invoice: true,
                        timeSlots: true,
                    }
                });
        } catch (error) {
            throw error;
        }
    }

    async getBookingDetailsByOrderId(orderId: string) {
        try {
            return await prisma.booking.findFirst(
                {
                    where: { payment: { razorPayOrderId: orderId } },
                    include: {
                        service: true,
                        plan: true,
                        payment: true,
                        user: { include: { company: true } },
                        invoice: true
                    }
                });
        } catch (error) {
            throw error;
        }
    }

    // Get all active bookings with pagination
    async getAllActiveBookingsOfUser(userId: string, page: number = 1, limit: number = 10) {
        try {
            const now = new Date();

            const [bookings, totalCount] = await Promise.all([
                prisma.booking.findMany({
                    where: { userId, endTime: { gt: now }, status: "CONFIRMED" },
                    include: {
                        service: true,
                        payment: { select: { id: true, amount: true, code: true, status: true } },
                        plan: { select: { defaultValue: true, duration: true } },
                        invoice: true
                    },
                    skip: (page - 1) * limit,
                    take: limit,
                    orderBy: { endTime: "asc" } // Sort by soonest expiry
                }),
                prisma.booking.count({ where: { userId, endTime: { gt: now }, status: "CONFIRMED" } })
            ]);

            // Add timeLeft and isStarted key to each booking
            const updatedBookings = bookings.map((booking: any) => {
                const isStarted = booking.startTime <= now;
                return {
                    ...booking,
                    isStarted,
                    timeLeft: isStarted ? getTimeLeft(booking.endTime) : getTimeUntilStart(booking.startTime)
                };
            });

            return { bookings: updatedBookings, totalCount };
        } catch (error) {
            throw error;
        }
    }

    async updateBookingStatusToCancelWithId(id: string,) {
        try {
            return await prisma.booking.updateMany(
                {
                    where: { id }, data: { status: "CANCELLED" },
                });
        } catch (error) {
            throw error;
        }
    }

    async fetchAllBookingsWithSubscriptionId(subscriptionId: string,) {
        try {
            const bookings = await prisma.booking.findMany(
                { where: { subscriptionId }, select: { id: true, payment: true, invoice: true } });
            return {
                bookingIds: bookings.map(booking => booking?.id),
                paymentIds: bookings.map(booking => booking?.payment?.id),
                invoiceIds: bookings.map(booking => booking?.invoice?.id),
            }
        } catch (error) {
            throw error;
        }
    }

    // Update a booking
    async updateBookingStatusForQuoted(id: string, data: Prisma.BookingUncheckedUpdateInput) {
        try {
            return await prisma.booking.update({ where: { id }, data, include: { payment: { select: { id: true } } } });
        } catch (error) {
            throw error;
        }
    }
}

export const bookingService = new BookingService();
export const bookingMiscService = new BookingMiscService();
