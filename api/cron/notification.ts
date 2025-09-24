import { CronJob } from "cron";
import { notificationScheduleService } from "../services/notificationSchedule";
import { notificationScheduledService } from "../services/notification";

export const midnightJob = new CronJob("0 0 * * *", async () => {
    try {
        const schedules = await notificationScheduleService.getAllSchedules();
        for (const schedule of schedules) {
            notificationScheduledService.send(schedule)
        }

    } catch (error: any) {
        console.error("midnight-cron-error", error);
    }
});


