import { create } from "zustand";
import useServiceStore from "./services";
import { getDaysUntilEndOfMonthLocalMidnight, getFullDaysBetween, getTotalDaysInMonth } from "../utils/date";

interface bookingSummaryState {
    planPrice: any;
    setplanPrice: (value: any) => void;
    finalPlanPrice: any;
    setFinalPlanPrice: (value: any) => void;
    price: any;
    setPrice: (value: any) => void;
    prorata: any;
    setProrata: (value: any) => void;
    bookingTab: string;
    setBookingTab: (value: any) => void;
    reset: () => void;
}

// Zustand Store
export const useBookingSummaryStore = create<bookingSummaryState>((set) => ({
    price: 0,
    setPrice: (value) => { set({ price: value }) },
    planPrice: 0,
    setplanPrice: (value) => { set({ price: value }) },
    finalPlanPrice: 0,
    setFinalPlanPrice: (value) => { set({ price: value }) },
    bookingTab: "Booking",
    setBookingTab: (value) => set({ bookingTab: value }),
    prorata: false,
    setProrata: (value) => { set({ prorata: value }) },
    reset: () => {
        set({ price: 0, prorata: false })
    }
}));
