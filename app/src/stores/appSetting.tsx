import { create } from "zustand";
import { getAppSetting, updateAppSetting } from "../api/appSetting";
import { useInvoiceGeneratorStore } from "./invoiceGenerator";

interface AppSettingState {
    loading: Boolean;
    setLoading: (value: Boolean) => void;
    appSetting: any;
    fetchAppSetting: () => Promise<void>;
    updateAppSetting: (data: any) => Promise<void>;
}

// Zustand Store
export const useAppSettingState = create<AppSettingState>((set) => ({
    loading: true,
    setLoading: (value) => set({ loading: value }),
    appSetting: [],
    fetchAppSetting: async () => {
        const response = await getAppSetting();
        set({ appSetting: response?.data, loading: false });
        useInvoiceGeneratorStore.getState().setSGST(response?.data?.cgst || 0);
        useInvoiceGeneratorStore.getState().setCGST(response?.data?.sgst || 0);
    },
    updateAppSetting: async (data) => {
        const response = await updateAppSetting(data);
        return response;
    },
}));
