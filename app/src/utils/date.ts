// utils/dateUtils.tsx
import { DateTime } from "luxon";


export const convertDateTimeFormat = (newDateTime: string) => {
    const dt = DateTime.fromISO(newDateTime);
    const formattedDt = dt.toFormat('yyyy-MM-dd\'T\'HH:mm');

    return formattedDt;
};

export const convertDateFormat = (newDate: string) => {
    const dt = DateTime.fromISO(newDate);
    if (!dt.isValid) {
        throw new Error("Invalid date input");
    }
    return dt.toFormat("yyyy-MM-dd");
};

export function convertUTCToIST(time: string) {
    return DateTime.fromFormat(time, 'HH:mm', { zone: 'UTC' })
        .setZone('Asia/Kolkata')
        .toFormat('hh:mm a');
}


export const convertDatePrimaryStyle = (utcDate: string): string => {
    if (!utcDate) return "Not-Provided";

    const date = new Date(utcDate);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleDateString("en-US", {
        // weekday: "long",  // Example: Monday
        year: "numeric",  // Example: 2025
        month: "long",    // Example: February
        day: "numeric"    // Example: 28
    });
};

export const convertDateSecondaryStyle = (utcDate: string): string => {
    if (!utcDate) return "Not-Provided";

    const date = new Date(utcDate);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString("en-US", {
        year: "numeric",  // Example: 2025
        month: "long",    // Example: February
        day: "numeric",   // Example: 28
        hour: "numeric",  // Example: 05
        minute: "2-digit", // Example: 30
        hour12: true      // Enable AM/PM format
    });
};

export function convertTimeSlots(timeSlots: any) {
    const result: any = {
        morning: [],
        afternoon: [],
        evening: [],
    };

    timeSlots.forEach((slot: any) => {
        const startTime = new Date(slot.startTime);
        const hours = startTime.getHours();
        const minutes = startTime.getMinutes();
        const ampm = hours < 12 ? 'AM' : 'PM';
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;

        const timeSlot: any = {
            value: slot.id,
            title: formattedTime,
            isBooked: slot.isBooked,
        };

        if (hours < 12) {
            result.morning.push(timeSlot);
        } else if (hours < 17) {
            result.afternoon.push(timeSlot);
        } else {
            result.evening.push(timeSlot);
        }
    });

    return result;
}



export const getTimeLeft = (endDate: string): string => {
    const now = new Date(); // Current UTC time
    const end = new Date(endDate);

    if (end <= now) return "Expired";

    let diffMs = end.getTime() - now.getTime();

    const units = [
        { label: "y", ms: 1000 * 60 * 60 * 24 * 365 }, // 1 year
        { label: "mo", ms: 1000 * 60 * 60 * 24 * 30 }, // 1 month (approx)
        { label: "d", ms: 1000 * 60 * 60 * 24 },       // 1 day
        { label: "h", ms: 1000 * 60 * 60 },           // 1 hour
        { label: "m", ms: 1000 * 60 }                 // 1 minute
    ];

    const parts: string[] = [];

    for (const unit of units) {
        const value = Math.floor(diffMs / unit.ms);
        if (value > 0) {
            parts.push(`${value}${unit.label}`);
            diffMs -= value * unit.ms;
        }
    }

    return parts.length ? parts.join(" ") + " left" : "Less than a minute left";
};

export const convertToUTC = (localDateTime: string): string => {
    return new Date(localDateTime).toISOString();
};

export const getNextMonthFirstMidnightUTC = (): string => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1); // 1st of next month at local midnight
    nextMonth.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
    return nextMonth.toISOString(); // Convert to UTC ISO string
};

export const getEndOfMonthEndTimeLocal = (startTime: string): string => {
    const date = new Date(startTime);

    // Move to next month, then go to the 0th day to get the last day of the original month
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 0, 0); // End of the day in local time

    const year = endOfMonth.getFullYear();
    const month = String(endOfMonth.getMonth() + 1).padStart(2, '0');
    const day = String(endOfMonth.getDate()).padStart(2, '0');
    const hours = String(endOfMonth.getHours()).padStart(2, '0');
    const minutes = String(endOfMonth.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function convertToUTC2(dateStr: string | null): string | null {
    if (!dateStr) return null;
    return DateTime.fromISO(dateStr, { zone: 'local' }).toUTC().toISO();
}

export function convertDateToUTC(dateString: string) {
    const date = new Date(dateString);
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hour = String(utcDate.getHours()).padStart(2, '0');
    const minute = String(utcDate.getMinutes()).padStart(2, '0');
    const second = String(utcDate.getSeconds()).padStart(2, '0');
    const millisecond = String(utcDate.getMilliseconds()).padStart(3, '0');
    const utcOffset = String(utcDate.getTimezoneOffset()).padStart(4, '0');
    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`;
}




export const getFutureDateMonth = (date: Date, monthsToAdd: number) => {
    const futureDate = new Date(date);
    futureDate.setMonth(futureDate.getMonth() + monthsToAdd);
    // Subtract 1 day
    futureDate.setDate(futureDate.getDate() - 1);
    return futureDate;
};

export const getFutureDateYear = (date: Date, yearsToAdd: number) => {
    const futureDate = new Date(date);
    futureDate.setFullYear(futureDate.getFullYear() + yearsToAdd);
    // Subtract 1 day
    futureDate.setDate(futureDate.getDate() - 1);
    return futureDate;
};
export const getFutureDateDay = (date: Date, daysToAdd: number) => {
    const futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + daysToAdd);
    return futureDate;
};

export const getFutureHour = (date: Date, hoursToAdd: number) => {
    const futureDate = new Date(date);
    futureDate.setHours(futureDate.getHours() + hoursToAdd);
    return futureDate;
};

// export const formatDate = (date: Date) => {
//     const pad = (n: number) => String(n).padStart(2, "0");
//     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`;
// };

// export const formatDateTime = (date: Date) => {
//     const pad = (n: number) => String(n).padStart(2, "0");
//     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:00`;
// };


// export const formatDate = (date: Date) => {
//     const pad = (n: number) => String(n).padStart(2, "0");
//     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
// };

export const formatDateTime = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};


export const formatDate = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const startDateEndDateMonth = (months?: number, startUtc?: string) => {

    const now = startUtc ? new Date(startUtc) : new Date();
    now.setSeconds(0, 0); // Set seconds and milliseconds to 00
    const startTimeDefault = formatDate(now);
    const endTimeDefault = formatDate(getFutureDateMonth(now, months || 1));
    return { startTimeDefault, endTimeDefault }
}

export const startDateEndDateDay = (days?: number, startUtc?: string) => {
    const now = startUtc ? new Date(startUtc) : new Date();
    now.setSeconds(0, 0); // Set seconds and milliseconds to 00
    const startTimeDefault = formatDate(now);
    const endTimeDefault = formatDate(getFutureDateDay(now, days || 1));
    return { startTimeDefault, endTimeDefault }
}

export const startDateEndDateHour = (hours?: number, startUtc?: string) => {
    const now = startUtc ? new Date(startUtc) : new Date();
    now.setSeconds(0, 0); // Set seconds and milliseconds to 00
    const startTimeDefault = formatDateTime(now);
    const endTimeDefault = formatDateTime(getFutureHour(now, hours || 1));
    return { startTimeDefault, endTimeDefault }
}

export const startDateEndDateYear = (years?: number, startUtc?: string) => {
    const now = startUtc ? new Date(startUtc) : new Date();
    now.setSeconds(0, 0); // Set seconds and milliseconds to 00
    const startTimeDefault = formatDate(now);
    const endTimeDefault = formatDate(getFutureDateYear(now, years || 1));
    return { startTimeDefault, endTimeDefault }
}

export const getDurationDates = (value: any, quantity?: number) => {
    let durationDates;
    if (value === "YEAR") {
        const { startTimeDefault, endTimeDefault } = startDateEndDateYear(quantity);
        const startTime = convertToUTC(startTimeDefault);
        const endTime = convertToUTC(endTimeDefault);
        durationDates = { startTime, endTime }
    } else if (value === "MONTH") {
        const { startTimeDefault, endTimeDefault } = startDateEndDateMonth(quantity);
        const startTime = convertToUTC(startTimeDefault);
        const endTime = convertToUTC(endTimeDefault);
        durationDates = { startTime, endTime }
    } else if (value === "DAY") {
        const { startTimeDefault, endTimeDefault } = startDateEndDateDay(quantity);
        const startTime = convertToUTC(startTimeDefault);
        const endTime = convertToUTC(endTimeDefault);
        durationDates = { startTime, endTime }
    } else if (value === "HOUR") {
        const { startTimeDefault, endTimeDefault } = startDateEndDateHour(quantity);
        const startTime = convertToUTC(startTimeDefault);
        const endTime = convertToUTC(endTimeDefault);
        durationDates = { startTime, endTime }
    }

    return durationDates;
}


export const getDurationDatesForExtend = (value: any, quantity?: number, oldSubEndDate?: string) => {

    // Helper function to add one day to a date string
    const addOneDayToDate = (dateString: string): string => {
        if (!dateString) return dateString;

        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                console.warn('Invalid date provided:', dateString);
                return dateString;
            }

            // Add one day
            date.setDate(date.getDate() + 1);

            // Set time to 00:00:00.000 (midnight)
            date.setHours(0, 0, 0, 0);

            return date.toISOString();
        } catch (error) {
            console.error('Error adding day to date:', error);
            return dateString;
        }
    };

    // Add one day to oldSubEndDate if it exists
    let adjustedStartDate = oldSubEndDate

    if (oldSubEndDate) {
        adjustedStartDate = addOneDayToDate(oldSubEndDate);
    }

    let durationDates;
    if (value === "YEAR") {
        const { startTimeDefault, endTimeDefault } = startDateEndDateYear(quantity, adjustedStartDate);
        const startTime = convertToUTC(startTimeDefault);
        const endTime = convertToUTC(endTimeDefault);
        durationDates = { startTime, endTime }
    } else if (value === "MONTH") {
        const { startTimeDefault, endTimeDefault } = startDateEndDateMonth(quantity, adjustedStartDate);
        const startTime = convertToUTC(startTimeDefault);
        const endTime = convertToUTC(endTimeDefault);
        durationDates = { startTime, endTime }
    } else if (value === "DAY") {
        const { startTimeDefault, endTimeDefault } = startDateEndDateDay(quantity, adjustedStartDate);
        const startTime = convertToUTC(startTimeDefault);
        const endTime = convertToUTC(endTimeDefault);
        durationDates = { startTime, endTime }
    } else if (value === "HOUR") {
        const { startTimeDefault, endTimeDefault } = startDateEndDateHour(quantity, adjustedStartDate);
        const startTime = convertToUTC(startTimeDefault);
        const endTime = convertToUTC(endTimeDefault);
        durationDates = { startTime, endTime }
    }

    return durationDates;
}


export const getcontinuedDurationDates = (duration: "YEAR" | "MONTH" | "DAY" | "HOUR", startTime: string, quantity: number = 1) => {
    // Convert startTime to a Date object
    const startDate = new Date(startTime);

    let endDate = new Date(startDate); // Create a copy to modify

    switch (duration) {
        case "YEAR":
            endDate.setFullYear(endDate.getFullYear() + quantity);
            break;
        case "MONTH":
            endDate.setMonth(endDate.getMonth() + quantity);
            break;
        case "DAY":
            endDate.setDate(endDate.getDate() + quantity);
            break;
        case "HOUR":
            endDate.setHours(endDate.getHours() + quantity);
            break;
        default:
            throw new Error("Invalid duration type");
    }
    // Convert to UTC format
    const endTime = endDate.toISOString();
    return { startTime, endTime };
};

export const getMaxEndTime = (
    list: { planId: string; serviceId: string; endTime?: string }[],
    filterParams: { id: string; serviceId: string }
) => {
    if (!list.length) return false; // Return false if list is empty

    // Filter the list based on planId and serviceId
    const filteredList = list.filter(item =>
        item.planId === filterParams.id && item.serviceId === filterParams.serviceId
    );

    if (!filteredList.length) return false; // Return false if no matching items

    // Extract valid endTimes
    const validEndTimes = filteredList
        .map(item => item.endTime)
        .filter((endTime): endTime is string => !!endTime);

    if (!validEndTimes.length) return false; // Return false if no valid endTime found

    // Find the highest endTime
    return validEndTimes.reduce((max, endTime) =>
        new Date(endTime).getTime() > new Date(max).getTime() ? endTime : max, validEndTimes[0]
    );
};

export const getDaysDifference = (startTime: Date, endTime: Date): number => {
    const msInOneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
    return Math.round((endTime.getTime() - startTime.getTime()) / msInOneDay);
};


export function getDaysUntilEndOfMonthLocalMidnight(startTime: string): number {
    const startUTC = DateTime.fromISO(startTime, { zone: 'utc' });

    // Get end of the month in device's local time, then convert to UTC
    const localEndOfMonth = startUTC
        .setZone('local')         // switch to device's local time
        .endOf('month')           // get 23:59:59.999 of the month
        .toUTC();                 // convert back to UTC

    // Calculate the difference in days
    const diff = localEndOfMonth.diff(startUTC, 'days').days;

    return Math.floor(diff); // return integer number of full days
}

export function getFullDaysBetween(startTime: string, endTime: string): number {
    const start = DateTime.fromISO(startTime, { zone: 'local' });
    const end = DateTime.fromISO(endTime, { zone: 'local' });

    const diff = end.diff(start, 'days').days;
    return Math.floor(diff); // return only full days
}

export function getTotalDaysInMonth(startTime: string): number {
    console.log("start-time", startTime)
    const localDate = DateTime.fromISO(startTime, { zone: 'local' });

    if (!localDate.isValid || localDate.daysInMonth === undefined) {
        throw new Error("Invalid date provided");
    }

    return localDate.daysInMonth;
}

export function formatDateForInvoice(input: string): string {
    const dt = DateTime.fromISO(input);
    return dt.toFormat("MMMM d, yyyy"); // "May 20, 2025"
}

export function getDaysBetweenUTC(utcEnd: any) {
    const now = DateTime.now().setZone('Asia/Kolkata');
    const end = DateTime.fromISO(utcEnd, { zone: 'utc' }).setZone('Asia/Kolkata');
    const diff = end.diff(now, 'days').days;
    console.log(diff, "days-left");
    return diff >= 0 ? Math.floor(diff) : 0;
}

export function formatUtcToLocalDate(utcString: string): string {
    return DateTime.fromISO(utcString, { zone: 'utc' })
        .toLocal()
        .toFormat('yyyy-MM-dd');
}

export function formatLocalToUtcDate(localDateString: string): any {
    return DateTime.fromFormat(localDateString, 'yyyy-MM-dd')
        .toUTC()
        .toISO();
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