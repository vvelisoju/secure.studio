import { CronJob } from "cron";
import { subscriptionCronService } from "../services/subscription";

export const job1 = new CronJob("*/15 * * * * *", async () => {
    try {
        await subscriptionCronService.compareStartTimeAndModifyStatus();
    } catch (error: any) {
        console.error("subscription-cron-error", error);
    }
});


