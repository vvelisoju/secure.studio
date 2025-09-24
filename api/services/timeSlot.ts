import { prisma } from "../prismaClient";
import { Prisma } from "@prisma/client";
import { DateTime } from 'luxon';
export class TimeSlotService {
    async getTimeslot(id: string) {
        try {
            return await prisma.timeSlot.findUnique({ where: { id } });
        } catch (error) {
            throw (error)
        }
    }

    async getAllTimeslot() {
        try {
            return await prisma.timeSlot.findMany();
        } catch (error) {
            throw (error)
        }
    }

    async createTimeSlot(data: any) {
        try {
            return await prisma.timeSlot.create({ data });
        } catch (error) {
            throw (error)
        }
    }

    async updateTimeslot(data: any) {
        try {
            return await prisma.timeSlot.update({ where: { id: data?.id }, data });
        } catch (error) {
            throw (error)
        }
    }

    async deleteTimeslot(id: string) {
        try {
            return await prisma.timeSlot.delete({ where: { id } });
        } catch (error) {
            throw (error)
        }
    }
}

export class TimeSlotMiscService {

    async createTimeslots(data: any) {
        try {
            const meetingRoomId = data?.id;
            const startTime = data?.startTime; // e.g., "09:00"
            const endTime = data?.endTime;     // e.g., "17:00"
            const slotDuration = data?.slotDuration; // in minutes
            const weekdays = data?.weekdays; // e.g., ['Monday', 'Tuesday', ...]

            const timeSlots = [];
            const zone = 'utc'; // Always work in UTC

            const startDate = DateTime.fromJSDate(new Date(data.start), { zone });
            const totalDays = data.days;

            for (let i = 0; i <= totalDays; i++) {
                const currentDate = startDate.plus({ days: i });
                const dayOfWeek = currentDate.toFormat('cccc'); // "Monday", etc.

                if (!weekdays.includes(dayOfWeek)) continue;

                // Check if any slot is already booked for this date
                const startOfDay = currentDate.startOf('day');
                const isAnySlotBooked = await prisma.timeSlot.findFirst({
                    where: {
                        meetingRoomSettingId: meetingRoomId,
                        startTime: {
                            gte: startOfDay.toJSDate().toISOString(),
                        },
                        isBooked: true
                    }
                });

                if (isAnySlotBooked) {
                    console.log(`Skipping ${currentDate.toISODate()} - slots already booked.`);
                    continue;
                }

                // Set day start and end using provided time
                const startDateTime = currentDate.set({
                    hour: parseInt(startTime.split(':')[0]),
                    minute: parseInt(startTime.split(':')[1]),
                });

                const endDateTime = currentDate.set({
                    hour: parseInt(endTime.split(':')[0]),
                    minute: parseInt(endTime.split(':')[1]),
                });

                let slotStart = startDateTime;

                while (slotStart < endDateTime) {
                    const slotEnd = slotStart.plus({ minutes: slotDuration });

                    timeSlots.push({
                        meetingRoomSettingId: meetingRoomId,
                        startTime: slotStart.toUTC().toISO(), // Always save in UTC
                        endTime: slotEnd.toUTC().toISO()
                    });

                    slotStart = slotEnd;
                }
            }

            if (timeSlots.length > 0) {
                await prisma.timeSlot.createMany({ data: timeSlots as any });
                console.log(`✅ Created ${timeSlots.length} time slots`);
            } else {
                console.log("⚠️ No time slots created.");
            }

        } catch (error) {
            console.error("❌ Error creating time slots:", error);
            throw error;
        }
    }

    async getTimeslotsBookedInFuture(data: any) {
        return await prisma.timeSlot.findMany({ where: { startTime: { gte: data.start }, isBooked: true } })
    }

    async getLastCreatedSlot (){
        const lastSlot = await prisma.timeSlot.findFirst({
            orderBy: {
                endTime: 'desc', // Get the most recent slot
            },
            take: 1,
        });
    
        return lastSlot;
    };

    async getTimeSlotsOfUserByUserId(userId: any) {
        try {
            return await prisma.timeSlot.findMany({ where: { userId } })
        } catch (error) {
            throw error;
        }
    }

    async deleteTimeslotByMeetingId(meetingRoomSettingId: string) {
        try {
            return await prisma.timeSlot.deleteMany({ where: { meetingRoomSettingId, isBooked: false } });
        } catch (error) {
            throw (error)
        }
    }

    async getAllTimeslotByDates(data: any) {
        try {
            return await prisma.timeSlot.findMany({ where: { startTime: { gte: data.startTime }, endTime: { lt: data.endTime }, bookingId: null }, orderBy: { startTime: "asc" } });
        } catch (error) {
            throw (error)
        }
    }

    async bookSlots(userId: string, slotIds: any) {
        try {
            const result = await prisma.$transaction(async (tx) => {
                // 1. Fetch all the slots in the request
                const slots = await tx.timeSlot.findMany({
                    where: {
                        id: { in: slotIds }
                    }
                });

                // 2. Check if all are unbooked
                const alreadyBooked = slots.find(slot => slot.isBooked);
                if (alreadyBooked) {
                    throw { status: 409, message: "One or more slots are already booked" };
                }

                // 3. Update all slots with isBooked = true and assign userId
                await tx.timeSlot.updateMany({
                    where: {
                        id: { in: slotIds }
                    },
                    data: {
                        isBooked: true,
                        userId: userId
                    }
                });

                return true;
            });
            return result;
        } catch (error) {
            throw (error)
        }
    }

    async updateManySlotsForOnlinePayment(slots: any, data: Prisma.TimeSlotUncheckedUpdateInput) {
        return await prisma.timeSlot.updateMany({ where: { id: { in: slots } }, data })
    }

    async getTimeSlotsByBookingId(userId: any) {
        try {
            return await prisma.timeSlot.findMany({ where: { userId } })
        } catch (error) {
            throw error;
        }
    }

}

export const timeSlotService = new TimeSlotService();
export const timeSlotMiscService = new TimeSlotMiscService();