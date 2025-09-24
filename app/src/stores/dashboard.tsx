import { create } from "zustand";
import { getDashboardDetails, getAdminDashboardDetails } from "../api/dashboard";

interface SubscriptionState {
    company: any;
    details: any;
    loading: boolean;
    fetchDashboardDetails: () => Promise<void>;
    fetchAdminDashboardDetails: () => Promise<void>;
}

// Zustand Store
export const useDashboardStore = create<SubscriptionState>((set) => ({
    company: {},
    details: {},
    loading: false,
    fetchDashboardDetails: async () => {
        set({ loading: true });
        const response = await getDashboardDetails();
        set({ details: response.data, loading: false, company: response?.data?.company });
    },
    fetchAdminDashboardDetails: async () => {
        set({ loading: true });
        const response = await getAdminDashboardDetails();
        set({ details: response.data, loading: false, });
    },
}));
