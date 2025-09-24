import { create } from "zustand";

interface MeetingRoomState {
    meetingRoomOpen: boolean;
    setMeetingRoomOpen: (value: boolean) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
}

// Zustand Store
export const useMeetingRoomStore = create<MeetingRoomState>((set) => ({
    meetingRoomOpen: false,
    setMeetingRoomOpen: (value) => set({ meetingRoomOpen: value }),
    loading: false,
    setLoading: (value) => set({ loading: value })
}));
