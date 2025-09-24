import { create } from "zustand";
import { fetchBookedTimeSlotOfUser, fetchTimeSlots, bookTimeSlots } from "../api/timeslot";
import { convertTimeSlots } from "../utils/date";
interface TimeSlotState {
    bookedSlotsOfUser: any[],
    fetchBookedSlotsOfUser: () => Promise<void>;
    fetchSlotsOfDates: (dates: any) => Promise<void>;
    BookSlots: (slotIds: any) => Promise<void>;
    slots: any,
}

// Zustand Store
export const useTimeSlotStore = create<TimeSlotState>((set) => ({
    bookedSlotsOfUser: [],
    slots: {},
    fetchBookedSlotsOfUser: async () => {
        const response = await fetchBookedTimeSlotOfUser();
        set({ bookedSlotsOfUser: response.data });
    },
    fetchSlotsOfDates: async (dates) => {
        const response = await fetchTimeSlots(dates);
        const slots = convertTimeSlots(response.data);
        set({
            slots: {
                morning: slots.morning,
                afternoon: slots.afternoon,
                evening: slots.evening
            }
        });
    },
    BookSlots: async (slotIds) => {
        const response = await bookTimeSlots(slotIds);
        return response;
    }
}));
