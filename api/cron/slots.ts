import cron from 'node-cron';
import { timeSlotMiscService } from "../services/timeSlot"; // Adjust path as necessary
import { DateTime } from "luxon";
import { MeetingRoomSetting, TimeSlot } from '@prisma/client';
import { meetingRoomSettingService } from '../services/meetingRoom';

cron.schedule('0 0 1 * *', async () => {
    try {
        // Get the last created slot's end date
        const lastSlot = await timeSlotMiscService.getLastCreatedSlot() as TimeSlot;
        if (lastSlot.id) {
            const lastSlotEndDate = DateTime.fromISO(lastSlot.endTime, { zone: 'UTC' });

            // Calculate the next time range
            const nextStartDate = lastSlotEndDate.plus({ days: 1 }); // e.g., July 17th
            let nextEndDate = nextStartDate.plus({ months: 1 }); // Calculate 1 month later
            // Subtract 1 day to ensure the last date is the 15th
            nextEndDate = nextEndDate.minus({ days: 1 });

            const meetingRoomSetting = await meetingRoomSettingService.getMeetingRoomSetting() as MeetingRoomSetting;

            // Calculate the difference in days
            const daysDifference = nextEndDate.diff(nextStartDate, 'days').days + 1;

            // Create the new slots (using your existing logic)
            await timeSlotMiscService.createTimeslots({
                start: nextStartDate.toISO(),
                end: nextEndDate.toISO(),
                startTime: meetingRoomSetting.startTime,
                endTime: meetingRoomSetting.endTime,
                days: daysDifference,
                weekdays: meetingRoomSetting.weekdays, // Adjust days as needed
                id: meetingRoomSetting.id, // Meeting Room ID
                slotDuration: meetingRoomSetting.slotDuration, // Example: 1-hour slots
            });
        }
    } catch (error) {
        console.error('Error creating next time slots:', error);
    }
});
