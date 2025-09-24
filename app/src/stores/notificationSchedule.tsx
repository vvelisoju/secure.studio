import { create } from "zustand";
import { getNotificationSchedule, updateNotificationSchedule } from "../api/notificationSchedule";

interface NotificationScheduleState {
    loading: Boolean;
    setLoading: (value: Boolean) => void;
    notificationSchedules: any[];
    fetchNotificationSchedules: () => Promise<void>;
    updateNotificationSchedule: (data: any) => Promise<void>;
}

// Zustand Store
export const useNotificationScheduleStore = create<NotificationScheduleState>((set) => ({
    loading: false,
    setLoading: (value) => set({ loading: value }),
    notificationSchedules: [],
    fetchNotificationSchedules: async () => {
        const response = await getNotificationSchedule();
        set({ notificationSchedules: response.data })
    },
    updateNotificationSchedule: async (data) => {
        const response = await updateNotificationSchedule(data);
        return response;
    },
}));
