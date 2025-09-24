
import { DateTime } from "luxon";

export const convertDatePrimaryStyle = (utcDate?: any): string => {
    const date = utcDate && !isNaN(new Date(utcDate).getTime())
        ? new Date(utcDate)
        : new Date(); // fallback to current date
    return date.toLocaleDateString("en-US", {
        year: "numeric",  // Example: 2025
        month: "long",    // Example: February
        day: "numeric",   // Example: 28
        timeZone: "Asia/Kolkata"
    });
};

export const convertTimePrimaryStyle = (utcDate?: any): string => {
    const date = utcDate && !isNaN(new Date(utcDate).getTime())
        ? new Date(utcDate)
        : new Date(); // fallback to current date
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Ensures AM/PM format
        timeZone: "Asia/Kolkata"
    });
};

// Helper function to calculate time left until endTime
export const getTimeLeft = (endDate: Date): string => {
    return formatTimeDifference(new Date(), endDate) + " left";
};

// Helper function to calculate time until startTime
export const getTimeUntilStart = (startDate: Date): string => {
    return formatTimeDifference(new Date(), startDate) + " to start";
};

// Function to format time difference into short format
const formatTimeDifference = (fromDate: Date, toDate: Date): string => {
    const zone = "Asia/Kolkata";

    const from = DateTime.fromJSDate(fromDate, { zone });
    const to = DateTime.fromJSDate(toDate, { zone });
    if (to <= from) return "Starting soon";

    // Get the diff in full units
    const diff = to.diff(from, ['years', 'months', 'days', 'hours', 'minutes']).toObject();

    const parts: string[] = [];

    if (diff.years) parts.push(`${Math.floor(diff.years)}y`);
    if (diff.months) parts.push(`${Math.floor(diff.months)}mo`);
    if (diff.days) parts.push(`${Math.floor(diff.days)}d`);
    if (diff.hours) parts.push(`${Math.floor(diff.hours)}h`);
    if (diff.minutes) parts.push(`${Math.floor(diff.minutes)}m`);

    return parts.length ? parts.join(" ") : "Less than a minute";
};


export const getStatusForSubscription = (startTime: string, endTime: string) => {
    const currentTime = new Date().toISOString(); // Get current UTC time

    if (currentTime > new Date(endTime).toISOString()) {
        return 'INACTIVE';
    } else if (new Date(startTime).toISOString() > currentTime) {
        return 'HOLD';
    } else {
        return 'ACTIVE';
    }
}

export function getNextThreeMonthsDayRange() {
    const start = DateTime.utc(); // Exact current UTC date and time
    const end = start.plus({ months: 3 });
    const days = Math.ceil(end.diff(start, "days").days);
    return {
        start: start.toJSDate(), // JS Date object with full timestamp
        end: end.toJSDate(),
        days,
    };
}

export function formatMonthRange(startDateUTC: string, endDateUTC: string): string {
    const start = DateTime.fromISO(startDateUTC, { zone: 'utc' });
    const end = DateTime.fromISO(endDateUTC, { zone: 'utc' });

    const format = (dt: DateTime) => dt.toFormat('LLLL, yyyy'); // e.g., "May, 2025"

    if (start.month === end.month && start.year === end.year) {
        return format(start);
    } else {
        return `${format(start)} to ${format(end)}`;
    }
}